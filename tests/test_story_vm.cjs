const fs=require('fs'), vm=require('vm'), path=require('path'), assert=require('node:assert/strict');
const root=path.resolve(__dirname,'..');
const ctx=vm.createContext({ console, window:{},localStorage:{setItem(){},getItem(){return null}},document:{getElementById(){return {textContent:''}}},URL, setTimeout });
let eng=fs.readFileSync(path.join(root,'site/engine.js'),'utf8');
eng=eng.split("$('freeActionForm').addEventListener")[0];
for(const f of ['site/beats.js','site/story.js']) vm.runInContext(fs.readFileSync(path.join(root,f),'utf8'),ctx,{filename:f});
vm.runInContext(eng,ctx,{filename:'site/engine.js'});
vm.runInContext('render=()=>{};save=()=>{};',ctx);
function state(){return JSON.parse(vm.runInContext('JSON.stringify(state)',ctx));}
function pick(scene,index){assert.equal(state().scene,scene,`expected ${scene} got ${state().scene}`);vm.runInContext(`choose((typeof STORY[${JSON.stringify(scene)}].choices==='function'?STORY[${JSON.stringify(scene)}].choices(state):STORY[${JSON.stringify(scene)}].choices)[${index}])`,ctx);if(state().scene==='_beat')vm.runInContext("choose({next:'_continueBeat'})",ctx);}
function reset(){vm.runInContext('restart()',ctx)}
const log=(x)=>console.log('PASS',x);
for (const s of ['birth','judgment','found'])pick(s,0);
pick('training',0);pick('upper_streets',0);pick('guards_downed',0);pick('queen_report',0);pick('elena_youth',0);pick('hunt',0);pick('gather',0);pick('tunnel',0);pick('marauders',0);
if(state().scene==='elder_death')pick('elder_death',0);if(state().scene==='elder_saved')pick('elder_saved',0);
pick('rune_chamber',0);pick('threshold',0);assert.equal(state().introComplete,false);log('Escape does not end introduction');
pick('post_hill',0);pick('road',0);
for(const name of ['market','protected_market','ignored_market','pursued_commander','balanced_market','prisoner','spared_prisoner','late_ambush']) if(state().scene===name)pick(name,0);
assert.equal(state().scene,'epilogue');
for(const s of ['epilogue','camp_pressure','night_trap','taken','dream_mountain','dream_assault','dream_throne','dream_fall','dream_break'])pick(s,0);
assert.equal(state().scene,'cell_awake');assert.equal(state().introComplete,true);assert.ok(state().anchor);log('Cell awakening is the canonical unlock');
pick('cell_awake',2);pick('cell_watch',2);assert.equal(state().scene,'_postDeath');assert.equal(state().lives,0);
vm.runInContext('apply(feelingChoices()[0].score);reawaken(feelingChoices()[0])',ctx);
assert.equal(state().scene,'return_cell');assert.equal(state().lives,1);assert.ok(state().knowledge.includes('cell_execution'));log('True post-cell death carries only Kael memory');
reset();for(const s of ['birth','judgment','found'])pick(s,0);
pick('training',1);pick('upper_streets',1);pick('guards_downed',1);pick('queen_report',0);pick('elena_youth',1);pick('hunt',1);assert.equal(state().scene,'pit_burning');pick('pit_burning',1);pick('reckless_revenge',0);assert.equal(state().scene,'_introDeath');assert.equal(state().introComplete,false);vm.runInContext("choose({next:'_restart'})",ctx);assert.equal(state().scene,'birth');assert.equal(state().lives,0);assert.equal(state().mind.violence,0);log('Pre-cell death resets with no knowledge');
for(const s of ['birth','judgment','found'])pick(s,0);
pick('training',1);pick('upper_streets',1);pick('guards_downed',1);pick('queen_report',0);pick('elena_youth',1);pick('hunt',1);pick('pit_burning',0);pick('shattered_years',0);pick('solitary_gate',0);pick('alternate_threshold',0);assert.equal(state().scene,'alternate_horizon');assert.equal(state().introComplete,false);pick('alternate_horizon',0);assert.equal(state().scene,'alternate_excerpt');log('Devastated Pit alternate remains an unresolved intro');
console.log('ALL STORY VM CHECKS PASSED');
// Independent Will: intention is not guaranteed to be enacted exactly.
reset();vm.runInContext("state.scene='market';state.mind.violence=8;state.mind.care=0",ctx);
pick('market',0);assert.equal(state().scene,'ignored_market');assert.ok(state().flags.includes('ignored_player_rescue'));log('Ruthless Kael can neglect civilian rescue');
reset();vm.runInContext("state.scene='prisoner';state.mind.violence=0;state.mind.care=8",ctx);
pick('prisoner',1);assert.equal(state().scene,'refused_execution');assert.ok(state().flags.includes('refused_execution'));log('Compassionate Kael can refuse to execute');
// Freeform: no AI required to recognize simple action intent.
vm.runInContext(fs.readFileSync(path.join(root,'site/narrator.js'),'utf8'),ctx);
let freeform=vm.runInContext("localInterpret('I talk to the bully so nobody gets hurt',STORY.training.choices,'training')",ctx);
assert.equal(freeform.option,'0');
freeform=vm.runInContext("localInterpret('I kill the captain',STORY.guards_downed.choices,'guards_downed')",ctx);
assert.equal(freeform.option,'1');
log('Limited offline typed input matches key opening decisions');
console.log('ADDITIONAL GAME ENGINE CHECKS PASSED');
