export const ACTIVE_CHARACTER_KEY = "living-table-active-character-v1";

const card = value => Object.freeze(value);

export const characterCards = Object.freeze([
  card({
    id:"wendy-birthday-hero",
    version:"1.0.0",
    system:"dnd-2014",
    compatibleSystems:["dnd-2014","dnd-2024"],
    adventureId:"wishing-cake",
    name:"Wendy’s Birthday Hero",
    classLine:"Level 3 Adventurer",
    front:{
      title:"Wendy’s Birthday Hero",
      subtitle:"The Wishing Cake Pregen",
      portrait:"👑",
      artAlt:"A determined birthday adventurer wearing a paper crown and holding a silver rapier."
    },
    back:{
      summary:"A quick, charismatic hero built to lead the rescue of Wendy’s stolen birthday wish.",
      playNotes:["Use Dexterity for finesse attacks.","Birthday Spark can rescue one failed check.","Wendy decides what happens to the recovered wish."],
      qrPath:"?character=wendy-birthday-hero"
    },
    base:{
      maxHp:28,
      baseAc:13,
      speed:30,
      proficiency:2,
      attack:5,
      damage:3,
      abilities:{strength:10,dexterity:16,constitution:14,intelligence:10,wisdom:12,charisma:15},
      saves:{strength:1,dexterity:5,constitution:3,intelligence:1,wisdom:2,charisma:4}
    },
    features:[
      "Birthday Spark: spend one candle token after a failed check to add 1d4.",
      "Keeper of the Wish: Wendy decides how the recovered wish is shared."
    ],
    startingEquipment:{
      head:"keeper-crown",neck:null,shoulders:"cloak-protection",armor:"leather-armor",hands:null,
      mainHand:"rapier",offHand:"shield",ring1:null,ring2:null,feet:"boots-elvenkind",wondrous:"birthday-spark"
    },
    ownedItemIds:["keeper-crown","cloak-protection","leather-armor","rapier","rapier-plus-1","shield","boots-elvenkind","birthday-spark","potion-healing"]
  })
]);

export const defaultCharacterCard = characterCards[0];

export function getCharacterCard(id) {
  return characterCards.find(entry => entry.id === id) ?? defaultCharacterCard;
}

export function resolveRequestedCharacter(search = location.search, storage = localStorage) {
  const requested = new URLSearchParams(search).get("character") || storage.getItem(ACTIVE_CHARACTER_KEY);
  return getCharacterCard(requested);
}

export function activateCharacterCard(id, storage = localStorage) {
  const selected = getCharacterCard(id);
  storage.setItem(ACTIVE_CHARACTER_KEY, selected.id);
  window.dispatchEvent(new CustomEvent("living-table:character-loaded", { detail:{ character:selected } }));
  return selected;
}
