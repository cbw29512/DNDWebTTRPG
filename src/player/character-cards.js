import { additionalPregens } from "./pregen-roster.js";

export const ACTIVE_CHARACTER_KEY = "living-table-active-character-v1";
export const ACTIVE_CHARACTER_EDITION_KEY = "living-table-character-edition-v1";

const freeze = value => Object.freeze(value);
const deepFreeze = value => {
  if (!value || typeof value !== "object" || Object.isFrozen(value)) return value;
  Object.values(value).forEach(deepFreeze);
  return Object.freeze(value);
};

const commonAbilities = freeze({ strength:10, dexterity:16, constitution:14, intelligence:10, wisdom:12, charisma:14 });
const commonAttacks = freeze([
  freeze({ id:"rapier", name:"Rapier", kind:"melee", attackAbility:"dexterity", proficient:true, damageDice:"1d8", damageType:"piercing", range:"5 ft.", properties:["finesse"] }),
  freeze({ id:"longbow", name:"Longbow", kind:"ranged", attackAbility:"dexterity", proficient:true, fightingStyleAttackBonus:2, damageDice:"1d8", damageType:"piercing", range:"150/600 ft.", properties:["ammunition","heavy","two-handed"] })
]);

const fighter2014 = deepFreeze({
  rulesId:"dnd-2014", source:"SRD 5.1 / 2014 fifth-edition rules", level:3, className:"Fighter", subclass:"Champion", species:"Human", background:"Soldier", size:"Medium", speed:30,
  abilities:{ ...commonAbilities }, hitDie:"d10", maxHp:28, hitDice:{ total:3, remaining:3, die:"d10" }, saveProficiencies:["strength","constitution"], skillProficiencies:["acrobatics","athletics","intimidation","perception"], expertise:[],
  armorTraining:["Light armor","Medium armor","Heavy armor","Shields"], weaponProficiencies:["Simple weapons","Martial weapons"], tools:["One gaming set","Land vehicles"], languages:["Common","Elvish"], senses:[], fightingStyle:{ name:"Archery", summary:"+2 bonus to attack rolls made with ranged weapons." }, criticalRange:[19,20], initiative:{ modifier:3, advantage:false }, attacks:commonAttacks.map(entry => ({ ...entry, mastery:null })),
  resources:[{ id:"second-wind", name:"Second Wind", max:1, recharge:"Short or Long Rest", action:"Bonus Action", effect:"Regain 1d10 + 3 HP." },{ id:"action-surge", name:"Action Surge", max:1, recharge:"Short or Long Rest", action:"Special", effect:"Take one additional action on your turn." }],
  features:[{ name:"Fighting Style — Archery", source:"Fighter 1", summary:"Add +2 to ranged weapon attack rolls." },{ name:"Second Wind", source:"Fighter 1", summary:"Bonus Action; regain 1d10 + Fighter level HP; 1 use per Short or Long Rest." },{ name:"Action Surge", source:"Fighter 2", summary:"Take one additional action on your turn; 1 use per Short or Long Rest." },{ name:"Improved Critical", source:"Champion 3", summary:"Weapon attacks score a critical hit on a natural 19 or 20." }],
  originNotes:["2014 Human ability increases are already included in the listed final ability scores.","Soldier supplies Athletics and Intimidation; Fighter supplies Acrobatics and Perception."], equipmentNotes:["2014 Fighter starting equipment supports leather armor + longbow, a martial weapon + shield, and an explorer/dungeoneer pack."], spellcastingAbility:null, spellSlots:{}, spells:[]
});

const fighter2024 = deepFreeze({
  rulesId:"dnd-2024", source:"SRD 5.2.1 / 2024 fifth-edition rules", level:3, className:"Fighter", subclass:"Champion", species:"Human", background:"Soldier", size:"Medium", speed:30,
  abilities:{ ...commonAbilities }, hitDie:"d10", maxHp:28, hitDice:{ total:3, remaining:3, die:"d10" }, saveProficiencies:["strength","constitution"], skillProficiencies:["acrobatics","athletics","insight","intimidation","investigation","perception","persuasion","stealth"], expertise:[],
  armorTraining:["Light armor","Medium armor","Heavy armor","Shields"], weaponProficiencies:["Simple weapons","Martial weapons"], tools:["One gaming set"], languages:["Common","Elvish","Halfling"], senses:[], fightingStyle:{ name:"Archery", summary:"+2 bonus to attack rolls made with ranged weapons." }, criticalRange:[19,20], initiative:{ modifier:3, advantage:true }, attacks:commonAttacks.map(entry => ({ ...entry, mastery:entry.id === "rapier" ? "Vex" : "Slow" })), weaponMasteries:["Rapier — Vex","Longbow — Slow","Dagger — Nick"], originFeats:["Savage Attacker","Skilled"],
  resources:[{ id:"second-wind", name:"Second Wind", max:2, recharge:"1 use on Short Rest; all on Long Rest", action:"Bonus Action", effect:"Regain 1d10 + 3 HP." },{ id:"action-surge", name:"Action Surge", max:1, recharge:"Short or Long Rest", action:"Special", effect:"Take one additional action except the Magic action." }],
  features:[{ name:"Fighting Style — Archery", source:"Fighter 1", summary:"Add +2 to ranged weapon attack rolls." },{ name:"Second Wind", source:"Fighter 1", summary:"Bonus Action; regain 1d10 + Fighter level HP; 2 uses at Fighter 3." },{ name:"Weapon Mastery", source:"Fighter 1", summary:"Use the mastery properties of three chosen weapons; Rapier Vex and Longbow Slow are prepared here." },{ name:"Action Surge", source:"Fighter 2", summary:"Take one additional action except the Magic action; 1 use per Short or Long Rest." },{ name:"Tactical Mind", source:"Fighter 2", summary:"After failing an ability check, expend Second Wind to add 1d10; if the check still fails, the use is not expended." },{ name:"Improved Critical", source:"Champion 3", summary:"Weapon and Unarmed Strike attack rolls score a critical hit on a natural 19 or 20." },{ name:"Remarkable Athlete", source:"Champion 3", summary:"Advantage on Initiative and Strength (Athletics) checks; after a critical hit, move up to half Speed without provoking Opportunity Attacks." },{ name:"Resourceful", source:"Human", summary:"Gain Heroic Inspiration whenever you finish a Long Rest." },{ name:"Skillful", source:"Human", summary:"Gain proficiency in one skill; Persuasion is selected." },{ name:"Versatile", source:"Human", summary:"Gain one Origin feat; Skilled is selected." },{ name:"Savage Attacker", source:"Soldier", summary:"Once per turn when you hit with a weapon, roll the weapon damage dice twice and use either roll." },{ name:"Skilled", source:"Human Versatile", summary:"Gain proficiency in three skills or tools; Insight, Investigation, and Stealth are selected." }],
  originNotes:["Soldier permits Strength, Dexterity, and Constitution increases; the final scores use +2 Dexterity and +1 Constitution.","Human Skillful grants Persuasion proficiency; Human Versatile grants Skilled."], equipmentNotes:["2024 Fighter/Soldier coin options can legally purchase the listed armor, shield, rapier, longbow, ammunition, and adventuring gear."], spellcastingAbility:null, spellSlots:{}, spells:[]
});

