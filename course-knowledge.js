'use strict';
var CourseKnowledge = (()=>{
  const memory=typeof MemoryScheduler!=='undefined'?MemoryScheduler:require('./memory-scheduler');
  function create(groups){
    const index=new Map();
    for(const group of groups){
      const peers=group.ids.map(id=>({id,pack:id.includes(':')?id.slice(0,id.indexOf(':')):'top'}));
      for(const {id}of peers)index.set(id,{key:group.key,peers});
    }
    function mark(card,id){
      const group=index.get(id);
      if(group)card.meaningKey=group.key;
      else delete card.meaningKey;
    }
    function seed({state,settings,pool,progress,learned,progressKey,now}){
      if(settings.pack==='pics'||settings.base===settings.target||settings.pack?.startsWith('list:'))return 0;
      const cutoff=Number.isFinite(progress.knowledgeResetAt)?progress.knowledgeResetAt:-Infinity;
      let imported=0;
      for(const word of pool){
        if(Object.hasOwn(progress.cards,word.id))continue;
        const group=index.get(word.id);
        if(!group)continue;
        let latest=null;
        for(const peer of group.peers){
          const key=progressKey({...settings,pack:peer.pack});
          const card=state.progress[key]?.cards?.[peer.id];
          if(!card||card.meaningKey&&card.meaningKey!==group.key)continue;
          const right=card.right??0,wrong=card.wrong??0;
          if(!Number.isFinite(right)||right<0||!Number.isFinite(wrong)||wrong<0||right+wrong===0)continue;
          const at=Number.isFinite(card.time)?card.time:card.memory?.last;
          if(!Number.isFinite(at)||at>now||at<=cutoff)continue;
          // Recent failure is stronger evidence than older confidence in another course.
          if(!latest||at>latest.at||at===latest.at&&!learned(card)&&learned(latest.card)
            ||at===latest.at&&learned(card)===learned(latest.card)&&card.lvl<latest.card.lvl)latest={card,key,id:peer.id,at};
        }
        if(!latest||!learned(latest.card))continue;
        const source=JSON.parse(JSON.stringify(latest.card));
        const previous=memory.ensure(source,now);
        // Carry scheduling evidence, not invented answers or duplicate review events.
        progress.cards[word.id]={lvl:source.lvl,ok:true,right:0,wrong:0,task:progress.task,time:latest.at,
          ...(source.verify?{verify:true}:{}),meaningKey:group.key,
          memory:{...previous,log:[],estimated:true},sharedFrom:{key:latest.key,id:latest.id,at:latest.at}};
        imported++;
      }
      return imported;
    }
    return {seed,mark};
  }
  const groups=typeof SHARED_WORD_GROUPS!=='undefined'?SHARED_WORD_GROUPS:require('./shared-word-groups');
  return {...create(groups),create};
})();
if(typeof module!=='undefined')module.exports=CourseKnowledge;
