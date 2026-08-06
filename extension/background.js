// Background service worker (Manifest V3). Keeps two responsibilities:
// 1. Register right-click context menu entries.
// 2. Stash whatever was captured that way in chrome.storage.local as
//    "pendingCapture", so the popup can pick it up the moment it opens —
//    context menu callbacks can't reliably render UI themselves.

const MENU_SELECTION = "neurodesk-send-selection";
const MENU_PAGE = "neurodesk-send-page";

chrome.runtime.onInstalled.addListener(() => {
  chrome.contextMenus.create({
    id: MENU_SELECTION,
    title: 'Send "%s" to NeuroDesk',
    contexts: ["selection"],
  });
  chrome.contextMenus.create({
    id: MENU_PAGE,
    title: "Send this page to NeuroDesk",
    contexts: ["page"],
  });
});

chrome.contextMenus.onClicked.addListener(async (info, tab) => {
  if (!tab?.id || !tab.url || tab.url.startsWith("chrome://")) return;

  const pending = {
    title: tab.title ?? "Untitled page",
    url: tab.url,
    excerpt: info.menuItemId === MENU_SELECTION ? (info.selectionText ?? "") : "",
    capturedAt: Date.now(),
  };

  await chrome.storage.local.set({ pendingCapture: pending });

  try {
    // Chrome 99+: opens the toolbar popup programmatically from a user
    // gesture (the context-menu click qualifies). Older browsers will
    // throw — the badge fallback below still tells the user what to do.
    await chrome.action.openPopup();
  } catch {
    chrome.action.setBadgeText({ text: "1", tabId: tab.id });
    chrome.action.setBadgeBackgroundColor({ color: "#6366F1" });
  }
});
