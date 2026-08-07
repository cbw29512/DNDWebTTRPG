import { resolveRequestedCharacter, resolveRequestedEdition, getCharacterProfile, normalizeEdition } from './src/player/character-cards.js';
import { activeSpellEntries, createSpellSlotState, restoreSpellSlots, eligibleSlotLevels, consumeSpellSlot, spellCombatSummary } from './src/player/spell-cards.js';

const isPlayer=document.querySelector('meta[name="living-table-role"]')?.content==='player';
if(isPlayer){
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
 let activeCharacter=resolveRequestedCharacter();
 let activeEdition=resolveRequestedEdition();
 const storagePrefix='living-table-spell-deck-v1';
 const stateKey=()=>`${storagePrefix}:${activeCharacter.id}:${normalizeEdition(activeEdition)}`;
 const currentProfile=()=>getCharacterProfile(activeCharacter,activeEdition);

 function specialUses(entry,profile){
  if(entry.specialUses)return {max:entry.specialUses,label:`Free ${entry.specialUses}/Long Rest`};
  if(entry.name==='Hunter’s Mark'){
   const resource=profile.resources?.find(item=>item.id==='favored-enemy');
   if(resource?.max)return {max:resource.max,label:`Favored Enemy ${resource.max}/Long Rest`};
  }
  return null;
 }
 function defaultUsage(profile){
  const free={};
  for(const entry of activeSpellEntries(profile)){const spec=specialUses(entry,profile);if(spec)free[entry.name]={max:spec.max,current:spec.max};}
  return {slots:createSpellSlotState(profile),free};
 }
 function loadUsage(profile){
  const fallback=defaultUsage(profile);
  try{
   const saved=JSON.parse(localStorage.getItem(stateKey())||'null');
   if(!saved)return fallback;
   for(const [level,slot] of Object.entries(fallback.slots)){
    const previous=saved.slots?.[level]; if(previous)slot.current=Math.max(0,Math.min(slot.max,Number(previous.current)));
   }
   for(const [name,use] of Object.entries(fallback.free)){
    const previous=saved.free?.[name]; if(previous)use.current=Math.max(0,Math.min(use.max,Number(previous.current)));
   }
   return fallback;
  }catch{return fallback;}
 }
 let usage=loadUsage(currentProfile());
 function saveUsage(){localStorage.setItem(stateKey(),JSON.stringify(usage));}
 function resetUsage(){usage=defaultUsage(currentProfile());saveUsage();render();}
 function slotTracker(profile){
  const levels=Object.entries(usage.slots).sort(([a],[b])=>Number(a)-Number(b));
  if(!levels.length)return '<span class="spell-no-slots">No spell slots</span>';
  return levels.map(([level,slot])=>`<div class="spell-slot-level" data-slot-level="${level}"><small>${level}${level==='1'?'st':level==='2'?'nd':level==='3'?'rd':'th'}</small><strong>${slot.current}/${slot.max}</strong><div aria-label="${slot.current} of ${slot.max} spell slots remaining">${Array.from({length:slot.max},(_,i)=>`<i class="${i<slot.current?'ready':'spent'}"></i>`).join('')}</div></div>`).join('');
 }
 function sourceBadges(entry){return entry.sources.map(source=>`<span>${esc(source)}</span>`).join('');}
 function cardMarkup(entry,profile){
  const card=entry.card;
  if(!card)return `<article class="compact-spell-card spell-data-missing"><h4>${esc(entry.name)}</h4><p>Rules data missing. This card is blocked from automated play.</p></article>`;
  const combat=spellCombatSummary(card,profile);
  const eligible=card.level?eligibleSlotLevels(profile,card.level):[];
  const free=specialUses(entry,profile); const freeState=free?usage.free[entry.name]:null;
  const levelLabel=card.level===0?'Cantrip':`${card.level}${card.level===1?'st':card.level===2?'nd':card.level===3?'rd':'th'} level`;
  const slotControl=card.level===0?'<strong class="spell-at-will">AT WILL</strong>':eligible.length?`<label class="spell-cast-control"><span>Slot</span><select data-spell-slot-select="${esc(entry.name)}">${eligible.map(level=>`<option value="${level}" ${usage.slots[level]?.current<1?'disabled':''}>L${level} · ${usage.slots[level]?.current??0} left</option>`).join('')}</select><button type="button" data-cast-spell="${esc(entry.name)}">Use Slot</button></label>`:'<span class="spell-no-slots">No eligible slot</span>';
  const freeControl=free?`<button type="button" class="spell-free-cast" data-free-cast="${esc(entry.name)}" ${freeState?.current<1?'disabled':''}>${esc(free.label)} · ${freeState?.current??0} left</button>`:'';
  return `<article class="compact-spell-card" data-spell-card="${esc(entry.name)}" data-spell-level="${card.level}"><header><div><small>${esc(levelLabel)} · ${esc(card.school)}</small><h4>${esc(card.name)}</h4></div><div class="spell-source-badges">${sourceBadges(entry)}</div></header><div class="spell-stat-row"><span><b>CAST</b>${esc(card.cast)}</span><span><b>RANGE</b>${esc(card.range)}</span><span><b>DURATION</b>${esc(card.duration)}</span><span><b>COMP</b>${esc(card.components)}</span></div><div class="spell-combat-line"><strong>${esc(combat)}</strong>${card.concentration?'<span title="Concentration">◉ CONC</span>':''}${card.ritual?'<span title="Ritual">◇ RITUAL</span>':''}</div><p class="spell-effect"><b>Effect:</b> ${esc(card.effect)}</p><p class="spell-mechanics"><b>Rules:</b> ${esc(card.mechanics)}</p>${card.upcast?`<p class="spell-upcast"><b>↑</b> ${esc(card.upcast)}</p>`:''}${entry.notes.length?`<p class="spell-special-note">${esc(entry.notes.join(' · '))}</p>`:''}<footer><span>${esc(card.source)}</span><div class="spell-use-controls">${slotControl}${freeControl}</div></footer></article>`;
 }
 function deckMarkup(profile){
  const entries=activeSpellEntries(profile);
  if(!profile.spellcastingAbility&&!entries.length)return '';
  const missing=entries.filter(entry=>!entry.card);
  const byLevel=new Map(); for(const entry of entries){const level=entry.card?.level??99;if(!byLevel.has(level))byLevel.set(level,[]);byLevel.get(level).push(entry);}
  const groups=[...byLevel.entries()].sort(([a],[b])=>a-b).map(([level,list])=>`<section class="spell-level-group"><h4>${level===0?'Cantrips':`Level ${level} Spells`}</h4><div class="spell-card-grid">${list.map(entry=>cardMarkup(entry,profile)).join('')}</div></section>`).join('');
  return `<section class="spell-card-deck" aria-labelledby="spell-deck-title"><header class="spell-deck-header"><div><small>PREGEN SPELL MINI-DECK · ${profile.rulesId==='dnd-2024'?'2024 / SRD 5.2.1':'2014 / SRD 5.1'}</small><h3 id="spell-deck-title">Spell Cards</h3><p>Compact combat shorthand. Source reference stays on every card when the full spell rule is longer.</p></div><button type="button" data-spell-long-rest>Long Rest · Restore Spell Uses</button></header><div class="spellcasting-summary"><span>Ability <strong>${profile.spellcastingAbility?.slice(0,3).toUpperCase()||'—'}</strong></span><span>${profile.spellcastingAbility?`Save <strong>${spellCombatSummary({save:'SAVE'},profile).replace('SAVE save ','')}</strong>`:''}</span><div class="spell-slot-tracker">${slotTracker(profile)}</div></div>${missing.length?`<p class="spell-deck-warning">⚠ ${missing.length} spell${missing.length===1?'':'s'} blocked because compact rules data is missing.</p>`:''}${groups}<p class="spell-deck-footnote">Spell slots restore on a Long Rest unless a class feature says otherwise. Arcane Recovery and other class resources remain separate resources on the character sheet.</p></section>`;
 }
 function render(){
  const sheet=document.querySelector('#app .full-character-sheet'); if(!sheet)return;
  const profile=currentProfile(); if(!profile)return;
  let deck=sheet.querySelector('.spell-card-deck'); const wrapper=document.createElement('div'); wrapper.innerHTML=deckMarkup(profile); const next=wrapper.firstElementChild;
  if(!next){deck?.remove();return;} if(deck)deck.replaceWith(next);else{const spellPanel=[...sheet.querySelectorAll('.sheet-panel')].find(panel=>panel.querySelector('h3')?.textContent.trim()==='Spellcasting');spellPanel?.insertAdjacentElement('afterend',next);}
  bind();
 }
 function bind(){const deck=document.querySelector('#app .spell-card-deck');if(!deck)return;deck.querySelector('[data-spell-long-rest]')?.addEventListener('click',resetUsage);deck.querySelectorAll('[data-cast-spell]').forEach(button=>button.addEventListener('click',()=>{const name=button.dataset.castSpell;const select=deck.querySelector(`[data-spell-slot-select="${CSS.escape(name)}"]`);const level=Number(select?.value);if(consumeSpellSlot(usage.slots,level)){saveUsage();render();}}));deck.querySelectorAll('[data-free-cast]').forEach(button=>button.addEventListener('click',()=>{const use=usage.free[button.dataset.freeCast];if(use?.current>0){use.current-=1;saveUsage();render();}}));}
 function changeContext(character,edition){if(character)activeCharacter=character;if(edition)activeEdition=normalizeEdition(edition);usage=loadUsage(currentProfile());setTimeout(render,60);}
 window.addEventListener('living-table:character-loaded',event=>changeContext(event.detail.character,event.detail.edition));
 document.addEventListener('click',event=>{const full=event.target.closest('[data-full-sheet-edition]');if(full)changeContext(null,full.dataset.fullSheetEdition);const quick=event.target.closest('[data-edition-toggle]');if(quick){const target=quick.textContent.includes('2024')?'dnd-2024':'dnd-2014';changeContext(null,target);}},true);
 const app=document.querySelector('#app');if(app)new MutationObserver(()=>{const sheet=app.querySelector('.full-character-sheet');if(sheet&&!sheet.querySelector('.spell-card-deck'))setTimeout(render,20);}).observe(app,{childList:true,subtree:true});
 window.addEventListener('DOMContentLoaded',()=>setTimeout(render,260));setTimeout(render,420);
}
