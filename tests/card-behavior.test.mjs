import assert from 'node:assert/strict';
import fs from 'node:fs';

const app = fs.readFileSync('src/app.js', 'utf8');
const schema = fs.readFileSync('src/schema.js', 'utf8');
const encounter = fs.readFileSync('src/encounter.js', 'utf8');
const wishingCake = fs.readFileSync('src/wishing-cake-cards.js', 'utf8');
const modal = fs.readFileSync('card-modal.js', 'utf8');
const questTracker = fs.readFileSync('quest-tracker.js', 'utf8');

assert.match(schema, /LOCATION:"location"/);
assert.match(schema, /OBJECTIVE:"objective"/);
assert.match(app, /slot\.accepts\.includes\(card\.type\)/);
assert.match(app, /That card type does not belong in this slot/);
assert.match(app, /Click a placed card to open its full readable version/);
assert.match(modal, /Open full card/);
assert.doesNotMatch(modal, /!event\.target\.closest\("\.stack-toggle"\)/);
assert.match(encounter, /wishingCakeCards/);
assert.match(wishingCake, /openingDialogue/);
assert.match(wishingCake, /Birthday Spark Candle Tokens/);
assert.match(wishingCake, /uses: \{ max: 3, label: "candle tokens" \}/);
assert.match(wishingCake, /Healing Candy/);
assert.match(app, /usesRemaining/);
assert.match(app, /use-charge/);
assert.match(app, /restore-charge/);
assert.match(app, /DM FULL CARD/);
assert.match(app, /PLAYER CARD/);
assert.match(questTracker, /objectiveCards/);
assert.match(questTracker, /revealedQuests/);
assert.match(questTracker, /data-add-side-quest/);

console.log('Slot-linked cards, role-safe full cards, NPC dialogue, item uses, and quest tracking are protected.');
