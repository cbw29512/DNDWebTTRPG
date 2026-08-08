const role=document.querySelector('meta[name="living-table-role"]')?.content||'player';
const isDM=role==='dm';

const setText=(node,text)=>{
  if(node&&node.textContent!==text)node.textContent=text;
};

function playerGuide(){
  if(isDM||document.querySelector('.live-player-guide'))return;
  const panel=document.querySelector('.live-session-player');
  if(!panel)return;
  const guide=document.createElement('section');
  guide.className='live-player-guide';
  guide.innerHTML=`<strong>JOIN → CONFIRM CHARACTER → PLAY</strong><span>Enter the code from your DM. Your local character tools remain available, but the adventure table below stays hidden until the DM connection is live.</span>`;
  panel.insertAdjacentElement('afterend',guide);
}

function updatePlayerConnectionState(){
  if(isDM)return;
  const status=document.querySelector('[data-live-status]')?.textContent?.trim()||'';
  const connected=/^Connected to game\b/i.test(status);
  document.body.classList.toggle('live-player-connected',connected);
  document.body.classList.toggle('live-player-awaiting',!connected);
  const guide=document.querySelector('.live-player-guide');
  if(!guide)return;

  const connectedValue=String(connected);
  if(guide.dataset.connected!==connectedValue)guide.dataset.connected=connectedValue;
  setText(guide.querySelector('strong'),connected?'CONNECTED — YOU ARE AT THE DM’S TABLE':'JOIN → CONFIRM CHARACTER → PLAY');
  setText(guide.querySelector('span'),connected?'The adventure cards above are the DM’s live revealed table. Use your character sheet, equipment, spells, and resources below while you play.':'Enter the code from your DM. Your local character tools remain available, but the adventure table below stays hidden until the DM connection is live.');
}

function dmGuide(){
  if(!isDM)return;
  const panel=document.querySelector('.live-session-dm');
  if(!panel||panel.querySelector('[data-copy-player-link]'))return;
  const actions=panel.querySelector('.live-actions');
  if(!actions)return;
  const button=document.createElement('button');
  button.type='button';button.dataset.copyPlayerLink='';button.disabled=true;button.textContent='Copy Player Link';
  actions.append(button);
  const hint=document.createElement('p');
  hint.className='live-dm-guide';
  hint.innerHTML='<strong>HOST → SHARE → RUN THE WORLD</strong><span>Start the live game, share the code or player link, then reveal only what the party discovers.</span>';
  panel.append(hint);

  const update=()=>{
    const raw=panel.querySelector('[data-live-code]')?.textContent?.replace(/\s/g,'')||'';
    const disabled=!/^[A-Z2-9]{8}$/.test(raw);
    if(button.disabled!==disabled)button.disabled=disabled;
  };
  new MutationObserver(update).observe(panel,{childList:true,subtree:true,characterData:true});
  update();
  button.addEventListener('click',async()=>{
    const code=panel.querySelector('[data-live-code]')?.textContent?.replace(/\s/g,'')||'';
    if(!/^[A-Z2-9]{8}$/.test(code))return;
    const url=new URL('player.html',location.href);url.search=`?game=${encodeURIComponent(code)}`;
    try{
      await navigator.clipboard.writeText(url.href);
      const status=panel.querySelector('[data-live-status]');
      setText(status,'Player join link copied.');
    }catch(error){
      console.warn('[Living Table] Clipboard copy failed; falling back to manual copy.',error);
      prompt('Copy this player link:',url.href);
    }
  });
}

function mount(){playerGuide();dmGuide();updatePlayerConnectionState();}
new MutationObserver(mount).observe(document.body,{childList:true,subtree:true,characterData:true});
window.addEventListener('DOMContentLoaded',mount);
setTimeout(mount,100);
