import assert from 'node:assert/strict';
import fs from 'node:fs';

const view=fs.readFileSync('combat-action-view.js','utf8');
const controls=fs.readFileSync('combat-action-controls.js','utf8');
const sync=fs.readFileSync('live-combat-sync.js','utf8');
const dm=fs.readFileSync('index.html','utf8');
const player=fs.readFileSync('player.html','utf8');

for(const hook of ['data-combat-spend','data-combat-move','data-combat-trigger-ready','data-combat-drop-ready','data-combat-ready-form'])assert.match(view,new RegExp(hook));
assert.match(view,/Ready uses your Action now and your Reaction when the trigger occurs/);
assert.match(view,/readied spell also requires concentration/);
assert.match(view,/group\?\.memberIds/,'The DM must get separate controls for every member of an active monster initiative group.');
assert.match(controls,/UPDATE_COMBAT_ACTION_ECONOMY/);
assert.match(controls,/RESET_COMBATANT_TURN/);
assert.match(controls,/createActionEconomyIntent/);
assert.match(controls,/living-table:combat-action-intent/);
assert.match(sync,/validatePlayerActionEconomyIntent/);
assert.match(sync,/UPDATE_COMBAT_ACTION_ECONOMY/);
assert.match(sync,/living-table:remote-combat-action-economy/);
assert.match(dm,/combat-action-controls\.js\?v=action-economy-1/);
assert.match(player,/combat-action-controls\.js\?v=action-economy-1/);
console.log('Action, bonus action, reaction, interaction, movement, Ready, DM group controls, and canonical reducer wiring are present.');
