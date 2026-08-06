import { ROLES, validateSession } from "./schema.js";
import { wishingCakePackCards } from "./wishing-cake-pack.js";

export const createRuinedChapelSession = () => {
  const session = validateSession({
    id: "wishing-cake-birthday-example",
    participants: [
      { id: "dm-1", name: "Dungeon Master", role: ROLES.DM },
      { id: "player-wendy", name: "Wendy's Player", role: ROLES.PLAYER }
    ],
    actors: [
      { id:"wendy", name:"Wendy's Birthday Hero", kind:"player", controllerId:"player-wendy", initiative:18, hp:{current:28,max:28}, ac:15, publicStatus:"Ready to reclaim her wish", private:{level:3,feature:"Birthday Spark"} },
      { id:"animated-present-a", name:"Animated Present A", kind:"monster", controllerId:"dm-1", initiative:14, hp:{current:18,max:18}, ac:14, publicStatus:"Wrapped and restless", private:{tactics:"Use Ribbon Lash against a hero approaching the cellar clue."} },
      { id:"animated-present-b", name:"Animated Present B", kind:"monster", controllerId:"dm-1", initiative:14, hp:{current:18,max:18}, ac:14, publicStatus:"Wrapped and restless", private:{tactics:"Use Surprise Inside when it can catch at least two heroes; surrender to genuine kindness at 6 HP or fewer."} }
    ],
    cards: wishingCakePackCards
  });

  session.cards.forEach(card => { card.face = structuredClone(card.playerFace); });
  return session;
};
