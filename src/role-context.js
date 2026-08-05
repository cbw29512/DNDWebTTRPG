import { ROLES } from "./schema.js";

const declaredRole = document.querySelector('meta[name="living-table-role"]')?.content?.trim().toLowerCase();

export function resolveRuntimeRole() {
  if (declaredRole === ROLES.DM || declaredRole === ROLES.PLAYER) return declaredRole;
  throw new Error("The Living Table requires an explicit DM or player entry point.");
}

export const runtimeRole = resolveRuntimeRole();
export const isDungeonMaster = runtimeRole === ROLES.DM;
export const isPlayer = runtimeRole === ROLES.PLAYER;

document.documentElement.dataset.runtimeRole = runtimeRole;
window.LivingTableRole = Object.freeze({ role: runtimeRole, isDungeonMaster, isPlayer });
