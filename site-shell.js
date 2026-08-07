import { renderWishingCakeArt } from './src/wishing-cake-art.js';

const role = document.querySelector('meta[name="living-table-role"]')?.content?.trim().toLowerCase() || '';
const params = new URLSearchParams(location.search);
const isPlayer = role === 'player';
const explicitDm = params.has('dm') || params.has('launch') || params.has('pack') || params.has('code');
const showHome = role === 'dm' && !explicitDm;
const hasSession = Boolean(localStorage.getItem('living-table-local-session-v1'));

function navMarkup() {
  const homeCurrent = showHome ? ' aria-current="page"' : '';
  const dmCurrent = !showHome && !isPlayer ? ' aria-current="page"' : '';
  const playerCurrent = isPlayer ? ' aria-current="page"' : '';
  return `<nav class="site-shell-nav" aria-label="The Living Table">
    <a class="site-shell-brand" href="./"${homeCurrent}><span class="site-shell-mark" aria-hidden="true">✦</span><span>The Living Table</span></a>
    <div class="site-shell-links">
      <a href="./"${homeCurrent}>Home</a>
      <a href="./?dm=1"${dmCurrent}>DM Table</a>
      ${!showHome && !isPlayer ? '<a href="#scene-runtime-title">Scenes</a>' : ''}
      <a href="./player.html"${playerCurrent}>Player Table</a>
    </div>
  </nav>`;
}

function landingMarkup() {
  const art = renderWishingCakeArt({
    id:'scene-stolen-wish',
    title:'The Stolen Wish',
    artKey:'scene-stolen-wish',
    artAlt:'A magical birthday cake being stolen in violet smoke inside a warm fantasy inn.'
  }, '✦');
  const resumeLabel = hasSession ? 'Resume DM Table' : 'Open DM Table';
  return `<main class="site-landing" id="home">
    <section class="landing-hero" aria-labelledby="landing-title">
      <div>
        <span class="landing-eyebrow">Card-driven tabletop play</span>
        <h1 id="landing-title">Run the adventure.<br><em>See the table.</em></h1>
        <p class="landing-lede">The Living Table turns a prepared tabletop adventure into a shared card board. The Dungeon Master controls scenes, encounters, reveals, initiative, and adventure state while players get a separate table containing only the information meant for them.</p>
        <div class="landing-actions">
          <a class="landing-action primary" href="./?launch=1">Run The Wishing Cake</a>
          <a class="landing-action" href="./?dm=1">${resumeLabel}</a>
          <a class="landing-action" href="./player.html">Open Player Table</a>
        </div>
        <p class="landing-note">Local playtest build: DM and Player views share the saved session when opened from the same browser profile. Remote-device synchronization is not part of this local prototype yet.</p>
      </div>
      <div class="landing-preview" aria-hidden="true">
        <article class="landing-preview-card">
          ${art}
          <div class="landing-preview-copy"><small>THE WISHING CAKE</small><h2>The Stolen Wish</h2><p>A birthday celebration becomes a card-driven rescue adventure through forgotten celebration halls.</p></div>
        </article>
      </div>
    </section>

    <section class="landing-section" id="how-it-works" aria-labelledby="how-title">
      <small>HOW IT WORKS</small>
      <h2 id="how-title">From adventure pack to live table in four steps.</h2>
      <div class="how-grid">
        <article class="how-card"><b>1</b><h3>Open the DM Table</h3><p>Choose the adventure and rules edition. The opening Location, Site, Area, NPCs, monsters, and rewards populate automatically.</p></article>
        <article class="how-card"><b>2</b><h3>Advance the Scene</h3><p>Use the DM Scene Control above the board. Loading a scene replaces the prepared spatial cards and encounter cards while preserving session state.</p></article>
        <article class="how-card"><b>3</b><h3>Run from the Cards</h3><p>Flip cards for full DM information, reveal player-safe cards, track initiative, use item resources, and keep the active quest visible.</p></article>
        <article class="how-card"><b>4</b><h3>Open the Player Table</h3><p>Use the Player Table link in another tab to give players a separate view without exposing DM-only card faces or controls.</p></article>
      </div>
    </section>

    <section class="landing-section landing-pack" aria-labelledby="pack-title">
      <div><small>READY TO PLAYTEST</small><h2 id="pack-title">The Wishing Cake</h2><p class="landing-lede">A whimsical dark-fantasy birthday one-shot built around Wendy's stolen wish, eight scenes, puzzles, hazards, optional roleplay, and a finale that can end through combat or reconciliation.</p><div class="landing-pack-meta"><span>Level 3</span><span>4–6 players</span><span>3–4 hours</span><span>D&D 2014 / 2024</span></div></div>
      <a class="landing-action primary" href="./?launch=1">Start Adventure</a>
    </section>
  </main>`;
}

function elementFromMarkup(markup) {
  const template = document.createElement('template');
  template.innerHTML = markup.trim();
  return template.content.firstElementChild;
}

const nav = elementFromMarkup(navMarkup());
const skip = document.querySelector('.skip');
if (skip) skip.insertAdjacentElement('afterend', nav);
else document.body.prepend(nav);

if (showHome) {
  document.body.classList.add('site-home-active');
  document.title = 'The Living Table — Card-Driven Tabletop Adventures';
  if (skip) {
    skip.href = '#how-it-works';
    skip.textContent = 'Skip to how it works';
  }
  document.body.append(elementFromMarkup(landingMarkup()));
}
