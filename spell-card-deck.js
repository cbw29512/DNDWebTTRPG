import { resolveRequestedCharacter, resolveRequestedEdition, getCharacterProfile, normalizeEdition } from './src/player/character-cards.js';
import { activeSpellEntries, createSpellSlotState, eligibleSlotLevels, consumeSpellSlot } from './src/player/spell-cards.js';
import { spellAccesses, spellCombatSummaryForAccess, accessAbilityLabel } from './src/player/spell-access.js';

const isPlayer=document.querySelector('meta[name="living-table-role"]')?.content==='player';
if(isPlayer){
 const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
 let activeCharacter=resolveRequestedCharacter();
 let activeEdition=resolveRequestedEdition();
 const storagePrefix='living-table-spell-deck-v2';
 const stateKey=()=>`${storagePrefix}:${activeCharacter.id}:${normalizeEdition(activeEdition)}`;
 const currentProfile=()=>getCharacterProfile(activeCharacter,activeEdition);

 function accesses(entry,profile){return spellAccesses(entry,profile);}
 function concentrationEntry(profile,name){return activeSpellEntries(profile).find(entry=>entry.name===name&&entry.card?.concentration)||null;}
 function defaultUsage(profile){
  const free={};
  for(const entry of activeSpellEntries(profile)){
   for(const access of accesses(entry,profile)){
    if(access.freeUse)free[access.id]={max:access.freeUse.max,current:access.freeUse.max,label:access.freeUse.label,recharge:access.freeUse.recharge};
   }
  }
  return {slots:createSpellSlotState(profile),free,concentration:null};
 }
 function loadUsage(profile){
  const fallback=defaultUsage(profile);
  try{
   const saved=JSON.parse(localStorage.getItem(stateKey())||'null');
   if(!saved)return fallback;
   for(const [level,slot] of Object.entries(fallback.slots)){
    const previous=saved.slots?.[level]; if(previous)slot.current=Math.max(0,Math.min(slot.max,Number(previous.current)));
   }
   for(const [id,use] of Object.entries(fallback.free)){
    const previous=saved.free?.[id]; if(previous)use.current=Math.max(0,Math.min(use.max,Number(previous.current)));
   }
   if(typeof saved.concentration==='string'&&concentrationEntry(profile,saved.concentration))fallback.concentration=saved.concentration;
   return fallback;
  }catch(error){console.warn('[Living Table] Could not restore spell-deck state.',error);return fallback;}
 }
 let usage=loadUsage(currentProfile());
 function saveUsage(){try{localStorage.setItem(stateKey(),JSON.stringify(usage));return true;}catch(error){console.warn('[Living Table] Could not save spell-deck state.',error);return false;}}
 function resetUsage(){usage=defaultUsage(currentProfile());saveUsage();render();}
 function startConcentration(name){
  if(!concentrationEntry(currentProfile(),name))return false;
  usage.concentration=name;
  return true;
 }
 function endConcentration(){if(!usage.concentration)return false;usage.concentration=null;return true;}
 function slotTracker(){
  const levels=Object.entries(usage.slots).sort(([a],[b])=>Number(a)-Number(b));
  if(!levels.length)return '<span class="spell-no-slots">No spell slots</span>';
  return levels.map(([level,slot])=>`<div class="spell-slot-level" data-slot-level="${level}"><small>${level}${level==='1'?'st':level==='2'?'nd':level==='3'?'rd':'th'}</small><strong>${slot.current}/${slot.max}</strong><div aria-label="${slot.current} of ${slot.max} spell slots remaining">${Array.from({length:slot.max},(_,i)=>`<i class="${i<slot.current?'ready':'spent'}"></i>`).join('')}</div></div>`).join('');
 }
 function concentrationSummary(){
  const active=usage.concentration;
  return `<span class="spell-concentration-summary" data-active-concentration="${esc(active||'')}" aria-live="polite">Concentration <strong>${esc(active||'None')}</strong>${active?'<button type="button" data-end-concentration>End</button>':''}</span>`;
 }
 function concentrationControl(card){
  if(!card.concentration)return '';
  if(usage.concentration===card.name)return `<button type="button" class="spell-concentration-control active" data-end-concentration data-concentration-spell="${esc(card.name)}">Concentrating · End</button>`;
  return `<button type="button" class="spell-concentration-control" data-start-concentration="${esc(card.name)}">Start Concentration</button>`;
 }
 function sourceBadges(entry,profile){return accesses(entry,profile).map(access=>`<span data-spell-access="${esc(access.id)}">${esc(access.label)} · ${esc(accessAbilityLabel(access))}</span>`).join('');}
 function combatLines(entry,profile){
  const card=entry.card; const seen=new Set(); const lines=[];
  for(const access of accesses(entry,profile)){
   const summary=spellCombatSummaryForAccess(card,profile,access); const signature=`${access.ability}:${summary}`;
   if(seen.has(signature))continue; seen.add(signature);
   lines.push(`<strong data-spell-combat-access="${esc(access.id)}">${esc(accessAbilityLabel(access))} · ${esc(summary)}</strong>`);
  }
  return lines.join('');
 }
 function freeControls(entry,profile){
  return accesses(entry,profile).filter(access=>access.freeUse).map(access=>{
   const freeState=usage.free[access.id]; const label=`${access.freeUse.label} ${access.freeUse.max}/${access.freeUse.recharge}`;
   return `<button type="button" class="spell-free-cast" data-free-cast-key="${esc(access.id)}" data-free-cast-spell="${esc(entry.name)}" ${freeState?.current<1?'disabled':''}>${esc(label)} · ${freeState?.current??0} left</button>`;
  }).join('');
 }
 function cardMarkup(entry,profile){
  const card=entry.card;
  if(!card)return `<article class="compact-spell-card spell-data-missing"><h4>${esc(entry.name)}</h4><p>Rules data missing. This card is blocked from automated play.</p></article>`;
  const spellAccess=accesses(entry,profile);
  const canUseSlots=spellAccess.some(access=>access.usesSlots);
  const eligible=card.level&&canUseSlots?eligibleSlotLevels(profile,card.level):[];
  const levelLabel=card.level===0?'Cantrip':`${card.level}${card.level===1?'st':card.level===2?'nd':card.level===3?'rd':'th'} level`;
  const slotControl=card.level===0?'<strong class="spell-at-will">AT WILL</strong>':eligible.length?`<label class="spell-cast-control"><span>Slot</span><select data-spell-slot-select="${esc(entry.name)}">${eligible.map(level=>`<option value="${level}" ${usage.slots[level]?.current<1?'disabled':''}>L${level} · ${usage.slots[level]?.current??0} left</option>`).join('')}</select><button type="button" data-cast-spell="${esc(entry.name)}">Use Slot</button></label>`:'<span class="spell-no-slots">No eligible slot for this access</span>';
  const accessLines=combatLines(entry,profile);
  return `<article class="compact-spell-card${usage.concentration===card.name?' is-concentrating':''}" data-spell-card="${esc(entry.name)}" data-spell-level="${card.level}"><header><div><small>${esc(levelLabel)} · ${esc(card.school)}</small><h4>${esc(card.name)}</h4></div><div class="spell-source-badges">${sourceBadges(entry,profile)}</div></header><div class="spell-stat-row"><span><b>CAST</b>${esc(card.cast)}</span><span><b>RANGE</b>${esc(card.range)}</span><span><b>DURATION</b>${esc(card.duration)}</span><span><b>COMP</b>${esc(card.components)}</span></div><div class="spell-combat-line spell-access-combat">${accessLines}${card.concentration?'<span title="Concentration">◉ CONC</span>':''}${card.ritual?'<span title="Ritual">◇ RITUAL</span>':''}</div><p class="spell-effect"><b>Effect:</b> ${esc(card.effect)}</p><p class="spell-mechanics"><b>Rules:</b> ${esc(card.mechanics)}</p>${card.upcast?`<p class="spell-upcast"><b>↑</b> ${esc(card.upcast)}</p>`:''}${entry.notes.length?`<p class="spell-special-note">${esc(entry.notes.join(' · '))}</p>`:''}<footer><span>${esc(card.source)}</span><div class="spell-use-controls">${slotControl}${freeControls(entry,profile)}${concentrationControl(card)}</div></footer></article>`;
 }
 function deckMarkup(profile){
  const entries=activeSpellEntries(profile);
  if(!profile.spellcastingAbility&&!entries.length)return '';
  const missing=entries.filter(entry=>!entry.card);
  const byLevel=new Map(); for(const entry of entries){const level=entry.card?.level??99;if(!byLevel.has(level))byLevel.set(level,[]);byLevel.get(level).push(entry);}
  const groups=[...byLevel.entries()].sort(([a],[b])=>a-b).map(([level,list])=>`<section class="spell-level-group"><h4>${level===0?'Cantrips':`Level ${level} Spells`}</h4><div class="spell-card-grid">${list.map(entry=>cardMarkup(entry,profile)).join('')}</div></section>`).join('');
  const classAbility=profile.spellcastingAbility?.slice(0,3).toUpperCase()||'—';
  return `<section class="spell-card-deck" aria-labelledby="spell-deck-title"><header class="spell-deck-header"><div><small>PREGEN SPELL MINI-DECK · ${profile.rulesId==='dnd-2024'?'2024 / SRD 5.2.1':'2014 / SRD 5.1'}</small><h3 id="spell-deck-title">Spell Cards</h3><p>Each source carries its own casting ability, slot permission, free-use rule, and concentration state.</p></div><button type="button" data-spell-long-rest>Long Rest · Restore Spell Uses</button></header><div class="spellcasting-summary"><span>Class ability <strong>${classAbility}</strong></span><span>Source-specific attack/DC <strong>shown on each card</strong></span>${concentrationSummary()}<div class="spell-slot-tracker">${slotTracker()}</div></div>${missing.length?`<p class="spell-deck-warning">⚠ ${missing.length} spell${missing.length===1?'':'s'} blocked because compact rules data is missing.</p>`:''}${groups}<p class="spell-deck-footnote">A free cast and a spell-slot cast are tracked separately. Starting concentration on another spell replaces the previous concentration spell. A Long Rest restores spell uses and ends concentration. The ability shown beside each source is the ability used for that source's attack roll or save DC.</p></section>`;
 }
 function render(){
  const sheet=document.querySelector('#app .full-character-sheet'); if(!sheet)return;
  const profile=currentProfile(); if(!profile)return;
  let deck=sheet.querySelector('.spell-card-deck'); const wrapper=document.createElement('div'); wrapper.innerHTML=deckMarkup(profile); const next=wrapper.firstElementChild;
  if(!next){deck?.remove();return;} if(deck)deck.replaceWith(next);else{const spellPanel=[...sheet.querySelectorAll('.sheet-panel')].find(panel=>panel.querySelector('h3')?.textContent.trim()==='Spellcasting');spellPanel?.insertAdjacentElement('afterend',next);}
  bind();
 }
 function bind(){
  const deck=document.querySelector('#app .spell-card-deck');
  if(!deck)return;
  deck.querySelector('[data-spell-long-rest]')?.addEventListener('click',()=>{try{resetUsage();}catch(error){console.warn('[Living Table] Long Rest spell reset failed.',error);}});
  deck.querySelectorAll('[data-cast-spell]').forEach(button=>button.addEventListener('click',()=>{
   try{
    const name=button.dataset.castSpell;
    const select=deck.querySelector(`[data-spell-slot-select="${CSS.escape(name)}"]`);
    const level=Number(select?.value);
    if(consumeSpellSlot(usage.slots,level)){
     startConcentration(name);
     saveUsage();
     render();
    }
   }catch(error){console.warn('[Living Table] Spell-slot cast failed.',error);}
  }));
  deck.querySelectorAll('[data-free-cast-key]').forEach(button=>button.addEventListener('click',()=>{
   try{
    const use=usage.free[button.dataset.freeCastKey];
    if(use?.current>0){use.current-=1;startConcentration(button.dataset.freeCastSpell);saveUsage();render();}
   }catch(error){console.warn('[Living Table] Free spell cast failed.',error);}
  }));
  deck.querySelectorAll('[data-start-concentration]').forEach(button=>button.addEventListener('click',()=>{
   try{if(startConcentration(button.dataset.startConcentration)){saveUsage();render();}}
   catch(error){console.warn('[Living Table] Could not start concentration.',error);}
  }));
  deck.querySelectorAll('[data-end-concentration]').forEach(button=>button.addEventListener('click',()=>{
   try{if(endConcentration()){saveUsage();render();}}
   catch(error){console.warn('[Living Table] Could not end concentration.',error);}
  }));
 }
 function changeContext(character,edition){if(character)activeCharacter=character;if(edition)activeEdition=normalizeEdition(edition);usage=loadUsage(currentProfile());setTimeout(render,60);}
 window.addEventListener('living-table:character-loaded',event=>changeContext(event.detail.character,event.detail.edition));
 document.addEventListener('click',event=>{const full=event.target.closest('[data-full-sheet-edition]');if(full)changeContext(null,full.dataset.fullSheetEdition);const quick=event.target.closest('[data-edition-toggle]');if(quick){const target=quick.textContent.includes('2024')?'dnd-2024':'dnd-2014';changeContext(null,target);}},true);
 const app=document.querySelector('#app');if(app)new MutationObserver(()=>{const sheet=app.querySelector('.full-character-sheet');if(sheet&&!sheet.querySelector('.spell-card-deck'))setTimeout(render,20);}).observe(app,{childList:true,subtree:true});
 window.addEventListener('DOMContentLoaded',()=>setTimeout(render,260));setTimeout(render,420);
}