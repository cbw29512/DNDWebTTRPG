const clone=value=>structuredClone(value);
const unique=values=>[...new Set(values.filter(Boolean))];

export function sceneList(manifest=globalThis.window?.__DND_ADVENTURE_PACK__){
  try{return Array.isArray(manifest?.scenes)?manifest.scenes:[];}
  catch(error){console.error('[Living Table] Could not read Scene list.',error);return [];}
}

export function findScene(sceneId,manifest){
  try{return sceneList(manifest).find(scene=>scene.id===sceneId)||null;}
  catch(error){console.error(`[Living Table] Could not find Scene ${sceneId}.`,error);return null;}
}

export function boardForScene(scene,manifest){
  try{
    const persistent=clone(manifest?.persistentBoard||{});
    const board=clone(scene?.board||{});
    return {
      location:unique([...(persistent.location||[]),scene?.locationId]),
      site:[scene?.siteId].filter(Boolean),
      room:[scene?.roomId].filter(Boolean),
      npc:unique([...(persistent.npc||[]),...(board.npc||[])]),
      monster:unique(board.monster||[]),
      hazard:unique(board.hazard||[]),
      treasure:unique(board.treasure||[])
    };
  }catch(error){console.error(`[Living Table] Could not build board for Scene ${scene?.id||'unknown'}.`,error);throw error;}
}

export function questStateForScene(session,scene,manifest){
  try{
    const mainQuestId=manifest?.startingQuests?.[0]||session?.quests?.[0]||null;
    const active=new Set(session?.questState?.active||(session?.quests||[]).filter(id=>id!==mainQuestId));
    (scene?.questIds||[]).filter(id=>id!==mainQuestId).forEach(id=>active.add(id));
    const revealed=new Set(session?.questState?.revealed||[]);
    if(mainQuestId)revealed.add(mainQuestId);
    active.forEach(id=>revealed.add(id));
    return {
      quests:unique([mainQuestId,...active]),
      questState:{active:[...active],revealed:[...revealed]}
    };
  }catch(error){console.error(`[Living Table] Could not calculate quest state for Scene ${scene?.id||'unknown'}.`,error);throw error;}
}

export function uniqueIds(values){return unique(values);}