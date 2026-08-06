import { APP_URL } from "./config.js";

const els = {
  loading: document.getElementById("state-loading"),
  signedOut: document.getElementById("state-signed-out"),
  ready: document.getElementById("state-ready"),
  signInBtn: document.getElementById("btn-sign-in"),
  workspaceSelect: document.getElementById("workspace-select"),
  titleInput: document.getElementById("title-input"),
  excerptInput: document.getElementById("excerpt-input"),
  sourceUrl: document.getElementById("source-url"),
  sendBtn: document.getElementById("btn-send"),
  statusMessage: document.getElementById("status-message"),
};

function showState(name) {
  for (const state of ["loading", "signedOut", "ready"]) {
    els[state].hidden = state !== name;
  }
}

function setStatus(message, kind) {
  els.statusMessage.hidden = false;
  els.statusMessage.textContent = message;
  els.statusMessage.className = `status ${kind}`;
}

async function getActiveTabContext() {
  const [tab] = await chrome.tabs.query({ active: true, currentWindow: true });
  if (!tab?.id) return { title: "", url: "", excerpt: "" };

  try {
    const response = await chrome.tabs.sendMessage(tab.id, { type: "NEURODESK_GET_PAGE_CONTEXT" });
    return response ?? { title: tab.title ?? "", url: tab.url ?? "", excerpt: "" };
  } catch {
    // Content script isn't injected on this page (e.g. chrome:// pages) —
    // fall back to whatever the tabs API itself can tell us.
    return { title: tab.title ?? "", url: tab.url ?? "", excerpt: "" };
  }
}

async function loadPendingOrPageContext() {
  const { pendingCapture } = await chrome.storage.local.get("pendingCapture");

  if (pendingCapture) {
    await chrome.storage.local.remove("pendingCapture");
    chrome.action.setBadgeText({ text: "" });
    return pendingCapture;
  }

  return getActiveTabContext();
}

async function fetchSession() {
  const response = await fetch(`${APP_URL}/api/extension/session`, { credentials: "include" });
  if (!response.ok) return { authenticated: false };
  return response.json();
}

async function fetchWorkspaces() {
  const response = await fetch(`${APP_URL}/api/extension/workspaces`, { credentials: "include" });
  if (!response.ok) return [];
  const data = await response.json();
  return data.workspaces ?? [];
}

async function sendCapture(payload) {
  const response = await fetch(`${APP_URL}/api/extension/capture`, {
    method: "POST",
    credentials: "include",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(payload),
  });
  const data = await response.json().catch(() => ({}));
  if (!response.ok) {
    throw new Error(data?.error ?? "Something went wrong sending that capture.");
  }
  return data;
}

async function init() {
  showState("loading");

  const [session, context] = await Promise.all([fetchSession(), loadPendingOrPageContext()]);

  if (!session.authenticated) {
    showState("signedOut");
    els.signInBtn.addEventListener("click", () => {
      chrome.tabs.create({ url: `${APP_URL}/login` });
    });
    return;
  }

  const workspaces = await fetchWorkspaces();
  els.workspaceSelect.innerHTML = workspaces
    .map((w) => `<option value="${w.id}">${w.name}</option>`)
    .join("");

  els.titleInput.value = context.title ?? "";
  els.excerptInput.value = context.excerpt ?? "";
  els.sourceUrl.textContent = context.url ?? "";

  showState("ready");

  els.sendBtn.addEventListener("click", async () => {
    els.sendBtn.disabled = true;
    els.sendBtn.textContent = "Sending…";

    try {
      const result = await sendCapture({
        workspaceId: els.workspaceSelect.value,
        title: els.titleInput.value.trim(),
        url: els.sourceUrl.textContent,
        excerpt: els.excerptInput.value.trim(),
      });

      setStatus(
        result.deliveredLive
          ? "Sent — it just landed live on that whiteboard."
          : "Saved. Open the whiteboard to see it (that tab wasn't live-connected).",
        "success",
      );
      els.sendBtn.textContent = "Sent ✓";
    } catch (err) {
      setStatus(err instanceof Error ? err.message : "Failed to send capture.", "error");
      els.sendBtn.disabled = false;
      els.sendBtn.textContent = "Send to whiteboard";
    }
  });
}

init();
