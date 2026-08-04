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
    { id:"location", title:"Blackthorn Cemetery", type:CARD_TYPES.LOCATION, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{readAloud:"Cold mist curls between leaning grave markers. A roofless chapel waits at the top of the hill.",summary:"A foggy cemetery surrounding the ruined chapel."}, dmFace:{readAloud:"Cold mist curls between leaning grave markers. A roofless chapel waits at the top of the hill.",notes:"The chapel is the only obvious shelter. Tracks lead toward its western door."} },
    { id:"room", title:"The Ruined Chapel", type:CARD_TYPES.ROOM, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{readAloud:"Fallen arches frame a cracked altar. Rubble covers the floor while candlelight trembles against the walls.",summary:"Fallen arches, dim light, and rubble that counts as difficult terrain."}, dmFace:{readAloud:"Fallen arches frame a cracked altar. Rubble covers the floor while candlelight trembles against the walls.",notes:"Secret door behind the northern tapestry."} },
    { id:"caretaker", title:"Mara Venn, Caretaker", type:CARD_TYPES.NPC, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{openingDialogue:"Please—keep your voices down. Something beneath the chapel has started answering the dead.",summary:"A frightened cemetery caretaker who knows the chapel grounds."}, dmFace:{openingDialogue:"Please—keep your voices down. Something beneath the chapel has started answering the dead.",roleplay:"Mara speaks quickly, avoids the chapel door, and grips an iron key.",knows:["The cult arrived before sunset","A hidden stair lies behind the altar","The priest fears the chapel bell"]} },
    { id:"priest", title:"Cult Priest", type:CARD_TYPES.MONSTER, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{summary:"A robed priest channels energy into a cracked altar."}, dmFace:{ac:12,hp:32,initiative:2,traits:["Dark Devotion"],notes:"Ritual completes at end of round 3."} },
    { id:"skeleton", title:"Skeleton", type:CARD_TYPES.MONSTER, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{summary:"An armed skeleton defends the altar."}, dmFace:{ac:13,hp:13,initiative:2,traits:["Undead"]} },
    { id:"hazard", title:"Falling Stones", type:CARD_TYPES.HAZARD, audience:AUDIENCES.EVERYONE, revealed:false, playerFace:{readAloud:"Stone cracks overhead as loose masonry begins to fall.",summary:"Loose masonry crashes from above."}, dmFace:{readAloud:"Stone cracks overhead as loose masonry begins to fall.",save:"DEX DC 14",damage:"2d6 bludgeoning"} },
    { id:"objective", title:"Stop the Midnight Rite", type:CARD_TYPES.OBJECTIVE, audience:AUDIENCES.EVERYONE, revealed:true, playerFace:{summary:"Break the ritual before the end of round 3."}, dmFace:{success:"Disrupt the altar, silence the priest, or ring the chapel bell.",failure:"The dead beneath the cemetery awaken."} },
    { id:"treasure", title:"Treasure Chest", type:CARD_TYPES.TREASURE, audience:AUDIENCES.EVERYONE, revealed:false, playerFace:{summary:"An iron-banded chest waits behind the altar."}, dmFace:{contents:["Potion of Healing","75 gp","Chapel key"]} },
    { id:"lantern", title:"Lantern of Last Light", type:CARD_TYPES.ITEM, audience:AUDIENCES.EVERYONE, revealed:true, uses:{max:3,label:"charges"}, playerFace:{summary:"Sheds bright light for 30 feet. Spend 1 charge to reveal invisible undead until the end of your next turn.",knownEffect:"You know the lantern has 3 charges and regains them at dawn."}, dmFace:{summary:"Sheds bright light for 30 feet. Spend 1 charge to reveal invisible undead until the end of your next turn.",secret:"The lantern also glows near desecrated ground.",recharge:"Regains all charges at dawn."} }
  ]
});
