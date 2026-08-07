import { spellAttackBonus, spellSaveDc } from '../dnd/rules-engine.js';

const freeze=value=>Object.freeze(value);
const record=value=>freeze({components:'V,S',duration:'Instant',concentration:false,ritual:false,attack:null,save:null,damage:null,healing:null,upcast:null,...value});
const key=value=>String(value||'').trim().replaceAll('’',"'").toLowerCase();

const catalog2014=[
 record({name:'Fire Bolt',level:0,school:'Evocation',cast:'1 Action',range:'120 ft.',effect:'One creature or object; ranged spell attack.',mechanics:'Hit: 1d10 fire. Unattended flammable objects can ignite.',damage:'1d10 fire',attack:'spell',source:'PHB 2014 p.242'}),
 record({name:'Ray of Frost',level:0,school:'Evocation',cast:'1 Action',range:'60 ft.',effect:'One creature; ranged spell attack.',mechanics:'Hit: 1d8 cold; target Speed -10 ft. until your next turn.',damage:'1d8 cold',attack:'spell',source:'PHB 2014 p.271'}),
 record({name:'Mage Hand',level:0,school:'Conjuration',cast:'1 Action',range:'30 ft.',duration:'1 minute',effect:'Create a spectral hand for simple object manipulation.',mechanics:'Cannot attack, activate magic items, or carry more than 10 lb.',source:'PHB 2014 p.256'}),
 record({name:'Prestidigitation',level:0,school:'Transmutation',cast:'1 Action',range:'10 ft.',duration:'Up to 1 hour',effect:'Create one minor magical sensory or utility effect.',mechanics:'Up to three non-instantaneous effects can remain active.',source:'PHB 2014 p.267'}),
 record({name:'Guidance',level:0,school:'Divination',cast:'1 Action',range:'Touch',duration:'Concentration, up to 1 minute',concentration:true,effect:'Touch one willing creature.',mechanics:'Target adds 1d4 to one ability check, then the spell ends.',source:'PHB 2014 p.248'}),
 record({name:'Sacred Flame',level:0,school:'Evocation',cast:'1 Action',range:'60 ft.',save:'DEX',effect:'Radiance descends on one creature you can see.',mechanics:'Failed save: 1d8 radiant; cover gives no save bonus.',damage:'1d8 radiant',source:'PHB 2014 p.272'}),
 record({name:'Thaumaturgy',level:0,school:'Transmutation',cast:'1 Action',range:'30 ft.',duration:'Up to 1 minute',components:'V',effect:'Create one minor divine sensory or environmental effect.',mechanics:'See source for the short menu of permitted effects.',source:'PHB 2014 p.282'}),
 record({name:'Vicious Mockery',level:0,school:'Enchantment',cast:'1 Action',range:'60 ft.',components:'V',save:'WIS',effect:'One creature that can hear you.',mechanics:'Failed save: 1d4 psychic and Disadvantage on its next attack roll.',damage:'1d4 psychic',source:'PHB 2014 p.285'}),
 record({name:'Mage Armor',level:1,school:'Abjuration',cast:'1 Action',range:'Touch',duration:'8 hours',components:'V,S,M',effect:'Touch a willing creature not wearing armor.',mechanics:'Base AC becomes 13 + DEX modifier until spell ends or armor is donned.',source:'PHB 2014 p.256'}),
 record({name:'Magic Missile',level:1,school:'Evocation',cast:'1 Action',range:'120 ft.',effect:'Create 3 darts; each automatically hits a creature you can see.',mechanics:'Each dart deals 1d4+1 force; assign darts among targets.',damage:'1d4+1 force per dart',upcast:'+1 dart per slot above 1st.',source:'PHB 2014 p.257'}),
 record({name:'Shield',level:1,school:'Abjuration',cast:'1 Reaction',range:'Self',duration:'1 round',effect:'Trigger: you are hit by an attack or targeted by Magic Missile.',mechanics:'+5 AC through start of your next turn; Magic Missile deals no damage.',source:'PHB 2014 p.275'}),
 record({name:'Detect Magic',level:1,school:'Divination',cast:'1 Action / Ritual',range:'Self (30 ft.)',duration:'Concentration, up to 10 minutes',concentration:true,ritual:true,effect:'Sense magic within 30 ft.',mechanics:'Use an action to see visible auras and learn schools; barriers can block.',source:'PHB 2014 p.231'}),
 record({name:'Healing Word',level:1,school:'Evocation',cast:'1 Bonus Action',range:'60 ft.',components:'V',effect:'One creature you can see regains hit points.',mechanics:'Heal 1d4 + spellcasting ability modifier.',healing:'1d4 + mod',upcast:'+1d4 per slot above 1st.',source:'PHB 2014 p.250'}),
 record({name:'Guiding Bolt',level:1,school:'Evocation',cast:'1 Action',range:'120 ft.',attack:'spell',effect:'One creature; ranged spell attack.',mechanics:'Hit: 4d6 radiant; next attack against target has Advantage before your next turn.',damage:'4d6 radiant',upcast:'+1d6 per slot above 1st.',source:'PHB 2014 p.248'}),
 record({name:'Sanctuary',level:1,school:'Abjuration',cast:'1 Bonus Action',range:'30 ft.',duration:'1 minute',components:'V,S,M',save:'WIS',effect:'Ward one creature against direct attacks and harmful targeted spells.',mechanics:'Attacker saves or retargets/loses attack; ward ends if target attacks or casts a spell affecting an enemy.',source:'PHB 2014 p.272'}),
 record({name:'Shield of Faith',level:1,school:'Abjuration',cast:'1 Bonus Action',range:'60 ft.',duration:'Concentration, up to 10 minutes',components:'V,S,M',concentration:true,effect:'One creature gains a shimmering protective field.',mechanics:'+2 AC for the duration.',source:'PHB 2014 p.275'}),
 record({name:'Bless',level:1,school:'Enchantment',cast:'1 Action',range:'30 ft.',duration:'Concentration, up to 1 minute',components:'V,S,M',concentration:true,effect:'Choose up to 3 creatures in range.',mechanics:'Targets add 1d4 to attack rolls and saving throws.',upcast:'+1 target per slot above 1st.',source:'PHB 2014 p.219'}),
 record({name:'Cure Wounds',level:1,school:'Evocation',cast:'1 Action',range:'Touch',effect:'Touch one creature to restore hit points.',mechanics:'Heal 1d8 + spellcasting ability modifier.',healing:'1d8 + mod',upcast:'+1d8 per slot above 1st.',source:'PHB 2014 p.230'}),
 record({name:'Hunter’s Mark',level:1,school:'Divination',cast:'1 Bonus Action',range:'90 ft.',duration:'Concentration, up to 1 hour',components:'V',concentration:true,effect:'Mark one creature you can see.',mechanics:'Weapon hits deal +1d6 damage; Advantage to Perception/Survival to find target.',damage:'+1d6 weapon damage',upcast:'Longer duration with higher slots; see source.',source:'PHB 2014 p.251'}),
 record({name:'Goodberry',level:1,school:'Transmutation',cast:'1 Action',range:'Touch',duration:'Instant; berries potent 24 hours',components:'V,S,M',effect:'Create 10 magical berries.',mechanics:'A creature uses an action to eat one: regain 1 HP and gain a day of nourishment.',healing:'1 HP per berry',source:'PHB 2014 p.246'}),
 record({name:'Charm Person',level:1,school:'Enchantment',cast:'1 Action',range:'30 ft.',duration:'1 hour',components:'V,S',save:'WIS',effect:'Attempt to charm one Humanoid you can see.',mechanics:'Target has Advantage if fighting you/allies; it knows it was charmed when spell ends.',upcast:'+1 target per slot above 1st.',source:'PHB 2014 p.221'}),
 record({name:'Faerie Fire',level:1,school:'Evocation',cast:'1 Action',range:'60 ft.',duration:'Concentration, up to 1 minute',components:'V',concentration:true,save:'DEX',effect:'Outline creatures/objects in a 20-ft. cube.',mechanics:'Failed save: outlined; cannot benefit from Invisible; attacks against it have Advantage if seen.',source:'PHB 2014 p.239'}),
 record({name:'Thunderwave',level:1,school:'Evocation',cast:'1 Action',range:'Self (15-ft. cube)',components:'V,S',save:'CON',effect:'Thunderous force erupts from you.',mechanics:'Fail: 2d8 thunder + push 10 ft.; success: half damage, no push.',damage:'2d8 thunder',upcast:'+1d8 per slot above 1st.',source:'PHB 2014 p.282'}),
 record({name:'Misty Step',level:2,school:'Conjuration',cast:'1 Bonus Action',range:'Self',components:'V',effect:'Teleport to an unoccupied space you can see.',mechanics:'Maximum teleport distance: 30 ft.',source:'PHB 2014 p.260'}),
 record({name:'Scorching Ray',level:2,school:'Evocation',cast:'1 Action',range:'120 ft.',attack:'spell',effect:'Create 3 rays; make a ranged spell attack for each.',mechanics:'Each hit deals 2d6 fire; rays can target one or several creatures.',damage:'2d6 fire per ray',upcast:'+1 ray per slot above 2nd.',source:'PHB 2014 p.273'}),
 record({name:'Web',level:2,school:'Conjuration',cast:'1 Action',range:'60 ft.',duration:'Concentration, up to 1 hour',components:'V,S,M',concentration:true,save:'DEX',effect:'Fill a 20-ft. cube with sticky webs.',mechanics:'Difficult terrain; failed DEX save = Restrained; action STR check vs spell DC to escape.',source:'PHB 2014 p.287'}),
 record({name:'Aid',level:2,school:'Abjuration',cast:'1 Action',range:'30 ft.',duration:'8 hours',components:'V,S,M',effect:'Choose up to 3 creatures.',mechanics:'Current and maximum HP each increase by 5 for duration.',healing:'+5 current/max HP',upcast:'+5 HP per slot above 2nd.',source:'PHB 2014 p.211'}),
 record({name:'Lesser Restoration',level:2,school:'Abjuration',cast:'1 Action',range:'Touch',effect:'Touch one creature.',mechanics:'End one disease or one condition: Blinded, Deafened, Paralyzed, or Poisoned.',source:'PHB 2014 p.255'}),
 record({name:'Spiritual Weapon',level:2,school:'Evocation',cast:'1 Bonus Action',range:'60 ft.',duration:'1 minute',attack:'spell',effect:'Create a spectral weapon and make a melee spell attack.',mechanics:'Hit: 1d8 + spellcasting mod force; later Bonus Actions move 20 ft. and attack.',damage:'1d8 + mod force',upcast:'+1d8 for every 2 slot levels above 2nd.',source:'PHB 2014 p.278'}),
 record({name:'Suggestion',level:2,school:'Enchantment',cast:'1 Action',range:'30 ft.',duration:'Concentration, up to 8 hours',components:'V,M',concentration:true,save:'WIS',effect:'Suggest a reasonable course of activity to one creature that understands you.',mechanics:'Failed save: target follows suggestion; damage by you/allies ends the spell.',source:'PHB 2014 p.279'}),
 record({name:'Shatter',level:2,school:'Evocation',cast:'1 Action',range:'60 ft.',components:'V,S,M',save:'CON',effect:'A 10-ft.-radius burst of painfully intense sound.',mechanics:'Fail: 3d8 thunder; success: half. Inorganic creatures have Disadvantage on save.',damage:'3d8 thunder',upcast:'+1d8 per slot above 2nd.',source:'PHB 2014 p.275'})
];

