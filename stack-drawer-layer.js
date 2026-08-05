function positionStackDrawers(){
  document.querySelectorAll('.card-stack.expanded').forEach(stack=>{
    const toggle=stack.querySelector('.stack-toggle');
    const drawer=stack.querySelector('.stack-drawer');
    if(!toggle||!drawer)return;

    const rect=toggle.getBoundingClientRect();
    const margin=12;
    const gap=10;
    const viewportWidth=Math.max(320,window.innerWidth);
    const viewportHeight=Math.max(320,window.innerHeight);
    const desiredWidth=Math.min(900,Math.max(320,drawer.scrollWidth||320),viewportWidth-(margin*2));
    const naturalHeight=Math.min(
      620,
      Math.max(180,drawer.scrollHeight||180),
      viewportHeight-(margin*2)
    );

    const belowTop=rect.bottom+gap;
    const aboveTop=rect.top-gap-naturalHeight;
    const fitsBelow=belowTop+naturalHeight<=viewportHeight-margin;
    const fitsAbove=aboveTop>=margin;
    const preferAbove=rect.bottom>viewportHeight*.55&&fitsAbove;
    const top=preferAbove
      ? aboveTop
      : fitsBelow
        ? belowTop
        : fitsAbove
          ? aboveTop
          : Math.max(margin,Math.min(belowTop,viewportHeight-naturalHeight-margin));
    const availableHeight=Math.max(180,viewportHeight-top-margin);

    drawer.style.setProperty('--stack-drawer-top',`${Math.round(top)}px`);
    drawer.style.setProperty('--stack-drawer-width',`${Math.round(desiredWidth)}px`);
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
