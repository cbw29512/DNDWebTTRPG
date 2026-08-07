const isPlayer=document.querySelector('meta[name="living-table-role"]')?.content==='player';
if(isPlayer){
  const app=document.querySelector('#app');
  const park=table=>{
    if(!table)return;
    document.body.classList.add('live-remote-connected');
    const panel=document.querySelector('.live-session-panel');
    if(panel&&table.parentElement!==document.body)panel.insertAdjacentElement('afterend',table);
    else if(!table.isConnected)document.body.append(table);
  };
  if(app)new MutationObserver(records=>{
    for(const record of records){
      for(const removed of record.removedNodes){
        if(!(removed instanceof Element))continue;
        const table=removed.matches?.('.remote-live-table')?removed:removed.querySelector?.('.remote-live-table');
        if(table)park(table);
      }
    }
    const live=document.querySelector('#app .remote-live-table');
    if(live)park(live);
  }).observe(app,{childList:true,subtree:true});
  window.addEventListener('living-table:session-updated',()=>{
    const live=document.querySelector('#app .remote-live-table');
    if(live)park(live);
  });
}
