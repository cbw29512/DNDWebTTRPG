import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";

const [html, js, css] = await Promise.all([
  readFile("index.html", "utf8"),
  readFile("library-hub.js", "utf8"),
  readFile("library-hub.css", "utf8")
]);

assert.match(html, /library-hub\.css/);
assert.match(html, /library-hub\.js/);
assert.match(js, /DM Library/);
assert.match(js, /Player Library/);
assert.match(js, /Current Card Board/);
assert.match(js, /Upload Adventure JSON/);
assert.match(js, /Build One-Shot/);
assert.match(js, /Owned Item Cards/);
assert.match(js, /Adventure Invitations/);
assert.match(js, /Current Adventures/);
assert.match(js, /localStorage/);
assert.match(js, /application\/json/);
assert.match(css, /\.library-tabs/);
assert.match(css, /\.mini-item-card/);
console.log("library hub tests passed");
