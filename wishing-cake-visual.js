import { renderWishingCakeArt } from './src/wishing-cake-art.js';

const artKeys = Object.freeze({
  location:'bramblewick',
  'site-wishing-cake-inn':'wishing-cake-inn',
  'site-celebration-halls':'old-celebration-halls',
  room:'grand-celebration-hall',
  'room-holding-cells':'scene-holding-cells',
  'room-wish-hall':'scene-wish-hall',
  'room-soul-cellar':'scene-soul-cellar',
  'room-pinata-pen':'scene-pinata-pen',
  'room-wrapping':'scene-wrapping-room',
  'room-cult':'scene-cult-room',
  'room-cake-chamber':'scene-cake-chamber',
  'scene-stolen-wish':'scene-stolen-wish',
  'scene-holding-cells':'scene-holding-cells',
  'scene-wish-hall':'scene-wish-hall',
  'scene-soul-cellar':'scene-soul-cellar',
  'scene-pinata-pen':'scene-pinata-pen',
  'scene-wrapping-room':'scene-wrapping-room',
  'scene-cult-room':'scene-cult-room',
  'scene-cake-chamber':'scene-cake-chamber',
  caretaker:'martha-bramblepot',
  'npc-boris':'boris-ironladle',
  'npc-pip':'pip-underbough',
  'npc-lute':'lute-merriweather',
  'npc-merrit':'merrit-vale',
  'npc-sepulchral':'sepulchral',
  priest:'animated-present',
  skeleton:'paper-plate-mimic',
  'monster-pinata-mimic':'pinata-mimic',
  'monster-sepulchral':'sepulchral',
  'hazard-exploding-pinata':'exploding-pinata',
  'hazard-wrapping-machine':'wrapping-machine',
  'hazard-wish-circle':'wish-circle',
  lantern:'birthday-spark-candles',
  'item-wish-crown':'wish-crown',
  'item-candy':'healing-candy',
  treasure:'stolen-present-table'
});

const altById = Object.freeze({
  location:'Lantern-lit rooftops and bakeries of Bramblewick at dusk.',
  'site-wishing-cake-inn':'A warm fantasy inn centered on a glowing birthday cake and hanging ribbons.',
  'site-celebration-halls':'The forgotten stone celebration halls beneath the inn.',
  room:'The Grand Celebration Hall set for a magical birthday party.',
  caretaker:'Martha Bramblepot, the welcoming halfling innkeeper.',
  'npc-boris':'Boris Ironladle, a flour-dusted dwarf baker.',
  'npc-pip':'Pip Underbough, a quick-talking stable hand.',
  'npc-lute':'Lute Merriweather, a traveling bard carrying a lute.',
  'npc-merrit':'Merrit Vale, a pale but hopeful freed soul.',
  'npc-sepulchral':'Sepulchral, a lonely green-robed halfling wizard.',
  priest:'An animated wrapped present attacking with razor ribbon.',
  skeleton:'A smiling paper plate mimic dropping from a stone ceiling.',
  'monster-pinata-mimic':'A living painted unicorn piñata charging through flying candy.',
  'monster-sepulchral':'Sepulchral guarding a glowing birthday cake inside the Wish Circle.',
  'hazard-exploding-pinata':'A magical piñata with a glowing fuse-like pull string.',
  'hazard-wrapping-machine':'A dangerous magical gift-wrapping conveyor with ribbons and shears.',
  'hazard-wish-circle':'A glowing chalk ritual circle surrounding the birthday cake.',
  lantern:'Three magical birthday candle tokens burning with golden light.',
  'item-wish-crown':'A handmade paper crown glowing with gentle wish magic.',
  'item-candy':'Bright enchanted healing candy in festive wrappers.',
  treasure:'A table crowded with stolen birthday presents.'
});

function hydrateArt(root=document) {
  root.querySelectorAll?.('.tarot-card[data-card-id] .card-art:not([data-wc-art])').forEach(stage => {
    const shell = stage.closest('.tarot-card');
    const id = shell?.dataset.cardId;
    if (!id) return;
    const title = shell.querySelector('h3')?.textContent?.trim() || 'Adventure card';
    const fallback = stage.textContent.trim() || '◇';
    const template = document.createElement('template');
    template.innerHTML = renderWishingCakeArt({id,title,artKey:artKeys[id],artAlt:altById[id]},fallback);
    const illustrated = template.content.firstElementChild;
    if (!illustrated) return;
    illustrated.dataset.wcArt = 'true';
    stage.replaceWith(illustrated);
  });
}

function boot() {
  document.body.classList.add('wishing-cake-visual-ready');
  hydrateArt(document);
  const app = document.querySelector('#app');
  if (!app) return;
  new MutationObserver(records => {
    records.forEach(record => record.addedNodes.forEach(node => {
      if (node.nodeType !== 1) return;
      if (node.matches?.('.tarot-card') || node.querySelector?.('.tarot-card')) hydrateArt(node.parentElement || node);
    }));
  }).observe(app,{childList:true,subtree:true});
}

if (document.readyState === 'loading') document.addEventListener('DOMContentLoaded',boot,{once:true});
else boot();