const wendy = deepFreeze({
  id:"wendy-birthday-hero", version:"2.0.0", compatibleSystems:["dnd-2014","dnd-2024"], adventureId:"wishing-cake", name:"Wendy’s Birthday Hero", classLine:"Human Fighter 3 · Champion",
  front:{ title:"Wendy’s Birthday Hero", subtitle:"The Wishing Cake Pregen", portrait:"🛡️", artAlt:"A determined human champion wearing a birthday ribbon, carrying a rapier and shield, with a longbow across her back." },
  back:{ summary:"A fast, durable level-3 Champion Fighter designed as a complete rules-legal pregen for either supported fifth-edition rules profile.", playNotes:["Rapier uses Dexterity and deals 1d8 + 3 piercing.","Longbow uses Dexterity and Archery for +7 to hit, dealing 1d8 + 3 piercing.","The 2014 and 2024 profiles intentionally differ where the rules differ."], importCodes:{ "dnd-2014":"WC-WENDY-F3-14", "dnd-2024":"WC-WENDY-F3-24" }, qrPaths:{ "dnd-2014":"player.html?character=wendy-birthday-hero&edition=2014", "dnd-2024":"player.html?character=wendy-birthday-hero&edition=2024" } },
  profiles:{ "dnd-2014":fighter2014, "dnd-2024":fighter2024 },
  base:{ maxHp:28, baseAc:13, speed:30, proficiency:2, attack:5, damage:3, abilities:{ ...commonAbilities }, saves:{ strength:2, dexterity:3, constitution:4, intelligence:0, wisdom:1, charisma:2 } },
  features:["Champion Fighter 3 — see the full edition-specific character sheet below the equipment doll.","Birthday Spark is an adventure item and is labeled separately from SRD character rules."],
  startingEquipment:{ head:null,neck:null,shoulders:null,armor:"leather-armor",hands:null,mainHand:"rapier",offHand:"shield",ring1:null,ring2:null,feet:null,wondrous:"birthday-spark" },
  ownedItemIds:["leather-armor","rapier","longbow","shield","birthday-spark"]
});

export const characterCards = Object.freeze([wendy, ...additionalPregens]);
export const defaultCharacterCard = characterCards[0];

export function normalizeEdition(value) { return String(value || "").toLowerCase().includes("2024") ? "dnd-2024" : "dnd-2014"; }
export function getCharacterProfile(character = defaultCharacterCard, edition = "dnd-2014") { const key=normalizeEdition(edition); return character.profiles?.[key] || character.profiles?.["dnd-2014"] || null; }
export function getCharacterCard(id) { return characterCards.find(entry => entry.id === id) ?? defaultCharacterCard; }
export function findCharacterByImportCode(code) { const normalized=String(code || "").trim().toUpperCase(); for(const character of characterCards){ for(const [edition,importCode] of Object.entries(character.back?.importCodes || {})){ if(String(importCode).toUpperCase()===normalized) return {character,edition}; } } return null; }
export function resolveRequestedCharacter(search = location.search, storage = localStorage) { const requested=new URLSearchParams(search).get("character") || storage.getItem(ACTIVE_CHARACTER_KEY); return getCharacterCard(requested); }
export function resolveRequestedEdition(search = location.search, storage = localStorage) { const requested=new URLSearchParams(search).get("edition") || storage.getItem(ACTIVE_CHARACTER_EDITION_KEY) || "2014"; return normalizeEdition(requested); }
export function activateCharacterCard(id, storage = localStorage, edition = null) { const selected=getCharacterCard(id); storage.setItem(ACTIVE_CHARACTER_KEY,selected.id); if(edition) storage.setItem(ACTIVE_CHARACTER_EDITION_KEY,normalizeEdition(edition)); window.dispatchEvent(new CustomEvent("living-table:character-loaded",{detail:{character:selected,edition:edition?normalizeEdition(edition):null}})); return selected; }
