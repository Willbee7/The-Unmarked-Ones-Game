/* THE UNMARKED ONES — INDEPENDENT WILL / STORY ENGINE
   State is saved locally, with physical consequences belonging to the current life and psychological changes carrying across lived experience.
*/
'use strict';
const STORAGE='unmarked-ones-living-novel-v2';
const $=id=>document.getElementById(id);
const copy=x=>JSON.parse(JSON.stringify(x));
const init=()=>({
 scene:'birth',introComplete:false,hp:40,supplies:1,
 mind:{violence:0,care:0,defiance:0,focus:0,grief:0,curiosity:0,rage:0,numbness:0,acceptance:0,bond:0},
 flags:[],knowledge:[],lives:0,memories:[],journal:[],
 anchor:null,lastCause:'',lastLearn:'',lastInterruption:null,
 readingScale:1,visited:[],pendingBeat:null,pendingTyped:null,lastTypedScene:null,improvCounts:{}
});
let state=init();
function rememberMark(tag){if(tag&&!state.flags.includes(tag))state.flags.push(tag);}
function note(h){state.journal.push(h);if(state.journal.length>90)state.journal.shift();}
function apply(effect){if(!effect)return;for(const [key,value]of Object.entries(effect)){
 if(key==='hp')state.hp=Math.min(40,Math.max(0,state.hp+value));
 else if(key==='supplies')state.supplies=Math.max(0,state.supplies+value);
 else if(typeof state.mind[key]==='number')state.mind[key]=Math.min(24,Math.max(0,state.mind[key]+value));
}}
function assignScene(next){state.scene=next;if(!state.visited.includes(next))state.visited.push(next);save();render();}
function die(cause,learn=''){
 state.lastCause=cause;state.lastLearn=learn;
 if(state.introComplete){state.scene='_postDeath';}
 else {state.scene='_introDeath';}
 save();render();
}
function finishIntroduction(){
 state.introComplete=true;state.hp=40;state.pendingBeat=null;
 state.scene='post_hill';
 state.anchor=null;
 state.anchor=copy({...state,anchor:null,knowledge:[],lives:0,memories:[],lastCause:'',lastLearn:'',lastInterruption:null});
 note('Kael crossed beyond Luminara.');save();render();
}
function reawaken(response){
 const cause=state.lastCause,tag=state.lastLearn;
 // Current personal development survives; the world resumes from the first morning beyond Luminara.
 const after=copy(state.mind);
 const prevMem=copy(state.memories);prevMem.push({life:state.lives+1,cause,tag,feeling:response.label});
 const prevKnowledge=[...state.knowledge];
 if(tag&&!prevKnowledge.includes(tag))prevKnowledge.push(tag);
 if(state.flags.some(x=>['chased_commander','ignored_player_rescue','wanted_rescue','prisoner_executed','prisoner_spared'].includes(x))&&!prevKnowledge.includes('market_conflict'))prevKnowledge.push('market_conflict');
 const anchor=copy(state.anchor);
 if(!anchor){restart();return;}
 const oldScale=state.readingScale;
 state={...copy(anchor),anchor,mind:after,scene:'return_morning',lives:prevMem.length,knowledge:prevKnowledge,memories:prevMem,readingScale:oldScale,lastCause:cause,lastLearn:tag,lastInterruption:null};
 note('A morning Kael remembers differently from everyone else.');save();render();
}
function restart(){const scale=state.readingScale;state=init();state.readingScale=scale;save();render();}
function choose(ch){
 if(ch.next==='_continueTyped'){
  const pending=state.pendingTyped;if(!pending){restart();return;}
  state.pendingTyped=null;state.scene=pending.from;
  if(pending.option==='improvise'){
    if(state.improvCounts[pending.from]>=2){assignScene(pending.from);return;}
    state.improvCounts[pending.from]=(state.improvCounts[pending.from]||0)+1;
    if(pending.tone!=='none'&&typeof state.mind[pending.tone]==='number')apply({[pending.tone]:1});
    state.lastTypedScene={scene:pending.from,text:pending.passage};
    note(`Attempted: ${pending.action}`);assignScene(pending.from);return;
  }
  const data=STORY[pending.from],choices=typeof data.choices==='function'?data.choices(state):data.choices;
  const ch=choices[Number(pending.option)];if(ch){note(`Player described: ${pending.action}`);choose(ch);}else assignScene(pending.from);return;
 }
 if(ch.next==='_continueBeat'){const target=state.pendingBeat?.target;state.pendingBeat=null;if(target)assignScene(target);return;}
 if(ch.next==='_journal'){journalModal();return;}
 if(ch.next==='_restart'){restart();return;}
 if(ch.next==='_finishIntro'){
  if(ch.mark)rememberMark(ch.mark);
  finishIntroduction();return;
 }
 if(ch.next==='_introDeath'||ch.next==='_postDeath'){
  die(ch.death||'Kael died.',ch.learn||'');return;
 }
 state.lastInterruption=null;
 const from=state.scene;
 const desired=ch.label;
 // Independent will: a choice remains clickable; the protagonist may act against it only when his history supports it.
 if(ch.intent==='protect_civilians' && state.mind.violence>=5 && state.mind.violence>state.mind.care+2){
   state.lastInterruption={command:desired,action:'Kael pursued the commander first. He did not deliberately target the civilians, but he failed to protect them when he could have.'};
   apply({grief:1,numbness:1});rememberMark('wanted_rescue');rememberMark('ignored_player_rescue');
   note('At the crossroads, Kael acted against the attempt to prioritize civilians.');assignScene('ignored_market');return;
 }
 if(ch.intent==='execute_prisoner' && state.mind.care>=5 && state.mind.care>state.mind.violence+2){
   state.lastInterruption={command:desired,action:'Kael would not execute a surrendered man. He lowered his weapon instead.'};
   apply({care:1,defiance:1});rememberMark('wanted_execution');rememberMark('refused_execution');
   note('Kael refused to execute a surrendered prisoner.');assignScene('refused_execution');return;
 }
 apply(ch.effect);
 if(ch.mark)rememberMark(ch.mark);
 if(state.hp<=0){die('Kael succumbed to wounds sustained on the journey.');return;}
 note(`${from}: ${desired}`);
 const target=typeof ch.next==='function'?ch.next(state):ch.next;
 const beat=ch.mark?buildActionBeat(ch.mark,state,from,target):null;
 if(beat){state.pendingBeat=beat;assignScene('_beat');return;}
 assignScene(target);
}
const feelingChoices=()=>{
 if(state.lives===0)return [
   {label:'I died. How can I still be here?',detail:'Confusion and disbelief.',score:{curiosity:1,grief:1}},
   {label:'I need to know what happened.',detail:'Curiosity presses through fear.',score:{curiosity:2,focus:1}},
   {label:'Someone did this to me. Someone will answer.',detail:'Anger, fear, and an urge to retaliate.',score:{rage:2,violence:1}},
   {label:'I cannot bear to lose them again.',detail:'Grief and the urge to protect.',score:{grief:2,care:1}}
 ];
 return [
  {label:'I will change the outcome, even if it takes another life.',detail:'Stubborn determination.',score:{defiance:2,focus:1}},
  {label:'No. Not again. I am tired of this.',detail:'Despair and exhaustion.',score:{grief:2,numbness:1}},
  {label:'Find the pattern. Test what can be changed.',detail:'Curiosity and analysis.',score:{curiosity:2,focus:1}},
  {label:'Remember. Do not react. Keep moving.',detail:'Growing emotional detachment.',score:{numbness:2}},
  {label:'This happened. I can choose what comes next.',detail:'Acceptance without surrender.',score:{acceptance:2,care:1}},
  {label:'They will not take another life from me.',detail:'Rage and determination.',score:{rage:2,violence:1}}
 ];
};
function sceneForRender(){
 if(state.scene==='_typedPrelude' && state.pendingTyped){return {act:STORY[state.pendingTyped.from]?.act||'THE STORY',title:'What Kael Attempts',place:(STORY[state.pendingTyped.from]?.place||'Luminara')+(state.pendingTyped.source==='local'?' · Offline action interpretation':' · AI narration'),text:[state.pendingTyped.passage],choices:[opt('Discover what happens next','_continueTyped')],special:'typed'};}
 if(state.scene==='_beat' && state.pendingBeat){return {...state.pendingBeat,choices:[opt('Turn the page','_continueBeat')],special:'beat'};}
 if(state.scene==='_introDeath')return {act:'GAME OVER',title:'You Died',place:'The journey has ended',text:[
   state.lastCause,
   'Kael’s strength was extraordinary, but it was not enough. This attempt is over.'
 ],choices:[opt('Restart from the beginning','_restart','A new attempt starts with Kael’s birth.')],special:'introDeath'};
 if(state.scene==='_postDeath')return {act:'CHAPTER ONE · THE DARKNESS AFTER',title:'The Last Breath',place:'Somewhere beyond the final moment',text:[
   state.lastCause,
   'Kael remembered the final blow. The shock of it. The moment he could no longer move. The certainty that nothing came after.',
   p('I died. I know I died.','memory'),
   state.lives===0?'Then, impossibly, he felt wind upon his face. He heard a familiar voice calling from a morning that had already passed.':'Again, the world seemed to fold toward a morning he knew too well.',
   'No one called it a miracle. No one else had seen what he had seen. Kael could not yet explain why.'
 ],choices:[],special:'postDeath'};
 const data=STORY[state.scene];if(!data)throw Error('Unknown scene: '+state.scene);
 if(state.lastTypedScene?.scene===state.scene){
   const original=data.text;return {...data,text:(s)=>{const lines=typeof original==='function'?original(s):original;return [...lines.slice(0,-1),s.lastTypedScene.text,...lines.slice(-1)];}};
 }
 return data;
}
function descriptiveMind(s){
 if(s.mind.numbness>=5)return 'Something in him has grown distant. A danger can arrive before the feeling of it does.';
 if(s.mind.rage>=4)return 'His anger arrives quickly; it often feels more useful than grief.';
 if(s.mind.violence>=5&&s.mind.violence>s.mind.care+2)return 'He often sees violence as the quickest way to stop a threat. Slowing down now takes effort.';
 if(s.mind.care>=5&&s.mind.care>s.mind.violence+2)return 'Protecting people has become instinctive, even when it costs him.';
 if(s.mind.grief>=4)return 'He carries losses that are difficult to speak aloud.';
 if(s.mind.curiosity>=3)return 'He has started noticing patterns he once would have ignored.';
 if(s.mind.focus>=3)return 'He studies people before acting and trusts observation over raw force.';
 return 'Stubborn, watchful, and capable of kindness or violence. His future is still taking shape.';
}
function createChoice(ch,handler){
 const button=document.createElement('button');button.className='choice';button.type='button';
 const body=document.createElement('span');
 const title=document.createElement('div');title.className='label';title.textContent=ch.label;
 body.append(title);
 if(ch.detail){const detail=document.createElement('div');detail.className='detail';detail.textContent=ch.detail;body.append(detail);}
 const chev=document.createElement('span');chev.className='chev';chev.textContent='›';chev.setAttribute('aria-hidden','true');
 button.append(body,chev);button.addEventListener('click',handler);return button;
}
function render(){
 const data=sceneForRender(),story=$('story'),choices=$('choices'),interruption=$('decisionNote');
 $('act').textContent=data.act;$('title').textContent=data.title;$('place').textContent=data.place;
 const paragraphs=typeof data.text==='function'?data.text(state):data.text;
 story.replaceChildren();
 for(const par of paragraphs){const obj=typeof par==='string'?{text:par,kind:'normal'}:par;const el=document.createElement('p');el.textContent=obj.text;if(obj.kind!=='normal')el.className=obj.kind;story.append(el);}
 choices.replaceChildren();
 interruption.replaceChildren();
 // Independent will is narrated within the chapter, not shown as a game-mechanics notice.
 let options=typeof data.choices==='function'?data.choices(state):data.choices;
 if(data.special==='postDeath'){
   $('choiceTitle').textContent='What goes through his mind?';
   for(const emotion of feelingChoices())choices.append(createChoice(emotion,()=>{apply(emotion.score);reawaken(emotion);}));
 }else {
   $('choiceTitle').textContent=data.special==='introDeath'?'Start again':data.special==='beat'||data.special==='typed'?'Continue the story':'Choose Kael’s next action';
   for(const choice of options)choices.append(createChoice(choice,()=>choose(choice)));
 }
 $('freeActionInput').placeholder=({training:'I speak to the bigger boy before anyone gets hurt…',upper_streets:'I knock over a crate to distract the guards…',guards_downed:'I lower my blade and warn the captain not to follow…',post_hill:'I ask Elena whether she trusts this road…'})[state.scene]||'I look for another way to solve this…';
 $('narratorMode').textContent=localStorage.getItem('unmarked-narrator-access')?'Private AI configured · offline fallback':'Offline interpreter · enable private AI in Menu';
 $('freeActionPanel').hidden=!(STORY[state.scene] && typeof state.scene==='string' && !['birth','judgment','found'].includes(state.scene) && (state.improvCounts[state.scene]||0)<2);
 $('footLeft').textContent=state.introComplete?'The open road · Beyond Luminara':'Luminara · Before the open sky';
 $('footRight').textContent=state.introComplete?'CHAPTER ONE':'INTRODUCTION';
 document.documentElement.style.setProperty('--scale',state.readingScale);
 save();window.scrollTo({top:0,behavior:'instant'});
}
function save(){try{localStorage.setItem(STORAGE,JSON.stringify(state));$('saveIndicator').textContent='Progress saved on this device';}catch(e){$('saveIndicator').textContent='Saving is blocked here. Open the game in Safari as a website.';}}
function load(){try{const raw=localStorage.getItem(STORAGE);if(!raw)return;const x=JSON.parse(raw);if(x&&typeof x.scene==='string'&&(STORY[x.scene]||['_postDeath','_introDeath'].includes(x.scene)||(x.scene==='_beat'&&x.pendingBeat?.target)||(x.scene==='_typedPrelude'&&x.pendingTyped?.from))&&Array.isArray(x.flags)&&x.mind&&typeof x.mind.violence==='number'&&typeof x.introComplete==='boolean')state={...init(),...x};}catch(e){}}
function showModal(title){$('modalTitle').textContent=title;$('backdrop').classList.add('open');$('closeModal').focus();}
function closeModal(){$('backdrop').classList.remove('open');}
function paragraph(parent,text,className){const e=document.createElement('p');e.textContent=text;if(className)e.className=className;parent.append(e);return e;}
function heading(parent,text){const h=document.createElement('h3');h.textContent=text;parent.append(h);}
function modalAction(parent,label,fn,isDanger=false){const b=document.createElement('button');b.textContent=label;if(isDanger)b.className='danger';b.addEventListener('click',fn);parent.append(b);return b;}
function journalModal(){const body=$('modalBody');body.replaceChildren();
 paragraph(body,'What Kael has done—and what happened afterward—in this life.', 'small');
 heading(body,'Recent events');
 const list=document.createElement('ol');const events=state.journal.slice(-16).reverse();
 for(const event of events){const li=document.createElement('li');li.textContent=event;list.append(li);}
 if(!events.length){const li=document.createElement('li');li.textContent='The story has only just begun.';list.append(li);}
 body.append(list);
 heading(body,'Who Kael is becoming');paragraph(body,descriptiveMind(state));
 if(state.lives>0){
  heading(body,'Things only Kael recalls');
  for(const m of state.memories.slice(-8).reverse())paragraph(body,`A previous life: ${m.cause} — ${m.feeling}`);
  paragraph(body,'Others have no memory of the lives Kael has experienced.', 'small');
 }
 showModal('Kael’s Journal');
}
function downloadSave(){
 const blob=new Blob([JSON.stringify({version:2,state},null,2)],{type:'application/json'});
 const url=URL.createObjectURL(blob);const a=document.createElement('a');a.href=url;a.download='unmarked-ones-save.json';document.body.append(a);a.click();a.remove();setTimeout(()=>URL.revokeObjectURL(url),2000);
}
function importSave(){const input=document.createElement('input');input.type='file';input.accept='.json,application/json';
 input.addEventListener('change',async()=>{if(!input.files?.length)return;try{
 const raw=await input.files[0].text();if(raw.length>3000000)throw Error('File too large');const parsed=JSON.parse(raw);const s=parsed?.state;
 if(parsed.version!==2||!s||!s.mind||!Array.isArray(s.flags)||!(STORY[s.scene]||['_postDeath','_introDeath'].includes(s.scene)||(s.scene==='_beat'&&s.pendingBeat?.target)||(s.scene==='_typedPrelude'&&s.pendingTyped?.from))||typeof s.introComplete!=='boolean'||typeof s.mind.violence!=='number')throw Error('Not a valid save');
 state={...init(),...s};closeModal();render();
 }catch(e){window.alert('This does not appear to be a valid prototype save file.');}});
 input.click();
}
function menuModal(){const body=$('modalBody');body.replaceChildren();
 paragraph(body,'A playable literary fantasy adapted from the author’s canonical opening. Your choices can create alternate histories, and the story remembers what Kael actually did.');
 heading(body,'Kael at this moment');
 paragraph(body,descriptiveMind(state));
 paragraph(body,`Health: ${state.hp}/40 · Supplies: ${state.supplies} · Places explored: ${state.visited.length}`,'small');
 paragraph(body,'Freeform input: With AI hosting configured, the narrator interprets what Kael attempts. Without it, a limited offline action interpreter is used. The author’s scenes and independent-will rules still determine the actual outcome.','small');
 if(state.lives>0){paragraph(body,'Some experiences linger even when no one around Kael remembers them.','small');}
 heading(body,'Private AI narration');
 const enabled=!!localStorage.getItem('unmarked-narrator-access');
 paragraph(body,enabled?'This device has a narrator access passphrase saved. The actual AI still requires a Netlify function with a server-side API key.':'AI is not unlocked on this device. Typing actions uses the limited offline interpreter.', 'small');
 const aiActions=document.createElement('div');aiActions.className='modal-buttons';
 modalAction(aiActions,enabled?'Change narrator passphrase':'Enter narrator passphrase',()=>{const val=window.prompt('Enter the PRIVATE narrator access passphrase (not your OpenAI API key):','');if(val===null)return;if(val.length<8||val.length>150){window.alert('Use a private passphrase of 8 to 150 characters.');return;}localStorage.setItem('unmarked-narrator-access',val);closeModal();render();});
 if(enabled)modalAction(aiActions,'Disable AI on this device',()=>{localStorage.removeItem('unmarked-narrator-access');closeModal();render();});
 body.append(aiActions);
 heading(body,'Reading & save');
 paragraph(body,'Your story is automatically saved in this browser on this device. To move it to another device, export your save and import it there.');
 const actions=document.createElement('div');actions.className='modal-buttons';
 modalAction(actions,'Export save',downloadSave);modalAction(actions,'Import save',importSave);
 modalAction(actions,'Start over',()=>{if(window.confirm('Erase this playthrough and restart from Kael’s birth?')){closeModal();restart();}},true);
 body.append(actions);
 heading(body,'About this edition');paragraph(body,'This is an interactive prototype, not the full manuscript. Major divergences are intentional alternate histories. Additional chapters will expand the consequences.');
 showModal('Reader Menu');
}
let freeBusy=false;
$('freeActionForm').addEventListener('submit',async ev=>{
 ev.preventDefault();if(freeBusy||!STORY[state.scene])return;
 const action=$('freeActionInput').value.trim().slice(0,450);if(action.length<3){$('freeActionStatus').textContent='Describe Kael’s intended action first.';return;}
 const origin=state.scene;const data=STORY[origin];const choices=typeof data.choices==='function'?data.choices(state):data.choices;
 const paragraphs=typeof data.text==='function'?data.text(state):data.text;
 freeBusy=true;$('narrateBtn').disabled=true;$('freeActionStatus').textContent='Interpreting Kael’s action…';
 let result;
 try{result=await requestNarrator(action,origin,choices,state,paragraphs);}
 catch(err){result=localInterpret(action,choices,origin);$('freeActionStatus').textContent='AI is not connected; using the limited offline interpreter.';}
 finally{freeBusy=false;$('narrateBtn').disabled=false;}
 if(state.scene!==origin)return;
 const allowed=validNarratorResult(result,choices.length);if(!allowed)return;
 state.pendingTyped={from:origin,action,option:result.option,passage:result.passage,tone:result.tone,source:result.source};
 $('freeActionInput').value='';assignScene('_typedPrelude');
});
$('smaller').addEventListener('click',()=>{state.readingScale=Math.max(.85,Math.round((state.readingScale-.07)*100)/100);render();});
$('larger').addEventListener('click',()=>{state.readingScale=Math.min(1.28,Math.round((state.readingScale+.07)*100)/100);render();});
$('journalBtn').addEventListener('click',journalModal);
$('menuBtn').addEventListener('click',menuModal);
$('closeModal').addEventListener('click',closeModal);
$('backdrop').addEventListener('click',e=>{if(e.target===$('backdrop'))closeModal();});
document.addEventListener('keydown',e=>{if(e.key==='Escape')closeModal();});
load();render();
// Local automation only. Not shown in normal play or menus.
if(window.__ENABLE_TEST__||new URLSearchParams(location.search).has('test')){
 window.__UNMARKED_TEST__={get:()=>copy(state),scene:()=>state.scene,set:(next)=>{state.scene=next;render();},restart};
}
