import { additionalPregens as draftPregens } from './pregen-roster.js';

const clone = value => structuredClone(value);
const feature = (name,source,summary) => ({name,source,summary});
const byId = Object.fromEntries(draftPregens.map(entry=>[entry.id,clone(entry)]));

// Merrin — 2014 Lightfoot Halfling and 2024 Halfling/Criminal/Thief.
{
 const c=byId['merrin-thief']; const p14=c.profiles['dnd-2014']; const p24=c.profiles['dnd-2024'];
 p14.features.push(
  feature('Brave','Lightfoot Halfling','Advantage on saving throws against being frightened.'),
  feature('Halfling Nimbleness','Lightfoot Halfling','Move through the space of a creature larger than you.'),
  feature('Naturally Stealthy','Lightfoot Halfling','You can attempt to hide when obscured only by a creature at least one size larger than you.')
 );
 p24.languages=['Common','Halfling','Thieves’ Cant','Elvish'];
 p24.features.push(
  feature('Steady Aim','Rogue 3','Bonus Action: if you have not moved this turn, gain Advantage on your next attack roll this turn; your Speed becomes 0 for the rest of the turn.'),
  feature('Brave','Halfling','Advantage on saves to avoid or end the Frightened condition.'),
  feature('Halfling Nimbleness','Halfling','Move through the space of a creature larger than you, but do not stop there.'),
  feature('Luck','Halfling','When you roll a 1 on the d20 of a D20 Test, reroll it and use the new roll.'),
  feature('Naturally Stealthy','Halfling','You can Hide when obscured only by a creature at least one size larger than you.')
 );
}

// Elara — make the Elf lineage and full level-3 Evoker profile explicit.
{
 const c=byId['elara-evoker']; const p14=c.profiles['dnd-2014']; const p24=c.profiles['dnd-2024'];
 p14.features.push(
  feature('Darkvision','High Elf','Darkvision 60 feet.'),feature('Keen Senses','High Elf','Proficiency in Perception.'),feature('Fey Ancestry','High Elf','Advantage on saves against being charmed, and magic cannot put you to sleep.'),feature('Trance','High Elf','Four hours of trance provides the rest benefit normally gained from eight hours of sleep.'),feature('High Elf Cantrip','High Elf','Know one Wizard cantrip using Intelligence.'),feature('Elf Weapon Training','High Elf','Proficiency with longsword, shortsword, shortbow, and longbow.')
 );
 p24.skillProficiencies=['arcana','history','investigation','religion','perception'];
 p24.features.push(
  feature('Darkvision','Elf','Darkvision 60 feet.'),feature('Fey Ancestry','Elf','Advantage on saves to avoid or end Charmed.'),feature('Keen Senses','Elf','Perception proficiency selected.'),feature('Trance','Elf','Complete a Long Rest in 4 hours of conscious trance.'),feature('High Elf Lineage','Elf','Prestidigitation cantrip; at level 3, Detect Magic is available from the lineage.')
 );
}

// Brunna — Dwarven Toughness applies in both editions; complete the skill/species facts.
{
 const c=byId['brunna-life-cleric']; const p14=c.profiles['dnd-2014']; const p24=c.profiles['dnd-2024'];
 p14.skillProficiencies=['insight','medicine','persuasion','religion'];
 p14.features.push(
  feature('Darkvision','Hill Dwarf','Darkvision 60 feet.'),feature('Dwarven Resilience','Hill Dwarf','Advantage on saving throws against poison and resistance to poison damage.'),feature('Dwarven Combat Training','Hill Dwarf','Proficiency with battleaxe, handaxe, light hammer, and warhammer.'),feature('Stonecunning','Hill Dwarf','Double proficiency on qualifying History checks about stonework.'),feature('Dwarven Toughness','Hill Dwarf','Hit point maximum increases by 1 per level; included in the 27 HP total.')
 );
 p24.maxHp=27;
 p24.skillProficiencies=['insight','medicine','persuasion','religion'];
 p24.senses=['Darkvision 120 ft.'];
 p24.features.push(
  feature('Dwarven Resilience','Dwarf','Resistance to Poison damage and Advantage on saves to avoid or end Poisoned.'),feature('Dwarven Toughness','Dwarf','Hit point maximum increases by 1 per level; included in the 27 HP total.'),feature('Stonecunning','Dwarf','Bonus Action: gain Tremorsense 60 feet for 10 minutes while on or touching stone; uses equal Proficiency Bonus per Long Rest.')
 );
}

