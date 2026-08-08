import assert from 'node:assert/strict';
import fs from 'node:fs';
import { rollDie, rollD20 } from '../src/dice.js';
import { COMMANDS, applyCommand, createInitialState, eventText } from '../src/state.js';
import { createRuinedChapelSession } from '../src/encounter.js';
import { projectSessionFor } from '../src/projection.js';
import { ROLES, validateCard, validateSession } from '../src/schema.js';
import { SOURCE_KINDS, primarySourceFor, sourceRegistry, validateSourceRegistry } from '../src/integrations/sourceRegistry.js';

const html=fs.readFileSync('index.html','utf8');
const css=fs.readFileSync('styles.css','utf8');
const hierarchyCss=fs.readFileSync('adventure-state-board.css','utf8');
const stackCss=fs.readFileSync('compact-stacks.css','utf8');
const app=fs.readFileSync('src/app.js','utf8');
const cardsSource=fs.readFileSync('src/wishing-cake-cards.js','utf8');
const auditedRules=fs.readFileSync('src/wishing-cake-audited-rules.js','utf8');
const spatialCards=fs.readFileSync('src/wishing-cake-spatial-cards.js','utf8');
const vision=fs.readFileSync('docs/PRODUCT_VISION.md','utf8');
const mvp=fs.readFileSync('docs/MVP_SPEC.md','utf8');
const integrationLedger=fs.readFileSync('docs/DND_REPOSITORY_INTEGRATION.md','utf8');
const sequence=values=>{let index=0;return()=>values[index++];};

assert.equal(rollDie(20,()=>0),1); assert.equal(rollDie(20,()=>0.999999),20);
const advantage=rollD20('advantage',sequence([0.2,0.8])); assert.deepEqual(advantage.rolls,[5,17]); assert.equal(advantage.total,17);
const disadvantage=rollD20('disadvantage',sequence([0.2,0.8])); assert.equal(disadvantage.total,5);
assert.throws(()=>rollD20('incorrect'),/Unknown d20 roll mode/);

let state=createInitialState();
let result=applyCommand(state,{type:COMMANDS.ROLL_D20,mode:'advantage'},{random:sequence([0.1,0.9])}); state=result.state;
assert.equal(state.total,19); assert.equal(state.revision,1);
result=applyCommand(state,{type:COMMANDS.TOGGLE_CARD,key:'hazard'}); state=result.state; assert.equal(state.revealed.hazard,true);
result=applyCommand(state,{type:COMMANDS.END_TURN}); state=result.state; assert.equal(state.active,1); assert.match(eventText(state)[0],/Skeleton A/);
result=applyCommand(state,{type:COMMANDS.UNDO}); state=result.state; assert.equal(state.active,0); assert.equal(result.event.type,'COMMAND_UNDONE');

const session=createRuinedChapelSession(); validateSession(session);
const dm=session.participants.find(p=>p.role===ROLES.DM);
const player=session.participants.find(p=>p.role===ROLES.PLAYER);
const dmView=projectSessionFor(session,dm);
const playerView=projectSessionFor(session,player);
assert.equal(session.id,'wishing-cake-birthday-example');
assert.ok(dmView.cards.length>=30);
assert.ok(playerView.cards.length>0,'Player projection must contain the currently revealed spatial/Scene context.');
assert.ok(playerView.cards.length<dmView.cards.length,'Player projection must exclude unrevealed adventure cards.');
assert.match(String(dmView.cards.find(card=>card.id==='monster-sepulchral').dmFace.hp),/^58/);
for(const hiddenId of ['caretaker','npc-boris','npc-pip','npc-lute','priest','lantern','room-cake-chamber']){
  assert.equal(playerView.cards.some(card=>card.id===hiddenId),false,`${hiddenId} must stay absent until the DM explicitly reveals it.`);
}
for(const card of playerView.cards)assert.equal('dmFace' in card,false,`${card.id} player projection must never contain dmFace.`);
assert.equal(playerView.cards.find(card=>card.id==='location').title,'Bramblewick');
assert.equal(playerView.cards.find(card=>card.id==='site-wishing-cake-inn').title,'The Wishing Cake Inn');
assert.equal(playerView.cards.find(card=>card.id==='room').title,'Grand Celebration Hall');
assert.equal(playerView.cards.find(card=>card.id==='scene-stolen-wish').title,'The Stolen Wish');
assert.equal(playerView.actors.some(actor=>actor.id==='sepulchral'),false);
assert.equal(playerView.actors.find(actor=>actor.id==='wendy').hp.current,28);
assert.throws(()=>projectSessionFor(session,{id:'intruder',name:'Intruder',role:'player'}),/not seated/);
assert.throws(()=>validateCard({id:'bad'}),/title/);