const catalog2024=[
 record({name:'Fire Bolt',level:0,school:'Evocation',cast:'1 Action',range:'120 ft.',effect:'One creature or object; ranged spell attack.',mechanics:'Hit: 1d10 fire; can ignite unattended flammables.',damage:'1d10 fire',attack:'spell',source:'PHB 2024 p.274'}),
 record({name:'Ray of Frost',level:0,school:'Evocation',cast:'1 Action',range:'60 ft.',effect:'One creature; ranged spell attack.',mechanics:'Hit: 1d8 cold; Speed -10 ft. until start of your next turn.',damage:'1d8 cold',attack:'spell',source:'PHB 2024 p.311'}),
 record({name:'Mage Hand',level:0,school:'Conjuration',cast:'1 Action',range:'30 ft.',duration:'1 minute',effect:'Create a spectral hand for simple object manipulation.',mechanics:'Cannot attack, activate magic items, or carry more than 10 lb.',source:'PHB 2024 p.293'}),
 record({name:'Prestidigitation',level:0,school:'Transmutation',cast:'1 Action',range:'10 ft.',duration:'Up to 1 hour',effect:'Create one minor magical sensory or utility effect.',mechanics:'Up to three non-instantaneous effects can remain active.',source:'PHB 2024 p.307'}),
 record({name:'Light',level:0,school:'Evocation',cast:'1 Action',range:'Touch',duration:'1 hour',components:'V,M',effect:'One Large-or-smaller object sheds magical light.',mechanics:'Bright light 20 ft., dim +20 ft.; recasting ends the prior Light.',source:'PHB 2024 p.292'}),
 record({name:'Mending',level:0,school:'Transmutation',cast:'1 minute',range:'Touch',components:'V,S,M',effect:'Repair one break or tear no larger than 1 ft.',mechanics:'Can physically repair a magic item but does not restore lost magic.',source:'PHB 2024 p.297'}),
 record({name:'Guidance',level:0,school:'Divination',cast:'1 Action',range:'Touch',duration:'Concentration, up to 1 minute',concentration:true,effect:'Choose one skill and touch a willing creature.',mechanics:'Target adds 1d4 to ability checks using the chosen skill.',source:'PHB 2024 p.282'}),
 record({name:'Sacred Flame',level:0,school:'Evocation',cast:'1 Action',range:'60 ft.',save:'DEX',effect:'Radiance descends on one creature you can see.',mechanics:'Failed save: 1d8 radiant; half/three-quarters cover gives no save benefit.',damage:'1d8 radiant',source:'PHB 2024 p.313'}),
 record({name:'Thaumaturgy',level:0,school:'Transmutation',cast:'1 Action',range:'30 ft.',duration:'Up to 1 minute',components:'V',effect:'Create a minor divine sensory or environmental effect.',mechanics:'See source for options; booming voice can aid Intimidation.',source:'PHB 2024 p.333'}),
 record({name:'Resistance',level:0,school:'Abjuration',cast:'1 Action',range:'Touch',duration:'Concentration, up to 1 minute',concentration:true,effect:'Choose one damage type for a willing creature.',mechanics:'Reduce that type of damage by 1d4, no more than once per turn.',source:'PHB 2024 p.312'}),
 record({name:'Druidcraft',level:0,school:'Transmutation',cast:'1 Action',range:'30 ft.',effect:'Create one minor nature-themed magical effect.',mechanics:'See source for weather, growth, sensory, and fire options.',source:'PHB 2024 p.266'}),
 record({name:'Vicious Mockery',level:0,school:'Enchantment',cast:'1 Action',range:'60 ft.',components:'V',save:'WIS',effect:'One creature that can hear you.',mechanics:'Failed save: 1d6 psychic and Disadvantage on next attack before end of its next turn.',damage:'1d6 psychic',source:'PHB 2024 p.337'}),
 record({name:'Mage Armor',level:1,school:'Abjuration',cast:'1 Action',range:'Touch',duration:'8 hours',components:'V,S,M',effect:'Touch a willing creature not wearing armor.',mechanics:'Base AC becomes 13 + DEX modifier until spell ends or armor is donned.',source:'PHB 2024 p.293'}),
 record({name:'Magic Missile',level:1,school:'Evocation',cast:'1 Action',range:'120 ft.',effect:'Create 3 darts; each automatically hits a creature you can see.',mechanics:'Each dart deals 1d4+1 force; assign darts among targets.',damage:'1d4+1 force per dart',upcast:'+1 dart per slot above 1st.',source:'PHB 2024 p.295'}),
 record({name:'Shield',level:1,school:'Abjuration',cast:'1 Reaction',range:'Self',duration:'1 round',effect:'Trigger: you are hit by an attack or targeted by Magic Missile.',mechanics:'+5 AC through start of your next turn; Magic Missile deals no damage.',source:'PHB 2024 p.316'}),
 record({name:'Detect Magic',level:1,school:'Divination',cast:'1 Action / Ritual',range:'Self (30 ft.)',duration:'Concentration, up to 10 minutes',concentration:true,ritual:true,effect:'Sense magic within 30 ft.',mechanics:'Magic action reveals visible auras/schools; specified barriers can block.',source:'PHB 2024 p.262'}),
 record({name:'Healing Word',level:1,school:'Abjuration',cast:'1 Bonus Action',range:'60 ft.',components:'V',effect:'One creature you can see regains hit points.',mechanics:'Heal 2d4 + spellcasting ability modifier.',healing:'2d4 + mod',upcast:'+2d4 per slot above 1st.',source:'PHB 2024 p.284'}),
 record({name:'Guiding Bolt',level:1,school:'Evocation',cast:'1 Action',range:'120 ft.',attack:'spell',effect:'One creature; ranged spell attack.',mechanics:'Hit: 4d6 radiant; next attack against target has Advantage before your next turn.',damage:'4d6 radiant',upcast:'+1d6 per slot above 1st.',source:'PHB 2024 p.282'}),
 record({name:'Sanctuary',level:1,school:'Abjuration',cast:'1 Bonus Action',range:'30 ft.',duration:'1 minute',components:'V,S,M',save:'WIS',effect:'Ward one creature against direct attacks and damaging targeted spells.',mechanics:'Attacker saves or retargets/loses attack; ward ends if target attacks, casts a spell, or deals damage.',source:'PHB 2024 p.313'}),
 record({name:'Shield of Faith',level:1,school:'Abjuration',cast:'1 Bonus Action',range:'60 ft.',duration:'Concentration, up to 10 minutes',components:'V,S,M',concentration:true,effect:'One creature gains a shimmering protective field.',mechanics:'+2 AC for the duration.',source:'PHB 2024 p.316'}),
 record({name:'Bless',level:1,school:'Enchantment',cast:'1 Action',range:'30 ft.',duration:'Concentration, up to 1 minute',components:'V,S,M',concentration:true,effect:'Choose up to 3 creatures in range.',mechanics:'Targets add 1d4 to attack rolls and saving throws.',upcast:'+1 target per slot above 1st.',source:'PHB 2024 p.247'}),
 record({name:'Cure Wounds',level:1,school:'Abjuration',cast:'1 Action',range:'Touch',effect:'Touch one creature to restore hit points.',mechanics:'Heal 2d8 + spellcasting ability modifier.',healing:'2d8 + mod',upcast:'+2d8 per slot above 1st.',source:'PHB 2024 p.259'}),
 record({name:'Command',level:1,school:'Enchantment',cast:'1 Action',range:'60 ft.',components:'V',save:'WIS',effect:'Issue one supported one-word command to a creature you can see.',mechanics:'Failed save: target follows command on its next turn; see source for command options.',upcast:'+1 target per slot above 1st.',source:'PHB 2024 p.251'}),
 record({name:'Hunter’s Mark',level:1,school:'Divination',cast:'1 Bonus Action',range:'90 ft.',duration:'Concentration, up to 1 hour',components:'V',concentration:true,effect:'Mark one creature you can see.',mechanics:'When you hit with an attack roll, deal +1d6 force; Advantage to find/track target.',damage:'+1d6 force',upcast:'Higher slots extend concentration duration.',source:'PHB 2024 p.287'}),
 record({name:'Goodberry',level:1,school:'Conjuration',cast:'1 Action',range:'Self',duration:'24 hours',components:'V,S,M',effect:'Create 10 magical berries in your hand.',mechanics:'Bonus Action to eat one: regain 1 HP; one berry supplies a day of nourishment.',healing:'1 HP per berry',source:'PHB 2024 p.280'}),
 record({name:'Ensnaring Strike',level:1,school:'Conjuration',cast:'1 Bonus Action',range:'Self',duration:'Concentration, up to 1 minute',components:'V',concentration:true,save:'STR',effect:'Cast immediately after you hit a creature with a weapon.',mechanics:'Fail: Restrained + 1d6 piercing/turn; Large+ has Advantage on save; action Athletics vs DC to escape.',damage:'1d6 piercing/turn',upcast:'+1d6 per slot above 1st.',source:'PHB 2024 p.268'}),
 record({name:'Fog Cloud',level:1,school:'Conjuration',cast:'1 Action',range:'120 ft.',duration:'Concentration, up to 1 hour',components:'V,S',concentration:true,effect:'Create a 20-ft.-radius sphere of fog.',mechanics:'Area is Heavily Obscured; strong wind disperses it.',upcast:'+20 ft. radius per slot above 1st.',source:'PHB 2024 p.276'}),
 record({name:'Longstrider',level:1,school:'Transmutation',cast:'1 Action',range:'Touch',duration:'1 hour',components:'V,S,M',effect:'Touch one creature.',mechanics:'Target Speed increases by 10 ft. for duration.',upcast:'+1 target per slot above 1st.',source:'PHB 2024 p.293'}),
 record({name:'Faerie Fire',level:1,school:'Evocation',cast:'1 Action',range:'60 ft.',duration:'Concentration, up to 1 minute',components:'V',concentration:true,save:'DEX',effect:'Outline creatures/objects in a 20-ft. cube.',mechanics:'Failed save: outlined; cannot benefit from Invisible; attacks have Advantage if attacker sees it.',source:'PHB 2024 p.271'}),
 record({name:'Thunderwave',level:1,school:'Evocation',cast:'1 Action',range:'Self (15-ft. cube)',components:'V,S',save:'CON',effect:'Thunderous force erupts from you.',mechanics:'Fail: 2d8 thunder + push 10 ft.; success: half damage, no push.',damage:'2d8 thunder',upcast:'+1d8 per slot above 1st.',source:'PHB 2024 p.334'}),
 record({name:'Dissonant Whispers',level:1,school:'Enchantment',cast:'1 Action',range:'60 ft.',components:'V',save:'WIS',effect:'One creature hears a discordant whisper.',mechanics:'Fail: 3d6 psychic and Reaction to move safely away; success: half damage only.',damage:'3d6 psychic',upcast:'+1d6 per slot above 1st.',source:'PHB 2024 p.264'}),
 record({name:'Misty Step',level:2,school:'Conjuration',cast:'1 Bonus Action',range:'Self',components:'V',effect:'Teleport to an unoccupied space you can see.',mechanics:'Maximum teleport distance: 30 ft.',source:'PHB 2024 p.299'}),
 record({name:'Scorching Ray',level:2,school:'Evocation',cast:'1 Action',range:'120 ft.',attack:'spell',effect:'Create 3 rays; make a ranged spell attack for each.',mechanics:'Each hit deals 2d6 fire; rays can target one or several creatures.',damage:'2d6 fire per ray',upcast:'+1 ray per slot above 2nd.',source:'PHB 2024 p.314'}),
 record({name:'Web',level:2,school:'Conjuration',cast:'1 Action',range:'60 ft.',duration:'Concentration, up to 1 hour',components:'V,S,M',concentration:true,save:'DEX',effect:'Fill a 20-ft. cube with sticky webs.',mechanics:'Difficult terrain/light obscurement; failed save = Restrained; action Athletics vs spell DC to escape.',source:'PHB 2024 p.340'}),
 record({name:'Aid',level:2,school:'Abjuration',cast:'1 Action',range:'30 ft.',duration:'8 hours',components:'V,S,M',effect:'Choose up to 3 creatures.',mechanics:'Current and maximum HP each increase by 5 for duration.',healing:'+5 current/max HP',upcast:'+5 HP per slot above 2nd.',source:'PHB 2024 p.239'}),
 record({name:'Lesser Restoration',level:2,school:'Abjuration',cast:'1 Bonus Action',range:'Touch',effect:'Touch one creature.',mechanics:'End one condition: Blinded, Deafened, Paralyzed, or Poisoned.',source:'PHB 2024 p.291'}),
 record({name:'Suggestion',level:2,school:'Enchantment',cast:'1 Action',range:'30 ft.',duration:'Concentration, up to 8 hours',components:'V,M',concentration:true,save:'WIS',effect:'Give a creature a suggestion of up to 25 words.',mechanics:'Failed save: target pursues achievable, non-obviously harmful suggestion; damage can end it.',source:'PHB 2024 p.320'}),
 record({name:'Shatter',level:2,school:'Evocation',cast:'1 Action',range:'60 ft.',components:'V,S,M',save:'CON',effect:'A 10-ft.-radius burst of painfully intense sound.',mechanics:'Fail: 3d8 thunder; success: half. Constructs have Disadvantage on save.',damage:'3d8 thunder',upcast:'+1d8 per slot above 2nd.',source:'PHB 2024 p.316'})
];

