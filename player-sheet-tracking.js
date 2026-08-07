import { resolveRequestedCharacter, resolveRequestedEdition, normalizeEdition, getCharacterProfile } from './src/player/character-cards.js';
import { getPregenSheetMetadata } from './src/player/pregen-sheet-metadata.js';

const CONDITIONS=['Blinded','Charmed','Deafened','Frightened','Grappled','Incapacitated','Invisible','Paralyzed','Petrified','Poisoned','Prone','Restrained','Stunned','Unconscious'];
const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
let activeCharacter=resolveRequestedCharacter();
let activeEdition=resolveRequestedEdition();
let scheduled=false;
let observer=null;

function key(){return `living-table-sheet-state-v1:${activeCharacter.id}:${normalizeEdition(activeEdition)}`;}
function defaults(){return {playerName:'',tempHp:0,inspiration:false,deathSuccesses:0,deathFailures:0,exhaustion:0,conditions:[],currency:{cp:0,sp:0,ep:0,gp:0,pp:0}};}
function load(){try{return {...defaults(),...JSON.parse(localStorage.getItem(key())||'{}')};}catch{return defaults();}}
function save(state){localStorage.setItem(key(),JSON.stringify(state));}
function currentEdition(){const sheet=document.querySelector('#app .full-character-sheet');const text=sheet?.querySelector('.full-sheet-header p')?.textContent||'';return text.includes('2024 / SRD 5.2.1')?'dnd-2024':'dnd-2014';}
function valueNumber(value,min,max){const n=Number(value);return Number.isFinite(n)?Math.max(min,Math.min(max,Math.trunc(n))):min;}

function markup(){
 const profile=getCharacterProfile(activeCharacter,activeEdition);
 const meta=getPregenSheetMetadata(activeCharacter.id);
 const state=load();
 const inspirationLabel=profile.rulesId==='dnd-2024'?'Heroic Inspiration':'Inspiration';
 const inspirationNote=profile.rulesId==='dnd-2024'&&profile.features?.some(feature=>feature.name==='Resourceful')?'Human Resourceful grants Heroic Inspiration after a Long Rest.':'';
 const senses=profile.senses?.length?profile.senses.join(', '):'Normal senses';
 const conditions=new Set(state.conditions||[]);
 return `<section class="sheet-panel sheet-tracking-panel" aria-labelledby="sheet-tracking-title">
  <h3 id="sheet-tracking-title">Character Details & Tracking</h3>
  <div class="sheet-identity-grid">
   <label>Player Name<input data-sheet-field="playerName" type="text" value="${esc(state.playerName)}" placeholder="Player name"></label>
   <div><small>Alignment</small><strong>${esc(meta.alignment)}</strong></div>
   <div><small>Size</small><strong>${esc(profile.size||'Medium')}</strong></div>
   <div><small>Species</small><strong>${esc(profile.species)}</strong></div>
   <div><small>Class / Level</small><strong>${esc(profile.className)} ${profile.level}</strong><span>${esc(profile.subclass)}</span></div>
   <div><small>Background</small><strong>${esc(profile.background)}</strong></div>
   <div><small>Hit Die</small><strong>${esc(profile.hitDie)}</strong></div>
   <div><small>Senses</small><strong>${esc(senses)}</strong></div>
   <div><small>Advancement</small><strong>Level ${profile.level}</strong><span>DM-managed milestone / XP</span></div>
  </div>
  <div class="sheet-tracker-grid">
   <label>Temporary HP<input data-sheet-number="tempHp" type="number" min="0" max="999" value="${valueNumber(state.tempHp,0,999)}"></label>
   <label class="sheet-check-tracker"><input data-sheet-check="inspiration" type="checkbox" ${state.inspiration?'checked':''}><span>${inspirationLabel}</span><small>${esc(inspirationNote)}</small></label>
   <fieldset><legend>Death Saves</legend><label>Successes <input data-sheet-number="deathSuccesses" type="number" min="0" max="3" value="${valueNumber(state.deathSuccesses,0,3)}"></label><label>Failures <input data-sheet-number="deathFailures" type="number" min="0" max="3" value="${valueNumber(state.deathFailures,0,3)}"></label></fieldset>
   <label>Exhaustion<input data-sheet-number="exhaustion" type="number" min="0" max="6" value="${valueNumber(state.exhaustion,0,6)}"><small>Track the edition-specific effects from the rules reference.</small></label>
  </div>
  <fieldset class="sheet-condition-tracker"><legend>Conditions</legend><div>${CONDITIONS.map(condition=>`<label><input type="checkbox" data-sheet-condition="${condition}" ${conditions.has(condition)?'checked':''}>${condition}</label>`).join('')}</div></fieldset>
  <fieldset class="sheet-currency"><legend>Currency</legend><div>${['cp','sp','ep','gp','pp'].map(unit=>`<label>${unit.toUpperCase()}<input data-sheet-currency="${unit}" type="number" min="0" max="999999" value="${valueNumber(state.currency?.[unit],0,999999)}"></label>`).join('')}</div></fieldset>
  <div class="sheet-roleplay-grid">
   <article><h4>Personality</h4><p>${esc(meta.personality)}</p></article>
   <article><h4>Ideal</h4><p>${esc(meta.ideal)}</p></article>
   <article><h4>Bond</h4><p>${esc(meta.bond)}</p></article>
   <article><h4>Flaw</h4><p>${esc(meta.flaw)}</p></article>
  </div>
 </section>`;
}

