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

function rememberCard(card) {
  if (!(card instanceof HTMLElement) || card.dataset.modalReady === "true") return;
  const key = cardKey(card);
  const title = card.querySelector("h3")?.textContent?.trim() || "Adventure Card";
  const type = card.querySelector(".category-ribbon")?.textContent?.trim() || "Card";
  const back = card.querySelector(".tarot-back");
  const controls = card.querySelector(".card-controls");

  cardDetails.set(key, {
    title,
    type,
    backHtml: back?.innerHTML || `<h3>${escapeHtml(title)}</h3><p>No card details available.</p>`,
    controlHtml: controls?.innerHTML || ""
  });

  card.dataset.modalKey = key;
  card.dataset.modalReady = "true";
  card.classList.add("image-only-card");

  const front = card.querySelector(".tarot-front");
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
  activeSource?.focus?.();
  activeSource = null;
}

function openModal(card) {
  const details = cardDetails.get(card.dataset.modalKey);
  if (!details) return;
  activeSource = card;

  const backdrop = document.createElement("div");
  backdrop.className = "large-card-backdrop";
  backdrop.innerHTML = `<section class="large-card-modal" role="dialog" aria-modal="true" aria-labelledby="largeCardTitle">
    <header class="large-card-header">
      <div><small>${escapeHtml(details.type)}</small><h2 id="largeCardTitle">${escapeHtml(details.title)}</h2></div>
      <button type="button" class="large-card-close" aria-label="Close full card">×</button>
    </header>
    <div class="large-card-body">${details.backHtml}</div>
    <footer class="large-card-actions">${details.controlHtml}<button type="button" class="large-card-return">Close Card</button></footer>
  </section>`;
  document.body.append(backdrop);
  backdrop.querySelector(".large-card-close")?.focus();
}

document.addEventListener("click", event => {
  if (event.target.closest(".large-card-close, .large-card-return") || event.target.classList.contains("large-card-backdrop")) {
    closeModal();
    return;
  }

  const modalButton = event.target.closest(".large-card-modal button");
  if (modalButton) {
    const instance = modalButton.dataset.instance;
    const action = modalButton.dataset.cardRoll;
    if (instance && action) {
      const original = [...document.querySelectorAll(`[data-card-roll="${action}"]`)].find(button => button.dataset.instance === instance);
      original?.click();
      closeModal();
    }
    return;
  }

  const card = event.target.closest(".tarot-card.image-only-card");
  if (card) {
    event.preventDefault();
    event.stopPropagation();
    openModal(card);
  }
}, true);

document.addEventListener("keydown", event => {
  if (event.key === "Escape") closeModal();
  if ((event.key === "Enter" || event.key === " ") && event.target.matches(".tarot-card.image-only-card")) {
    event.preventDefault();
    event.stopPropagation();
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
