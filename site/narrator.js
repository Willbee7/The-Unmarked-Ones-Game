/* THE UNMARKED ONES — FREEFORM ACTION BRIDGE
   A hosted narrator chooses an existing action or a limited side action.
   The engine, not the narrator, mutates canonical world state.
*/
'use strict';
const NARRATOR_ENDPOINT='/.netlify/functions/narrate';
function normalizeAction(text){return text.toLowerCase().replace(/[^a-z0-9 ]/g,' ').replace(/\s+/g,' ').trim();}
const SYNONYMS={
 attack:['attack','strike','hit','punch','beat','fight','slam','kick','stab','rush','charge','kill','hurt'],
 merciful:['spare','mercy','forgive','let go','no harm','not kill','leave alive','negotiate','talk','peace','reason','apologize'],
 stealth:['sneak','hide','sneaky','creep','steal','take unseen','shadow','quietly','wait','observe','study'],
 defend:['protect','save','defend','shield','rescue','help','civilians','children','family'],
 escape:['escape','flee','retreat','run away','leave','get out','avoid'],
 plan:['plan','map','think','study','analyze','rune','symbol','look','inspect','strategize','prepare']
};
function localInterpret(action,choices,scene){
 const a=normalizeAction(action);let keywords=new Set(a.split(' '));
 const score=(label)=>normalizeAction(label).split(' ').reduce((n,w)=>n+(w.length>3&&keywords.has(w)?2:0),0);
 const scores=choices.map(c=>score(c.label));
 let pick=-1, best=0;
 const negation=/\b(?:do not|dont|don t|won t|will not|not|no|never|refuse to|without)\s+(?:want to\s+|intend to\s+)?(?:kill|attack|hurt|fight|strike|stab|execute)\b/.test(a);
 const specific=scene==='training'?[
  {test:/\b(?:do not|dont|don t|won t|will not|not|no|never|refuse to|without)\s+(?:want to\s+|intend to\s+)?(?:kill|attack|hurt|fight|strike|stab|execute)\b/,index:0},
  {test:/talk|ask|peace|negotiate|return|give back|make him|spare|without hurting|no fight/,index:0},
  {test:/punch|slam|strike|hit|beat|fight|hurt|kill|attack|kick/,index:1},
  {test:/sneak|steal|wait|watch|observe|hide|unseen|study/,index:2}
 ]:scene==='guards_downed'?[
  {test:/\b(?:do not|dont|don t|won t|will not|not|no|never|refuse to|without)\s+(?:want to\s+|intend to\s+)?(?:kill|attack|hurt|fight|strike|stab|execute)\b/,index:0},
  {test:/kill|stab|execute|end his life|murder|finish him/,index:1},
  {test:/unconscious|knock him out|put him to sleep/,index:2},
  {test:/spare|mercy|leave alive|walk away|no kill|disarm/,index:0}
 ]:null;
 if(specific){for(const item of specific){if(item.test.test(a)&&item.index<choices.length){pick=item.index;break;}}}
 if(pick<0){for(let i=0;i<scores.length;i++){if(scores[i]>best){best=scores[i];pick=i;}}}
 // Match action themes to choice labels, but do not force nonsensical decisions.
 if(pick<0||best<3&& !specific){
  const themes=Object.entries(SYNONYMS).filter(([name,words])=>words.some(w=>a.includes(w))).map(([name])=>name);
  for(let i=0;i<choices.length;i++){
   const l=normalizeAction(choices[i].label);
   if(themes.includes('defend')&&/protect|help|rescue|civilians|spare|safe|defend/.test(l)){pick=i;break;}
   if(themes.includes('attack')&&/attack|kill|fight|strike|challenge|execute/.test(l)){pick=i;break;}
   if(themes.includes('escape')&&/leave|escape|run|retreat|flee/.test(l)){pick=i;break;}
   if(themes.includes('plan')&&/study|observe|map|rune|prepare/.test(l)){pick=i;break;}
  }
 }
 if(pick<0)return {option:'improvise',tone:'focus',passage:'Kael measured what could be done without mistaking a wish for a possibility. He tried a small part of the idea, watching for a response. For now, the larger situation remained unresolved.',source:'local'};
 return {option:String(pick),tone:'focus',passage:`Kael considered the idea: ${action.trim().replace(/[.!?]+$/,'').slice(0,180)}. His body moved before he could be entirely certain of the outcome. Around him, the world did not grow any less dangerous. Whatever followed would depend on the people and obstacles already before him.`,source:'local'};
}
function validNarratorResult(result,allowedCount){
 if(!result||typeof result!=='object'||typeof result.option!=='string'||typeof result.passage!=='string'||typeof result.tone!=='string')return false;
 if(!(result.option==='improvise'||(/^\d{1,2}$/.test(result.option)&&Number(result.option)<allowedCount)))return false;
 if(!['care','violence','focus','defiance','curiosity','none'].includes(result.tone))return false;
 if(result.passage.trim().length<30||result.passage.length>1600)return false;
 return true;
}
async function requestNarrator(action,scene,choices,state,paragraphs){
 const access=localStorage.getItem('unmarked-narrator-access')||'';
 if(!access)throw Error('No private narrator access code on this device');
 const payload={action,scene,options:choices.map((c,i)=>({id:String(i),label:c.label,detail:c.detail||''})),context:{
  description:paragraphs.map(x=>typeof x==='string'?x:x.text).join(' ').slice(0,2700),
  psychologicalProfile:{violence:state.mind.violence,care:state.mind.care,focus:state.mind.focus,grief:state.mind.grief,numbness:state.mind.numbness},
  visibleHistory:state.journal.slice(-5),lifeCount:state.introComplete?state.lives:0,introductionFinished:state.introComplete,
  memoryHints:state.introComplete?state.memories.slice(-2).map(m=>({cause:m.cause,feeling:m.feeling})):[]
 }};
 const controller=new AbortController();const timer=setTimeout(()=>controller.abort(),18000);
 try{
  const res=await fetch(NARRATOR_ENDPOINT,{method:'POST',headers:{'Content-Type':'application/json','X-Narrator-Access':access},body:JSON.stringify(payload),signal:controller.signal});
  if(!res.ok)throw Error('Narrator endpoint unavailable');
  const out=await res.json();
  if(!validNarratorResult(out,choices.length))throw Error('Narrator returned invalid response');
  if(!state.introComplete&&/\bremembering\b|\bprevious lives\b|\blives again\b/i.test(out.passage))throw Error('Premature spoiler');
  return {...out,source:'ai'};
 }finally{clearTimeout(timer);}
}
