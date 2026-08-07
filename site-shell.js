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
  const resumeLabel = hasSession ? 'Resume DM Table' : 'Take the DM Seat';
  return `<main class="site-landing" id="home">
    <section class="landing-hero" aria-labelledby="landing-title">
      <div>
        <span class="landing-eyebrow">A shared card-driven tabletop RPG</span>
        <h1 id="landing-title">Run the adventure.<br><em>Together at one living table.</em></h1>
        <p class="landing-lede">The Living Table keeps the Dungeon Master and players in the same game at the same time. The DM runs the world, plays its creatures and characters, and reveals cards as the story changes. Players see and use the scenes, clues, threats, equipment, spells, and character information meant for them—without exposing DM-only information.</p>
        <p class="landing-heart"><strong>Cards replace page hunting, not roleplaying.</strong> They put the right rules and story information on the table when it matters so everyone can stay in the adventure.</p>
        <div class="landing-actions">
          <a class="landing-action primary" href="./?launch=1">Run The Wishing Cake</a>
          <a class="landing-action" href="./?dm=1">${resumeLabel}</a>
          <a class="landing-action" href="./player.html">Join as a Player</a>
        </div>
        <p class="landing-note">Current local playtest: DM and Player views share a saved session when opened from the same browser profile. Remote-device synchronization is not part of this prototype yet.</p>
      </div>
      <div class="landing-preview" aria-hidden="true">
        <article class="landing-preview-card">
          ${art}
          <div class="landing-preview-copy"><small>THE WISHING CAKE</small><h2>The Stolen Wish</h2><p>The DM reveals a stolen birthday wish, the party reacts, and the shared table changes as the adventure unfolds.</p></div>
        </article>
      </div>
    </section>

    <section class="landing-section" id="how-it-works" aria-labelledby="how-title">
      <small>HOW IT WORKS</small>
      <h2 id="how-title">From adventure pack to live table—together.</h2>
      <p class="landing-lede">The DM and players play simultaneously. Each role gets the information and controls it needs, while both sides stay anchored to the same scene, encounter, characters, and story.</p>
      <div class="how-grid">
        <article class="how-card"><b>1</b><h3>Sit Down Together</h3><p>Choose an adventure and rules edition. The DM takes the DM Table; each player takes the Player Table and their character. Everyone is now playing the same session.</p></article>
        <article class="how-card"><b>2</b><h3>The DM Plays the World</h3><p>The DM describes the scene, roleplays NPCs, runs monsters, adjudicates rules, and advances the adventure. DM-only notes and unrevealed information stay behind the screen.</p></article>
        <article class="how-card"><b>3</b><h3>Cards Enter Play</h3><p>Locations, creatures, clues, hazards, treasure, characters, equipment, and spells appear as usable game pieces. Reveal only what the party has discovered; keep secrets hidden until they matter.</p></article>
        <article class="how-card"><b>4</b><h3>Players Act on the Same Table</h3><p>Players use their character, equipment, spell, and revealed adventure cards to make decisions while the DM responds in real time. The table evolves with the story instead of sending everyone back to books and notes.</p></article>
      </div>
    </section>

    <section class="landing-section" aria-labelledby="cards-title">
      <small>THE HEART OF THE SYSTEM</small>
      <h2 id="cards-title">The cards are the shared language of play.</h2>
      <p class="landing-lede">A card is not just a reference image. It is a piece of the active game: something the DM can introduce, hide, reveal, use, track, or hand into the players' side of the table.</p>
      <div class="how-grid">
        <article class="how-card"><h3>Adventure Cards</h3><p>Scenes, locations, NPCs, monsters, traps, clues, quests, and treasure tell the table what is here and what can happen next.</p></article>
        <article class="how-card"><h3>Character Cards</h3><p>Pregens, attacks, equipment, resources, and spell cards keep the player's most-used mechanics immediately available without replacing the full character sheet.</p></article>
        <article class="how-card"><h3>Rules-Accurate Play</h3><p>Where the site presents D&D mechanics, those mechanics are structured and edition-aware. The interface should calculate or display the rule correctly rather than inventing a shortcut.</p></article>
        <article class="how-card"><h3>Built to Be Reusable</h3><p>The same card language is designed to support more adventures and, as the builder grows, let DMs assemble their own adventures from existing cards and create matching homebrew cards.</p></article>
      </div>
    </section>

    <section class="landing-section landing-pack" aria-labelledby="pack-title">
      <div><small>READY TO PLAYTEST</small><h2 id="pack-title">The Wishing Cake</h2><p class="landing-lede">A whimsical dark-fantasy birthday one-shot built around Wendy's stolen wish. The DM and players move through eight shared scenes with puzzles, hazards, roleplay, combat, and a finale that can end through force or reconciliation.</p><div class="landing-pack-meta"><span>Level 3</span><span>4–6 players</span><span>3–4 hours</span><span>D&D 2014 / 2024</span></div></div>
      <a class="landing-action primary" href="./?launch=1">Run The Wishing Cake</a>
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
  document.title = 'The Living Table — Shared Card-Driven Tabletop Adventures';
  if (skip) {
    skip.href = '#how-it-works';
    skip.textContent = 'Skip to how it works';
  }
  document.body.append(elementFromMarkup(landingMarkup()));
}
