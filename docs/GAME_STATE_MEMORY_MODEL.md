# Canonical Game-State Memory Model

Last updated: 2026-08-05

The Living Table exists to remember the game so the people at the table can play. A saved campaign must be able to resume at the exact meaningful moment—even in the middle of combat—without reconstructing state from memory, paper notes, chat logs, or another application.

## Resume promise

After loading a campaign, the DM and players should immediately recover:

- where the party is;
- what is happening now;
- whose turn it is;
- every active condition and resource;
- what changed in the current Area;
- what each relevant NPC knows, said, promised, or believes;
- which clues, Sites, Areas, and exits have been discovered;
- what each character owns, knows about those items, and has already used;
- what the party was trying to accomplish next.

A campaign is not truly saved if the DM still has to remember the missing context.

## Authoritative state domains

### Campaign and chronology

Track:

- campaign ID, title, owner, members, roles, and edition;
- adventure pack ID and immutable release version;
- campaign clock, in-world date, elapsed travel/rest time, and session dates;
- milestone or XP progress and current character levels;
- completed session summaries and event history;
- DM rulings and edition-specific overrides.

### Place and Scene

Track:

- current Location;
- current Site;
- current Area / Room;
- current Scene and phase;
- visited and discovered places;
- discovered and undiscovered exits;
- player-safe versus DM-only descriptions;
- active environmental effects;
- Scene transitions and why they occurred.

### Persistent Area state

For every Area / Room, retain:

- searched, unsearched, cleared, occupied, altered, damaged, locked, unlocked, trapped, or safe state;
- opened doors and containers;
- revealed secret doors and clues;
- disabled, triggered, reset, or bypassed traps;
- moved or destroyed objects;
- defeated, escaped, surrendered, befriended, or relocated creatures;
- claimed and unclaimed treasure;
- unfinished triggers and consequences;
- notes created by the DM during play.

Returning to a room should show what the party actually left behind, not the original untouched source definition.

### NPC memory

For each NPC, retain:

- identity, portrait, voice, motivation, role, faction, and current attitude;
- where the NPC was last seen and current known location;
- what the NPC knows versus what players have learned;
- exact important statements, promises, lies, threats, requests, and bargains;
- relationship changes by character or party;
- gifts, debts, favors, insults, injuries, conditions, and unresolved business;
- whether the NPC is alive, dead, missing, hostile, allied, captured, or unavailable;
- next likely response when encountered again.

The DM card should answer, “What did this person tell the party last time?” without requiring a notebook search.

### Combat state

A combat save must retain:

- encounter ID, edition, round number, active turn, and turn order;
- every combatant and initiative result;
- grouped-monster initiative where used;
- current and maximum HP, temporary HP, and damage taken;
- conditions and their sources, durations, saves, and end timing;
- concentration and the effect being maintained;
- action, bonus action, reaction, movement, object interaction, and held/readied action state;
- death saves and stabilization;
- spell slots, class resources, limited features, recharge abilities, and item charges spent;
- cover, position or zone, terrain, visibility, hazards, and ongoing area effects;
- surprise, hidden creatures, reinforcements, morale, surrender, and escape state;
- lair actions, environmental initiative counts, and recurring triggers;
- roll history, damage applications, corrections, overrides, and undo history.

Resuming mid-combat should make the next turn immediately obvious.

### Character continuity

For each character, retain:

- edition, ancestry/species, background, classes, subclasses, and levels;
- XP or milestone status;
- maximum/current HP, temporary HP, AC, speed, senses, proficiency bonus, and conditions;
- hit dice, exhaustion, inspiration, death saves, and concentration;
- spell preparation/known state, spell slots, class resources, and feature uses;
- action-economy state during combat;
- equipment, attunement, carried weight when used, currency, ammunition, consumables, and tools;
- active effects and their expiration rules;
- short rests, long rests, level-ups, and the exact resources changed by them;
- private character notes and player-visible history.

Edition-specific rules engines apply mechanical recovery. The shared memory layer records what happened and the resulting authoritative values.

### Item and treasure memory

Every acquired item needs a persistent instance—not merely a reference to a generic definition.

Track:

- item instance ID and source definition/version;
- true name and player-known name;
- mundane, magic, unidentified, partially identified, identified, or cursed knowledge state;
- player-known properties and DM-only properties;
- owner, carrier, equipped slot, container, and party-stash state;
- quantity, charges, pieces, ammunition, durability, and recharge timing;
- attunement requirement, attuned character, and attunement status;
- curse presence and whether the curse has been discovered;
- acquisition Scene, previous owners, gifts, sales, transfers, and loss;
- custom names, notes, and appearance;
- consumed, destroyed, sold, dropped, stolen, or recovered state.

This must answer questions such as:

- Was the sword Flame Tongue, Frost Brand, or something else?
- What does the Potion of Growth do?
- Who is carrying it?
- How many charges remain?
- Is it attuned?
- Has the curse been discovered?
- Where and when did the party acquire it?

Player projections must never reveal an undiscovered curse or unknown property simply because the DM record contains it.

### Quests, clues, and objectives

Track:

- main, side, personal, hidden, failed, completed, and abandoned objectives;
- current stage and next known lead;
- discovered clues and the Scene in which each was learned;
- NPCs, Sites, Areas, items, and events connected to the objective;
- deadlines and clocks;
- DM-only truth versus player-visible wording;
- rewards promised, granted, declined, or still owed.

### Rest, recovery, and advancement

Track each rest event with:

- short or long rest;
- start/end time and interruption state;
- edition and house rules used;
- hit dice spent or recovered;
- HP restored;
- spell slots, class resources, item charges, and features restored;
- conditions or exhaustion changed;
- watches, travel consequences, and Scene triggers;
- resulting authoritative character values.

Track each advancement event with level before/after, class choice, HP change, new features, spells, proficiency changes, and any pending player choices.

## Event history and undo

Every meaningful mutation should create a readable event containing:

- actor or system responsible;
- action performed;
- affected entities;
- before and after values when practical;
- campaign time and real timestamp;
- visibility: DM only, selected players, or public;
- source command, rule, card, or DM override;
- link to the event it corrects when undone.

The DM must be able to fix an accidental click without manually repairing several modules.

## Immutable definitions versus mutable instances

Adventure packs and `DNDCards` definitions are immutable source content.

Runtime state stores instances and changes:

```text
Definition: Potion of Growth rules and artwork
Instance: the specific bottle Wendy found, who owns it, whether it is identified, and whether it has been consumed
```

```text
Definition: Cake Chamber original room card
Instance: east chandelier destroyed, two presents opened, north door unlocked, Wish Circle at two advances
```

Playing a campaign never mutates the purchased or versioned source package.

## Player-safe projections

The authoritative record may contain secrets, but a player payload includes only:

- that player's character-private information;
- public party state;
- revealed world cards and facts;
- item properties that character is permitted to know;
- public combat information;
- DM-requested choices or rolls.

Unknown item properties, curses, hidden creatures, unrevealed exits, secret DCs, NPC lies, future triggers, and private tactics remain absent from player payloads.

## Minimum exact-resume acceptance test

1. Save during round 3 of combat.
2. Close every browser.
3. Reopen the campaign later.
4. DM sees the correct Location, Site, Area, Scene, active turn, initiative, combatants, HP, conditions, concentration, hazards, room alterations, and private notes.
5. Each player sees the correct character, inventory, known item properties, resource use, conditions, public initiative, and revealed cards.
6. The system highlights the next valid action.
7. No person must reconstruct state from memory or enter the same fact twice.
