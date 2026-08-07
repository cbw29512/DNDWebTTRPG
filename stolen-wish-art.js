(() => {
  const SELECTOR = '.card-art-illustrated.art-scene-stolen-wish';
  const SRC = './assets/wishing-cake/stolen-wish.jpg';

  function enhance(frame) {
    if (!(frame instanceof HTMLElement) || frame.dataset.rasterArtEnhanced === 'true') return;
    frame.dataset.rasterArtEnhanced = 'true';

    const fallback = frame.querySelector('svg');
    if (fallback) fallback.classList.add('card-art-placeholder');

    const img = document.createElement('img');
    img.className = 'card-art-raster';
    img.src = SRC;
    img.alt = frame.getAttribute('aria-label') || 'The Stolen Wish fantasy illustration';
    img.decoding = 'async';
    img.loading = 'eager';

    const markLoaded = () => {
      if (img.complete && img.naturalWidth > 0 && img.naturalHeight > 0) {
        frame.classList.add('has-raster-art');
        frame.classList.remove('raster-art-failed');
      }
    };

    img.addEventListener('load', markLoaded, { once: true });
    img.addEventListener('error', () => {
      frame.classList.remove('has-raster-art');
      frame.classList.add('raster-art-failed');
      img.remove();
    }, { once: true });

    frame.prepend(img);
    if (img.complete) markLoaded();
  }

  function scan(root = document) {
    if (root instanceof Element && root.matches(SELECTOR)) enhance(root);
    root.querySelectorAll?.(SELECTOR).forEach(enhance);
  }

  const observer = new MutationObserver(records => {
    for (const record of records) {
      for (const node of record.addedNodes) {
        if (node instanceof Element) scan(node);
      }
    }
  });

  const start = () => {
    scan();
    observer.observe(document.documentElement, { childList: true, subtree: true });
  };

  if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded', start, { once: true });
  else start();
})();
