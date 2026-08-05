import { ROLES, validateSession } from "./schema.js";
import { wishingCakeCards } from "./wishing-cake-cards.js";
import { wishingCakeSpatialCards } from "./wishing-cake-spatial-cards.js";

export const createRuinedChapelSession = () => {
  const legacySpatialIds = new Set(["location", "room"]);
  const cards = [
    ...wishingCakeSpatialCards,
    ...wishingCakeCards.filter(card => !legacySpatialIds.has(card.id))
  ];

  const session = validateSession({
    id: "wishing-cake-birthday-example",
    participants: [
      { id: "dm-1", name: "Dungeon Master", role: ROLES.DM },
      { id: "player-wendy", name: "Wendy's Player", role: ROLES.PLAYER }
    ],
    actors: [
      { id:"wendy", name:"Wendy's Birthday Hero", kind:"player", controllerId:"player-wendy", initiative:18, hp:{current:28,max:28}, ac:15, publicStatus:"Ready to reclaim her wish", private:{level:3,feature:"Birthday Spark"} },
      { id:"animated-present-a", name:"Animated Present A", kind:"monster", controllerId:"dm-1", initiative:14, hp:{current:18,max:18}, ac:14, publicStatus:"Wrapped and restless", private:{tactics:"Ribbon Lash anyone approaching the cake."} },
      { id:"animated-present-b", name:"Animated Present B", kind:"monster", controllerId:"dm-1", initiative:14, hp:{current:18,max:18}, ac:14, publicStatus:"Wrapped and restless", private:{tactics:"Harass a spellcaster and surrender to genuine kindness."} },
      { id:"sepulchral", name:"Sepulchral", kind:"monster", controllerId:"dm-1", initiative:12, hp:{current:80,max:80}, ac:15, publicStatus:"Guarding the Wish Circle", private:{tactics:"Protect the cake, divide the party, and plead once bloodied."} }
    ],
    cards
  });

  session.cards.forEach(card => { card.face = structuredClone(card.playerFace); });
  return session;
};
