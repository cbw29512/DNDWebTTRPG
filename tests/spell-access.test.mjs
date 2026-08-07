import assert from 'node:assert/strict';
import { getCharacterCard, getCharacterProfile } from '../src/player/character-cards.js';
import { activeSpellEntries, getSpellCard } from '../src/player/spell-cards.js';
import { spellAccesses, spellCombatSummaryForAccess, spellAttackBonusForAbility, spellSaveDcForAbility } from '../src/player/spell-access.js';

function entry(profile,name){return activeSpellEntries(profile).find(item=>item.name===name);}

const elara24=getCharacterProfile(getCharacterCard('elara-evoker'),'dnd-2024');
const shield=entry(elara24,'Shield');
const shieldAccess=spellAccesses(shield,elara24);
assert.ok(shieldAccess.some(access=>access.group==='prepared'&&access.ability==='intelligence'&&access.usesSlots));
const shieldOrigin=shieldAccess.find(access=>access.group==='origin');
assert.equal(shieldOrigin.ability,'intelligence');
assert.equal(shieldOrigin.usesSlots,true);
assert.equal(shieldOrigin.freeUse.max,1);
assert.equal(shieldOrigin.freeUse.recharge,'Long Rest');

const detect=entry(elara24,'Detect Magic');
const detectLineage=spellAccesses(detect,elara24).find(access=>access.group==='lineage');
assert.equal(detectLineage.ability,'intelligence');
assert.equal(detectLineage.usesSlots,true);
assert.equal(detectLineage.freeUse.max,1);

const brunna24=getCharacterProfile(getCharacterCard('brunna-life-cleric'),'dnd-2024');
const command=entry(brunna24,'Command');
const commandOrigin=spellAccesses(command,brunna24).find(access=>access.group==='origin');
assert.equal(commandOrigin.ability,'wisdom');
assert.equal(commandOrigin.freeUse.max,1);
assert.equal(spellCombatSummaryForAccess(getSpellCard('Command','dnd-2024'),brunna24,commandOrigin),'WIS save DC 13');

const fern24=getCharacterProfile(getCharacterCard('fern-hunter'),'dnd-2024');
const longstrider=entry(fern24,'Longstrider');
const longstriderLineage=spellAccesses(longstrider,fern24).find(access=>access.group==='lineage');
assert.equal(longstriderLineage.ability,'wisdom');
assert.equal(longstriderLineage.freeUse.max,1);
const huntersMark=entry(fern24,'Hunter’s Mark');
const markAccess=spellAccesses(huntersMark,fern24).find(access=>access.group==='alwaysPrepared');
assert.equal(markAccess.ability,'wisdom');
assert.equal(markAccess.usesSlots,true);
assert.equal(markAccess.freeUse.max,2);
assert.equal(markAccess.freeUse.resourceId,'favored-enemy');

const lute24=getCharacterProfile(getCharacterCard('lute-lore-bard'),'dnd-2024');
const sanctuary=entry(lute24,'Sanctuary');
const sanctuaryOrigin=spellAccesses(sanctuary,lute24).find(access=>access.group==='origin');
assert.equal(sanctuaryOrigin.ability,'charisma');
assert.equal(spellCombatSummaryForAccess(getSpellCard('Sanctuary','dnd-2024'),lute24,sanctuaryOrigin),'WIS save DC 13');

// Architecture proof: source ability must override the class spellcasting ability.
const mixedProfile={
 level:5,
 spellcastingAbility:'intelligence',
 abilities:{strength:8,dexterity:12,constitution:14,intelligence:18,wisdom:10,charisma:14},
 spellAccessRules:{origin:{ability:'charisma',usesSlots:true,sourceLabel:'Origin Test'}},
 resources:[]
};
const originAccess=spellAccesses({name:'Guiding Bolt',sources:['Origin']},mixedProfile)[0];
assert.equal(originAccess.ability,'charisma');
assert.equal(spellAttackBonusForAbility(mixedProfile,'intelligence'),7);
assert.equal(spellAttackBonusForAbility(mixedProfile,'charisma'),5);
assert.equal(spellSaveDcForAbility(mixedProfile,'intelligence'),15);
assert.equal(spellSaveDcForAbility(mixedProfile,'charisma'),13);
assert.equal(spellCombatSummaryForAccess(getSpellCard('Guiding Bolt','dnd-2024'),mixedProfile,originAccess),'Spell attack +5','Origin spell must use CHA rather than the profile INT class ability');

console.log('Source-aware spellcasting access audit passed.');
