(() => {
  const normalize = () => {
    const board = document.querySelector('.fixed-board, .encounter-strip-v4');
    if (!board) return;

    board.classList.remove('fixed-board');
    board.classList.add('encounter-strip-v4');

    Array.from(board.children).forEach((child) => {
      child.classList.remove('board-slot');
      child.classList.add('encounter-zone-v4');
    });

    const heading = document.querySelector('.board-header h1');
    if (heading && !heading.querySelector('.layout-build-v4')) {
      const marker = document.createElement('span');
      marker.className = 'layout-build-v4';
      marker.textContent = 'ROW v4';
      heading.append(marker);
    }
  };

  const observer = new MutationObserver(normalize);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  document.addEventListener('DOMContentLoaded', normalize);
  normalize();
})();
