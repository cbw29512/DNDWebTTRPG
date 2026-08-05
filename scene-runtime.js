import { loadLocalSession, saveLocalSession } from './local-session.js';
import { isDungeonMaster } from './src/role-context.js';

const clone = value => JSON.parse(JSON.stringify(value));
const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
const unique = values => [...new Set(values.filter(Boolean))];

function sceneList(manifest = window.__DND_ADVENTURE_PACK__) {
  return Array.isArray(manifest?.scenes) ? manifest.scenes : [];
}

function findScene(sceneId, manifest) {
  return sceneList(manifest).find(scene => scene.id === sceneId) || null;
}

function boardForScene(scene, manifest) {
  const persistent = clone(manifest?.persistentBoard || {});
  const board = clone(scene?.board || {});
  return {
    location: unique([...(persistent.location || []), scene.locationId]),
    site: [scene.siteId].filter(Boolean),
    room: [scene.roomId].filter(Boolean),
    npc: unique([...(persistent.npc || []), ...(board.npc || [])]),
    monster: unique(board.monster || []),
    hazard: unique(board.hazard || []),
    treasure: unique(board.treasure || [])
  };
}

function questStateForScene(session, scene, manifest) {
  const mainQuestId = manifest?.startingQuests?.[0] || session?.quests?.[0] || null;
  const active = new Set(session?.questState?.active || (session?.quests || []).filter(id => id !== mainQuestId));
  (scene?.questIds || []).filter(id => id !== mainQuestId).forEach(id => active.add(id));
  const revealed = new Set(session?.questState?.revealed || []);
  if (mainQuestId) revealed.add(mainQuestId);
  active.forEach(id => revealed.add(id));
  return {
    quests: unique([mainQuestId, ...active]),
    questState: {
      active: [...active],
      revealed: [...revealed]
    }
  };
}

function sceneLabel(scene) {
  return `${scene.order}. ${scene.title}`;
}

function breadcrumb(scene) {
  return [scene.locationTitle, scene.siteTitle, scene.roomTitle].filter(Boolean).map(esc).join(' → ');
}

function sceneControlsMarkup(manifest, activeId) {
  const scenes = sceneList(manifest);
  const activeIndex = Math.max(0, scenes.findIndex(scene => scene.id === activeId));
  const active = scenes[activeIndex] || scenes[0];
  if (!active) return '';
  const exits = (active.exits || []).map(exit => {
    const target = findScene(exit.sceneId, manifest);
    return target ? `<button type="button" data-load-scene="${esc(target.id)}">${esc(exit.label || target.title)}</button>` : '';
  }).join('');
  return `<section class="scene-runtime" aria-labelledby="scene-runtime-title">
    <div class="scene-runtime-heading"><div><small>DM ADVENTURE CONTROL</small><h2 id="scene-runtime-title">${esc(manifest.title)}</h2><p class="scene-breadcrumb">${breadcrumb(active)}</p><p><strong>Current scene:</strong> ${esc(active.title)}</p></div><div class="scene-runtime-progress">Scene ${activeIndex + 1} of ${scenes.length}</div></div>
    <label>Current scene<select data-scene-select>${scenes.map(scene => `<option value="${esc(scene.id)}" ${scene.id === active.id ? 'selected' : ''}>${esc(sceneLabel(scene))}</option>`).join('')}</select></label>
    <div class="scene-runtime-actions"><button type="button" data-scene-previous ${activeIndex < 1 ? 'disabled' : ''}>← Previous</button><button type="button" data-scene-load>Load Scene</button><button type="button" data-scene-next ${activeIndex >= scenes.length - 1 ? 'disabled' : ''}>Next →</button></div>
    ${exits ? `<div class="scene-runtime-exits"><small>CONNECTED PATHS</small>${exits}</div>` : ''}
    <p data-scene-status aria-live="polite">Location, Site, and Area describe where the party is. The active Scene is carried by the Area card and saved separately from the live board.</p>
  </section>`;
}

let loading = false;

