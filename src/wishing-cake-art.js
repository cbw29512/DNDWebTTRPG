const aliases = Object.freeze({
  location: 'bramblewick',
  'site-wishing-cake-inn': 'wishing-cake-inn',
  'site-celebration-halls': 'old-celebration-halls',
  room: 'grand-celebration-hall',
  'room-holding-cells': 'scene-holding-cells',
  'room-wish-hall': 'scene-wish-hall',
  'room-soul-cellar': 'scene-soul-cellar',
  'room-pinata-pen': 'scene-pinata-pen',
  'room-wrapping': 'scene-wrapping-room',
  'room-cult': 'scene-cult-room',
  'room-cake-chamber': 'scene-cake-chamber',
  caretaker: 'martha-bramblepot',
  'npc-boris': 'boris-ironladle',
  'npc-pip': 'pip-underbough',
  'npc-lute': 'lute-merriweather',
  'npc-merrit': 'merrit-vale',
  'npc-sepulchral': 'sepulchral',
  priest: 'animated-present',
  skeleton: 'paper-plate-mimic',
  lantern: 'birthday-spark-candles',
  treasure: 'stolen-present-table',
  'item-wish-crown': 'wish-crown',
  'item-candy': 'healing-candy'
});

const palettes = Object.freeze({
  warm: ['#2a130f','#713221','#ffcc73','#fff0bd'],
  violet: ['#170f2d','#4e286b','#ca8cff','#ffe0ff'],
  cold: ['#101c2c','#24485e','#82d8e9','#e7fbff'],
  ghost: ['#10221f','#275d50','#8be1bd','#e5fff5'],
  candy: ['#29132c','#8f2e68','#ff7fb1','#ffe08b'],
  machine: ['#161b24','#424b58','#f4c96a','#e9f0f7'],
  boss: ['#190f1f','#46203f','#9ce66f','#ffe78d'],
  treasure: ['#241807','#725019','#ffd76e','#fff4bd'],
  city: ['#111b2b','#324768','#f2b85a','#f4e6c5']
});

const scenePalette = key => {
  if (/holding|plate/.test(key)) return palettes.cold;
  if (/soul|merrit/.test(key)) return palettes.ghost;
  if (/pinata|candy/.test(key)) return palettes.candy;
  if (/wrapping|machine/.test(key)) return palettes.machine;
  if (/cake-chamber|sepulchral|wish-circle/.test(key)) return palettes.boss;
  if (/crown|present-table|spark/.test(key)) return palettes.treasure;
  if (/bramblewick|celebration-halls/.test(key)) return palettes.city;
  if (/wish-hall|stolen-wish|cult/.test(key)) return palettes.violet;
  return palettes.warm;
};

const confetti = (accent, pale) => `
  <g opacity=".9" stroke-linecap="round">
    <path d="M18 26l9 5M48 16l-3 9M208 24l-8 6M188 13l2 10M218 70l8-2M25 104l-8 5" stroke="${accent}" stroke-width="4"/>
    <circle cx="61" cy="31" r="3" fill="${pale}"/><circle cx="198" cy="95" r="3" fill="${pale}"/><circle cx="34" cy="74" r="2.5" fill="${pale}"/>
  </g>`;

const cake = (accent, pale) => `
  <g transform="translate(73 61)">
    <ellipse cx="47" cy="67" rx="55" ry="10" fill="#08090d" opacity=".45"/>
    <rect x="2" y="35" width="90" height="34" rx="8" fill="#f4c98b"/>
    <rect x="13" y="14" width="68" height="28" rx="7" fill="#ffe1ad"/>
    <path d="M14 26c9 9 17-7 26 1s18-7 27 1 13-2 14-3v9H14z" fill="${accent}" opacity=".75"/>
    <g stroke="${pale}" stroke-width="3"><path d="M24 14V1M47 14V-2M70 14V1"/></g>
    <g fill="#ffd164"><path d="M24 0c-5-6 2-12 0-15 8 7 5 12 0 15z"/><path d="M47-3c-5-6 2-12 0-15 8 7 5 12 0 15z"/><path d="M70 0c-5-6 2-12 0-15 8 7 5 12 0 15z"/></g>
  </g>`;

