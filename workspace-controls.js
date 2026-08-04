(() => {
  const state = { deckCollapsed: false, initiativeCollapsed: false };

  function enhancePanel(panel, key, label) {
    if (!panel) return;
    panel.classList.toggle('is-collapsed', state[key]);

    let button = panel.querySelector(':scope > .workspace-panel-toggle');
    if (!button) {
      button = document.createElement('button');
      button.type = 'button';
      button.className = 'workspace-panel-toggle';
      button.addEventListener('click', () => {
        state[key] = !state[key];
        applyControls();
      });
      panel.prepend(button);
    }

    button.textContent = state[key] ? `Show ${label}` : `Hide ${label}`;
    button.setAttribute('aria-expanded', String(!state[key]));
  }

  function applyControls() {
    const workspace = document.querySelector('.dm-workspace');
    if (!workspace) return;
    enhancePanel(workspace.querySelector('.adventure-deck'), 'deckCollapsed', 'Adventure Deck');
    enhancePanel(workspace.querySelector('.turn-panel'), 'initiativeCollapsed', 'Initiative');
  }

  const app = document.querySelector('#app');
  if (app) {
    const observer = new MutationObserver(applyControls);
    observer.observe(app, { childList: true });
  }

  window.addEventListener('DOMContentLoaded', applyControls);
})();
