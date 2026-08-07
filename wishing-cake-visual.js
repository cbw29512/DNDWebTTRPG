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

const specialItems = Object.freeze({
  'item-wooden-dog': {
    alt:'A small carved wooden dog standing on a gift-box lid.',
    art:'<path d="M58 95q5-35 31-40l23 7 20-17 12 8-9 22 13 13-7 26H74z" fill="#bd7d46"/><circle cx="119" cy="67" r="4" fill="#20140e"/><path d="M72 105l-5 29M129 108l7 26M82 72L63 56" stroke="#f1c889" stroke-width="8" stroke-linecap="round"/><rect x="43" y="125" width="154" height="13" rx="6" fill="#6e3c56"/>'
  },
  'item-story-book': {
    alt:'An open enchanted story book with glowing pages and floating stars.',
    art:'<path d="M34 45q45-20 84 8v72q-40-17-84-1z" fill="#f4dfaf"/><path d="M206 45q-45-20-84 8v72q40-17 84-1z" fill="#ead49d"/><path d="M120 52v73" stroke="#8f6232" stroke-width="5"/><path d="M52 69h48M52 84h42M142 68h45M142 83h34" stroke="#a47a4d" stroke-width="4" stroke-linecap="round"/><g fill="#ffd86a"><path d="M61 28l5 10 11 2-8 8 2 11-10-5-10 5 2-11-8-8 11-2z"/><circle cx="178" cy="27" r="8"/></g>'
  },
  'item-teddy-dagger': {
    alt:'A soft teddy bear with a small hidden dagger glinting behind it.',
    art:'<g fill="#c68a58"><circle cx="90" cy="55" r="18"/><circle cx="150" cy="55" r="18"/><circle cx="120" cy="70" r="35"/><ellipse cx="120" cy="116" rx="43" ry="30"/></g><ellipse cx="120" cy="78" rx="17" ry="13" fill="#e7b57f"/><circle cx="108" cy="66" r="4" fill="#1b1513"/><circle cx="132" cy="66" r="4" fill="#1b1513"/><path d="M120 76l-5 6 5 4 5-4z" fill="#241815"/><path d="M171 30l10 61-13 2-9-62z" fill="#e4edf5"/><path d="M163 87l23-3 5 10-29 4z" fill="#d8b35f"/>'
  },
  'item-rope': {
    alt:'A sixty-foot coil of golden gift rope tied with a festive ribbon.',
    art:'<g fill="none" stroke="#d8ad55" stroke-width="9"><ellipse cx="116" cy="79" rx="61" ry="39"/><ellipse cx="116" cy="79" rx="45" ry="27"/><ellipse cx="116" cy="79" rx="28" ry="16"/></g><path d="M161 89q37 5 49 31M164 92q19 23 5 44" fill="none" stroke="#f2d88e" stroke-width="7" stroke-linecap="round"/><path d="M63 42l19 17-13 18M82 59l17-18 12 23" fill="#a64f67" stroke="#e88ba5" stroke-width="4"/>'
  }
});

function specialItemMarkup(id) {
  const item = specialItems[id];
  if (!item) return null;
  return `<div class="card-art card-art-illustrated art-${id}" data-art-key="${id}" role="img" aria-label="${item.alt}"><svg viewBox="0 0 240 150" focusable="false" aria-hidden="true"><rect width="240" height="150" fill="#21140e"/><path d="M0 112Q58 83 118 111T240 92V150H0Z" fill="#59361d"/><circle cx="194" cy="32" r="43" fill="#f3c65d" opacity=".12"/>${item.art}<rect x="3" y="3" width="234" height="144" rx="14" fill="none" stroke="#f7df9b" stroke-opacity=".3" stroke-width="2"/></svg></div>`;
}

function hydrateArt(root=document) {
  root.querySelectorAll?.('.tarot-card[data-card-id] .card-art:not([data-wc-art])').forEach(stage => {
    const shell = stage.closest('.tarot-card');
    const id = shell?.dataset.cardId;
    if (!id) return;
    const title = shell.querySelector('h3')?.textContent?.trim() || 'Adventure card';
    const fallback = stage.textContent.trim() || '◇';
    const template = document.createElement('template');
    template.innerHTML = specialItemMarkup(id) || renderWishingCakeArt({id,title,artKey:artKeys[id],artAlt:altById[id]},fallback);
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
