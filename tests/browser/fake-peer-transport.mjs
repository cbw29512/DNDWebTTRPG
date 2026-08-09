export function installFakePeerTransport(){
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
