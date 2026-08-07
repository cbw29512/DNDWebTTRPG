export const ABILITIES = Object.freeze(["strength","dexterity","constitution","intelligence","wisdom","charisma"]);

export const SKILLS = Object.freeze({
  acrobatics:"dexterity",
  animalHandling:"wisdom",
  arcana:"intelligence",
  athletics:"strength",
  deception:"charisma",
  history:"intelligence",
  insight:"wisdom",
  intimidation:"charisma",
  investigation:"intelligence",
  medicine:"wisdom",
  nature:"intelligence",
  perception:"wisdom",
  performance:"charisma",
  persuasion:"charisma",
  religion:"intelligence",
  sleightOfHand:"dexterity",
  stealth:"dexterity",
  survival:"wisdom"
});

export function abilityModifier(score) {
  if (!Number.isFinite(score)) throw new TypeError("Ability score must be numeric.");
  return Math.floor((score - 10) / 2);
}

export function proficiencyBonus(level) {
  if (!Number.isInteger(level) || level < 1 || level > 20) throw new RangeError("Character level must be 1-20.");
  return 2 + Math.floor((level - 1) / 4);
}

export function savingThrowModifier(profile, ability) {
  const base = abilityModifier(profile.abilities[ability]);
  const proficient = profile.saveProficiencies?.includes(ability);
  return base + (proficient ? proficiencyBonus(profile.level) : 0);
}

export function skillModifier(profile, skill) {
  const ability = SKILLS[skill];
  if (!ability) throw new RangeError(`Unknown skill: ${skill}`);
  const base = abilityModifier(profile.abilities[ability]);
  const pb = proficiencyBonus(profile.level);
  if (profile.expertise?.includes(skill)) return base + pb * 2;
  if (profile.skillProficiencies?.includes(skill)) return base + pb;
  return base;
}

export function passivePerception(profile) {
  return 10 + skillModifier(profile, "perception");
}

export function spellSaveDc(profile) {
  if (!profile.spellcastingAbility) return null;
  return 8 + abilityModifier(profile.abilities[profile.spellcastingAbility]) + proficiencyBonus(profile.level);
}

export function spellAttackBonus(profile) {
  if (!profile.spellcastingAbility) return null;
  return abilityModifier(profile.abilities[profile.spellcastingAbility]) + proficiencyBonus(profile.level);
}

export function weaponAttackBonus(profile, weapon) {
  const ability = weapon.attackAbility || (weapon.properties?.includes("finesse") ? "dexterity" : weapon.kind === "ranged" ? "dexterity" : "strength");
  let total = abilityModifier(profile.abilities[ability]);
  if (weapon.proficient !== false) total += proficiencyBonus(profile.level);
  total += weapon.attackBonus || 0;
  total += weapon.fightingStyleAttackBonus || 0;
  return total;
}

export function weaponDamageModifier(profile, weapon) {
  const ability = weapon.attackAbility || (weapon.properties?.includes("finesse") ? "dexterity" : weapon.kind === "ranged" ? "dexterity" : "strength");
  return abilityModifier(profile.abilities[ability]) + (weapon.damageBonus || 0) + (weapon.fightingStyleDamageBonus || 0);
}

export function rollDie(sides, random = Math.random) {
  if (!Number.isInteger(sides) || sides < 2) throw new RangeError("Die must have at least two sides.");
  return Math.floor(random() * sides) + 1;
}

export function parseDiceExpression(expression) {
  const normalized = String(expression ?? "").replace(/\s+/g, "").toLowerCase();
  if (!normalized) throw new Error("Dice expression is required.");
  const source = /^[+-]/.test(normalized) ? normalized : `+${normalized}`;
  const tokens = [...source.matchAll(/([+-])(?:(\d*)d(\d+)|(\d+))/g)];
  if (!tokens.length || tokens.map(match => match[0]).join("") !== source) throw new Error(`Unsupported dice expression: ${expression}`);
  return tokens.map(match => ({
    sign: match[1] === "-" ? -1 : 1,
    count: match[3] ? Number(match[2] || 1) : 0,
    sides: match[3] ? Number(match[3]) : 0,
    flat: match[4] ? Number(match[4]) : 0
  }));
}

export function rollDiceExpression(expression, random = Math.random) {
  const terms = parseDiceExpression(expression);
  const rolls = [];
  let total = 0;
  for (const term of terms) {
    if (term.flat) {
      total += term.sign * term.flat;
      rolls.push({ kind:"flat", value:term.sign * term.flat });
      continue;
    }
    const values = Array.from({ length:term.count }, () => rollDie(term.sides, random));
    const subtotal = values.reduce((sum, value) => sum + value, 0) * term.sign;
    total += subtotal;
    rolls.push({ kind:"dice", count:term.count, sides:term.sides, sign:term.sign, values, subtotal });
  }
  return { expression:String(expression), total, rolls };
}

export function rollD20(modifier = 0, { advantage = false, disadvantage = false, random = Math.random } = {}) {
  const first = rollDie(20, random);
  let second = null;
  let natural = first;
  if (advantage !== disadvantage && (advantage || disadvantage)) {
    second = rollDie(20, random);
    natural = advantage ? Math.max(first, second) : Math.min(first, second);
  }
  return { natural, rolls:second == null ? [first] : [first, second], modifier, total:natural + modifier };
}

export function rollDamageParts(parts, random = Math.random) {
  const resolved = (parts || []).map(part => {
    const result = rollDiceExpression(part.dice, random);
    return { ...part, ...result };
  });
  return { parts:resolved, total:resolved.reduce((sum, part) => sum + part.total, 0) };
}

export function validateDamageParts(parts, label = "damage") {
  if (!Array.isArray(parts) || !parts.length) throw new Error(`${label} must define at least one damage part.`);
  for (const part of parts) {
    const terms = parseDiceExpression(part.dice);
    if (terms.some(term => term.sides === 20)) throw new Error(`${label} cannot use a d20 as damage dice.`);
    if (!part.type) throw new Error(`${label} must name a damage type.`);
  }
  return true;
}
