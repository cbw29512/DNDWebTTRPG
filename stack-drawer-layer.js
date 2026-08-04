function positionStackDrawers(){
  document.querySelectorAll('.card-stack.expanded').forEach(stack=>{
    const toggle=stack.querySelector('.stack-toggle');
    const drawer=stack.querySelector('.stack-drawer');
    if(!toggle||!drawer)return;

    const rect=toggle.getBoundingClientRect();
    const margin=12;
    const gap=8;
    const availableWidth=Math.max(240,window.innerWidth-margin-Math.max(margin,rect.left));
    const desired=Math.min(900,Math.max(320,drawer.scrollWidth||320),availableWidth);
    const left=Math.max(margin,Math.min(rect.left,window.innerWidth-desired-margin));
    const top=Math.max(margin,rect.bottom+gap);
    const availableHeight=Math.max(180,window.innerHeight-top-margin);

    drawer.style.setProperty('--stack-drawer-left',`${Math.round(left)}px`);
    drawer.style.setProperty('--stack-drawer-top',`${Math.round(top)}px`);
    drawer.style.setProperty('--stack-drawer-width',`${Math.round(desired)}px`);
    drawer.style.setProperty('--stack-drawer-max-height',`${Math.round(availableHeight)}px`);
  });
}

function dismissExpandedStack(event){
  if(!document.querySelector('.card-stack.expanded'))return;
  if(event.target.closest('.card-stack,.stack-drawer,.large-card-modal,.picker-backdrop'))return;
  const toggle=document.querySelector('.card-stack.expanded .stack-toggle');
  toggle?.click();
}

let frame=0;
function schedule(){
  cancelAnimationFrame(frame);
  frame=requestAnimationFrame(positionStackDrawers);
}

new MutationObserver(schedule).observe(document.documentElement,{childList:true,subtree:true});
window.addEventListener('resize',schedule);
window.addEventListener('scroll',schedule,true);
document.addEventListener('click',event=>{
  dismissExpandedStack(event);
  schedule();
},true);
schedule();
