import { additionalPregens as strictPregens } from './pregen-roster-srd.js';
const roster=structuredClone(strictPregens);
const byId=Object.fromEntries(roster.map(c=>[c.id,c]));

// Rogue — complete 2014/2024 non-spellcasting and edition-specific proficiencies.
{
 const c=byId['merrin-thief'];
 c.profiles['dnd-2014'].spellDetails={cantrips:[],known:[],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
 c.profiles['dnd-2024'].spellDetails={cantrips:[],known:[],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
 c.profiles['dnd-2024'].weaponProficiencies=['Simple weapons','Martial weapons with the Finesse or Light property'];
 c.profiles['dnd-2024'].tools=['Thieves’ Tools'];
 const fastHands=c.profiles['dnd-2024'].features.find(feature=>feature.name==='Fast Hands');
 if(fastHands) fastHands.summary='As a Bonus Action, make the listed Sleight of Hand checks, take the Utilize action, or take the Magic action to use a magic item that requires that action.';
}

// Wizard: three Wizard cantrips; 10-spell level-3 spellbook in 2014, expanded by Evoker/Sage/Elf sources in 2024.
{
 const c=byId['elara-evoker'];
 c.profiles['dnd-2014'].spellDetails={
  cantrips:['Fire Bolt','Ray of Frost','Mage Hand'],known:[],
  prepared:['Mage Armor','Magic Missile','Shield','Misty Step','Scorching Ray','Web'],alwaysPrepared:[],
  spellbook:['Detect Magic','Feather Fall','Mage Armor','Magic Missile','Shield','Thunderwave','Misty Step','Scorching Ray','Web','Sleep'],
  origin:[],lineage:['Prestidigitation — High Elf cantrip']
 };
 c.profiles['dnd-2024'].weaponProficiencies=['Simple weapons'];
 c.profiles['dnd-2024'].spellDetails={
  cantrips:['Fire Bolt','Ray of Frost','Mage Hand'],known:[],
  prepared:['Mage Armor','Magic Missile','Shield','Misty Step','Scorching Ray','Web'],alwaysPrepared:[],
  spellbook:['Detect Magic','Feather Fall','Mage Armor','Magic Missile','Sleep','Thunderwave','Misty Step','Web','Scorching Ray','Shatter','Burning Hands','Gust of Wind'],
  origin:['Light — Magic Initiate (Wizard)','Mending — Magic Initiate (Wizard)','Shield — Magic Initiate free 1/Long Rest'],
  lineage:['Prestidigitation — High Elf lineage','Detect Magic — High Elf lineage at level 3']
 };
}

// Life Cleric: legal arrays, Dwarven Toughness, six prepared spells, and Life Domain spells.
{
 const c=byId['brunna-life-cleric']; const p14=c.profiles['dnd-2014']; const p24=c.profiles['dnd-2024'];
 p14.abilities={strength:14,dexterity:10,constitution:14,intelligence:8,wisdom:16,charisma:10};
 p24.abilities={strength:13,dexterity:10,constitution:14,intelligence:8,wisdom:16,charisma:12};
 c.base.abilities={...p14.abilities};
 c.base.saves={strength:2,dexterity:0,constitution:2,intelligence:-1,wisdom:5,charisma:2};
 p14.features.push({name:'Bonus Proficiency',source:'Life Domain 1',summary:'Gain proficiency with Heavy armor.'});
 p14.spellDetails={
  cantrips:['Guidance','Sacred Flame','Thaumaturgy'],known:[],
  prepared:['Healing Word','Guiding Bolt','Sanctuary','Shield of Faith','Detect Magic','Aid'],
  alwaysPrepared:['Bless — Life Domain','Cure Wounds — Life Domain','Lesser Restoration — Life Domain','Spiritual Weapon — Life Domain'],
  spellbook:[],origin:[],lineage:[]
 };
 p24.spellDetails={
  cantrips:['Guidance','Sacred Flame','Thaumaturgy'],known:[],
  prepared:['Healing Word','Guiding Bolt','Sanctuary','Shield of Faith','Detect Magic','Aid'],
  alwaysPrepared:['Aid — Life Domain','Bless — Life Domain','Cure Wounds — Life Domain','Lesser Restoration — Life Domain'],
  spellbook:[],origin:['Light — Magic Initiate (Cleric)','Resistance — Magic Initiate (Cleric)','Command — Magic Initiate free 1/Long Rest'],lineage:[]
 };
}

// Ranger: 2014 knows three spells. 2024 has four prepared Ranger spells plus Hunter's Mark always prepared.
{
 const c=byId['fern-hunter']; const p24=c.profiles['dnd-2024'];
 c.profiles['dnd-2014'].spellDetails={cantrips:[],known:['Hunter’s Mark','Cure Wounds','Goodberry'],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
 if(!p24.skillProficiencies.includes('insight')) p24.skillProficiencies.push('insight');
 p24.spellDetails={cantrips:[],known:[],prepared:['Cure Wounds','Goodberry','Ensnaring Strike','Fog Cloud'],alwaysPrepared:['Hunter’s Mark — Favored Enemy'],spellbook:[],origin:[],lineage:['Druidcraft — Wood Elf lineage','Longstrider — Wood Elf lineage at level 3']};
}

// Lore Bard: use a simple dagger in both editions. The 2014 list remains SRD 5.1-only; Dissonant Whispers is available in SRD 5.2.1 and is kept only on the 2024 profile.
{
 const c=byId['lute-lore-bard'];
 c.startingEquipment.mainHand='dagger';
 c.ownedItemIds=['leather-armor','dagger','birthday-spark'];
 const dagger={id:'dagger',name:'Dagger',kind:'melee',attackAbility:'dexterity',proficient:true,damageDice:'1d4',damageType:'piercing',range:'5 ft. / 20/60 ft.',properties:['finesse','light','thrown']};
 c.profiles['dnd-2014'].attacks=[{...dagger,mastery:null}];
 c.profiles['dnd-2024'].attacks=[{...dagger,mastery:null}];
 c.profiles['dnd-2014'].spellDetails={cantrips:['Vicious Mockery','Mage Hand'],known:['Healing Word','Charm Person','Faerie Fire','Thunderwave','Suggestion','Shatter'],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
 c.profiles['dnd-2024'].spellDetails={cantrips:['Vicious Mockery','Mage Hand'],known:[],prepared:['Healing Word','Dissonant Whispers','Faerie Fire','Thunderwave','Suggestion','Shatter'],alwaysPrepared:[],spellbook:[],origin:['Guidance — Magic Initiate (Cleric)','Light — Magic Initiate (Cleric)','Sanctuary — Magic Initiate free 1/Long Rest'],lineage:[]};
}

for(const c of roster){
 for(const profile of Object.values(c.profiles)){
  const d=profile.spellDetails||{cantrips:[],known:[],prepared:[],alwaysPrepared:[],spellbook:[],origin:[],lineage:[]};
  profile.spells=[...d.cantrips,...d.known,...d.prepared,...d.alwaysPrepared,...d.origin,...d.lineage].map(v=>String(v).split(' — ')[0]);
 }
}
export const additionalPregens=Object.freeze(roster.map(Object.freeze));
