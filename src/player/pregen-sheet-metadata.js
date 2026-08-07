const freeze=value=>Object.freeze(value);

// Character-sheet identity/roleplay fields that do not change between the 2014 and
// 2024 mechanical profiles. These are original pregen characterization, not SRD rules.
export const pregenSheetMetadata=freeze({
  'wendy-birthday-hero':freeze({
    alignment:'Neutral Good',
    personality:'Steps forward when someone needs help and turns tense moments into a challenge the group can solve together.',
    ideal:'Celebration. A victory matters most when everyone has someone to share it with.',
    bond:'This birthday and the people who showed up for it matter more than any treasure.',
    flaw:'Takes responsibility for problems that should be shared with the whole party.'
  }),
  'merrin-thief':freeze({
    alignment:'Chaotic Good',
    personality:'Always checks the exits, pockets a useful tool, and jokes when the room gets dangerous.',
    ideal:'Freedom. Locks, threats, and bad rules exist to be outsmarted.',
    bond:'Will not abandon a companion who trusted Merrin to get them home.',
    flaw:'Curiosity can beat caution when something is obviously trapped or forbidden.'
  }),
  'elara-evoker':freeze({
    alignment:'Neutral Good',
    personality:'Studies a problem carefully, then commits to a solution with startling intensity.',
    ideal:'Knowledge. Understanding dangerous magic is the first step toward using it responsibly.',
    bond:'Keeps detailed notes so the party never has to survive the same mistake twice.',
    flaw:'Can focus on solving the magical problem and miss the emotional one.'
  }),
  'brunna-life-cleric':freeze({
    alignment:'Lawful Good',
    personality:'Checks whether everyone has eaten, rested, and bandaged up before worrying about herself.',
    ideal:'Mercy. Strength should create another chance whenever another chance is possible.',
    bond:'Treats the party as a responsibility freely chosen and worth protecting.',
    flaw:'Has trouble accepting that someone may refuse the help she knows how to give.'
  }),
  'fern-hunter':freeze({
    alignment:'Neutral Good',
    personality:'Quietly observes the room, notices the overlooked trail, and acts decisively once the pattern is clear.',
    ideal:'Balance. Protect people without destroying more than the danger requires.',
    bond:'Feels responsible for guiding companions safely through places they do not understand.',
    flaw:'Can trust instinct so strongly that explanations arrive after the decision.'
  }),
  'lute-lore-bard':freeze({
    alignment:'Chaotic Good',
    personality:'Collects stories, remembers small details about people, and refuses to let a grim room stay grim for long.',
    ideal:'Joy. Hope is not frivolous when it gives people the courage to keep moving.',
    bond:'A good story should leave its heroes with more choices than they had at the beginning.',
    flaw:'Sometimes keeps performing after the moment calls for silence.'
  })
});

export function getPregenSheetMetadata(id){return pregenSheetMetadata[id]||freeze({alignment:'Unaligned / player choice',personality:'Player choice',ideal:'Player choice',bond:'Player choice',flaw:'Player choice'});}
