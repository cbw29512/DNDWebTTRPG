export function installFakePeerTransport(){
  try{
    const rawGet=Storage.prototype.getItem;
    const rawSet=Storage.prototype.setItem;
    const rawRemove=Storage.prototype.removeItem;
    const rawClear=Storage.prototype.clear;
    const rawKey=Storage.prototype.key;
    const storagePrefix=()=>location.pathname.endsWith('/player.html')?'player::':'dm::';
    Storage.prototype.getItem=function(key){return this===window.localStorage?rawGet.call(this,`${storagePrefix()}${key}`):rawGet.call(this,key);};
    Storage.prototype.setItem=function(key,value){return this===window.localStorage?rawSet.call(this,`${storagePrefix()}${key}`,value):rawSet.call(this,key,value);};
    Storage.prototype.removeItem=function(key){return this===window.localStorage?rawRemove.call(this,`${storagePrefix()}${key}`):rawRemove.call(this,key);};
    Storage.prototype.clear=function(){
      if(this!==window.localStorage)return rawClear.call(this);
      const prefix=storagePrefix();const keys=[];
      for(let index=0;index<this.length;index+=1){const key=rawKey.call(this,index);if(key?.startsWith(prefix))keys.push(key);}
      for(const key of keys)rawRemove.call(this,key);
    };
  }catch(error){console.error('[Living Table test] Could not isolate fake device storage.',error);}

  class Emitter{
    constructor(){this.handlers=new Map();}
    on(name,fn){const list=this.handlers.get(name)||[];list.push(fn);this.handlers.set(name,list);return this;}
    emit(name,...args){for(const fn of this.handlers.get(name)||[])fn(...args);}
  }
  class FakeConnection extends Emitter{
    constructor(owner,peer){super();this.owner=owner;this.peer=peer;this.open=false;}
    send(data){if(this.open)this.owner.bus.postMessage({type:'data',from:this.owner.id,to:this.peer,data});}
    close(){if(!this.open)return;this.open=false;this.emit('close');this.owner.bus.postMessage({type:'close',from:this.owner.id,to:this.peer});}
  }
  class FakePeer extends Emitter{
    constructor(id){
      super();this.id=id||`fake-player-${Math.random().toString(36).slice(2)}`;this.connections=new Map();
      this.bus=new BroadcastChannel('living-table-fake-peer-bus');this.bus.onmessage=event=>this.receive(event.data||{});
      setTimeout(()=>this.emit('open',this.id),0);
    }
    connect(target){
      const conn=new FakeConnection(this,target);this.connections.set(target,conn);
      this.bus.postMessage({type:'connect',from:this.id,to:target});return conn;
    }
    receive(message){
      if(message.to!==this.id)return;
      if(message.type==='connect'){
        let conn=this.connections.get(message.from);
        if(!conn){conn=new FakeConnection(this,message.from);this.connections.set(message.from,conn);}
        this.emit('connection',conn);conn.open=true;setTimeout(()=>conn.emit('open'),0);
        this.bus.postMessage({type:'ack',from:this.id,to:message.from});return;
      }
      if(message.type==='ack'){
        const conn=this.connections.get(message.from);if(conn&&!conn.open){conn.open=true;conn.emit('open');}return;
      }
      if(message.type==='data'){this.connections.get(message.from)?.emit('data',message.data);return;}
      if(message.type==='close'){
        const conn=this.connections.get(message.from);if(conn?.open){conn.open=false;conn.emit('close');}
      }
    }
    destroy(){for(const conn of this.connections.values())if(conn.open)conn.close();this.connections.clear();this.bus.close();}
  }
  window.Peer=FakePeer;
}
