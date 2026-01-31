chrome.action.onClicked.addListener((tab) => {
  chrome.scripting.executeScript({
    target: {tabId: tab.id},
    files: ['content.js']
  });
});

// 存储原始窗口尺寸以便还原
const originalWindowBounds = {};

chrome.runtime.onMessage.addListener((msg, sender, sendResponse) => {
  if (msg.type === 'capture') {
    chrome.tabs.captureVisibleTab(sender.tab.windowId, {format: 'png'}, (dataUrl) => {
      sendResponse(dataUrl);
    });
    return true; // 异步响应
  }

  if (msg.type === 'prepareCapture') {
    const winId = sender.tab.windowId;
    chrome.windows.get(winId, (win) => {
      // 保存原始尺寸
      originalWindowBounds[winId] = {width: win.width, height: win.height, left: win.left, top: win.top};
      // 计算目标宽/高（传入的值）
      const target = {width: msg.width || win.width, height: win.height};
      chrome.windows.update(winId, target, (updated) => {
        sendResponse({ok: true, original: originalWindowBounds[winId], updated: {width: updated.width, height: updated.height}});
      });
    });
    return true;
  }

  if (msg.type === 'restoreWindow') {
    const winId = sender.tab.windowId;
    const orig = msg.original || originalWindowBounds[winId];
    if (orig) {
      chrome.windows.update(winId, {width: orig.width, height: orig.height, left: orig.left, top: orig.top}, () => {
        // 清理存储
        delete originalWindowBounds[winId];
        sendResponse({ok: true});
      });
      return true;
    } else {
      sendResponse({ok: false, error: 'no-original-bounds'});
    }
  }
});
