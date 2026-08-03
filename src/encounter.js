import { AUDIENCES, CARD_TYPES, ROLES, validateSession } from "./schema.js";

export const createRuinedChapelSession = () => validateSession({
  id: "ruined-chapel-demo",
  participants: [
    { id: "dm-1", name: "Dungeon Master", role: ROLES.DM },
    { id: "player-lyria", name: "Lyria's Player", role: ROLES.PLAYER }
  ],
  actors: [
    { id:"lyria", name:"Lyria", kind:"player", controllerId:"player-lyria", initiative:24, hp:{current:32,max:38}, ac:15, publicStatus:"Wounded", private:{class:"Rogue",level:5,condition:"Hidden"} },
    { id:"skeleton-a", name:"Skeleton A", kind:"monster", controllerId:"dm-1", initiative:18, hp:{current:13,max:13}, ac:13, publicStatus:"Unhurt", private:{tactics:"Focus isolated targets."} },
    { id:"thorin", name:"Thorin", kind:"player", controllerId:"player-thorin", initiative:15, hp:{current:44,max:44}, ac:18, publicStatus:"Unhurt", private:{class:"Fighter",level:5} },
    { id:"cult-priest", name:"Cult Priest", kind:"monster", controllerId:"dm-1", initiative:13, hp:{current:32,max:32}, ac:12, publicStatus:"Unhurt", private:{tactics:"Complete ritual at end of round 3.",secretReaction:"Dark Devotion"} },
    { id:"elandra", name:"Elandra", kind:"player", controllerId:"player-elandra", initiative:11, hp:{current:24,max:24}, ac:13, publicStatus:"Unhurt", private:{class:"Wizard",level:5} },
    { id:"skeleton-b", name:"Skeleton B", kind:"monster", controllerId:"dm-1", initiative:8, hp:{current:13,max:13}, ac:13, publicStatus:"Unhurt", private:{tactics:"Guard the priest."} },
    { id:"dain", name:"Dain", kind:"player", controllerId:"player-dain", initiative:6, hp:{current:36,max:36}, ac:17, publicStatus:"Unhurt", private:{class:"Cleric",level:5} }
  ],
  cards: [
    { id:"room", title:"The Ruined Chapel", type:CARD_TYPES.ROOM, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{summary:"Fallen arches, dim light, and rubble that counts as difficult terrain."}, dmFace:{notes:"Secret door behind the northern tapestry."} },
    { id:"priest", title:"Cult Priest", type:CARD_TYPES.MONSTER, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{summary:"A robed priest channels energy into a cracked altar."}, dmFace:{ac:12,hp:32,traits:["Dark Devotion"],notes:"Ritual completes at end of round 3."} },
    { id:"skeleton", title:"Skeletons", type:CARD_TYPES.MONSTER, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{summary:"Two armed skeletons defend the altar."}, dmFace:{ac:13,hp:13,traits:["Undead"]} },
    { id:"hazard", title:"Falling Stones", type:CARD_TYPES.HAZARD, audience:AUDIENCES.EVERYONE, revealed:false, playerFace:{summary:"Loose masonry crashes from above."}, dmFace:{save:"DEX DC 14",damage:"2d6 bludgeoning"} },
    { id:"treasure", title:"Treasure Chest", type:CARD_TYPES.TREASURE, audience:AUDIENCES.EVERYONE, revealed:false, playerFace:{summary:"An iron-banded chest waits behind the altar."}, dmFace:{contents:["Potion of Healing","75 gp","Chapel key"]} }
  ]
});
