import assert from 'node:assert/strict';
import { renderCombatActionControls } from '../combat-action-view.js';

const player={id:'player:seat-1',kind:'player',name:'Wendy',cardId:'wendy-birthday-hero',actionEconomy:{action:true,bonusAction:true,reaction:true,objectInteraction:true,movementMax:30,movementRemaining:30,readiedAction:null}};
const monsterA={id:'monster:a',kind:'monster',name:'Cake Mimic A',cardId:'cake-mimic',actionEconomy:{action:true,bonusAction:true,reaction:true,objectInteraction:true,movementMax:15,movementRemaining:15,readiedAction:null}};
const monsterB={id:'monster:b',kind:'monster',name:'Cake Mimic B',cardId:'cake-mimic',actionEconomy:{...monsterA.actionEconomy}};
const combat={status:'active',activeTurnId:'player:seat-1',combatants:{[player.id]:player,[monsterA.id]:monsterA,[monsterB.id]:monsterB},initiativeGroups:{'group:cake-mimic':{id:'group:cake-mimic',memberIds:[monsterA.id,monsterB.id]}}};

const ownTurn=renderCombatActionControls({combat,isDM:false,ownCharacterId:'wendy-birthday-hero'});
assert.match(ownTurn,/ACTIVE TURN/);
assert.match(ownTurn,/data-combat-spend="action"[^>]*>Spend Action/);
assert.match(ownTurn,/data-combat-move="5"/);
assert.match(ownTurn,/data-combat-ready-form/);
assert.match(ownTurn,/Ready · Spend Action/);

combat.activeTurnId='group:cake-mimic';
const reactionWindow=renderCombatActionControls({combat,isDM:false,ownCharacterId:'wendy-birthday-hero'});
assert.match(reactionWindow,/REACTION WINDOW/);
assert.match(reactionWindow,/data-combat-spend="action"[^>]*disabled/);
assert.match(reactionWindow,/data-combat-spend="reaction"[^>]*>Spend Reaction/);
assert.match(reactionWindow,/data-combat-move="5"[^>]*disabled/);

const dmGroup=renderCombatActionControls({combat,isDM:true});
assert.match(dmGroup,/Cake Mimic A/);
assert.match(dmGroup,/Cake Mimic B/);
assert.equal((dmGroup.match(/data-combat-reset-turn/g)||[]).length,2,'Grouped monsters need separate per-instance turn budgets.');

player.actionEconomy={...player.actionEconomy,action:false,readiedAction:{kind:'action',trigger:'The door opens',response:'I fire an arrow'}};
const ready=renderCombatActionControls({combat:{...combat,activeTurnId:'group:cake-mimic'},isDM:false,ownCharacterId:'wendy-birthday-hero'});
assert.match(ready,/The door opens/);
assert.match(ready,/I fire an arrow/);
assert.match(ready,/Trigger Ready · Reaction/);
console.log('Action economy view distinguishes own-turn spending, reaction windows, grouped monster budgets, and Ready state.');