assert.match(cardsSource,/Room 7: Cake Chamber/);
assert.match(cardsSource,/Martha Bramblepot/);
assert.match(cardsSource,/D, D, E, D, G, F/);
assert.match(cardsSource,/Wish Circle Clock/);
assert.match(cardsSource,/Birthday Spark Candle Tokens/);
assert.match(cardsSource,/Keeper of the Wish Crown/);
assert.match(cardsSource,/Healing Candy/);
assert.match(cardsSource,/openingDialogue/);
assert.match(cardsSource,/playerFace/);
assert.match(cardsSource,/dmFace/);
assert.match(auditedRules,/six progress before three failures/i);
assert.match(auditedRules,/spell save DC 13/);
assert.match(auditedRules,/artRequired/);
assert.match(spatialCards,/Bramblewick/);
assert.match(spatialCards,/site-wishing-cake-inn/);
assert.match(spatialCards,/Grand Celebration Hall/);
assert.match(spatialCards,/scene-stolen-wish/);

assert.equal(validateSourceRegistry(sourceRegistry),true);
assert.equal(primarySourceFor(SOURCE_KINDS.RULES_CATALOG),'cbw29512/DungeonCards');
assert.equal(primarySourceFor(SOURCE_KINDS.CARD_PLATFORM),'cbw29512/DungeonCards');
assert.equal(sourceRegistry.some(source=>source.repository==='cbw29512/monstercardforge'),true);
assert.equal(sourceRegistry.some(source=>source.repository==='cbw29512/CharacterForge'),true);
assert.throws(()=>validateSourceRegistry([...sourceRegistry,sourceRegistry[0]]),/Duplicate source repository/);
assert.match(integrationLedger,/Do not maintain a second handwritten SRD spell or monster catalog/);
assert.match(integrationLedger,/DNDTeachingAdventureDemonsWrath/);
assert.match(integrationLedger,/DungeonMaps/);

assert.match(html,/name="living-table-role" content="dm"/);
assert.match(html,/adventure-state-board\.css/);
assert.doesNotMatch(html,/encounter-slot-guard/);
assert.match(app,/projectSessionFor/);
assert.match(app,/Adventure Deck/); assert.match(app,/Dungeon Master Card Board/); assert.match(app,/const SLOTS/);
assert.match(app,/label: "Location"/); assert.match(app,/label: "Site"/); assert.match(app,/label: "Area"/);
assert.doesNotMatch(app,/label: "Current Scene"/);
assert.match(app,/mergeActiveSceneIntoArea/);
assert.match(app,/NPCs/); assert.match(app,/Monsters/);
assert.match(app,/Traps \/ Hazards/); assert.match(app,/Treasure \/ Rewards/);
assert.doesNotMatch(app,/label: "Objective \/ Quest"/);
assert.match(app,/stack-count/); assert.match(app,/data-toggle-stack/); assert.match(app,/data-card-roll/);
assert.match(app,/data-roll-all-monsters/); assert.match(app,/groupedInitiative/); assert.match(app,/Identical monsters share one initiative value/);
assert.match(app,/data-open-picker/); assert.match(app,/data-place-card/); assert.match(app,/draggable="true"/);
assert.match(app,/data-flip-card/); assert.match(app,/data-remove-instance/);
assert.match(css,/\.fixed-board/); assert.match(css,/\.board-slot/); assert.match(css,/\.tarot-card/); assert.match(css,/\.card-picker/);
assert.match(hierarchyCss,/data-slot="location"/); assert.match(hierarchyCss,/data-slot="site"/); assert.match(hierarchyCss,/data-slot="room"/); assert.doesNotMatch(hierarchyCss,/data-slot="scene"/); assert.match(hierarchyCss,/flex-wrap: wrap !important/);
assert.match(stackCss,/\.card-stack/); assert.match(stackCss,/\.stack-count/); assert.match(stackCss,/\.inside-card-rolls/); assert.match(stackCss,/\.stack-drawer/);
assert.match(vision,/server-side/i); assert.match(mvp,/complete (?:a single )?D&D-style combat encounter/i);

const slotDefinitions = [...app.matchAll(/id: "(location|site|room|npc|monster|hazard|treasure)"/g)].map(match => match[1]);
assert.deepEqual(slotDefinitions, ['location','site','room','npc','monster','hazard','treasure']);

console.log('The Living Table seven-slot hierarchy, audited Wishing Cake rules, explicit player-safe projections, source registry, and runtime contracts passed.');