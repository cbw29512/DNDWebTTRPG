const PACKS = Object.freeze({
  "wishing-cake": "packs/wishing-cake/1.0.0/manifest.json",
  "wish-cake-001": "packs/wishing-cake/1.0.0/manifest.json"
});

const normalizeCode = value => String(value ?? "").trim().toLowerCase();
const params = new URLSearchParams(location.search);
const requested = normalizeCode(params.get("pack") || params.get("code"));
const saved = normalizeCode(localStorage.getItem("dndweb:lastAdventurePack"));
const packKey = PACKS[requested] ? requested : PACKS[saved] ? saved : "wishing-cake";

async function fetchManifest(key) {
  const path = PACKS[key];
  if (!path) throw new Error("Adventure code not recognized.");
  const response = await fetch(path, { cache: "no-store" });
  if (!response.ok) throw new Error(`Adventure manifest failed to load (${response.status}).`);
  const manifest = await response.json();
  if (![1, 2].includes(manifest.schemaVersion) || !manifest.releaseId || !manifest.entrySceneId) {
    throw new Error("Adventure manifest is incomplete or incompatible.");
  }
  if (manifest.schemaVersion >= 2 && (!manifest.scenes?.every(scene => scene.locationId && scene.siteId && scene.roomId && scene.sceneCardId))) {
    throw new Error("Adventure spatial hierarchy is incomplete.");
  }
  return manifest;
}

function countLine(counts) {
  return [
    counts.locations !== undefined ? `${counts.locations} location` : null,
    counts.sites !== undefined ? `${counts.sites} sites` : null,
    `${counts.rooms} areas`,
    counts.scenes !== undefined ? `${counts.scenes} scenes` : null,
    `${counts.npcs} NPCs`, `${counts.monsters} monsters`,
    `${counts.hazards} hazards`, `${counts.items} items`, `${counts.quests} quests`
  ].filter(Boolean).join(" · ");
}

function showLoader(manifest) {
  const wrapper = document.createElement("div");
  wrapper.className = "adventure-loader-backdrop";
  wrapper.innerHTML = `<section class="adventure-loader" role="dialog" aria-modal="true" aria-labelledby="pack-title">
    <small>ADVENTURE MASTER CARD</small>
    <h1 id="pack-title">${manifest.title}</h1>
    <p>${manifest.subtitle}</p>
    <div class="pack-meta"><span>Level ${manifest.recommendedLevel}</span><span>${manifest.playerCount} players</span><span>${manifest.estimatedHours} hours</span></div>
    <p class="pack-counts">${countLine(manifest.counts)}</p>
    <p class="pack-code">Adventure code: <strong>${manifest.adventureCode}</strong></p>
    <label>Rules edition<select data-pack-system>${manifest.systems.map(system => `<option value="${system}">${system === "dnd-2014" ? "D&D 2014 / SRD 5.1" : "D&D 2024 / SRD 5.2"}</option>`).join("")}</select></label>
    <div class="loader-actions"><button type="button" data-load-pack>Load Adventure</button><button type="button" data-preview-pack>Preview Only</button></div>
    <details><summary>Enter another adventure code</summary><form data-code-form><input name="code" autocomplete="off" placeholder="WISH-CAKE-001"><button>Open</button></form></details>
    <p class="loader-status" aria-live="polite"></p>
  </section>`;
  document.body.append(wrapper);

  const status = wrapper.querySelector(".loader-status");
  wrapper.querySelector("[data-code-form]").addEventListener("submit", event => {
    event.preventDefault();
    const code = normalizeCode(new FormData(event.currentTarget).get("code"));
    if (!PACKS[code]) { status.textContent = "That adventure code was not found."; return; }
    location.search = `?code=${encodeURIComponent(code)}`;
  });
  wrapper.querySelector("[data-preview-pack]").addEventListener("click", () => {
    status.textContent = "Preview mode leaves your current saved session unchanged.";
    wrapper.remove();
  });
  wrapper.querySelector("[data-load-pack]").addEventListener("click", () => {
    const system = wrapper.querySelector("[data-pack-system]").value;
    const record = { packId: manifest.packId, releaseId: manifest.releaseId, version: manifest.version, system, loadedAt: new Date().toISOString() };
    localStorage.setItem("dndweb:lastAdventurePack", manifest.packId);
    localStorage.setItem(`dndweb:adventure:${manifest.packId}`, JSON.stringify(record));
    window.__DND_ADVENTURE_PACK__ = Object.freeze({ ...manifest, selectedSystem: system });
    document.dispatchEvent(new CustomEvent("dnd:adventure-loaded", { detail: window.__DND_ADVENTURE_PACK__ }));
    wrapper.remove();
  });
}

try {
  const manifest = await fetchManifest(packKey);
  window.__DND_ADVENTURE_PACK__ = Object.freeze(manifest);
  const explicitLaunch = requested || params.get("launch") === "1";
  if (explicitLaunch) showLoader(manifest);
} catch (error) {
  console.error(error);
  const message = document.createElement("p");
  message.className = "adventure-load-error";
  message.textContent = `Adventure could not be loaded: ${error.message}`;
  document.body.prepend(message);
}

await import("./src/app.js");
