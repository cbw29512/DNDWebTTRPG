import { abilityModifier, proficiencyBonus } from '../dnd/rules-engine.js';

const sourceKeyByLabel=Object.freeze({
  'Cantrip':'cantrips',
  'Known':'known',
  'Prepared':'prepared',
  'Always Prepared':'alwaysPrepared',
  'Origin':'origin',
  'Lineage':'lineage'
});
const sourceLabelByGroup=Object.freeze({
  cantrips:'Class',
  known:'Class',
  prepared:'Class',
  alwaysPrepared:'Class',
  origin:'Origin',
  lineage:'Lineage'
});
const classGroups=new Set(['cantrips','known','prepared','alwaysPrepared']);

function defaultRule(profile,group){
  return {
    ability:profile?.spellcastingAbility||null,
    usesSlots:classGroups.has(group)&&group!=='cantrips',
    sourceLabel:sourceLabelByGroup[group]||group,
    freeUsesBySpell:{},
    resourceBySpell:{}
  };
}

function ruleFor(profile,group){
  const configured=profile?.spellAccessRules?.[group]||{};
  return {...defaultRule(profile,group),...configured};
}

function freeUseForSpell(rule,profile,spellName){
  const explicit=rule.freeUsesBySpell?.[spellName];
  if(explicit){
    const value=typeof explicit==='number'?{max:explicit}:explicit;
    return {max:Number(value.max||1),label:value.label||'Free Cast',recharge:value.recharge||'Long Rest'};
  }
  const resourceId=rule.resourceBySpell?.[spellName];
  if(resourceId){
    const resource=profile?.resources?.find(entry=>entry.id===resourceId);
    if(resource?.max)return {max:Number(resource.max),label:resource.name||'Free Cast',recharge:resource.recharge||'Long Rest',resourceId};
  }
  return null;
}

export function spellAccesses(entry,profile){
  const accesses=[];
  for(const label of entry?.sources||[]){
    const group=sourceKeyByLabel[label]||label;
    const rule=ruleFor(profile,group);
    const freeUse=freeUseForSpell(rule,profile,entry.name);
    accesses.push({
      id:`${group}:${entry.name}`,
      group,
      label:rule.sourceLabel||label,
      ability:rule.ability||profile?.spellcastingAbility||null,
      usesSlots:Boolean(rule.usesSlots),
      freeUse
    });
  }
  return accesses;
}

export function spellAttackBonusForAbility(profile,ability){
  if(!ability)return null;
  return abilityModifier(profile.abilities[ability])+proficiencyBonus(profile.level);
}

export function spellSaveDcForAbility(profile,ability){
  if(!ability)return null;
  return 8+abilityModifier(profile.abilities[ability])+proficiencyBonus(profile.level);
}

export function spellCombatSummaryForAccess(card,profile,access){
  if(!card)return 'Rules data unavailable';
  const ability=access?.ability||profile?.spellcastingAbility||null;
  if(card.attack==='spell'){
    const bonus=spellAttackBonusForAbility(profile,ability);
    return bonus==null?'Spell attack —':`Spell attack ${bonus>=0?'+':''}${bonus}`;
  }
  if(card.save){
    const dc=spellSaveDcForAbility(profile,ability);
    return dc==null?`${card.save} save DC —`:`${card.save} save DC ${dc}`;
  }
  return 'No attack/save';
}

export function accessAbilityLabel(access){return access?.ability?String(access.ability).slice(0,3).toUpperCase():'—';}
