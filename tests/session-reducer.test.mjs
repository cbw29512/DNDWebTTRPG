import assert from 'node:assert/strict';
import { SESSION_COMMANDS } from '../src/session/session-commands.js';
import { LIVE_BOARD_SLOT_IDS, normalizeSessionState } from '../src/session/session-schema.js';
import { applySessionCommand } from '../src/session/session-reducer.js';

const baseSession = normalizeSessionState({
  sessionId:'test-session',status:'prepared',
  board:{location:['location'],site:['site-wishing-cake-inn'],room:['room'],npc:[],monster:['paper-plate-mimic'],hazard:[],treasure:[]},
  players:[{seatId:'seat-1',characterId:'wendy-birthday-hero',claimedBy:null,ready:false}],eventHistory:[]
});

for(const slotId of LIVE_BOARD_SLOT_IDS)assert.ok(Array.isArray(baseSession.board[slotId]),`${slotId} must always exist`);
assert.equal(baseSession.revision,0);

{
  const before=structuredClone(baseSession);
  const {state,event}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.PLACE_CARD,slotId:'monster',cardId:'animated-present'},{now:1000});
  assert.deepEqual(baseSession,before,'Reducer must not mutate the input session.');
  assert.deepEqual(state.board.monster,['paper-plate-mimic','animated-present']);
  assert.equal(state.revision,1);
  assert.equal(state.updatedAt,'1970-01-01T00:00:01.000Z');
  assert.equal(event.type,SESSION_COMMANDS.PLACE_CARD);
  assert.deepEqual(event.data,{slotId:'monster',cardId:'animated-present'});
  assert.equal(state.eventHistory.at(-1).id,event.id);
}

{
  const once=applySessionCommand(baseSession,{type:SESSION_COMMANDS.PLACE_CARD,slotId:'monster',cardId:'animated-present'},{now:2000}).state;
  const twice=applySessionCommand(once,{type:SESSION_COMMANDS.PLACE_CARD,slotId:'monster',cardId:'animated-present'},{now:3000}).state;
  assert.equal(twice.board.monster.filter(id=>id==='animated-present').length,2,'Repeated monsters must preserve quantity.');
  const removed=applySessionCommand(twice,{type:SESSION_COMMANDS.REMOVE_CARD,slotId:'monster',cardId:'animated-present'},{now:4000}).state;
  assert.equal(removed.board.monster.filter(id=>id==='animated-present').length,1,'REMOVE_CARD removes one matching entry.');
}

{
  const replacement={room:['cake-chamber'],treasure:['birthday-spark']};
  const {state,event}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.REPLACE_BOARD,board:replacement},{now:5000});
  assert.deepEqual(state.board.room,['cake-chamber']);
  assert.deepEqual(state.board.treasure,['birthday-spark']);
  assert.deepEqual(state.board.monster,[],'Missing slots normalize to empty arrays.');
  assert.equal('board' in event.data,false,'Board autosaves must not duplicate the complete board into event history.');
  assert.deepEqual(event.data.slotCounts,{location:0,site:0,room:1,npc:0,monster:0,hazard:0,treasure:1});
}

{
  const {state,event}=applySessionCommand(baseSession,{
    type:SESSION_COMMANDS.LOAD_SCENE,
    sceneId:'finale',locationId:'inn',siteId:'birthday-wing',roomId:'cake-chamber',sceneCardId:'scene-finale',
    board:{location:['inn'],site:['birthday-wing'],room:['cake-chamber'],npc:['wendy'],monster:['cake-golem'],hazard:[],treasure:['birthday-spark']},
    quests:['restore-wish','defeat-cake'],questState:{active:['defeat-cake'],revealed:['restore-wish','defeat-cake']},
    roomHistory:['wrapping-room'],discoveredScenes:['entry','finale'],status:'in-progress',activatedQuestIds:['defeat-cake']
  },{now:5500});
  assert.equal(state.currentSceneId,'finale');
  assert.equal(state.currentRoomId,'cake-chamber');
  assert.deepEqual(state.board.monster,['cake-golem']);
  assert.deepEqual(state.questState.active,['defeat-cake']);
  assert.deepEqual(state.roomHistory,['wrapping-room']);
  assert.deepEqual(state.discoveredScenes,['entry','finale']);
  assert.equal(state.eventHistory.length,1,'Atomic scene load creates one event, not a partial-write trail.');
  assert.equal('board' in event.data,false,'Scene events must summarize board state rather than duplicate it.');
  assert.equal(event.data.sceneId,'finale');
  assert.equal(event.data.slotCounts.monster,1);
}

{
  const {state}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.SET_SCENE_CONTEXT,currentLocationId:'inn',currentSiteId:'birthday-wing',currentRoomId:'cake-chamber',currentSceneId:'finale',currentSceneCardId:'scene-finale'},{now:6000});
  assert.equal(state.currentRoomId,'cake-chamber');
  assert.equal(state.currentSceneId,'finale');
}

{
  const combat={round:3,activeTurn:'wendy',concentration:{'seat-1':'Bless'}};
  const {state,event}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.SET_COMBAT_STATE,combatState:combat},{now:7000});
  combat.round=99;
  assert.equal(state.combatState.round,3,'Reducer must clone command payload state.');
  assert.equal(state.combatState.concentration['seat-1'],'Bless');
  assert.equal('combatState' in event.data,false,'Combat events must not duplicate the full combat snapshot.');
  assert.equal(event.data.round,3);
  assert.equal(event.data.activeTurn,'wendy');
}

{
  const {state}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.UPDATE_PLAYER,seatId:'seat-1',patch:{ready:true,hp:22,seatId:'hijack'}},{now:8000});
  assert.equal(state.players[0].ready,true);
  assert.equal(state.players[0].hp,22);
  assert.equal(state.players[0].seatId,'seat-1','A patch cannot replace seat identity.');
}

{
  const {state}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.SET_STATUS,status:'in-progress'},{now:9000});
  assert.equal(state.status,'in-progress');
}

{
  const {state,event}=applySessionCommand(baseSession,{type:SESSION_COMMANDS.REPLACE_BOARD,board:structuredClone(baseSession.board)},{now:9500});
  assert.equal(event,null,'A no-op command must not create event history noise.');
  assert.equal(state.revision,baseSession.revision,'A no-op command must not increment revision.');
}

assert.throws(()=>applySessionCommand(baseSession,{type:'MAGIC_MUTATION'},{now:10000}),/Unsupported session command/);
assert.throws(()=>applySessionCommand(baseSession,{type:SESSION_COMMANDS.PLACE_CARD,slotId:'scene',cardId:'bad'},{now:11000}),/Unknown board slot/);
assert.throws(()=>applySessionCommand(baseSession,{type:SESSION_COMMANDS.REMOVE_CARD,slotId:'monster',cardId:'missing'},{now:12000}),/not present/);
assert.throws(()=>applySessionCommand(baseSession,{type:SESSION_COMMANDS.UPDATE_PLAYER,seatId:'seat-404',patch:{ready:true}},{now:13000}),/Unknown player seat/);
assert.throws(()=>applySessionCommand(baseSession,{type:SESSION_COMMANDS.LOAD_SCENE,board:{}},{now:14000}),/requires sceneId/);

console.log('Authoritative session reducer audit passed.');