function persist(panel){
 const state=load();
 panel.querySelectorAll('[data-sheet-field]').forEach(input=>input.addEventListener('input',()=>{state[input.dataset.sheetField]=input.value;save(state);}));
 panel.querySelectorAll('[data-sheet-number]').forEach(input=>input.addEventListener('change',()=>{state[input.dataset.sheetNumber]=valueNumber(input.value,Number(input.min||0),Number(input.max||999));input.value=state[input.dataset.sheetNumber];save(state);}));
 panel.querySelectorAll('[data-sheet-check]').forEach(input=>input.addEventListener('change',()=>{state[input.dataset.sheetCheck]=input.checked;save(state);}));
 panel.querySelectorAll('[data-sheet-condition]').forEach(input=>input.addEventListener('change',()=>{const selected=new Set(state.conditions||[]);input.checked?selected.add(input.dataset.sheetCondition):selected.delete(input.dataset.sheetCondition);state.conditions=[...selected];save(state);}));
 panel.querySelectorAll('[data-sheet-currency]').forEach(input=>input.addEventListener('change',()=>{state.currency={...defaults().currency,...state.currency,[input.dataset.sheetCurrency]:valueNumber(input.value,0,999999)};input.value=state.currency[input.dataset.sheetCurrency];save(state);}));
}

function observe(){const app=document.querySelector('#app');if(app&&observer)observer.observe(app,{childList:true,subtree:true});}
function render(){
 scheduled=false;
 const sheet=document.querySelector('#app .full-character-sheet');
 if(!sheet)return;
 activeEdition=currentEdition();
 observer?.disconnect();
 try{
  sheet.querySelector('.sheet-tracking-panel')?.remove();
  const attacks=sheet.querySelector('.sheet-attacks');
  const wrapper=document.createElement('div');wrapper.innerHTML=markup();
  const panel=wrapper.firstElementChild;
  if(attacks)sheet.insertBefore(panel,attacks);else sheet.append(panel);
  persist(panel);
 } finally { observe(); }
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(render);}
window.addEventListener('living-table:character-loaded',event=>{activeCharacter=event.detail.character||resolveRequestedCharacter();activeEdition=event.detail.edition||resolveRequestedEdition();schedule();});
document.addEventListener('click',event=>{if(event.target.closest('#app [data-edition-toggle],#app [data-full-sheet-edition]'))setTimeout(schedule,40);},true);
observer=new MutationObserver(schedule);observe();
window.addEventListener('DOMContentLoaded',schedule);setTimeout(schedule,260);
