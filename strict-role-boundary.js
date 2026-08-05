import { runtimeRole, isDungeonMaster, isPlayer } from './src/role-context.js';

const app = document.querySelector('#app');
let scheduled = false;
let selectingRole = false;

function selectDeclaredRole() {
  const target = app?.querySelector(`[data-role="${runtimeRole}"]`);
  if (!target || target.classList.contains('selected') || selectingRole) return;
  selectingRole = true;
  target.click();
  queueMicrotask(() => { selectingRole = false; });
}

function roleBanner() {
  const topbar = app?.querySelector('.topbar');
  if (!topbar || app.querySelector('.role-locked-banner')) return;
  const banner = document.createElement('section');
  banner.className = `role-locked-banner role-${runtimeRole}`;
  banner.setAttribute('aria-label', `${runtimeRole} workspace`);
  banner.innerHTML = isDungeonMaster
    ? '<div><small>DUNGEON MASTER WORKSPACE</small><strong>You run the world.</strong><span>Describe scenes, portray NPCs and monsters, adjudicate actions, reveal results, and advance the adventure.</span></div>'
    : '<div><small>PLAYER TABLE</small><strong>You control your character.</strong><span>Explore what the DM reveals, describe what your character does, roll when asked, and follow the adventure through your cards.</span></div>';
  topbar.insertAdjacentElement('afterend', banner);
}

function removeForbiddenControls() {
  app?.querySelector('.view-switch')?.remove();
  if (isPlayer) {
    app?.querySelectorAll([
      '.adventure-deck',
      '[data-roll-all-monsters]',
      '.encounter-board [data-card-roll]',
      '.encounter-board [data-open-picker]',
      '.encounter-board [data-reveal]',
      '.encounter-board [data-remove-instance]',
      '.encounter-board [draggable="true"]'
    ].join(',')).forEach(node => node.remove());
  }
}

function enforceRoleBoundary() {
  scheduled = false;
  selectDeclaredRole();
  roleBanner();
  removeForbiddenControls();
  document.documentElement.dataset.runtimeRole = runtimeRole;
  document.body.dataset.runtimeRole = runtimeRole;
}

function scheduleEnforcement() {
  if (scheduled) return;
  scheduled = true;
  requestAnimationFrame(enforceRoleBoundary);
}

if (app) {
  new MutationObserver(scheduleEnforcement).observe(app, { childList: true, subtree: true });
}

window.addEventListener('DOMContentLoaded', scheduleEnforcement);
window.addEventListener('living-table:session-updated', scheduleEnforcement);
window.addEventListener('living-table:scene-loaded', scheduleEnforcement);
scheduleEnforcement();

window.LivingTableRoleBoundary = Object.freeze({ role: runtimeRole, enforce: scheduleEnforcement });