const gift = (x,y,scale,accent,pale) => `<g transform="translate(${x} ${y}) scale(${scale})"><rect x="0" y="13" width="58" height="47" rx="5" fill="${pale}"/><rect x="25" y="13" width="9" height="47" fill="${accent}"/><rect x="-4" y="4" width="66" height="15" rx="4" fill="${accent}"/><path d="M29 8C18-10 5 0 15 12M29 8C40-10 54 0 44 12" fill="none" stroke="${pale}" stroke-width="5" stroke-linecap="round"/></g>`;

const bars = pale => `<g stroke="${pale}" stroke-width="7" opacity=".82"><path d="M47 18v117M83 18v117M119 18v117M155 18v117M191 18v117"/><path d="M38 40h163M38 116h163"/></g>`;

const bubbles = (accent,pale) => `<g fill="none" stroke="${pale}" opacity=".78"><circle cx="53" cy="49" r="23" stroke-width="3"/><circle cx="121" cy="39" r="29" stroke-width="3"/><circle cx="184" cy="62" r="25" stroke-width="3"/><circle cx="87" cy="104" r="19" stroke-width="3"/><circle cx="158" cy="111" r="22" stroke-width="3"/></g><g fill="${accent}" opacity=".7"><circle cx="47" cy="43" r="5"/><circle cx="113" cy="31" r="7"/><circle cx="177" cy="55" r="6"/><circle cx="82" cy="99" r="4"/><circle cx="151" cy="105" r="5"/></g>`;

const drums = (accent,pale) => `<g transform="translate(27 60)">${[0,29,58,87,116,145,174].map((x,i)=>`<g transform="translate(${x} ${i%2?6:0})"><ellipse cx="12" cy="9" rx="12" ry="6" fill="${pale}"/><rect x="0" y="8" width="24" height="38" rx="6" fill="${i%2?accent:'#7f5a43'}"/><ellipse cx="12" cy="46" rx="12" ry="5" fill="#160e12" opacity=".65"/></g>`).join('')}</g>`;

const conveyor = (accent,pale) => `<g transform="translate(20 70)"><path d="M0 20h200l-20 45H20z" fill="#313945" stroke="${pale}" stroke-width="3"/><g fill="${accent}">${[30,70,110,150,190].map(x=>`<circle cx="${x}" cy="42" r="12"/>`).join('')}</g><path d="M25 0c25 25 45-22 71 2s48-18 78 0" fill="none" stroke="${pale}" stroke-width="7" stroke-linecap="round"/><path d="M90-35l18 36M119-35L101 1" stroke="${accent}" stroke-width="5"/></g>`;

const barrelGhosts = (accent,pale) => `<g transform="translate(30 65)">${[0,60,120].map((x,i)=>`<g transform="translate(${x} ${i===1?-12:0})"><path d="M3 0h48l5 66H-2z" fill="#65462f" stroke="#a8784f" stroke-width="3"/><path d="M3 18h50M1 48h54" stroke="#c99b6d" stroke-width="4"/><ellipse cx="27" cy="29" rx="15" ry="19" fill="${pale}" opacity=".48"/><circle cx="22" cy="26" r="2.5" fill="${accent}"/><circle cx="32" cy="26" r="2.5" fill="${accent}"/><path d="M21 36q6 5 12 0" fill="none" stroke="${accent}" stroke-width="2"/></g>`).join('')}</g>`;

const wizard = (accent,pale) => `<g transform="translate(83 25)"><circle cx="37" cy="24" r="21" fill="#d5aa82"/><path d="M16 27q20-36 43 0v7H16z" fill="#28422d"/><path d="M17 49q20-16 40 0l15 69H2z" fill="#2e5c35"/><path d="M30 55l7 15 8-15" fill="${accent}"/><path d="M67 47l19 70" stroke="#7f5e3e" stroke-width="8" stroke-linecap="round"/><circle cx="86" cy="117" r="8" fill="${pale}" opacity=".8"/></g>`;

const mimicPlate = (accent,pale) => `<g transform="translate(68 35)"><circle cx="52" cy="42" r="42" fill="#f6eee0" stroke="${pale}" stroke-width="5"/><path d="M24 42q28 35 56 0-8 50-28 50S32 74 24 42z" fill="#4b1624"/><path d="M29 48l10 9 9-11 10 11 10-11 10 9" fill="none" stroke="#fff4da" stroke-width="6"/><circle cx="38" cy="31" r="5" fill="#1b1720"/><circle cx="67" cy="31" r="5" fill="#1b1720"/><path d="M18 89l-17 23M85 89l18 23" stroke="${accent}" stroke-width="7" stroke-linecap="round"/></g>`;

