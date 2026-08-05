export const DND_CARDS_SOURCE = Object.freeze({
  repository: "cbw29512/DNDCards",
  commit: "5395c9eb70ec8011df53f0ecdb5125485a6c8092",
  moduleUrl: "https://cdn.jsdelivr.net/gh/cbw29512/DNDCards@5395c9eb70ec8011df53f0ecdb5125485a6c8092/src/data.js",
  assetBaseUrl: "https://cdn.jsdelivr.net/gh/cbw29512/DNDCards@5395c9eb70ec8011df53f0ecdb5125485a6c8092/"
});

const kindAliases = Object.freeze({
  pc: "character",
  pregen: "character",
  creature: "monster",
  equipment: "item",
  magicItem: "item",
  rule: "rule"
});

const fallbackCards = Object.freeze([
  { id:"pc-wendy", kind:"character", title:"Wendy the Wishkeeper", playerText:"A warm-hearted hero who protects every shared wish.", dmText:"Pregenerated character from DungeonCards.", quickStats:["♥ 32","🛡 15","Initiative +3"] },
  { id:"pc-bob", kind:"character", title:"Bob the Brave", playerText:"A cheerful barbarian who treats every challenge like a party game.", dmText:"Pregenerated character from DungeonCards.", quickStats:["♥ 44","🛡 14","Initiative +2"] },
  { id:"pc-lumi", kind:"character", title:"Lumi Candlelight", playerText:"A quick-witted mage whose sparks smell faintly of vanilla.", dmText:"Pregenerated character from DungeonCards.", quickStats:["♥ 26","🛡 13","Initiative +4"] }
]);

const text = value => Array.isArray(value) ? value.join(" • ") : String(value ?? "");

export function resolveDungeonCardsAsset(value) {
  if (typeof value !== "string" || !value.trim()) return "🎴";
  const asset = value.trim();
  if (/^(?:https?:|data:|blob:)/i.test(asset)) return asset;
  if (asset.length < 8 && !/[/.]/.test(asset)) return asset;
  return new URL(asset.replace(/^\.\//, "").replace(/^\//, ""), DND_CARDS_SOURCE.assetBaseUrl).href;
}

export function normalizeDungeonCard(card) {
  const kind = kindAliases[card?.kind] || card?.kind || "card";
  const artSource = card?.art || card?.image || card?.imageUrl || card?.portrait || card?.frontImage || "🎴";
  return Object.freeze({
    id: String(card?.id || `dndcard-${crypto.randomUUID?.() || Math.random().toString(36).slice(2)}`),
    kind,
    title: String(card?.title || card?.name || "Untitled Card"),
    room: card?.room ?? null,
    playerText: text(card?.playerText || card?.summary || card?.description),
    dmText: text(card?.dmText || card?.rulesText || card?.notes),
    quickStats: Array.isArray(card?.quickStats) ? [...card.quickStats] : [],
    art: resolveDungeonCardsAsset(artSource),
    artSource,
    source: "DungeonCards",
    sourceCommit: DND_CARDS_SOURCE.commit,
    raw: card
  });
}

export function normalizeCatalog(cards = []) {
  const byId = new Map();
  cards.forEach(card => {
    const normalized = normalizeDungeonCard(card);
    if (!byId.has(normalized.id)) byId.set(normalized.id, normalized);
  });
  return [...byId.values()].sort((a,b) => a.kind.localeCompare(b.kind) || a.title.localeCompare(b.title));
}

let catalogPromise;
export async function loadDungeonCardsCatalog() {
  if (!catalogPromise) catalogPromise = import(DND_CARDS_SOURCE.moduleUrl)
    .then(module => normalizeCatalog(module.allCards || [...(module.cards || []), ...(module.characters || []), ...(module.events || [])]))
    .catch(error => {
      console.warn("DungeonCards catalog could not be loaded; using the committed fallback set.", error);
      return normalizeCatalog(fallbackCards);
    });
  return catalogPromise;
}

export function catalogCounts(cards) {
  return cards.reduce((counts, card) => {
    counts.total += 1;
    counts[card.kind] = (counts[card.kind] || 0) + 1;
    return counts;
  }, { total:0 });
}

export function filterCatalog(cards, { kind="all", search="" } = {}) {
  const query = search.trim().toLowerCase();
  return cards.filter(card => (kind === "all" || card.kind === kind) && (!query || `${card.title} ${card.kind} ${card.playerText} ${card.dmText}`.toLowerCase().includes(query)));
}
