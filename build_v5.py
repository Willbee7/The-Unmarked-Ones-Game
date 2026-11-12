from pathlib import Path
p=Path('/mnt/data/Unmarked-Prototype-V/site')
story=(p/'story.js').read_text()
# change threshold, alternative ending
assert "choices:[opt('Turn the page','_finishIntro')]" in story
story=story.replace("choices:[opt('Turn the page','_finishIntro')]", "choices:[opt('Follow the road into the new world','post_hill')]",1)
assert "choices:[opt('Begin the life beyond Luminara','_finishIntro','',null,{mark:'alt_escape'})]" in story
story=story.replace("choices:[opt('Begin the life beyond Luminara','_finishIntro','',null,{mark:'alt_escape'})]", "choices:[opt('See what this different freedom demands','alternate_horizon','',null,{mark:'alt_escape'})]",1)
# remove old epilogue and return morning and add new story scenes at tail
start=story.index(" epilogue:{act:'END OF PROTOTYPE")
end=story.index('\n};', start)
new_story=r''' epilogue:{act:'INTRODUCTION · THE ROAD UNFOLDS',title:'There Are Roads That Do Not Lead Home',place:'Beyond Luminara · The ridge path',text:s=>[
  'The last patrol retreated behind the reeds. Kael did not watch them for long. The frightened people in the village were still counting losses, and the old scars of the Pit had not faded simply because there was a sky above him.',
  observed(s,'prisoner_executed')?'Elena had avoided his eyes since the prisoner fell. Ulysses noticed and said nothing. That silence followed the company down the road.':observed(s,'refused_execution')?'When the surrendering soldier had knelt, Kael had felt the strange distance between an impulse and what his hand would permit. He was still thinking of it.':observed(s,'prisoner_questioned')?'The captive’s account of the missing courier left unanswered questions, and Cidric had already begun marking unfamiliar roads on his map.':'They had survived another confrontation, but survival had not decided what sort of people they would become.',
  observed(s,'elder_lives')?'Elder Lysander walked slowly at the rear, leaning on a staff. Each step hurt him, but he would not let anyone carry him.':'Kael found his hand closing around empty air where the old scavenger used to stand beside him.',
  'That night Ulysses asked to speak when the others were ready to sleep.'
 ],choices:[
  opt('Listen to what Ulysses has to say.','camp_pressure'),
  opt('Read the account of what has happened so far.','_journal')
 ]},
 camp_pressure:{act:'INTRODUCTION · FAULT LINES',title:'What Ulysses Cannot Ignore',place:'Beyond Luminara · A camp of wet stone',text:s=>[
  'The fire had burned low. Rain slipped from the leaves onto the stones around it, and the company sat close enough to hear one another breathe.',
  '“We cannot keep running together forever,” Ulysses said. “The queen can follow a company more easily than scattered travelers. We need another way.”',
  observed(s,'ignored_player_rescue')?'Kael heard the suggestion through the memory of the family in the market: people who had been left waiting while he pursued a threat. He wondered whether Ulysses had been watching.':observed(s,'guard_killed')?'Kael had killed a royal guard once, and the pursuit had grown worse afterward. He could understand why Ulysses feared every road.':'Ulysses had trained beside him since childhood. The doubt in his voice hurt more because Kael knew it was not cowardice.',
  'Thorne demanded to know what would become of his brother. Cidric spoke about splitting supplies. Elena watched Kael, waiting to hear what he would say—not what a leader was supposed to say.'
 ],choices:[
  opt('Tell Ulysses he is free to leave, even if it hurts.','night_trap','', {grief:1,focus:1},{mark:'ulysses_departed'}),
  opt('Order him to stay until they have a better plan.','night_trap','',{defiance:2},{mark:'ulysses_forced'}),
  opt('Ask him to help design a safer route instead.','early_signs','',{focus:2,bond:1},{mark:'ulysses_heard'})
 ]},
 early_signs:{act:'INTRODUCTION · ANOTHER WAY',title:'A Watch Kept Together',place:'Beyond Luminara · The northern track',text:s=>[
  'Kael took Ulysses aside instead of arguing before the whole company. They spread Cidric’s map beneath a stone to keep it from the wind.',
  '“Show me where you think they will come,” Kael said. Ulysses pointed toward a line of scrub overlooking the camp. “There. They have been following us since midday.”',
  observed(s,'prisoner_questioned')?'The prisoner’s warning about a courier suddenly felt less like a story and more like a trail someone had laid for them.':'Kael searched the dark beyond the tents. A distant glint flashed once, then vanished.',
  'They could move before midnight, or stay long enough to learn who was watching.'
 ],choices:[
  opt('Break camp quietly and lead everyone off the marked road.','unwritten_path','',{focus:2,care:1},{mark:'changed_pursuit'}),
  opt('Lay a false trail and find out who follows it.','night_trap','',{focus:1},{mark:'exposed_watch'})
 ]},
 night_trap:{act:'INTRODUCTION · THE AMBUSH',title:'The Price of a Familiar Voice',place:'Beyond Luminara · The sleeping camp',text:s=>[
  observed(s,'ulysses_departed')?'Ulysses was gone when the company settled down. Kael kept looking at the empty place beside the fire, as if the absence would explain itself.':'Ulysses had stayed, but he slept away from the others. Every word at the campfire felt as though it might break something.',
  'A twig snapped beyond the firelight. Then arrows struck the packs. Royal soldiers surged out of the trees with their faces covered and their casting hands already alight.',
  observed(s,'exposed_watch')?'Kael had suspected a watcher. He had not expected the soldiers to come from the opposite side of the camp.':'The attackers moved as if they knew where every bedroll lay. Kael recognized the shape of the camp he had described aloud the night before.',
  'Elena raised both hands. Thorne lunged between the soldiers and his brother. For one terrible moment Kael had to decide where he would stand.'
 ],choices:[
  opt('Stay beside the others and defend the camp.','taken','',{care:1,defiance:1,hp:-8},{mark:'held_camp'}),
  opt('Draw the soldiers into the ravine while the others escape.','unwritten_path','',{care:2,hp:-9},{mark:'ravine_diversion'}),
  opt('Charge the spellcaster without waiting for an opening.','_introDeath','',null,{death:'The royal spellcaster killed Kael during the attack on the camp.'})
 ]},
 taken:{act:'INTRODUCTION · A DARKER ROAD',title:'The Night That Would Not End',place:'A hidden royal holding chamber',text:s=>[
  'The fight ended without a victory. Kael remembered the weight of an enchanted chain around his wrist and Elena calling his name from somewhere he could not see.',
  observed(s,'ulysses_departed')?'Ulysses had been absent when the soldiers found them. The coincidence sat beneath Kael’s anger like a stone he could not swallow.':observed(s,'ulysses_forced')?'A soldier used a phrase Kael had spoken privately to Ulysses. Kael looked for his oldest friend among the captives and found only shadows.':'The soldiers had known too much about the company, and the shape of the ambush felt deliberate.',
  'A woman in a dark robe stepped forward. She touched two fingers to his brow. “Let him have the future he wanted,” she told the guards.',
  'Kael struggled to pull away. The chamber blurred. When he opened his eyes again, the walls were gone.'
 ],choices:[opt('Open his eyes to the morning.','dream_mountain')]},
 dream_mountain:{act:'INTRODUCTION · CAIRN HOLD',title:'Allies Among the Mountains',place:'The northern mountains · Cairn Hold',text:s=>[
  'The days had become weeks. The company reached a mountain fortress where soldiers sharpened blades beside blacksmiths and children carried water between the tents.',
  'Elysia, commander of a small resistance, listened as Kael told her what Seraphina had done to the Unmarked. He had expected suspicion. Instead, she offered him a place at her war table.',
  observed(s,'prisoner_executed')?'Kael remembered one life ended by his own hand at the crossroads. Elysia asked whether he could lead fighters who might surrender. He had no answer she would have liked.':'Kael spoke of the people his kingdom had taught him to overlook. For a moment it felt as if he had found someone capable of hearing them.',
  'The days of preparation passed with a strange ease. Every plan seemed to find its answer before the next question arose.'
 ],choices:[
  opt('Train with the resistance and protect the weakest recruits.','dream_assault','',{care:2,bond:1},{mark:'dream_recruits'}),
  opt('Prepare a direct strike against the palace.','dream_assault','',{focus:1,violence:1},{mark:'dream_assault_plan'})
 ]},
 dream_assault:{act:'INTRODUCTION · A WAR DREAMED',title:'The Kingdom at the Gates',place:'Luminara · The capital walls',text:s=>[
  'The army arrived at dawn. Luminara, which had once seemed vast enough to swallow Kael whole, lay before him like something that could finally be reached.',
  observed(s,'dream_recruits')?'The young recruits stayed behind the first line, just as Kael had promised Elysia. He heard their voices calling to one another through the smoke.':'Kael pressed his fingers against the lines Cidric had drawn on the map. The assault was exactly where they had planned it, though he could not remember some of the marches that brought them there.',
  'Thorne and his younger brother fought side by side. Elena’s light held the wounded together. Ulysses appeared beside Kael at a turning in the street, his blade ready and his expression unreadable.',
  'Beyond the palace doors, a throne waited.'
 ],choices:[
  opt('Enter the throne room with the companions.','dream_throne'),
  opt('Send aid to the wounded before entering.','dream_throne','',{care:1},{mark:'dream_wounded'})
 ]},
 dream_throne:{act:'INTRODUCTION · THE QUEEN',title:'The Woman on the Throne',place:'Luminara · The royal audience hall',text:s=>[
  'Queen Seraphina stood where Kael had imagined her a thousand times. Fire moved beneath her skin. The immense throne made her look no taller than the old scavenger who had once carried Kael through the Pit.',
  '“My son,” she said. Her voice held neither surprise nor warmth. “Did you come for a crown or an answer?”',
  observed(s,'guard_killed')?'Kael thought of the first guard he had killed and of the punishment that followed. He wondered whether Seraphina had ever counted the people below her feet.':'Kael thought of the guard he had spared at seven. Sparing him had not softened the queen’s decree, but it had kept one life from being added to her reign.',
  'Fire spread along the floor between them. The companions waited for Kael to move.'
 ],choices:[
  opt('Demand that Seraphina answer for the people she discarded.','dream_fall','',{focus:1,defiance:1},{mark:'dream_accusation'}),
  opt('Strike before she can burn the room.','dream_fall','',{violence:1},{mark:'dream_strike'}),
  opt('Ask whether she ever searched for the child she abandoned.','dream_fall','',{grief:1},{mark:'dream_question'})
 ]},
 dream_fall:{act:'INTRODUCTION · A FALSE DAWN',title:'The Sound of Victory',place:'Luminara · After the battle',text:s=>[
  observed(s,'dream_accusation')?'The words reached Seraphina before the blades did. For an instant she looked more like a woman than a legend. Then the last of her defenses broke.':'The battle collapsed into a final clash of steel and magic. The queen fell, and her great fire went out.',
  observed(s,'dream_question')?'Kael received no answer about the child she had thrown away. He could only look at her still form and wonder whether the silence was all he would ever have.':'The palace fell silent. People began cheering in the streets as though the long years of fear had ended at a single stroke.',
  'By evening, the city had begun speaking of peace. Kael stood among his companions while a sunset unlike any he remembered touched the ruined towers.',
  'For the first time, he allowed himself to believe they might be finished running.'
 ],choices:[opt('Stay with the others until nightfall.','dream_break')]},
 dream_break:{act:'INTRODUCTION · THE AWAKENING',title:'The Light Comes Apart',place:'A place that should have been peaceful',text:s=>[
  'Elena was laughing beside the fire. Thorne and his brother were arguing over a cooking pot. Cidric unfolded a clean map, and Ulysses looked at Kael like a friend who had never left.',
  'Kael reached for the warmth of that moment. The fire cast no heat. The sound of laughter continued after the companions had stopped moving.',
  'Then another sound rose through it: iron striking stone, followed by a man’s cry of pain.',
  'The light stretched thin. The faces before him blurred. A terrible cold took hold of Kael’s chest as the whole beautiful evening began to crack.'
 ],choices:[opt('Open his eyes.','cell_awake')]},
 cell_awake:{act:'CHAPTER ONE · THE AWAKENING',title:'The Cold Stone Is Real',place:'Luminara · A royal dungeon',text:s=>[
  'Kael woke with his cheek against wet stone. The last light of victory clung to his sight for an instant before the bars came into focus.',
  'Across the corridor, Thorne and his younger brother Lysander were bound and bruised beneath the gaze of royal guards. Elena sat in the neighboring cell, her hands trembling in her lap. Neither the war nor the celebration had happened the way Kael remembered them.',
  'The queen still ruled. His companions were prisoners. Ulysses had disappeared somewhere beyond the door.',
  'Kael drew a shallow breath and felt every injury he had carried into this place. He had not returned from death. He had awakened from a lie.',
  'A guard turned at the sound of his breathing. The dungeon smelled of damp stone, iron, and extinguished candles.'
 ],choices:[
  opt('Whisper to Elena and find out what she remembers.','cell_elena','',{care:1,bond:1},{mark:'asked_elena'}),
  opt('Study the bars, the guards, and the chalk marks on the wall.','cell_marks','',{focus:2},{mark:'studied_cell'}),
  opt('Call the guard over and demand answers.','cell_watch','',{defiance:1},{mark:'challenged_guard'})
 ]},
 cell_elena:{act:'CHAPTER ONE · THE NEXT BREATH',title:'The Girl Beyond the Bars',place:'Luminara · The neighboring cell',text:s=>[
  '“Elena.” Kael had to say her name twice before she looked up.',
  'She crossed the narrow space between her wall and the bars, her eyes swollen with exhaustion. “They took the others,” she whispered. “I don’t know where.”',
  'Kael wanted to tell her about the sunlit hill, about the peace he had held for an instant. But her hands were shaking here, in the real cold, and he needed to know what could still be done.',
  observed(s,'elder_lives')?'He thought of elder Lysander, alive when they crossed the gate. Kael did not know where the soldiers had taken him.':'He heard elder Lysander’s final words in a voice that had long ago gone silent.'
 ],choices:[
  opt('Promise her you will find a way out together.','cell_watch','',{care:1,defiance:1},{mark:'cell_promise'}),
  opt('Ask what she saw before the spell took him.','cell_watch','',{focus:1},{mark:'cell_witness'})
 ]},
 cell_marks:{act:'CHAPTER ONE · THE NEXT BREATH',title:'The Scratches in the Wall',place:'Luminara · Kael’s cell',text:s=>[
  'Kael forced his eyes away from the suffering across the corridor. Scratches broke the mortar between the stones beside his left hand.',
  'Some were pleas from earlier prisoners. Others followed the same repeating pattern Cidric had once pointed out in the ancient passages: three short strokes, a pause, and a crooked line.',
  'He traced them slowly. The wall did not open. A small crack behind the iron hinge, however, suggested that someone had attempted the same escape before him.',
  'The discovery did not free him. It gave him something to remember while the guards were watching.'
 ],choices:[
  opt('Keep the discovery to himself.','cell_watch','',{focus:1},{mark:'hinge_noted'}),
  opt('Quietly tell Elena about the weakened hinge.','cell_watch','',{bond:1,care:1},{mark:'hinge_shared'})
 ]},
 cell_watch:{act:'CHAPTER ONE · THE NEXT BREATH',title:'The Guard at the Door',place:'Luminara · The holding cells',text:s=>[
  'A guard stopped outside Kael’s cell with a key ring in one hand and an elemental sigil dimly glowing on the other.',
  observed(s,'challenged_guard')?'“You were loud enough to wake the whole corridor,” the guard said. “Try that again.”':observed(s,'hinge_noted')?'Kael kept his gaze on the guard’s wrist, noticing how the ring of keys knocked against his armor.':'The guard peered through the bars, deciding whether the prisoner was worth another question.',
  'He was close enough for Kael to reach if the door opened. He was also a trained mage, and Kael could barely stand.',
  p(inner(s),'thought')
 ],choices:s=>[
  ...(knows(s,'cell_execution')?[opt('Move back before the sigil ignites; he remembers its reach.','cell_future','',{focus:2},{mark:'avoided_sigil'})]:[]),
  opt('Lower his voice and ask where the others were taken.','cell_future','',{focus:1},{mark:'asked_guard'}),
  opt('Insult the guard and test how he reacts.','cell_blow','',{defiance:1},{mark:'provoked_guard'}),
  opt('Seize the key ring and try to overpower the mage.','_postDeath','',null,{death:'The guard’s elemental magic killed Kael when he lunged through the cell doorway.',learn:'cell_execution'})
 ]},
 cell_blow:{act:'CHAPTER ONE · THE PRICE',title:'A Pain He Can Endure',place:'Luminara · The holding cells',text:s=>[
  'Kael stepped close enough to make the guard turn. His answer came as a sharp blow through the bars.',
  'Pain burst along Kael’s jaw. He staggered, caught himself against the stone, and remained breathing. The guard laughed and walked on.',
  'Kael was hurt, not dead. His anger still burned, and he had learned something about the guard’s reach.'
 ],choices:[opt('Breathe through the pain and watch the corridor.','cell_future','',{focus:1},{mark:'endured_blow'})]},
 cell_future:{act:'CHAPTER ONE · THE DUNGEON',title:'The Story Has Not Ended',place:'Luminara · Kael’s cell',text:s=>[
  'The guard’s footsteps faded into the distance. The dungeon did not become kinder, and the bars did not open.',
  observed(s,'cell_promise')?'Elena had heard his promise. She sat close to the bars now, waiting for him to decide what to try next.':observed(s,'hinge_shared')?'Elena glanced once toward the weakened hinge. She was already thinking about what her unstable magic might do to it.':observed(s,'asked_guard')?'The guard had muttered that the other prisoners had been taken to the eastern cells. It was almost nothing, but it was a direction.':'Kael watched the corridor and measured the distance between one guard’s footsteps and the next.',
  s.lives>0?p('He also carried a memory of dying here. That memory belonged to him alone.','memory'):p('He had survived the opening of his story. The next choice was still waiting.','thought'),
  'Beyond the last torch, someone turned a key. Kael raised his head. Whatever came through that door would find him watching.'
 ],choices:[
  opt('Keep reading the journal of this life.','_journal'),
  opt('Return to the guard’s approach and try another action.','cell_watch'),
  opt('End this playable excerpt.','finished_excerpt')
 ]},
 return_cell:{act:'CHAPTER ONE · THE SAME STONE',title:'A Death No One Else Knows',place:'Luminara · Kael’s cell',text:s=>[
  'The stone beneath Kael’s cheek was cold and wet. He knew that cold. He had awakened here once before.',
  'The guard had killed him. Kael remembered the final burst of magic and the certainty of his own end. Yet his chest rose with another breath, and no wound remained from the attack.',
  'Across the corridor the brothers were alive. Elena sat in the neighboring cell, exactly where she had been. None of them looked at Kael as though they had witnessed his death.',
  p(s.lives===1?'I died. Why am I here again?':`Again. He remembered every time, and the world remembered none of them.`,'memory'),
  s.mind.numbness>=4?p('A stillness answered his terror. It frightened him that his mind could become this quiet.','thought'):s.mind.rage>=3?p('The helplessness sharpened into anger, and he dug his fingernails into the stone to keep from shouting.','thought'):s.mind.curiosity>=3?p('The scene had repeated. So could its smallest details. What happened if he moved before the guard drew his keys?','thought'):p('He waited for panic to loosen its grip. There was no one here who could explain what he remembered.','thought')
 ],choices:[
  opt('Hide his fear and study the moment carefully.','cell_watch','',{focus:1,curiosity:1},{mark:'studied_return'}),
  opt('Call out to Elena and ask whether she noticed anything strange.','cell_elena','',{care:1,grief:1},{mark:'asked_about_return'}),
  opt('Wait for the guard and change what happens next.','cell_watch','',{defiance:1},{mark:'changed_death'})
 ]},
 alternate_horizon:{act:'INTRODUCTION · A HISTORY DIVIDED',title:'What Remains of the Road',place:'Beyond Luminara · The hills beyond the gate',text:s=>[
  'The world beyond the gate did not know the names of the dead. Kael could walk for days without meeting anyone who understood what the Pit had been.',
  observed(s,'searched_ruins')?'Elena traveled beside him, her magic a fragile candle against the open dark. She could not replace the people they had lost, and neither could Kael.':'His footsteps were the only company he could hear. A road forked beyond the crest, both paths leading toward places no one from the Pit had mapped.',
  'The story that might have carried him toward a band of companions and a rebellion had been broken before it began. That did not leave him without choices. It left him with harder ones.',
  p(inner(s),'thought')
 ],choices:[
  opt('Follow the distant smoke and search for survivors.','alternate_excerpt','',{care:1},{mark:'smoke_route'}),
  opt('Turn toward the mountain passes, away from anyone who knows Luminara.','alternate_excerpt','',{focus:1},{mark:'mountain_route'})
 ]},
 unwritten_path:{act:'INTRODUCTION · AN UNWRITTEN ROAD',title:'The Ambush That Did Not Happen',place:'Beyond Luminara · A hidden track',text:s=>[
  observed(s,'changed_pursuit')?'The company broke camp before the soldiers closed in. By dawn their old bedrolls were ashes in a fire the patrol had set for enemies who were no longer there.':'Kael dragged the pursuit into the ravine while Elena guided the others away. He escaped by climbing an embankment no soldier could follow in armor.',
  'Ulysses walked beside the company when they regrouped. There were questions Kael still wanted to ask him, but no chains bound their hands and no queen stood above them.',
  'Their road would not be the same road that might have led to a dungeon. That difference was not a failure of the story. It was a decision made alive.'
 ],choices:[
  opt('Choose a direction for the company’s next journey.','alternate_excerpt','',{focus:1},{mark:'route_rewritten'})
 ]},
 alternate_excerpt:{act:'INTRODUCTION · CONTINUES',title:'The Road Still Has No Ending',place:'A different history',text:s=>[
  'The company—or what remained of it—continued beyond the last familiar trail. Somewhere the queen’s soldiers were planning their next search. Somewhere, a stranger was making a choice that might cross Kael’s path.',
  'This alternate history has not reached its own conclusion in Prototype V. Nothing is silently forced back into the prison cell, and this is not the end of Kael’s introduction.',
  'What happens next must be written from the lives that actually survived this journey, not copied from a different one.'
 ],choices:[opt('Read the journal of this history.','_journal'),opt('Begin another life from the opening.','_restart')]},
 finished_excerpt:{act:'CHAPTER ONE · CONTINUES',title:'Beyond the Torchlight',place:'Luminara · The royal dungeon',text:s=>[
  'Kael lowered himself against the wall, listening to the corridor. For the moment, he was alive. The guards still controlled the doors, and the others were still in danger.',
  'The next part of his life lay somewhere beyond the approaching footsteps.',
  p(inner(s),'thought'),
  'Prototype V ends here. The story itself does not.'
 ],choices:[opt('Return to the dungeon scene.','cell_watch'),opt('Read Kael’s journal.','_journal')]}
'''
story=story[:start]+new_story+story[end:]
# prevent demarcation too early; map formerly named CHAPTER ONE to INTRODUCTION (through old scenes)
story=story.replace("act:'CHAPTER ONE · THE OTHER SIDE'", "act:'INTRODUCTION · THE OTHER SIDE'")
story=story.replace("act:'CHAPTER ONE · A QUIET MOMENT'", "act:'INTRODUCTION · A QUIET MOMENT'")
story=story.replace("act:'CHAPTER ONE · TRACKS IN THE MUD'", "act:'INTRODUCTION · TRACKS IN THE MUD'")
story=story.replace("act:'CHAPTER ONE · THE KNOWING'", "act:'INTRODUCTION · THE KNOWING'")
story=story.replace("act:'CHAPTER ONE · AN UNEASY FREEDOM'", "act:'INTRODUCTION · AN UNEASY FREEDOM'")
story=story.replace("act:'CHAPTER ONE · THE CROSSROADS'", "act:'INTRODUCTION · THE CROSSROADS'")
story=story.replace("act:'CHAPTER ONE · THE CHOICE'", "act:'INTRODUCTION · THE CHOICE'")
story=story.replace("act:'CHAPTER ONE · THE PURSUIT'", "act:'INTRODUCTION · THE PURSUIT'")
story=story.replace("act:'CHAPTER ONE · THE NARROW WAY'", "act:'INTRODUCTION · THE NARROW WAY'")
story=story.replace("act:'CHAPTER ONE · A SECOND LINE'", "act:'INTRODUCTION · A SECOND LINE'")
story=story.replace("act:'CHAPTER ONE · RESTRAINT'", "act:'INTRODUCTION · RESTRAINT'")
story=story.replace("act:'CHAPTER ONE · A LINE CROSSED'", "act:'INTRODUCTION · A LINE CROSSED'")
story=story.replace("act:'CHAPTER ONE · AN ANSWER'", "act:'INTRODUCTION · AN ANSWER'")
story=story.replace("act:'CHAPTER ONE · THE REEDS'", "act:'INTRODUCTION · THE REEDS'")
# remove mechanical note in old scene
story=story.replace("'He had not tried to kill the civilians. He simply had not fought as hard for them as he might once have done.',\n  p('That was the terrible difference between what he meant to do and what he actually did.','thought')", "'He had not swung a blade at the family. He had simply kept running while they called for help. Their silence afterward troubled him more than their voices had.'")
(p/'story.js').write_text(story)
# engine logic
eng=(p/'engine.js').read_text()
eng=eng.replace("const STORAGE='unmarked-ones-living-novel-v2';", "const STORAGE='unmarked-ones-living-novel-v5';")
eng=eng.replace("function assignScene(next){state.scene=next;if(!state.visited.includes(next))state.visited.push(next);save();render();}", "function assignScene(next){if(next==='cell_awake'&&!state.introComplete){finishIntroduction();return;}state.scene=next;if(!state.visited.includes(next))state.visited.push(next);save();render();}")
old="""function finishIntroduction(){
 state.introComplete=true;state.hp=40;state.pendingBeat=null;
 state.scene='post_hill';
 state.anchor=null;
 state.anchor=copy({...state,anchor:null,knowledge:[],lives:0,memories:[],lastCause:'',lastLearn:'',lastInterruption:null});
 note('Kael crossed beyond Luminara.');save();render();
}"""
new="""function finishIntroduction(){
 // The illusion breaking at the prison cell, not the surface escape, is the canonical boundary.
 // This is NOT a death, and the character is not told about any hidden mechanic.
 state.introComplete=true;state.pendingBeat=null;state.hp=Math.min(40,Math.max(12,state.hp));
 state.scene='cell_awake';state.anchor=null;
 if(!state.visited.includes('cell_awake'))state.visited.push('cell_awake');
 note('Kael woke from the false victory into a royal dungeon.');
 state.anchor=copy({...state,anchor:null,knowledge:[],lives:0,memories:[],lastCause:'',lastLearn:'',lastInterruption:null});
 save();render();
}"""
assert old in eng
eng=eng.replace(old,new)
eng=eng.replace("// Current personal development survives; the world resumes from the first morning beyond Luminara.","// Only Kael retains his emotional experiences; the world returns to the provisional dungeon anchor.")
eng=eng.replace("state={...copy(anchor),anchor,mind:after,scene:'return_morning'", "state={...copy(anchor),anchor,mind:after,scene:'return_cell'")
eng=eng.replace("note('A morning Kael remembers differently from everyone else.');", "note('Kael remembers the final moment, but the dungeon does not.');")
eng=eng.replace("if(ch.next==='_finishIntro'){\n  if(ch.mark)rememberMark(ch.mark);\n  finishIntroduction();return;\n }", "if(ch.next==='_finishIntro'){\n  // Disabled on every path except the canonical prison-cell awakening.\n  if(state.scene==='cell_awake')finishIntroduction();\n  return;\n }")
eng=eng.replace("  'Kael’s strength was extraordinary, but it was not enough. This attempt is over.'", "  'The story ends here.'")
eng=eng.replace("   state.lives===0?'Then, impossibly, he felt wind upon his face. He heard a familiar voice calling from a morning that had already passed.':'Again, the world seemed to fold toward a morning he knew too well.',", "   state.lives===0?'Then the cold stone of the cell met his cheek. A breath entered lungs that had stopped moving.':'Again, the last breath yielded to the cold of a cell he knew.',")
eng=eng.replace("return {act:STORY[state.pendingTyped.from]?.act||'THE STORY',title:'What Kael Attempts',place:(STORY[state.pendingTyped.from]?.place||'Luminara')+(state.pendingTyped.source==='local'?' · Offline action interpretation':' · AI narration'),text:[state.pendingTyped.passage],choices:[opt('Discover what happens next','_continueTyped')],special:'typed'};", "return {act:STORY[state.pendingTyped.from]?.act||'THE STORY',title:'And So He Moves',place:(STORY[state.pendingTyped.from]?.place||'Luminara'),text:[state.pendingTyped.passage],choices:[opt('Continue','_continueTyped')],special:'typed'};")
eng=eng.replace("if(ch.detail){const detail=document.createElement('div');detail.className='detail';detail.textContent=ch.detail;body.append(detail);}","// The prose reveals consequences; don't display mechanical commentary beneath choices.")
eng=eng.replace("$('footLeft').textContent=state.introComplete?'The open road · Beyond Luminara':'Luminara · Before the open sky';", "$('footLeft').textContent=state.introComplete?'Luminara · A royal dungeon':'Luminara and the lands beyond';")
eng=eng.replace("$('footRight').textContent=state.introComplete?'CHAPTER ONE':'INTRODUCTION';", "$('footRight').textContent=state.introComplete?'THE DUNGEON':'INTRODUCTION';")
eng=eng.replace("const blob=new Blob([JSON.stringify({version:2,state},null,2)]", "const blob=new Blob([JSON.stringify({version:5,state},null,2)]")
eng=eng.replace("if(parsed.version!==2", "if(parsed.version!==5")
eng=eng.replace("paragraph(body,'A playable literary fantasy adapted from the author’s canonical opening. Your choices can create alternate histories, and the story remembers what Kael actually did.');", "paragraph(body,'A living-novel opening adapted from the author’s history. Decisions and their consequences become the novel’s own prose.');")
eng=eng.replace("heading(body,'Kael at this moment');\n paragraph(body,descriptiveMind(state));", "heading(body,'Kael at this moment');\n paragraph(body,descriptiveMind(state));")
eng=eng.replace("state.lives>0", "state.lives>0")
# label post-death, no upfront mention in UI
eng=eng.replace("$('choiceTitle').textContent=data.special==='introDeath'?'Start again':data.special==='beat'||data.special==='typed'?'Continue the story':'Choose Kael’s next action';", "$('choiceTitle').textContent=data.special==='introDeath'?'Start again':data.special==='beat'||data.special==='typed'?'Continue the story':'What does Kael do?';")
eng=eng.replace("return {act:'CHAPTER ONE · THE DARKNESS AFTER'", "return {act:'THE MOMENT AFTER'" )
eng=eng.replace("if(window.__ENABLE_TEST__||new URLSearchParams(location.search).has('test')){", "if(window.__ENABLE_TEST__||new URLSearchParams(location.search).has('test')){")
# avoid old data from before V5; minor save corrupted flag never allow premature memory
(p/'engine.js').write_text(eng)
html=(p/'index.html').read_text().replace('Prototype IV · Freeform actions','Prototype V · The Living Introduction')
(p/'index.html').write_text(html)
# improve offline interpreter default prose to actual scene native narration
narr=(p/'narrator.js').read_text()
narr=narr.replace("passage:`Kael allowed the idea to take shape: “${action.trim().replace(/[.!?]+$/,'').slice(0,180)}.” He measured the distance between wanting something and making it happen. The choice was his intention; the next moment would show what the world allowed.`", "passage:`Kael considered the idea: ${action.trim().replace(/[.!?]+$/,'').slice(0,180)}. His body moved before he could be entirely certain of the outcome. Around him, the world did not grow any less dangerous. Whatever followed would depend on the people and obstacles already before him.`")
(p/'narrator.js').write_text(narr)
print('Built modified v5 sources',len(story),len(eng))
