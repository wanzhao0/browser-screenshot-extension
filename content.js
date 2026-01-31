// 自动滚动并拼接网页长截图
// 支持横向和纵向全页面截图，自动调整窗口宽度，截图前提示并自动隐藏悬浮元素
(async function() {
  const sleep = ms => new Promise(r => setTimeout(r, ms));
  // 1. 截图前弹窗提示
  alert('请将浏览器窗口最大化，确保网页全部可见。\n\n截图过程中请勿切换标签页。');

  // 2. 自动隐藏常见悬浮/固定元素
  const hideFloatingElements = () => {
    const selectors = [
      'header', 'footer', 'nav', '.navbar', '.sidebar', '.fixed', '.sticky',
      '[style*="position:fixed"]', '[style*="position:sticky"]',
      '.ad', '.ads', '.advert', '.banner', '.popup', '.toolbar', '.float', '.suspend',
      '.chat', '.customer-service', '.back-to-top', '.cookie', '.modal', '.mask', '.overlay'
    ];
    selectors.forEach(sel => {
      document.querySelectorAll(sel).forEach(el => {
        el.setAttribute('data-screenshot-hide', '1');
        el.style.display = 'none';
      });
    });
  };
  hideFloatingElements();

  const totalWidth = document.documentElement.scrollWidth;
  const totalHeight = document.documentElement.scrollHeight;
  const viewportWidth = window.innerWidth;
  const viewportHeight = window.innerHeight;
  let screenshots = [];

  // 记录原窗口尺寸
  const originalWidth = window.outerWidth;
  const originalHeight = window.outerHeight;

  // 如果窗口宽度小于页面宽度，通过 background 请求调整窗口
  let originalBounds = null;
  if (window.outerWidth < totalWidth) {
    const resp = await new Promise(resolve => {
      chrome.runtime.sendMessage({type: 'prepareCapture', width: totalWidth}, resolve);
    });
    if (resp && resp.original) originalBounds = resp.original;
    await sleep(500); // 等待窗口调整和页面重排
  }

  // 重新获取视口宽度
  const newViewportWidth = window.innerWidth;
  const newViewportHeight = window.innerHeight;

  // 考虑设备像素比（DPR）——captureVisibleTab 返回的是像素级图片
  const dpr = window.devicePixelRatio || 1;
  const viewportPixelWidth = Math.round(newViewportWidth * dpr);
  const viewportPixelHeight = Math.round(newViewportHeight * dpr);

  for (let y = 0; y < totalHeight; y += newViewportHeight) {
    for (let x = 0; x < totalWidth; x += newViewportWidth) {
      window.scrollTo(x, y);
      await sleep(350);
      const dataUrl = await new Promise(resolve => {
        chrome.runtime.sendMessage({type: 'capture'}, resolve);
      });
      screenshots.push({x, y, dataUrl});
    }
  }

  // 拼接图片（按像素处理，避免 DPR 导致的裁切）
  const canvas = document.createElement('canvas');
  canvas.width = Math.round(totalWidth * dpr);
  canvas.height = Math.round(totalHeight * dpr);
  const ctx = canvas.getContext('2d');

  for (const shot of screenshots) {
    const img = new window.Image();
    img.src = shot.dataUrl;
    await new Promise(res => { img.onload = res; });
    // img.width/img.height 是图片的像素尺寸
    const srcW = img.width;
    const srcH = img.height;
    const destX = Math.round(shot.x * dpr);
    const destY = Math.round(shot.y * dpr);
    ctx.drawImage(img, 0, 0, srcW, srcH, destX, destY, srcW, srcH);
  }

  canvas.toBlob(blob => {
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = `screenshot-${Date.now()}.png`;
    a.click();
    URL.revokeObjectURL(url);
  });

  // 截图后还原窗口尺寸（通过 background）
  if (originalBounds) {
    await new Promise(resolve => {
      chrome.runtime.sendMessage({type: 'restoreWindow', original: originalBounds}, resolve);
    });
  }
})();
