const isDM=document.querySelector('meta[name="living-table-role"]')?.content==='dm';
let scheduled=false;
function applyCounts(){
 scheduled=false;if(!isDM)return;
 document.querySelectorAll('#app .card-stack').forEach(stack=>{
   const count=Number(stack.querySelector('.stack-count')?.textContent?.trim()||0);
   const front=stack.querySelector('.stack-toggle .tarot-card .tarot-front');
   if(!front)return;
   let badge=front.querySelector('.live-stack-quantity');
   if(count>1){
     if(!badge){badge=document.createElement('span');badge.className='live-stack-quantity';front.prepend(badge);}
     const text=`×${count} in play`;
     const label=`${count} copies in play`;
     if(badge.textContent!==text)badge.textContent=text;
     if(badge.getAttribute('aria-label')!==label)badge.setAttribute('aria-label',label);
   }else if(badge)badge.remove();
 });
}
function schedule(){if(scheduled)return;scheduled=true;requestAnimationFrame(applyCounts);}
const app=document.querySelector('#app');if(app)new MutationObserver(schedule).observe(app,{childList:true,subtree:true,characterData:true});
window.addEventListener('DOMContentLoaded',schedule);schedule();
