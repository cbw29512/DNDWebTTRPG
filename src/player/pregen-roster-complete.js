import { additionalPregens as strictPregens } from './pregen-roster-srd.js';
const roster=structuredClone(strictPregens);
const byId=Object.fromEntries(roster.map(c=>[c.id,c]));

// Rogue has no spellcasting.
byId['merrin-thief'].profiles['dnd-2014'].spellDetails={cantrips:[],known:[],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
byId['merrin-thief'].profiles['dnd-2024'].spellDetails={cantrips:[],known:[],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};

// Wizard: three Wizard cantrips; 10-spell level-3 spellbook in 2014, expanded by Evoker/Sage/Elf sources in 2024.
{
 const c=byId['elara-evoker'];
 c.profiles['dnd-2014'].spellDetails={
  cantrips:['Fire Bolt','Ray of Frost','Mage Hand'],
  known:[],
  prepared:['Mage Armor','Magic Missile','Shield','Misty Step','Scorching Ray','Web'],
  alwaysPrepared:[],
  spellbook:['Detect Magic','Feather Fall','Mage Armor','Magic Missile','Shield','Thunderwave','Misty Step','Scorching Ray','Web','Sleep'],
  origin:[],lineage:['Prestidigitation — High Elf cantrip']
 };
 c.profiles['dnd-2024'].weaponProficiencies=['Simple weapons'];
 c.profiles['dnd-2024'].spellDetails={
  cantrips:['Fire Bolt','Ray of Frost','Mage Hand'],
  known:[],
  prepared:['Mage Armor','Magic Missile','Shield','Misty Step','Scorching Ray','Web'],
  alwaysPrepared:[],
  spellbook:['Detect Magic','Feather Fall','Mage Armor','Magic Missile','Sleep','Thunderwave','Misty Step','Web','Scorching Ray','Shatter','Burning Hands','Gust of Wind'],
  origin:['Guidance — Magic Initiate (Wizard)','Light — Magic Initiate (Wizard)','Shield — Magic Initiate free 1/Long Rest'],
  lineage:['Prestidigitation — High Elf lineage','Detect Magic — High Elf lineage at level 3']
 };
}

// Life Cleric: class cantrips, six prepared level-1+ spells, and four Life Domain spells at level 3.
{
 const c=byId['brunna-life-cleric'];
 c.profiles['dnd-2014'].spellDetails={
  cantrips:['Guidance','Sacred Flame','Thaumaturgy'],known:[],
  prepared:['Healing Word','Guiding Bolt','Sanctuary','Shield of Faith','Detect Magic','Aid'],
  alwaysPrepared:['Bless — Life Domain','Cure Wounds — Life Domain','Lesser Restoration — Life Domain','Spiritual Weapon — Life Domain'],
  spellbook:[],origin:[],lineage:[]
 };
 c.profiles['dnd-2024'].spellDetails={
  cantrips:['Guidance','Sacred Flame','Thaumaturgy'],known:[],
  prepared:['Healing Word','Guiding Bolt','Sanctuary','Shield of Faith','Detect Magic','Aid'],
  alwaysPrepared:['Aid — Life Domain','Bless — Life Domain','Cure Wounds — Life Domain','Lesser Restoration — Life Domain'],
  spellbook:[],
  origin:['Light — Magic Initiate (Cleric)','Resistance — Magic Initiate (Cleric)','Command — Magic Initiate free 1/Long Rest'],lineage:[]
 };
}

// Ranger: 2014 knows three spells. 2024 prepares four Ranger spells and always has Hunter's Mark prepared.
{
 const c=byId['fern-hunter'];
 c.profiles['dnd-2014'].spellDetails={cantrips:[],known:['Hunter’s Mark','Cure Wounds','Goodberry'],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
 c.profiles['dnd-2024'].spellDetails={cantrips:[],known:[],prepared:['Cure Wounds','Goodberry','Ensnaring Strike','Fog Cloud'],alwaysPrepared:['Hunter’s Mark — Favored Enemy'],spellbook:[],origin:[],lineage:['Druidcraft — Wood Elf lineage','Longstrider — Wood Elf lineage at level 3']};
}

// Lore Bard: use a dagger as common legal starting weapon in both editions. 2024 Acolyte adds Cleric Magic Initiate spells.
{
 const c=byId['lute-lore-bard'];
 c.startingEquipment.mainHand='dagger';
 c.ownedItemIds=['leather-armor','dagger','birthday-spark'];
 const dagger={id:'dagger',name:'Dagger',kind:'melee',attackAbility:'dexterity',proficient:true,damageDice:'1d4',damageType:'piercing',range:'5 ft. / 20/60 ft.',properties:['finesse','light','thrown']};
 c.profiles['dnd-2014'].attacks=[{...dagger,mastery:null}];
 c.profiles['dnd-2024'].attacks=[{...dagger,mastery:null}];
 c.profiles['dnd-2014'].spellDetails={cantrips:['Vicious Mockery','Mage Hand'],known:['Healing Word','Dissonant Whispers','Faerie Fire','Thunderwave','Suggestion','Shatter'],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
 c.profiles['dnd-2024'].spellDetails={cantrips:['Vicious Mockery','Mage Hand'],known:[],prepared:['Healing Word','Dissonant Whispers','Faerie Fire','Thunderwave','Suggestion','Shatter'],alwaysPrepared:[],spellbook:[],origin:['Guidance — Magic Initiate (Cleric)','Light — Magic Initiate (Cleric)','Sanctuary — Magic Initiate free 1/Long Rest'],lineage:[]};
}

for(const c of roster){
 for(const profile of Object.values(c.profiles)){
  const d=profile.spellDetails||{cantrips:[],known:[],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
  profile.spells=[...d.cantrips,...d.known,...d.prepared,...d.alwaysPrepared,...d.origin,...d.lineage].map(v=>String(v).split(' — ')[0]);
 }
}
export const additionalPregens=Object.freeze(roster.map(Object.freeze));
