(() => {
  const states = { deck: false, initiative: false };

  function enhancePanel(panel, key, label) {
    if (!panel || panel.querySelector(':scope > .panel-collapse-toggle')) return;
    const button = document.createElement('button');
    button.type = 'button';
    button.className = 'panel-collapse-toggle';
    button.textContent = `${states[key] ? 'Hide' : 'Show'} ${label}`;
    button.setAttribute('aria-expanded', String(states[key]));
    button.addEventListener('click', () => {
      states[key] = !states[key];
      panel.classList.toggle('panel-collapsed', !states[key]);
      panel.classList.toggle('panel-expanded', states[key]);
      button.textContent = `${states[key] ? 'Hide' : 'Show'} ${label}`;
      button.setAttribute('aria-expanded', String(states[key]));
    });
    panel.prepend(button);
    panel.classList.toggle('panel-collapsed', !states[key]);
    panel.classList.toggle('panel-expanded', states[key]);
  }

  function applyTabletopLayout() {
    const workspace = document.querySelector('.dm-workspace');
    if (!workspace) return;
    enhancePanel(workspace.querySelector('.adventure-deck'), 'deck', 'Adventure Deck');
    enhancePanel(workspace.querySelector('.turn-panel'), 'initiative', 'Initiative');
  }

  const observer = new MutationObserver(applyTabletopLayout);
  observer.observe(document.documentElement, { childList: true, subtree: true });
  window.addEventListener('DOMContentLoaded', applyTabletopLayout);
})();
