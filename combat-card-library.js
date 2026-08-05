import { loadDungeonCardsCatalog } from './src/library/dndcards-catalog.js';

const ICONS=Object.freeze({hp:'HP',armor:'🛡',speed:'➜',melee:'⚔',ranged:'➶',spell:'✦',dc:'⬡',roll:'◈',recharge:'↻',reaction:'⚡'});
const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
const glyph=kind=>({monster:'🐲',character:'🧙',item:'✨',room:'🚪',npc:'♟',hazard:'⚠',rule:'📖',event:'🎲'}[kind]||'🎴');
const frontBadge=card=>card.raw?.badge||card.raw?.rarity||card.raw?.challengeLabel&&`CR ${card.raw.challengeLabel}`||card.kind.toUpperCase();
const statIcon=text=>text.startsWith('🛡')?ICONS.armor:text.startsWith('♥')?ICONS.hp:text.startsWith('➜')?ICONS.speed:text.startsWith('⚔')?ICONS.melee:text.startsWith('➶')?ICONS.ranged:text.startsWith('✦')?ICONS.spell:text.startsWith('⬡')?ICONS.dc:'◆';
const cleanStat=text=>String(text).replace(/^[🛡♥➜⚔➶✦⬡◈↻⚡]\s*/, '');
const abilityNames=['STR','DEX','CON','INT','WIS','CHA'];
const mod=n=>`${Math.floor((Number(n)-10)/2)>=0?'+':''}${Math.floor((Number(n)-10)/2)}`;

function actionRows(card){
  return (card.raw?.actions||[]).map(action=>{
    const icon=action.icon||({melee:ICONS.melee,ranged:ICONS.ranged,spell:ICONS.spell}[action.kind])||ICONS.roll;
    return `<div class="combat-action-row"><b>${esc(icon)}</b><span><strong>${esc(action.label)}</strong><small>${esc(action.roll||'')} ${action.damage?`• ${esc(action.damage)}`:''} ${action.range?`• ${esc(action.range)}`:''}</small>${action.effect?`<em>${esc(action.effect)}</em>`:''}</span></div>`;
  }).join('');
}
function statGrid(card){
  const stats=(card.quickStats||[]).map(stat=>`<div class="combat-stat"><b>${esc(statIcon(stat))}</b><span>${esc(cleanStat(stat))}</span></div>`).join('');
  const abilities=Array.isArray(card.raw?.abilities)?`<div class="combat-abilities">${card.raw.abilities.map((score,i)=>`<span><b>${abilityNames[i]}</b>${esc(score)} <small>${mod(score)}</small></span>`).join('')}</div>`:'';
  return `${stats}${abilities}`;
}
function artMarkup(card){
  const art=card.art;
  if(typeof art==='string'&&/^https?:|^\.\/|^\//.test(art)) return `<img src="${esc(art)}" alt="${esc(card.title)}">`;
  return `<span>${esc(typeof art==='string'&&art.length<8?art:glyph(card.kind))}</span>`;
}
function openCombatCard(card){
  document.querySelector('.combat-card-dialog')?.remove();
  const dialog=document.createElement('dialog');
  dialog.className='combat-card-dialog';
  dialog.innerHTML=`<button class="combat-dialog-close" aria-label="Close">×</button><div class="combat-tarot-pair">
    <article class="combat-tarot-front"><header><span>${esc(card.kind)}</span><b>${esc(frontBadge(card))}</b></header><div class="combat-front-art">${artMarkup(card)}</div><h2>${esc(card.title)}</h2></article>
    <article class="combat-tarot-back"><header><span>${esc(card.title)}</span><b>${esc(frontBadge(card))}</b></header><div class="combat-back-stats">${statGrid(card)}</div>${actionRows(card)?`<section class="combat-actions"><h3>Actions</h3>${actionRows(card)}</section>`:''}${card.dmText?`<section class="combat-traits"><h3>Traits / Rules</h3><p>${esc(card.dmText)}</p></section>`:''}<footer>${esc(card.raw?.edition||'')} ${card.raw?.source?`• ${esc(card.raw.source)}`:''}</footer></article>
  </div>`;
  document.body.append(dialog);
  dialog.querySelector('.combat-dialog-close').onclick=()=>dialog.close();
  dialog.addEventListener('close',()=>dialog.remove());
  dialog.showModal();
}

let cards=[];
loadDungeonCardsCatalog().then(result=>{cards=result;enhance();});
function enhance(root=document){
  root.querySelectorAll?.('[data-catalog-card]').forEach(article=>{
    if(article.dataset.combatEnhanced==='true')return;
    const card=cards.find(entry=>entry.id===article.dataset.catalogCard);if(!card)return;
    article.dataset.combatEnhanced='true';
    const art=article.querySelector('.library-card-art');
    if(art)art.innerHTML=`<span class="catalog-front-badge">${esc(frontBadge(card))}</span><div class="catalog-front-picture">${artMarkup(card)}</div><strong>${esc(card.title)}</strong>`;
    const body=article.children[1];
    if(body)body.innerHTML=`<small>${esc(card.kind)} · ${esc(card.raw?.edition||'DungeonCards')}</small><h3>${esc(card.title)}</h3><div class="catalog-combat-strip">${(card.quickStats||[]).slice(0,4).map(stat=>`<span><b>${esc(statIcon(stat))}</b>${esc(cleanStat(stat))}</span>`).join('')}</div>${(card.raw?.actions||[]).slice(0,2).map(action=>`<p class="catalog-action-line"><b>${esc(action.icon||ICONS.roll)}</b> ${esc(action.label)} ${esc(action.roll||'')} ${action.damage?`• ${esc(action.damage)}`:''}</p>`).join('')}`;
  });
}
new MutationObserver(records=>records.forEach(record=>record.addedNodes.forEach(node=>node instanceof HTMLElement&&enhance(node)))).observe(document.documentElement,{childList:true,subtree:true});
document.addEventListener('click',event=>{
  const button=event.target.closest('[data-preview-catalog-card]');if(!button)return;
  const card=cards.find(entry=>entry.id===button.dataset.previewCatalogCard);if(!card)return;
  event.preventDefault();event.stopImmediatePropagation();openCombatCard(card);
},true);
enhance();
