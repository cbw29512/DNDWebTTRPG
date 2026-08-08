import assert from 'node:assert/strict';
import fs from 'node:fs';

const dmHtml=fs.readFileSync('index.html','utf8');
const playerHtml=fs.readFileSync('player.html','utf8');
const css=fs.readFileSync('live-play-priority.css','utf8');

for(const html of [dmHtml,playerHtml]){
 assert.match(html,/board-first-live-play-20260805/);
 assert.match(html,/live-play-priority\.css\?v=board-first-live-3/);
 assert.ok(html.indexOf('live-play-priority.css')>html.indexOf('adventure-state-board.css'),'Live-play priority must load after board layout.');
 assert.match(html,/live-play-board-first/);
}
assert.match(dmHtml,/<body class="role-dm live-play-board-first">/);
assert.match(playerHtml,/<body class="role-player live-play-board-first live-player-awaiting">/);
assert.match(css,/grid-template-areas:[\s\S]*"topbar topbar"[\s\S]*"board board"/,'Always-used dice/topbar tools must precede the board on desktop.');
assert.match(css,/\.dm-workspace,body\.live-play-board-first #app \.player-layout\{display:contents!important;\}/);
for(const area of ['board','topbar','deck','initiative','player','quest'])assert.match(css,new RegExp(`grid-area:${area}`));
assert.match(css,/> \.local-session-bar \{order:20;\}/);
assert.match(css,/> \.scene-runtime \{order:21;\}/);
assert.match(css,/> \.library-hub \{order:22;\}/);
assert.match(css,/position:sticky;top:0;z-index:45/,'Dice bar must remain accessible during long board play.');
assert.match(css,/@media\(max-width:1000px\)[\s\S]*grid-template-areas:"topbar" "board"/,'Narrow layouts must keep tools above board.');
assert.match(css,/grid-template-columns:repeat\(2,minmax\(0,1fr\)\)/,'DM secondary panels must keep equal desktop columns.');
assert.match(css,/--live-secondary-panel-height:clamp\(420px, 52vh, 520px\)/);
assert.match(css,/\.adventure-deck \.deck-card-list\{flex:1 1 auto;min-height:0;max-height:none;overflow:auto;\}/,'Panel lists may scroll.');
assert.match(css,/\.turn-panel \.initiative\{flex:1 1 auto;min-height:0;overflow:auto;\}/,'Initiative panel list may scroll.');
assert.match(css,/--live-tarot-card-width:148px/);
assert.match(css,/#app \.tarot-card\{flex:0 0 var\(--live-tarot-card-width\);width:var\(--live-tarot-card-width\);min-width:var\(--live-tarot-card-width\);max-width:var\(--live-tarot-card-width\);\}/);
assert.match(css,/#app \.tarot-inner\{width:100%;aspect-ratio:2\.75 \/ 4\.75;\}/);
console.log('Live-play hierarchy passed: dice tools first, board primary, panels constrained, and cards fixed at tarot geometry.');
