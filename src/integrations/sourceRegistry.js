export const SOURCE_KINDS = Object.freeze({
  CARD_PLATFORM: "card-platform",
  RULES_CATALOG: "rules-catalog",
  CHARACTER: "character",
  ENCOUNTER: "encounter",
  CAMPAIGN: "campaign",
  MAP: "map",
  PLAYER_DISPLAY: "player-display",
  CONTENT: "content",
  ART_PIPELINE: "art-pipeline"
});

export const sourceRegistry = Object.freeze([
  {
    repository: "cbw29512/DungeonCards",
    kinds: [SOURCE_KINDS.CARD_PLATFORM, SOURCE_KINDS.RULES_CATALOG, SOURCE_KINDS.CHARACTER, SOURCE_KINDS.ENCOUNTER],
    authority: "primary",
    importMode: "versioned-adapter",
    notes: "Canonical card/rules concepts and deterministic SRD exports. Never duplicate the catalogs by hand."
  },
  {
    repository: "cbw29512/monstercardforge",
    kinds: [SOURCE_KINDS.ENCOUNTER, SOURCE_KINDS.CAMPAIGN, SOURCE_KINDS.PLAYER_DISPLAY],
    authority: "workflow-pattern",
    importMode: "selective-adapter",
    notes: "Reuse privacy-safe player display, session, recovery, and handoff patterns."
  },
  {
    repository: "cbw29512/DNDCards",
    kinds: [SOURCE_KINDS.CARD_PLATFORM, SOURCE_KINDS.PLAYER_DISPLAY],
    authority: "ux-concept",
    importMode: "review-and-rebuild",
    notes: "Reuse battle-board and card-reveal interaction ideas; do not copy the application wholesale."
  },
  {
    repository: "cbw29512/CharacterForge",
    kinds: [SOURCE_KINDS.CHARACTER],
    authority: "legacy-workflow",
    importMode: "schema-adapter",
    notes: "Adapt character workflows and imports into the Living Table runtime schema."
  },
  {
    repository: "cbw29512/DungeonMaps",
    kinds: [SOURCE_KINDS.MAP],
    authority: "future-service",
    importMode: "architecture-review",
    notes: "Join/WebSocket concepts may help later; map canvas and fog are not assumed complete."
  },
  {
    repository: "cbw29512/dnd-campaign-portal",
    kinds: [SOURCE_KINDS.CAMPAIGN, SOURCE_KINDS.CONTENT],
    authority: "concept-source",
    importMode: "review-and-rebuild",
    notes: "Reuse campaign landing, roster, handout, and player-access ideas."
  },
  {
    repository: "cbw29512/DNDTeachingAdventureDemonsWrath",
    kinds: [SOURCE_KINDS.CONTENT],
    authority: "content-candidate",
    importMode: "license-and-content-review",
    notes: "Potential teaching encounter after originality and licensing review."
  },
  {
    repository: "cbw29512/DNDLanguageTranslator",
    kinds: [SOURCE_KINDS.CONTENT],
    authority: "optional-tool",
    importMode: "review-and-rebuild",
    notes: "Potential language-aware clue and handout cards after MVP."
  },
  {
    repository: "cbw29512/MonsterColoringBook",
    kinds: [SOURCE_KINDS.ART_PIPELINE, SOURCE_KINDS.CONTENT],
    authority: "asset-candidate",
    importMode: "provenance-review",
    notes: "Runtime must not depend on the local generation pipeline; assets require provenance metadata."
  }
]);

export const primarySourceFor = kind => {
  const match = sourceRegistry.find(source => source.authority === "primary" && source.kinds.includes(kind));
  return match?.repository ?? null;
};

export const validateSourceRegistry = registry => {
  if (!Array.isArray(registry) || registry.length === 0) throw new TypeError("Source registry must be a non-empty array.");

  const repositories = new Set();
  for (const source of registry) {
    if (!source.repository?.includes("/")) throw new TypeError("Each source requires an owner/repository identifier.");
    if (repositories.has(source.repository)) throw new RangeError(`Duplicate source repository: ${source.repository}`);
    repositories.add(source.repository);
    if (!Array.isArray(source.kinds) || source.kinds.length === 0) throw new TypeError(`${source.repository} requires at least one source kind.`);
    if (!source.importMode) throw new TypeError(`${source.repository} requires an import mode.`);
  }

  const primaryRulesSources = registry.filter(source => source.authority === "primary" && source.kinds.includes(SOURCE_KINDS.RULES_CATALOG));
  if (primaryRulesSources.length !== 1) throw new RangeError("Exactly one primary rules catalog source is required.");

  return true;
};
