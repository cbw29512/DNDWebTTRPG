(() => {
const cardDetails = new Map();
let activeSource = null;

const escapeHtml = value => String(value)
  .replaceAll("&", "&amp;")
  .replaceAll("<", "&lt;")
  .replaceAll(">", "&gt;")
  .replaceAll('"', "&quot;")
  .replaceAll("'", "&#039;");

function cardKey(card) {
  return card.dataset.cardInstance || card.querySelector("[data-instance]")?.dataset.instance || card.dataset.cardId || card.querySelector("h3")?.textContent || crypto.randomUUID();
}

function controlKey(button, index) {
  const datasets = [
    ["cardRoll", button.dataset.cardRoll],
    ["removeInstance", button.dataset.removeInstance],
    ["reveal", button.dataset.reveal],
    ["flipCard", button.dataset.flipCard]
  ];
  const match = datasets.find(([, value]) => value);
  return match ? `${match[0]}:${match[1]}` : `control:${index}:${button.textContent?.trim() || "button"}`;
}

function rememberCard(card) {
  if (!(card instanceof HTMLElement) || card.dataset.modalReady === "true") return;
  const key = cardKey(card);
  const title = card.querySelector("h3")?.textContent?.trim() || "Adventure Card";
  const type = card.querySelector(".category-ribbon")?.textContent?.trim() || "Card";
  const front = card.querySelector(".tarot-front");
  const back = card.querySelector(".tarot-back");
  const controls = card.querySelector(".card-controls");
  const controlButtons = [...(controls?.querySelectorAll("button") || [])];
  const controlMap = new Map();

  controlButtons.forEach((button, index) => {
    const actionKey = controlKey(button, index);
    button.dataset.modalControlKey = actionKey;
    controlMap.set(actionKey, button);
  });

  cardDetails.set(key, {
    title,
    type,
    frontHtml: front?.innerHTML || `<h3>${escapeHtml(title)}</h3><p>No player-facing information available.</p>`,
    backHtml: back?.innerHTML || `<h3>${escapeHtml(title)}</h3><p>No card details available.</p>`,
    controlHtml: controls?.innerHTML || "",
    controlMap
  });

  card.dataset.modalKey = key;
  card.dataset.modalReady = "true";
  card.classList.add("image-only-card");

  if (front) {
    const art = front.querySelector(".card-art")?.outerHTML || `<div class="card-art">◇</div>`;
    const ribbon = front.querySelector(".category-ribbon")?.outerHTML || "";
    front.innerHTML = `${ribbon}${art}<h3>${escapeHtml(title)}</h3><span class="open-card-hint">Open full card</span>`;
  }

  back?.remove();
  controls?.remove();
  card.querySelector(".tarot-inner")?.classList.add("thumbnail-inner");
  card.setAttribute("role", "button");
  card.setAttribute("tabindex", "0");
  card.setAttribute("aria-label", `Open full ${title} card`);
}

function enhanceCards(root = document) {
  root.querySelectorAll?.(".tarot-card").forEach(rememberCard);
}

function closeModal() {
  document.querySelector(".large-card-backdrop")?.remove();
  document.body.classList.remove("modal-open");
  activeSource?.focus?.();
  activeSource = null;
}

function openModal(card) {
  const details = cardDetails.get(card.dataset.modalKey);
  if (!details) return;
  activeSource = card;
  closeModal();
  activeSource = card;

  const backdrop = document.createElement("div");
  backdrop.className = "large-card-backdrop";
  backdrop.dataset.modalCardKey = card.dataset.modalKey;
  backdrop.innerHTML = `<section class="large-card-modal" role="dialog" aria-modal="true" aria-labelledby="largeCardTitle">
    <header class="large-card-header">
      <div><small>${escapeHtml(details.type)}</small><h2 id="largeCardTitle">${escapeHtml(details.title)}</h2></div>
      <button type="button" class="large-card-close" aria-label="Close full card">×</button>
    </header>
    <div class="large-card-body">
      <div class="large-card-face-grid">
        <section class="large-card-face large-card-front"><h3>Player / Read-Aloud Side</h3>${details.frontHtml}</section>
        <section class="large-card-face large-card-back"><h3>Back / Full Details</h3>${details.backHtml}</section>
      </div>
    </div>
    <footer class="large-card-actions">${details.controlHtml}<button type="button" class="large-card-return">Close Card</button></footer>
  </section>`;
  document.body.append(backdrop);
  document.body.classList.add("modal-open");
  backdrop.querySelector(".large-card-close")?.focus();
}

function runModalControl(button) {
  const backdrop = button.closest(".large-card-backdrop");
  const details = cardDetails.get(backdrop?.dataset.modalCardKey);
  const key = button.dataset.modalControlKey;
  const original = key ? details?.controlMap.get(key) : null;
  if (!original) return false;
  original.click();
  return true;
}

document.addEventListener("click", event => {
  if (event.target.closest(".large-card-close, .large-card-return") || event.target.classList.contains("large-card-backdrop")) {
    closeModal();
    return;
  }

  const modalButton = event.target.closest(".large-card-modal button");
  if (modalButton) {
    if (runModalControl(modalButton)) closeModal();
    return;
  }

  const card = event.target.closest(".tarot-card.image-only-card");
  if (card) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openModal(card);
  }
}, true);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".tarot-card.image-only-card")) {
    event.preventDefault();
    event.stopImmediatePropagation();
    openModal(event.target);
  }
});

const observer = new MutationObserver(records => {
  for (const record of records) {
    record.addedNodes.forEach(node => {
      if (node instanceof HTMLElement) enhanceCards(node);
    });
  }
});
observer.observe(document.documentElement, { childList: true, subtree: true });
enhanceCards();
})();
