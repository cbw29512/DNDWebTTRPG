import { initiativeComplete, turnLabel } from './src/session/combat-party-model.js';

const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));
const initiativeFor=(combat,id)=>combat.initiativeGroups?.[id]?.initiative??combat.combatants?.[id]?.initiative??null;

function orderMarkup(combat){
  const ids=combat.turnOrder||[];
  if(!ids.length)return '<li>Initiative is not complete yet.</li>';
  return ids.map((id,index)=>`<li class="${combat.activeTurnId===id?'is-active':''}"><span><b>${index+1}.</b> ${esc(turnLabel(combat,id))}</span><strong>${initiativeFor(combat,id)??'—'}</strong></li>`).join('');
}

function playerSetup(combat,isDM,ownCharacterId){
  const players=Object.values(combat.combatants||{}).filter(entry=>entry.kind==='player');
  return players.map(player=>{
    const mine=player.cardId===ownCharacterId;
    const controls=isDM
      ? `<input type="number" inputmode="numeric" data-player-init-input="${esc(player.id)}" value="${player.initiative??''}" aria-label="${esc(player.name)} initiative"><button data-player-init-set="${esc(player.id)}">Set</button><button data-player-init-roll="${esc(player.id)}">Roll</button>`
      : mine?`<button data-player-init-roll="${esc(player.id)}">Roll My Initiative</button>`:'<span>Waiting for player</span>';
    return `<div class="combat-player-init"><span><b>${esc(player.name)}</b><small>${player.initiative==null?'Not rolled':`Initiative ${player.initiative}`}</small></span><div>${controls}</div></div>`;
  }).join('')||'<p>No player combatants are registered.</p>';
}

function economyMarkup(combat,ownCharacterId){
  const player=Object.values(combat.combatants||{}).find(entry=>entry.cardId===ownCharacterId);
  if(!player?.actionEconomy)return '';
  const action=player.actionEconomy;
  return `<div class="combat-economy"><span class="${action.action?'available':'spent'}">Action</span><span class="${action.bonusAction?'available':'spent'}">Bonus</span><span class="${action.reaction?'available':'spent'}">Reaction</span><span>${action.movementRemaining??0}/${action.movementMax??0} ft.</span></div>`;
}

export function renderCombatPanel({combat,isDM,ownCharacterId='',message=''}){
  try{
    if(!combat)return `<h2>Combat Rounds</h2><p>${isDM?'Start combat when the encounter begins.':'Waiting for the DM to start combat.'}</p>${isDM?'<button class="reveal" data-combat-start>Start Combat</button>':''}<p class="combat-round-message">${esc(message)}</p>`;
    const setup=combat.status==='setup';
    const active=combat.status==='active';
    return `<header class="combat-round-header"><div><small>${setup?'INITIATIVE SETUP':`ROUND ${combat.round}`}</small><h2>Combat Rounds</h2></div>${active?`<strong>Active: ${esc(turnLabel(combat,combat.activeTurnId))}</strong>`:''}</header>
      ${setup?`<section class="combat-player-initiative"><h3>Player Initiative</h3>${playerSetup(combat,isDM,ownCharacterId)}</section>`:''}
      <ol class="initiative combat-order">${orderMarkup(combat)}</ol>
      ${economyMarkup(combat,ownCharacterId)}
      <div class="combat-round-actions">${isDM&&setup?`<button class="reveal" data-combat-begin ${initiativeComplete(combat)?'':'disabled'}>Begin Round 1</button>`:''}${isDM&&active?'<button class="reveal" data-combat-next>Next Turn</button>':''}${isDM?'<button data-combat-end>End Combat</button>':''}</div>
      <p class="combat-round-message" aria-live="polite">${esc(message)}</p>
      <small>${setup?'Roll identical monsters from their ⏱ INIT card shortcut; they share one initiative result.':'Action, Bonus Action, Reaction, and movement reset from the canonical combat state when a creature’s turn begins.'}</small>`;
  }catch(error){console.error('[Living Table] Could not render combat-round panel.',error);return '<h2>Combat Rounds</h2><p>Combat controls could not be rendered.</p>';}
}