const unicorn = (accent,pale) => `<g transform="translate(50 36)"><path d="M35 18q28-24 58 5 25 25 8 61-16 33-61 22-27-7-31-34-5-31 26-54z" fill="${pale}"/><path d="M64 9L76-22 84 13" fill="${accent}"/><path d="M37 20q-22-22-31 1 17 2 23 18" fill="${accent}"/><circle cx="73" cy="42" r="5" fill="#20152a"/><path d="M21 70q35 22 75 3" fill="none" stroke="${accent}" stroke-width="8" stroke-dasharray="9 7"/><path d="M22 95l-8 28M84 98l11 25" stroke="${pale}" stroke-width="10" stroke-linecap="round"/></g>`;

const crown = (accent,pale) => `<g transform="translate(55 45)"><path d="M0 25L22 0l22 25L67-2l24 27 23-22 16 65H-8z" fill="${accent}" stroke="${pale}" stroke-width="5"/><circle cx="22" cy="25" r="5" fill="${pale}"/><circle cx="67" cy="23" r="5" fill="${pale}"/><circle cx="112" cy="25" r="5" fill="${pale}"/></g>`;

const candles = (accent,pale) => `<g transform="translate(65 46)">${[0,48,96].map((x,i)=>`<g transform="translate(${x} ${i===1?-9:0})"><rect x="0" y="23" width="22" height="60" rx="5" fill="${i===1?accent:pale}"/><path d="M11 22c-12-15 8-24 1-35 18 13 12 28-1 35z" fill="#ffd764"/></g>`).join('')}</g>`;

const person = (accent,pale,variant='person') => {
  const props = variant==='baker' ? '<path d="M33 3q21-16 42 0-5 8-21 6T33 3z" fill="#fff1d7"/><path d="M23 74h63v20H23z" fill="#f0dfc5" opacity=".9"/>' : variant==='bard' ? '<path d="M15 73q72-33 92 24" fill="none" stroke="#a96c3b" stroke-width="9"/><circle cx="96" cy="95" r="17" fill="#c98a45" stroke="#f7d393" stroke-width="4"/>' : variant==='stable' ? '<path d="M17 20h77" stroke="#795738" stroke-width="8"/><path d="M28 14q22-15 52 1" fill="#3a2a1d"/>' : '';
  return `<g transform="translate(67 24)"><circle cx="53" cy="31" r="28" fill="#d8aa83"/><path d="M25 65q28-16 56 0l17 65H8z" fill="${accent}"/><path d="M35 27q18-26 37 0" fill="none" stroke="#3a261e" stroke-width="8" stroke-linecap="round"/><circle cx="44" cy="33" r="3" fill="#241a18"/><circle cx="62" cy="33" r="3" fill="#241a18"/>${props}<path d="M27 80h53" stroke="${pale}" stroke-width="4" opacity=".7"/></g>`;
};

const city = (accent,pale,old=false) => `<g transform="translate(20 32)"><path d="M0 82h200v32H0z" fill="#0d1017" opacity=".58"/><path d="M10 82V36l25-18 22 18v46M62 82V18l28-15 28 15v64M124 82V31l25-20 23 20v51M177 82V43l15-12 8 7v44" fill="${old?'#2c3544':'#5e4634'}" stroke="${pale}" stroke-width="2"/><g fill="${accent}">${[24,43,78,98,139,157,187].map((x,i)=>`<rect x="${x}" y="${45+(i%3)*8}" width="8" height="11" rx="2"/>`).join('')}</g><path d="M0 91q48-18 95 0t105 0" fill="none" stroke="${accent}" stroke-width="3" opacity=".7"/></g>`;

