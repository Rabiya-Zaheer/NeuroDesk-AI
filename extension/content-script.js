// Runs on every page. Purely passive — it only responds when the popup
// asks for context, it never sends anything anywhere on its own.

function getExcerpt() {
  const selection = window.getSelection()?.toString().trim();
  if (selection) return selection;

  const description = document.querySelector('meta[name="description"]')?.getAttribute("content");
  if (description) return description.trim();

  const bodyText = document.body?.innerText ?? "";
  return bodyText.replace(/\s+/g, " ").trim().slice(0, 500);
}

chrome.runtime.onMessage.addListener((message, _sender, sendResponse) => {
  if (message?.type !== "NEURODESK_GET_PAGE_CONTEXT") return undefined;

  sendResponse({
    title: document.title,
    url: window.location.href,
    excerpt: getExcerpt(),
    hasSelection: Boolean(window.getSelection()?.toString().trim()),
  });

  return true;
});