const byEdition=freeze({
 'dnd-2014':freeze(Object.fromEntries(catalog2014.map(spell=>[key(spell.name),spell]))),
 'dnd-2024':freeze(Object.fromEntries(catalog2024.map(spell=>[key(spell.name),spell])))
});

export function normalizeSpellName(value){return String(value||'').split(' — ')[0].trim();}
export function getSpellCard(name,rulesId='dnd-2014'){return byEdition[rulesId]?.[key(normalizeSpellName(name))]||null;}

const sourceGroups=freeze([
 ['cantrips','Cantrip'],['known','Known'],['prepared','Prepared'],['alwaysPrepared','Always Prepared'],['origin','Origin'],['lineage','Lineage']
]);

export function activeSpellEntries(profile){
 const details=profile?.spellDetails||{cantrips:[],known:[],prepared:profile?.spells||[],alwaysPrepared:[],origin:[],lineage:[]};
 const map=new Map();
 for(const [group,label] of sourceGroups){
  for(const raw of details[group]||[]){
   const name=normalizeSpellName(raw); const note=String(raw).includes(' — ')?String(raw).split(' — ').slice(1).join(' — '):'';
   const existing=map.get(key(name))||{name,sources:[],notes:[]};
   if(!existing.sources.includes(label))existing.sources.push(label);
   if(note&&!existing.notes.includes(note))existing.notes.push(note);
   map.set(key(name),existing);
  }
 }
 return [...map.values()].map(entry=>({
  ...entry,
  card:getSpellCard(entry.name,profile.rulesId),
  specialUses:entry.notes.some(note=>/free 1\/long rest/i.test(note))?1:0
 }));
}

export function spellCombatSummary(card,profile){
 if(!card)return 'Rules data unavailable';
 if(card.attack==='spell')return `Spell attack ${spellAttackBonus(profile)>=0?'+':''}${spellAttackBonus(profile)}`;
 if(card.save)return `${card.save} save DC ${spellSaveDc(profile)}`;
 return 'No attack/save';
}

export function createSpellSlotState(profile){
 return Object.fromEntries(Object.entries(profile?.spellSlots||{}).map(([level,max])=>[Number(level),{max:Number(max),current:Number(max)}]));
}
export function restoreSpellSlots(state){for(const slot of Object.values(state||{}))slot.current=slot.max;return state;}
export function eligibleSlotLevels(profile,spellLevel){return Object.keys(profile?.spellSlots||{}).map(Number).filter(level=>level>=spellLevel).sort((a,b)=>a-b);}
export function consumeSpellSlot(state,level){const slot=state?.[Number(level)];if(!slot||slot.current<1)return false;slot.current-=1;return true;}

export const spellCardCatalog=byEdition;