const motifFor = (key, accent, pale) => {
  if (key==='bramblewick') return city(accent,pale,false)+confetti(accent,pale);
  if (key==='wishing-cake-inn' || key==='grand-celebration-hall') return cake(accent,pale)+confetti(accent,pale);
  if (key==='old-celebration-halls') return city(accent,pale,true);
  if (key==='scene-stolen-wish') return cake(accent,pale)+wizard(accent,pale)+confetti(accent,pale);
  if (key==='scene-holding-cells') return bars(pale)+mimicPlate(accent,pale);
  if (key==='scene-wish-hall') return bubbles(accent,pale);
  if (key==='scene-soul-cellar') return barrelGhosts(accent,pale);
  if (key==='scene-pinata-pen' || key==='pinata-mimic') return unicorn(accent,pale)+confetti(accent,pale);
  if (key==='scene-wrapping-room' || key==='wrapping-machine') return conveyor(accent,pale);
  if (key==='scene-cult-room') return drums(accent,pale)+confetti(accent,pale);
  if (key==='scene-cake-chamber' || key==='sepulchral') return `<circle cx="120" cy="88" r="54" fill="none" stroke="${accent}" stroke-width="5" stroke-dasharray="8 8" opacity=".75"/>`+cake(accent,pale)+wizard(accent,pale);
  if (key==='animated-present') return gift(74,43,1.5,accent,pale)+confetti(accent,pale);
  if (key==='paper-plate-mimic') return mimicPlate(accent,pale);
  if (key==='exploding-pinata') return unicorn(accent,pale)+`<g stroke="${accent}" stroke-width="6">${[0,45,90,135].map(a=>`<path d="M120 75l0-58" transform="rotate(${a} 120 75)"/>`).join('')}</g>`;
  if (key==='wish-circle') return `<circle cx="120" cy="76" r="55" fill="none" stroke="${accent}" stroke-width="7"/><circle cx="120" cy="76" r="37" fill="none" stroke="${pale}" stroke-width="3" stroke-dasharray="5 8"/>`+cake(accent,pale);
  if (key==='birthday-spark-candles') return candles(accent,pale);
  if (key==='wish-crown') return crown(accent,pale);
  if (key==='healing-candy') return `<g transform="translate(55 55)"><path d="M0 20l28-20 76 0 28 20-28 20H28z" fill="${accent}"/><rect x="28" y="0" width="76" height="40" rx="18" fill="${pale}"/><path d="M45 20h42" stroke="${accent}" stroke-width="8" stroke-linecap="round"/></g>`+confetti(accent,pale);
  if (key==='stolen-present-table') return gift(20,65,.85,accent,pale)+gift(90,45,1.1,accent,pale)+gift(165,72,.65,accent,pale);
  if (key==='martha-bramblepot') return person(accent,pale,'person');
  if (key==='boris-ironladle') return person(accent,pale,'baker');
  if (key==='pip-underbough') return person(accent,pale,'stable');
  if (key==='lute-merriweather') return person(accent,pale,'bard');
  if (key==='merrit-vale') return `<g opacity=".82">${person(accent,pale,'person')}</g><path d="M70 130q50 28 100 0" fill="none" stroke="${pale}" stroke-width="5" opacity=".5"/>`;
  return `<circle cx="120" cy="76" r="48" fill="${accent}" opacity=".22"/><path d="M78 104L120 38l42 66z" fill="none" stroke="${pale}" stroke-width="7"/><circle cx="120" cy="76" r="12" fill="${accent}"/>`;
};

const esc = value => String(value ?? '').replace(/[&<>"']/g, char => ({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[char]));

export function artKeyForCard(card) {
  return String(card?.artKey || aliases[card?.id] || card?.id || 'adventure-card').replace(/[^a-z0-9-]/gi,'-').toLowerCase();
}

export function renderWishingCakeArt(card, fallbackIcon='◇') {
  if (!card) return `<div class="card-art card-art-fallback" aria-hidden="true">${esc(fallbackIcon)}</div>`;
  const key = artKeyForCard(card);
  const [bg,mid,accent,pale] = scenePalette(key);
  const alt = card.artAlt || `${card.title || 'Adventure card'} illustrated fantasy card art`;
  const motif = motifFor(key,accent,pale);
  return `<div class="card-art card-art-illustrated art-${esc(key)}" data-art-key="${esc(key)}" role="img" aria-label="${esc(alt)}"><svg viewBox="0 0 240 150" focusable="false" aria-hidden="true" preserveAspectRatio="xMidYMid slice"><rect width="240" height="150" fill="${bg}"/><path d="M0 118Q55 82 112 111T240 94V150H0Z" fill="${mid}" opacity=".82"/><circle cx="204" cy="29" r="42" fill="${accent}" opacity=".11"/><circle cx="33" cy="132" r="53" fill="${pale}" opacity=".06"/>${motif}<rect x="3" y="3" width="234" height="144" rx="14" fill="none" stroke="${pale}" stroke-opacity=".27" stroke-width="2"/></svg></div>`;
}
