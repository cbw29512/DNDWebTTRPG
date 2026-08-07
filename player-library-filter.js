(() => {
const FILTERS = [
  ['all','All'],
  ['characters','Characters'],
  ['collected','Collected Cards'],
  ['items','Items'],
  ['invitations','Invitations'],
  ['adventures','Adventures'],
  ['catalog','Browse Catalog']
];

let activeFilter = 'all';
let search = '';

const panel = () => document.querySelector('#library-panel');
const playerTabActive = () => document.querySelector('[data-library-tab="player"]')?.classList.contains('active');
const normalize = value => String(value || '').toLowerCase();

function classifySections(root) {
  const sections = [...root.children];
  sections.forEach(section => {
    const heading = normalize(section.querySelector('h2,h3')?.textContent);
    if (heading.includes('playable character')) section.dataset.playerLibrarySection = 'characters';
    else if (heading.includes('my collected')) section.dataset.playerLibrarySection = 'collected';
    else if (heading.includes('owned item')) section.dataset.playerLibrarySection = 'items';
    else if (section.classList.contains('library-columns')) section.dataset.playerLibrarySection = 'social';
    else if (section.classList.contains('dungeoncards-catalog')) section.dataset.playerLibrarySection = 'catalog';
  });
  const columns = root.querySelector('.library-columns');
  if (columns) {
    [...columns.children].forEach(column => {
      const heading = normalize(column.querySelector('h3')?.textContent);
      column.dataset.playerLibrarySection = heading.includes('invitation') ? 'invitations' : 'adventures';
    });
  }
}

function searchableText(node) {
  return normalize(node.textContent);
}

function applyFilters() {
  const root = panel();
  if (!root || !playerTabActive()) return;
  classifySections(root);
  root.querySelectorAll('[data-player-library-section]').forEach(section => {
    const type = section.dataset.playerLibrarySection;
    const matchesType = activeFilter === 'all' || type === activeFilter || (type === 'social' && ['invitations','adventures'].includes(activeFilter));
    const matchesSearch = !search || searchableText(section).includes(search);
    section.hidden = !(matchesType && matchesSearch);
  });
  root.querySelectorAll('[data-player-filter]').forEach(button => button.classList.toggle('selected', button.dataset.playerFilter === activeFilter));
}

function installControls() {
  const root = panel();
  if (!root || !playerTabActive() || root.querySelector('.player-library-filterbar')) return;
  const heading = root.querySelector('.library-heading');
  if (!heading) return;
  const controls = document.createElement('section');
  controls.className = 'player-library-filterbar';
  controls.setAttribute('aria-label','Filter player library');
  controls.innerHTML = `<label>Search my library<input type="search" data-player-library-search placeholder="Character, item, adventure, or card"></label><div class="player-library-filter-buttons">${FILTERS.map(([id,label]) => `<button type="button" data-player-filter="${id}" class="${activeFilter===id?'selected':''}">${label}</button>`).join('')}</div>`;
  heading.insertAdjacentElement('afterend', controls);
  controls.querySelectorAll('[data-player-filter]').forEach(button => button.addEventListener('click', () => {
    activeFilter = button.dataset.playerFilter;
    applyFilters();
  }));
  controls.querySelector('[data-player-library-search]').addEventListener('input', event => {
    search = normalize(event.target.value.trim());
    applyFilters();
  });
  applyFilters();
}

const observer = new MutationObserver(() => {
  if (!playerTabActive()) return;
  installControls();
  applyFilters();
});
observer.observe(document.body,{childList:true,subtree:true});
document.addEventListener('click', event => {
  if (event.target.closest('[data-library-tab="player"]')) setTimeout(installControls,20);
});
window.addEventListener('DOMContentLoaded', installControls);
installControls();
})();