// Fern — 2024 Basic/SRD uses Soldier, not Guide. Wood Elf lineage keeps Speed 35.
{
 const c=byId['fern-hunter']; const p14=c.profiles['dnd-2014']; const p24=c.profiles['dnd-2024'];
 p14.features.push(
  feature('Darkvision','Wood Elf','Darkvision 60 feet.'),feature('Keen Senses','Wood Elf','Proficiency in Perception.'),feature('Fey Ancestry','Wood Elf','Advantage on saves against being charmed, and magic cannot put you to sleep.'),feature('Trance','Wood Elf','Four hours of trance provides the rest benefit normally gained from eight hours of sleep.'),feature('Fleet of Foot','Wood Elf','Walking Speed is 35 feet.'),feature('Mask of the Wild','Wood Elf','Can attempt to hide while lightly obscured by natural phenomena.')
 );
 p24.background='Soldier'; p24.originFeats=['Savage Attacker']; p24.speed=35;
 p24.skillProficiencies=['athletics','intimidation','perception','stealth','survival']; p24.expertise=['survival'];
 p24.languages=['Common','Elvish','Goblin','Sylvan'];
 p24.spells=['Hunter’s Mark','Cure Wounds','Goodberry','Ensnaring Strike','Fog Cloud'];
 p24.originNotes=['2024 Soldier grants Savage Attacker and Athletics/Intimidation; final ability scores use the Soldier ability-score options.','Hunter’s Mark is always prepared and does not count against the four prepared Ranger spells at level 3.'];
 p24.features.push(
  feature('Darkvision','Wood Elf','Darkvision 60 feet.'),feature('Fey Ancestry','Wood Elf','Advantage on saves to avoid or end Charmed.'),feature('Keen Senses','Wood Elf','Perception proficiency selected.'),feature('Trance','Wood Elf','Complete a Long Rest in 4 hours of conscious trance.'),feature('Wood Elf Lineage','Elf','Speed becomes 35 feet and you know Druidcraft; at level 3, Longstrider is available from the lineage.'),feature('Savage Attacker','Soldier','Once per turn when you hit with a weapon, roll the weapon damage dice twice and use either roll.')
 );
}

// Lute — 2024 Basic/SRD uses Acolyte, not Entertainer. Preserve Charisma-focused ability legality.
{
 const c=byId['lute-lore-bard']; const p14=c.profiles['dnd-2014']; const p24=c.profiles['dnd-2024'];
 p14.skillProficiencies=['acrobatics','deception','history','insight','investigation','perception','performance','persuasion','sleightOfHand','stealth'];
 p14.features.push(feature('Darkvision','Half-Elf','Darkvision 60 feet.'),feature('Fey Ancestry','Half-Elf','Advantage on saves against being charmed, and magic cannot put you to sleep.'),feature('Skill Versatility','Half-Elf','Gain proficiency in two skills of your choice; included in the listed skills.'));
 p24.background='Acolyte'; p24.originFeats=['Magic Initiate (Cleric)','Skilled'];
 p24.skillProficiencies=['insight','religion','performance','persuasion','deception','history','perception','acrobatics','investigation','sleightOfHand','stealth','medicine'];
 p24.originNotes=['2024 Acolyte grants Magic Initiate (Cleric), Insight, and Religion; its ability-score choices permit the listed Charisma score.','Human Skillful grants one listed skill; Human Versatile grants Skilled, which supplies three more listed proficiencies.'];
 p24.features=p24.features.filter(entry=>entry.name!=='Musician');
 p24.features.push(
  feature('Magic Initiate (Cleric)','Acolyte','Learn two Cleric cantrips and one level-1 Cleric spell; the level-1 spell can be cast once per Long Rest without a spell slot.'),feature('Resourceful','Human','Gain Heroic Inspiration whenever you finish a Long Rest.'),feature('Skillful','Human','Gain proficiency in one skill of your choice; included in the skill list.'),feature('Versatile — Skilled','Human','Gain the Skilled Origin feat; three additional proficiencies are included in the skill list.')
 );
 // Six level 1+ Bard spells are prepared at Bard 3; cantrips are represented in the same display list for now.
 p24.spells=['Vicious Mockery','Mage Hand','Healing Word','Dissonant Whispers','Faerie Fire','Thunderwave','Suggestion','Shatter'];
}

export const additionalPregens = Object.freeze(Object.values(byId).map(entry=>Object.freeze(entry)));