async function loadScene(sceneId, manifest = window.__DND_ADVENTURE_PACK__) {
  if (!isDungeonMaster || loading) return false;
  const scene = findScene(sceneId, manifest);
  const api = window.LivingTableLocalSession;
  if (!scene || !api?.reconcileBoard) return false;

  loading = true;
  const status = document.querySelector('[data-scene-status]');
  if (status) status.textContent = `Preparing ${[scene.locationTitle, scene.siteTitle, scene.roomTitle, scene.title].filter(Boolean).join(' / ')}…`;

  try {
    const targetBoard = boardForScene(scene, manifest);
    const actual = await api.reconcileBoard(targetBoard, {
      onProgress:text => {
        const node = document.querySelector('[data-scene-status]');
        if (node) node.textContent = text;
      }
    });
    const session = loadLocalSession() || api.createLocalSession(manifest, manifest.selectedSystem);
    const history = [...(session.roomHistory || [])];
    if (session.currentRoomId && history.at(-1) !== session.currentRoomId) history.push(session.currentRoomId);
    const quests = questStateForScene(session, scene, manifest);
    const eventHistory = [...(session.eventHistory || []), {
      id: `scene-${Date.now()}`,
      type: 'scene-loaded',
      sceneId: scene.id,
      locationId: scene.locationId,
      siteId: scene.siteId,
      roomId: scene.roomId,
      sceneCardId: scene.sceneCardId,
      activatedQuestIds: clone(scene.questIds || []),
      at: new Date().toISOString()
    }];

    saveLocalSession({
      ...session,
      ...quests,
      currentSceneId: scene.id,
      currentLocationId: scene.locationId,
      currentSiteId: scene.siteId,
      currentRoomId: scene.roomId,
      currentSceneCardId: scene.sceneCardId,
      board: actual,
      roomHistory: history,
      discoveredScenes: unique([...(session.discoveredScenes || []), scene.id]),
      eventHistory,
      status: 'in-progress'
    });

    renderSceneRuntime();
    const nextStatus = document.querySelector('[data-scene-status]');
    if (nextStatus) nextStatus.textContent = `${scene.roomTitle}: ${scene.title} is active. Area context, quests, and the exact adventure state are saved; hidden information remains absent from player projections until revealed.`;
    window.dispatchEvent(new CustomEvent('living-table:scene-loaded', { detail:{ scene, board:actual } }));
    return true;
  } catch (error) {
    const failure = document.querySelector('[data-scene-status]');
    if (failure) failure.textContent = `Could not load ${scene.title}. ${error?.message || 'The current board was left unchanged.'}`;
    return false;
  } finally {
    loading = false;
  }
}

function bindSceneRuntime(root, manifest) {
  if (!root || !isDungeonMaster) return;
  const select = root.querySelector('[data-scene-select]');
  root.querySelector('[data-scene-load]')?.addEventListener('click', () => loadScene(select.value, manifest));
  root.querySelector('[data-scene-previous]')?.addEventListener('click', () => {
    const scenes=sceneList(manifest); const index=scenes.findIndex(scene=>scene.id===select.value); if(index>0) loadScene(scenes[index-1].id,manifest);
  });
  root.querySelector('[data-scene-next]')?.addEventListener('click', () => {
    const scenes=sceneList(manifest); const index=scenes.findIndex(scene=>scene.id===select.value); if(index>=0&&index<scenes.length-1) loadScene(scenes[index+1].id,manifest);
  });
  root.querySelectorAll('[data-load-scene]').forEach(button => button.addEventListener('click', () => loadScene(button.dataset.loadScene, manifest)));
}

export function renderSceneRuntime() {
  if (!isDungeonMaster) {
    document.querySelector('.scene-runtime')?.remove();
    return;
  }
  const manifest = window.__DND_ADVENTURE_PACK__;
  if (!sceneList(manifest).length) return;
  document.querySelector('.scene-runtime')?.remove();
  const session = loadLocalSession();
  const wrapper = document.createElement('div');
  wrapper.innerHTML = sceneControlsMarkup(manifest, session?.currentSceneId || manifest.entrySceneId);
  const toolbar = document.querySelector('.local-session-bar');
  (toolbar?.parentNode || document.body).insertBefore(wrapper.firstElementChild, toolbar?.nextSibling || document.body.firstChild);
  bindSceneRuntime(document.querySelector('.scene-runtime'), manifest);
}

if (isDungeonMaster) {
  window.addEventListener('living-table:session-updated', renderSceneRuntime);
  window.addEventListener('dnd:adventure-loaded', () => setTimeout(renderSceneRuntime, 120));
  window.addEventListener('DOMContentLoaded', renderSceneRuntime);
}
window.LivingTableScenes = Object.freeze({ sceneList, findScene, boardForScene, questStateForScene, loadScene, renderSceneRuntime });
renderSceneRuntime();
