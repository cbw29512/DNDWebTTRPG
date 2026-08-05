import { loadDungeonCardsCatalog } from './src/library/dndcards-catalog.js';

const placeholderArt = value => !value || value === '🎴' || (typeof value === 'string' && value.length < 8 && !/[/.]/.test(value));
const hasRules = card => Boolean(card.dmText || card.playerText || card.quickStats?.length || card.raw?.actions?.length || card.raw?.features?.length || card.raw?.traits?.length);
const badgePresent = card => Boolean(card.raw?.badge || card.raw?.rarity || card.raw?.challengeLabel || card.raw?.cr || card.raw?.level || card.kind);
const shorthandPresent = card => Boolean(card.quickStats?.length || card.raw?.actions?.length || card.raw?.abilities?.length || card.raw?.dc || card.raw?.damage || card.raw?.effect || card.raw?.rulesText || card.raw?.features || card.raw?.traits);

export function auditCard(card) {
  const issues=[];
  if (!card.id || /^dndcard-/.test(card.id)) issues.push('unstable or missing ID');
  if (!card.title || card.title === 'Untitled Card') issues.push('missing title');
  if (placeholderArt(card.artSource)) issues.push('missing production artwork');
  if (!badgePresent(card)) issues.push('missing CR, rarity, level, or type badge');
  if (!hasRules(card)) issues.push('empty rules back');
  if (!shorthandPresent(card)) issues.push('missing usable shorthand stats');
  if (card.kind === 'monster' && !(card.quickStats?.length || card.raw?.abilities?.length || card.raw?.actions?.length)) issues.push('monster lacks combat block');
  if (card.kind === 'character' && !(card.raw?.actions?.length || card.raw?.features?.length || card.quickStats?.length)) issues.push('character lacks playable actions/features');
  const blocking=issues.some(issue=>/missing title|unstable|empty rules back/.test(issue));
  const status=blocking?'blocked':issues.includes('missing production artwork')?'missing-art':issues.length?'needs-content':'ready';
  return { id:card.id,title:card.title,kind:card.kind,status,issues };
}

export function auditCatalog(cards) {
  const seen=new Set();
  const results=cards.map(card=>{
    const result=auditCard(card);
    if (seen.has(card.id)) result.issues.push('duplicate ID');
    seen.add(card.id);
    if (result.issues.includes('duplicate ID')) result.status='blocked';
    return result;
  });
  const counts=results.reduce((out,result)=>{out.total+=1;out[result.status]=(out[result.status]||0)+1;out.byKind[result.kind]=(out.byKind[result.kind]||0)+1;return out;},{total:0,ready:0,'needs-content':0,'missing-art':0,blocked:0,byKind:{}});
  return {counts,results};
}

const esc=value=>String(value??'').replace(/[&<>"']/g,c=>({'&':'&amp;','<':'&lt;','>':'&gt;','"':'&quot;',"'":'&#039;'}[c]));
function reportMarkup(report){
  const problem=report.results.filter(item=>item.status!=='ready');
  return `<section class="library-section card-quality-audit" data-quality-report-mounted="true"><header class="library-heading"><div><small>SELLABLE CARD QUALITY GATE</small><h3>All-card audit</h3><p>${report.counts.total} imported cards checked. A card is not considered production-ready while it lacks artwork, game shorthand, a stable ID, or a usable back.</p></div></header><div class="quality-counts"><span><b>${report.counts.ready}</b> Ready</span><span><b>${report.counts['missing-art']}</b> Missing art</span><span><b>${report.counts['needs-content']}</b> Needs content</span><span><b>${report.counts.blocked}</b> Blocked</span></div><details><summary>${problem.length} cards still need work</summary><div class="quality-list">${problem.slice(0,250).map(item=>`<article class="quality-row status-${item.status}"><div><strong>${esc(item.title)}</strong><small>${esc(item.kind)} · ${esc(item.id)}</small></div><span>${esc(item.status.replace('-',' '))}</span><p>${item.issues.map(esc).join(' · ')}</p></article>`).join('')||'<p>Every imported card passed the current automated checks.</p>'}</div></details></section>`;
}

let report;
let mountQueued=false;
function mount() {
  mountQueued=false;
  if (!report) return;
  const panel=document.querySelector('#library-panel');
  const dmActive=Boolean(document.querySelector('.library-tabs [data-library-tab="dm"].active'));
  if (!panel || panel.hidden || !dmActive || panel.querySelector('[data-quality-report-mounted="true"]')) return;
  panel.insertAdjacentHTML('afterbegin',reportMarkup(report));
}
function scheduleMount() {
  if (mountQueued) return;
  mountQueued=true;
  requestAnimationFrame(mount);
}

loadDungeonCardsCatalog().then(cards=>{
  report=auditCatalog(cards);
  window.DNDCardQualityAudit=report;
  scheduleMount();
  console.table(report.counts);
});

const libraryHub=document.querySelector('.library-hub');
if (libraryHub) {
  new MutationObserver(records=>{
    const needsMount=records.some(record=>[...record.addedNodes].some(node=>node.nodeType===1 && (node.matches?.('#library-panel, [data-library-tab="dm"]') || node.querySelector?.('#library-panel, [data-library-tab="dm"]'))));
    if (needsMount || !document.querySelector('[data-quality-report-mounted="true"]')) scheduleMount();
  }).observe(libraryHub,{childList:true,subtree:true,attributes:true,attributeFilter:['class','hidden']});
}
document.addEventListener('click',event=>{
  if (event.target.closest('[data-library-tab="dm"]')) setTimeout(scheduleMount,0);
});
