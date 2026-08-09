const esc=value=>String(value??'').replace(/[&<>"']/g,char=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

function actionButton(id,key,label,available,enabled=true){
  return `<button type="button" data-combat-spend="${key}" data-combatant-id="${esc(id)}" ${available&&enabled?'':'disabled'}>${available?`Spend ${label}`:`${label} Spent`}</button>`;
}

function movementControls(id,economy,enabled){
  const remaining=Number(economy.movementRemaining??0);
  const max=Number(economy.movementMax??0);
  return `<div class="combat-movement"><strong>Movement ${remaining}/${max} ft.</strong><button type="button" data-combat-move="5" data-combatant-id="${esc(id)}" ${enabled&&remaining>0?'':'disabled'}>Move 5 ft.</button><button type="button" data-combat-move="10" data-combatant-id="${esc(id)}" ${enabled&&remaining>0?'':'disabled'}>Move 10 ft.</button></div>`;
}

function readyControls(id,economy,ownTurn){
  const ready=economy.readiedAction;
  if(ready){
    const trigger=typeof ready==='object'?ready.trigger:String(ready);
    const response=typeof ready==='object'?ready.response:'Declared response';
    return `<div class="combat-ready is-ready"><strong>Ready</strong><p><b>If:</b> ${esc(trigger)}<br><b>Then:</b> ${esc(response)}</p><div><button type="button" data-combat-trigger-ready data-combatant-id="${esc(id)}" ${economy.reaction?'':'disabled'}>Trigger Ready · Reaction</button><button type="button" data-combat-drop-ready data-combatant-id="${esc(id)}">Drop Ready</button></div></div>`;
  }
  const enabled=ownTurn&&economy.action&&economy.reaction;
  return `<form class="combat-ready" data-combat-ready-form data-combatant-id="${esc(id)}"><strong>Ready an Action</strong><label>Trigger<input name="readyTrigger" maxlength="180" placeholder="If the cultist opens the door…" ${enabled?'':'disabled'} required></label><label>Response<input name="readyResponse" maxlength="180" placeholder="I loose an arrow." ${enabled?'':'disabled'} required></label><button ${enabled?'':'disabled'}>Ready · Spend Action</button><small>Ready uses your Action now and your Reaction when the trigger occurs. A readied spell also requires concentration.</small></form>`;
}

function combatantPanel(combatant,ownTurn,{isDM=false}={}){
  const economy=combatant.actionEconomy||{};
  return `<section class="combat-action-card" data-action-combatant="${esc(combatant.id)}"><header><div><small>${ownTurn?'ACTIVE TURN':'REACTION WINDOW'}</small><h3>${esc(combatant.name)}</h3></div>${isDM?`<button type="button" data-combat-reset-turn data-combatant-id="${esc(combatant.id)}">Reset Budget</button>`:''}</header><div class="combat-action-buttons">${actionButton(combatant.id,'action','Action',economy.action,ownTurn)}${actionButton(combatant.id,'bonusAction','Bonus Action',economy.bonusAction,ownTurn)}${actionButton(combatant.id,'objectInteraction','Interaction',economy.objectInteraction,ownTurn)}${actionButton(combatant.id,'reaction','Reaction',economy.reaction,true)}</div>${movementControls(combatant.id,economy,ownTurn)}${readyControls(combatant.id,economy,ownTurn)}</section>`;
}

export function renderCombatActionControls({combat,isDM,ownCharacterId=''}){
  try{
    if(!combat||combat.status!=='active')return '';
    if(!isDM){
      const own=Object.values(combat.combatants||{}).find(entry=>entry.kind==='player'&&entry.cardId===ownCharacterId);
      if(!own)return '';
      return `<section class="combat-action-console"><h3>Your Turn Resources</h3>${combatantPanel(own,combat.activeTurnId===own.id)}</section>`;
    }
    const group=combat.initiativeGroups?.[combat.activeTurnId];
    const ids=group?.memberIds?.length?group.memberIds:[combat.activeTurnId];
    const targets=ids.map(id=>combat.combatants?.[id]).filter(Boolean);
    if(!targets.length)return '';
    return `<section class="combat-action-console"><h3>Active Creature Resources</h3>${targets.map(target=>combatantPanel(target,true,{isDM:true})).join('')}</section>`;
  }catch(error){console.error('[Living Table] Could not render action economy controls.',error);return '<p>Action controls could not be rendered.</p>';}
}
