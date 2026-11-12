/* THE UNMARKED ONES — INTERACTIVE STORY DATA
   This story adapts the author's origin and introduction. Non-canonical consequences are explicitly generated as alternate history.
   Do not expose hidden character mechanics before their narrative reveal. */
'use strict';
const opt=(label,next,detail='',effect=null,more={})=>({label,next,detail,effect,...more});
const p=(text,kind='normal')=>({text,kind});
const observed=(s,key)=>s.flags.includes(key);
const knows=(s,key)=>s.knowledge.includes(key);
const isRuined=s=>observed(s,'pit_massacre');
const inner=s=>{
 const v=s.mind.violence,c=s.mind.care,n=s.mind.numbness,gr=s.mind.grief;
 if(n>=4)return 'Kael considered his options without allowing his face to change. The quiet in his mind unsettled him more than anger once had.';
 if(gr>=4)return 'For a moment the memory of the people he had lost seemed heavier than his body. He carried it anyway.';
 if(v>=5 && c<=2)return 'His first thought was how quickly a threat could be ended. The thought arrived so naturally that he almost failed to notice it.';
 if(c>=4)return 'He searched the faces around him before counting the dangers. That was the kind of man he still wanted to be.';
 return 'Kael watched, listened, and waited. He had survived by noticing what stronger people overlooked.';
};
const STORY={
 birth:{act:'ORIGIN · THE IMMORTALS',title:'A Child Without a Mark',place:'Luminara · The royal palace',text:[
  'In the kingdom of Luminara, power was everything. Magic shimmered in the sky and lived in the bones of the royal family—the Immortals—whose gifts halted the passage of age.',
  'Queen Seraphina, fiercest among them, commanded an inferno powerful enough to turn cities to ash. Across twelve other kingdoms, rulers measured their ambitions against hers.',
  'On a storm-struck night she gave birth to a son. When she held him, she searched for the spark that proved her bloodline. There was no glow, no symbol, no flicker of power.',
  p('He was Unmarked.','thought')
 ],choices:[opt('Turn the page','judgment')]},
 judgment:{act:'ORIGIN · THE SENTENCE',title:'The Pit of Silence',place:'Luminara · Beneath the throne',text:[
  'In Luminara, to be Unmarked was to be treated as nothing. Seraphina feared the weakness her child might suggest to the kingdoms watching her throne.',
  'Her order was swift. The infant was cast into the Pit of Silence, where beggars, thieves, and the unwanted struggled beneath the city.',
  'His small body struck the darkness. Bruised and bleeding, he cried into a place that had swallowed more lives than anyone bothered to count.',
  p('But Kael did not die.','thought')
 ],choices:[opt('Follow the cry into the darkness','found')]},
 found:{act:'ORIGIN · A NAME',title:'The Man Who Found Him',place:'The Pit · The lower ruins',text:[
  'An aging scavenger named Lysander heard the child. He followed the sound through rubble and found a tiny body that should not have survived the fall.',
  'The boy opened his eyes. Something stubborn and unbroken looked back at the old man.',
  'Lysander carried him home and named him Kael—“mighty warrior” in the old tongue. He became the boy’s father in every way that mattered.',
  'There was no magic to teach. Instead, Lysander taught the things that kept the forgotten alive: patience, observation, the right moment to flee, and the courage to defend another.'
 ],choices:[opt('Seven years later','training')]},
 training:{act:'INTRODUCTION · AGE SEVEN',title:'Lessons in the Dark',place:'The Pit · Lysander’s shelter',text:[
  'At seven, Kael was already a formidable fighter. He had learned to take food from guarded storerooms, read footprints in wet stone, and fight larger opponents without meeting their strength head-on.',
  'That morning, another scavenger’s child returned with a split lip and an empty sack. A bigger boy had taken his food. Lysander did not intervene. He watched Kael instead.',
  '“A fight,” the old man said, “is easy to start. What comes after it is what ruins people.”'
 ],choices:[
  opt('Get the food back without hurting anyone.','upper_streets','Find another way to settle it.',{care:2,focus:1}, {mark:'early_mercy'}),
  opt('Beat the bully until he learns not to steal.','upper_streets','Violence becomes the easiest answer.',{violence:2,defiance:1},{mark:'early_fury'}),
  opt('Observe the boy for a day; take the food when he leaves it unguarded.','upper_streets','Patience before confrontation.',{focus:2},{mark:'early_cunning'})
 ]},
 upper_streets:{act:'INTRODUCTION · THE UPPER DISTRICTS',title:'The Elemental Guard',place:'Luminara · The market alleys',text:s=>[
  'Kael ventured into the upper districts with a handful of outcasts searching for food. Beyond the market rose the gilded towers of the royal district.',
  'The guards spotted them. Their hands brightened with elemental magic. The older outcasts scattered, leaving Kael in the mouth of a narrow alley.',
  observed(s,'early_fury')?p('His fists tightened. He remembered how quickly the larger boy had fallen. Part of him wanted to try it again.','thought'):observed(s,'early_mercy')?p('They were stronger, and there were people behind him who could not outrun them. That mattered more than winning.','thought'):p('Kael counted the guards, the alley mouths, and the places their magic would strike stone instead of flesh.','thought'),
  observed(s,'early_fury')?'The smaller scavenger who had watched Kael beat the bully stayed far behind him now. Kael caught the look in the child’s eyes and did not know what to do with it.':observed(s,'early_mercy')?'A boy who had once received his stolen food back without a fight squeezed through a gap in the stalls. He gave Kael a nervous nod before fleeing.': 'Kael remembered the empty crate behind the ration stalls: strength was only useful when he knew where to place it.',
  'He knew he could not overpower the patrol. But he had watched their movements before.'
 ],choices:[
  opt('Draw them into the narrow alley and disarm them.','guards_downed','Use the alley to break their formation.',{focus:1},{mark:'alley_tactic'}),
  opt('Attack the captain before he can cast.','guards_downed','A harder, angrier approach.',{violence:1,defiance:1,hp:-7},{mark:'aggressive_tactic'}),
  opt('Use the alleys to draw the guards away from the outcasts.','guards_downed','Risk your own safety to protect the others.',{care:1,hp:-4},{mark:'protective_tactic'})
 ]},
 guards_downed:{act:'INTRODUCTION · THE FIRST LINE',title:'A Guard on His Knees',place:'Luminara · The market alleys',text:s=>[
  observed(s,'alley_tactic')?'The alley was filled with settling steam, overturned barrels, and the groans of armored men who had run out of room to fight. Kael stood in the narrow space he had chosen.':observed(s,'aggressive_tactic')?'Broken tiles covered the stones. Kael held one hand against his bruised ribs; the captain had struck him hard before falling beneath the rush of Kael’s counterattacks.':'The overturned cart blocked the market lane. Somewhere beyond it, the fleeing outcasts had reached safety. Kael wiped rainwater and dust from his face.',
  observed(s,'aggressive_tactic')?'The captain lay sprawled beside the wall, his casting hand bleeding. One guard crawled toward his fallen sword.':'The captain lay against a wall, his weapon beyond his grasp. The other guards struggled to rise.',
  'Kael stood above the captain with a short scavenger’s blade in his hand. He knew the difference between stopping a threat and ending a life.',
  observed(s,'early_fury')?p('He had already learned how satisfying it felt when a stronger opponent finally stopped moving. He did not like how easily that thought returned.','thought'):p('Lysander’s warning came back to him: what comes after a fight is what ruins people.','thought')
 ],choices:[
  opt('Leave the guards alive, disarmed and humiliated.','queen_report','Leave the captain alive. The Pit would pay for a royal death.',{care:1,focus:1},{mark:'guards_spared'}),
  opt('Kill the helpless captain.','queen_report','End the captain’s life before he can rise.',{violence:3,grief:1,defiance:1},{mark:'guard_killed',intent:'early_kill'}),
  opt('Strike him unconscious and escape without another word.','queen_report','No death, but the captain will remember your face.',{focus:1},{mark:'guard_unconscious'})
 ]},
 queen_report:{act:'INTERLUDE · THE THRONE',title:'A Description Too Familiar',place:'Luminara · Seraphina’s court',text:s=>[
  observed(s,'guard_killed')?'A royal guard was dead. The survivors brought the body and the story of a fierce Unmarked child before the throne. The report carried more fear than humiliation.':observed(s,'guard_unconscious')?'The captain was carried into the throne chamber unconscious. His surviving patrol spoke for him, still struggling to explain how a small Unmarked boy had taken their weapons.':'The guards returned to the palace alive, bruised, and deeply humiliated. One of them could hardly look at the throne while describing the child who had let him walk away.',
  'Seraphina demanded a description. Piercing eyes. Unnatural resilience. A mind that turned the city’s own streets against its soldiers.',
  'The queen remembered the child she had cast away. Her fury cooled into something worse: fear of what the other twelve kingdoms might learn.',
  observed(s,'guard_killed')?'“Erase him,” she ordered. “And teach the district what it costs to hide him.”':'“Find him,” she ordered. “Make certain he never threatens my throne.”'
 ],choices:[opt('Return beneath the city','elena_youth')]},
 elena_youth:{act:'INTRODUCTION · THE FORGOTTEN',title:'The Girl With Broken Magic',place:'The Pit · The lantern passages',text:s=>[
  'The years that followed were shaped by flight. The guards searched the alleys and the outcasts moved their shelters whenever the watch came too close.',
  'Among them was Elena, another abandoned child. She had magic, but it came in uncertain flares, enough to make her valuable to cruel people and dangerous to herself.',
  observed(s,'guard_killed')?'Word of the dead guard reached the Pit before Kael did. Some of the older scavengers called him dangerous. Elena did not turn away, but she asked once, quietly, whether the killing had been necessary. He did not give her a simple answer.':'Word of the defeated royal patrol spread through the Pit. Some called Kael brave. Others feared the retaliation that would surely follow. Elena saw how those stories weighed on him even when he pretended they did not.',
  'She and Kael understood each other without having to explain what it meant to be unwanted. Their friendship deepened as they grew older.',
  'One night Elena’s trembling hands lit the passage too brightly. The young outcasts around her recoiled.'
 ],choices:[
  opt('Stand beside her until the light settles.','hunt','Let Elena decide how much help she wants.',{care:2,bond:2},{mark:'elena_supported'}),
  opt('Tell the others to get back; nobody will touch her.','hunt','Protection spoken like a threat.',{violence:1,defiance:1,bond:1},{mark:'elena_defended'}),
  opt('Ask her to practice controlling it, however long it takes.','hunt','Treat her as a partner, not a weakness.',{focus:1,bond:2},{mark:'elena_training'})
 ]},
 hunt:{act:'INTRODUCTION · THE HUNT',title:'The Price of Being Found',place:'The Pit · A hidden refuge',text:s=>[
  'The queen’s soldiers never stopped looking. Kael fought them more than once, each encounter drawing danger closer to the people he called family.',
  observed(s,'guard_killed')?'The killing in the market had changed the patrols. This was no longer merely a hunt for one boy. The crown had begun preparing a punitive sweep of the Pit.':'Kael had spared the guards all those years ago. Their humiliation had still brought the queen’s attention—but the outcasts had learned how to stay ahead of her patrols.',
  observed(s,'elena_supported')?'Elena watched the lantern flame flicker, then rested her hand beside Kael’s without looking at him. She had not forgotten who had stayed when her magic frightened everyone else.':observed(s,'elena_defended')?'Elena was close enough to hear the conversation. “Don’t decide for me again,” she told Kael, as fiercely as she had defended herself in the lantern passage.':'Elena had begun practicing with a small stone when she thought no one was looking. The light she made was still uncertain, but more deliberate than before.',
  'Lysander watched the tunnel mouth, his face severe. “We cannot keep waiting for the day they find us.”'
 ],choices:s=>observed(s,'guard_killed')?[
   opt('Warn the shelters and move everyone before the sweep.','gather','An attempt to contain the damage.',{care:2,focus:1},{mark:'evacuation'}),
   opt('Stay and challenge the soldiers at the heart of the Pit.','pit_burning','Keep the fight here, where your people live.',{violence:2,defiance:2},{mark:'pit_massacre'}),
   opt('Leave the Pit alone before the soldiers find you.','alone_departure','The people you leave will face the sweep without you.',{numbness:1,grief:2},{mark:'left_pit'})
  ]:[
   opt('Listen to what Lysander has discovered.','gather','The original route toward freedom.',{focus:1}),
   opt('Visit the other shelters and gather supplies first.','gather','Prepare more carefully.',{care:1,supplies:1},{mark:'prepared_shelters'})
  ]},
 pit_burning:{act:'INTRODUCTION · THE LOWER CITY',title:'The Night the Pit Burned',place:'The Pit · The lower city',text:[
  'The soldiers came with fire.',
  'Kael had believed that if he stood his ground, the others would have time to flee. He was wrong about how many soldiers the queen would send.',
  'Flames raced through the shelters. Friends vanished in the smoke. When dawn reached the shafts in the ceiling, most of the outcasts Kael had grown up beside were dead or scattered.',
  'The old scavenger Lysander lay among the fallen. Elena had escaped the first wave, but no one knew where Ulysses and the others had gone.',
  p('This was not the escape Kael had dreamed of. The story he might have lived was gone.','thought')
 ],choices:[
  opt('Search the ruins for Elena and the remaining survivors.','shattered_years','Choose the living over revenge.',{care:2,grief:2},{mark:'searched_ruins'}),
  opt('Go directly after the commander who ordered the slaughter.','reckless_revenge','A suicidal pursuit may end this life.',{violence:3,grief:2},{mark:'revenge_first'})
 ]},
 reckless_revenge:{act:'INTRODUCTION · THE GARRISON',title:'The Last Charge',place:'Luminara · The sealed garrison',text:[
  'Kael crossed the open courtyard without a plan. He was strong for a boy from the Pit, but his anger could not stop a wall of elemental magic.',
  'He brought one soldier down. The next three struck together. The blast was not an injury he could endure.',
  'The world went dark.'
 ],choices:[opt('Continue','_introDeath','',null,{death:'A barrage of elemental fire killed Kael outside the garrison.'})]},
 alone_departure:{act:'INTRODUCTION · EXILE',title:'The One Who Left',place:'Luminara · The forgotten stair',text:[
  'Kael left the Pit before the soldiers arrived. He told himself he would return with help. By morning, the entrances were sealed and smoke was rising from below.',
  'He could not know who had survived. In the silence after the soldiers departed, he heard no voices calling from the depths.',
  'For years he carried the knowledge that leaving had saved his life, and may have cost others theirs.'
 ],choices:[opt('Find a way beyond Luminara alone','shattered_years','You may never find those you leave behind.',{grief:2,numbness:1},{mark:'alone_path'})]},
 shattered_years:{act:'INTRODUCTION · THE YEARS AFTER',title:'What Remained',place:'Luminara · The hidden crossings',text:s=>[
  'Years passed. The scattered survivors learned different names and new hiding places. There was no close-knit company preparing to escape together; the massacre had broken that possibility.',
  observed(s,'searched_ruins')?'Kael found Elena alive among the ruins. Her magic still flickered, and her trust in him survived, though not without fear. Together they searched for a route out.':'Kael learned to cross the city alone. Whenever someone mentioned the Pit, he said little.',
  'He acquired fragments of an old map describing a rune-bound passage. It was dangerous, incomplete, and possibly his only chance to leave Luminara.',
  p(inner(s),'thought')
 ],choices:[
  opt('Study the map and avoid the royal roads.','solitary_gate','Use caution rather than force.',{focus:2},{mark:'solitary_cautious'}),
  opt('Break through the sealed service tunnel.','solitary_gate','Risk another confrontation.',{violence:1,hp:-5},{mark:'solitary_force'})
 ]},
 solitary_gate:{act:'INTRODUCTION · THE THRESHOLD',title:'A Door Meant for No One',place:'Luminara · The ancient seam',text:s=>[
  'The hidden passage ended in a stone door covered in symbols older than the Immortals. Kael had no Cidric to decipher them and no company to hold a guardian at bay.',
  observed(s,'searched_ruins')?'Elena stood beside him, tracing the stones with unsteady light. Neither knew if the runes would answer.':'Alone, Kael pressed his palms to the cold inscription and listened to the mechanism beyond the wall.',
  'The markings shifted as he tested them. A deep vibration passed through the door. Whatever waited beyond the seal had not yet awakened.'
 ],choices:[
  opt('Follow the pattern instead of forcing the door.','alternate_threshold','A careful escape from a different history.',{focus:1},{mark:'alternate_solved'}),
  opt('Strike the seal until it breaks.','_introDeath','The guardian strikes before you can retreat.',null,{death:'The ancient guardian killed Kael at the threshold.'})
 ]},
 alternate_threshold:{act:'INTRODUCTION · THE OPEN SKY',title:'A Freedom Without Victory',place:'Beyond Luminara',text:s=>[
  'The door opened onto a hillside washed with sunlight. Kael stepped into air that had never carried the queen’s magic.',
  observed(s,'searched_ruins')?'Elena crossed beside him. They were alive, but they had not brought the family they had hoped to save.':'He crossed alone. There was no laughter, no company of friends, and no one to tell him he had done well.',
  'He was free. The word did not feel the way he had imagined.',
  p('Freedom had come. He had paid for it with a future he could scarcely imagine now.','thought')
 ],choices:[opt('Begin the life beyond Luminara','_finishIntro','',null,{mark:'alt_escape'})]},
 gather:{act:'INTRODUCTION · A WAY OUT',title:'The Hidden Passage',place:'The Pit · The last safe cave',text:s=>[
  'One night, with the guards searching ever closer, old Lysander brought the survivors into a hidden cave. He revealed a passage older than the kingdom, a route that might lead beyond the Immortals’ reach.',
  'Kael looked around at the people who had become his family: Elena, fierce and exhausted; Ulysses, his oldest friend and fiercest rival; Thorne, master of hand-to-hand combat; and Thorne’s younger brother Lysander, a gifted archer. Cidric, whose knowledge of old languages had saved them before, knelt over the map.',
  'The old scavenger Lysander—who had raised Kael—stood apart from the younger archer who happened to share his name. Both were prepared to risk the passage.',
  observed(s,'guard_killed')?'Some shelters had escaped the queen’s punitive sweep. Others had not. Kael knew the violence in the market had helped bring the soldiers to their doors.':'There was little time. The queen’s hunt would not end, and none of them wished to grow old in the shadows of Luminara.'
 ],choices:[
  opt('Gather bandages, food, and lantern oil before leaving.','tunnel','Leave slowly, but prepared.',{supplies:2,care:1},{mark:'packed_medicine'}),
  opt('Leave at once before the queen closes the passage.','tunnel','Speed over supplies.',{focus:1},{mark:'hurried_escape'}),
  opt('Let Cidric study the old maps while the others rest.','tunnel','Better knowledge of what waits below.',{focus:2,bond:1},{mark:'cidric_prepared'})
 ]},
 tunnel:{act:'INTRODUCTION · THE JOURNEY',title:'The Paths Beneath the Kingdom',place:'Luminara · The flooded tunnels',text:s=>[
  'The company entered a labyrinth of old stone. One tunnel had collapsed; another lay beneath black water. Far below, unseen creatures moved through the dark.',
  'Thorne cleared fallen rock. The younger Lysander watched the shadows with his bow drawn. Cidric studied worn inscriptions. Elena gathered the smallest lights she dared.',
  observed(s,'packed_medicine')?'Kael’s pack dragged at his shoulder. The oil and bandages took up space where he might have carried another blade. He hoped he would not need them.':'Their packs were light. Whenever someone coughed or stumbled, Kael wondered what they had left behind in their haste.',
  'The old scavenger Lysander kept to the rear, ensuring no one was left behind. The journey tested them in ways the streets of the Pit never had.',
  observed(s,'cidric_prepared')?'Cidric’s map marked a dry maintenance route. The choice would cost time but spare them a dangerous crossing.':'Ahead lay a flooded passage where the water covered a broken floor.'
 ],choices:s=>[
  opt('Use the ledges and cross carefully.','marauders','Slow, safer, and physically exhausting.',{focus:1,hp:-3}),
  opt('Push through the water and save time.','marauders','The water conceals broken masonry.',{hp:-11,defiance:1},{mark:'flood_wounds'}),
  ...(observed(s,'cidric_prepared')?[opt('Take Cidric’s dry maintenance route.','marauders','Your earlier preparation opens another path.',{focus:1},{mark:'dry_route'})]:[])
 ]},
 marauders:{act:'INTRODUCTION · AN AMBUSH',title:'The Cost of Passage',place:'Luminara · The narrow vaults',text:s=>[
  observed(s,'dry_route')?'The company emerged from the dry maintenance passage without the injuries the flooded crossing might have inflicted. At the narrow vaults, however, marauders were already waiting behind the columns.':observed(s,'flood_wounds')?'Kael was still favoring the leg cut in the black water when the first marauder stepped out. The attack came where the vault narrowed, and he could not move as quickly as he wanted.':'The marauders struck where the passage narrowed. Their blades flashed between the columns before the company could retreat.',
  'The old scavenger Lysander was wounded defending the rear. He sank against a pillar, breathing hard. Kael tried to reach him, but a second attacker stepped into his path.',
  'Elena’s magic surged beneath her skin—unstable, dangerous, perhaps powerful enough to scatter the marauders.',
  'Kael had seconds to choose.'
 ],choices:s=>[
  opt('Tell Elena to unleash her magic while you hold the line.','elder_death','Trust Elena to stop the attackers while you hold them back.',{bond:1,grief:1,hp:-5},{mark:'elena_burst'}),
  ...(s.supplies>=2?[opt('Use the bandages and coordinate a rescue of Lysander.','elder_saved','The medicine you carried might buy him time.',{supplies:-2,care:2,focus:1,hp:-6},{mark:'elder_rescued'})]:[]),
  opt('Charge through the attackers without waiting.','_introDeath','A desperate gamble, even for Kael.',null,{death:'Kael was killed by the marauders before the company could break the ambush.'})
 ]},
 elder_death:{act:'INTRODUCTION · A LAST REQUEST',title:'Never Forget Who You Are',place:'Luminara · The lower vaults',text:[
  'Elena’s burst of magic scattered the marauders. When the light faded, she could barely stand.',
  'Kael fell beside the old man who had raised him. There was nothing left in Lysander’s body to heal. The old scavenger took Kael’s hand and told him how proud he was.',
  p('“Never forget who you are, and never stop fighting for those who cannot fight for themselves.”','thought'),
  'He died there in the dark. The company continued carrying his words, and the grief of leaving him behind.'
 ],choices:[opt('Carry his words toward the stone door.','rune_chamber','', {grief:2,care:1},{mark:'elder_fell'})]},
 elder_saved:{act:'INTRODUCTION · THE VAULTS',title:'The Old Man Breathes',place:'Luminara · The lower vaults',text:[
  'Kael dropped beside the old man while Thorne and the younger Lysander held the attackers back. The bandages bought time; Elena used only a little of her unstable magic to steady the bleeding.',
  'The marauders fled. Lysander was still gravely wounded, but alive. He tried to speak, and Kael stopped him.',
  '“Save it,” Kael whispered. “You can lecture me when we get outside.”',
  'The old scavenger gave a faint, pained smile. His survival would change everything that followed.'
 ],choices:[opt('Help Lysander through the last passage.','rune_chamber','', {care:1,bond:1},{mark:'elder_lives'})]},
 rune_chamber:{act:'INTRODUCTION · THE GATE',title:'The Guardian and the Runes',place:'Luminara · The ancient chamber',text:s=>[
  'The company entered a vast chamber. Runes glowed along the walls, circling a stone door. A guardian rose from the shadows—its magic darker than anything the group had faced.',
  'Every strike Kael landed seemed to disappear into the creature. Its power drew strength from the darkness itself. Thorne and the younger Lysander struggled to keep it away from Elena.',
  observed(s,'cidric_prepared')?'Cidric recognized an inscription from the maps they had studied by lamplight. He pointed Kael toward the first rune before the guardian could advance. They had one advantage no sword could give them: a warning.':'Kael recalled the old world Lysander had described, when magic and willpower were bound by rules. Cidric had begun interpreting the symbols. Together they saw a pattern that matched the guardian’s movements.',
  observed(s,'elder_lives')?'Behind them the old scavenger leaned against a pillar, alive only because the others had chosen to save him.':'Kael held close the last words of the man who had raised him.'
 ],choices:[
  opt('Ask Elena to hold the guardian while you and Cidric work the runes.','threshold','Turn the guardian’s own binding against it.',{focus:1,bond:1,hp:-5},{mark:'runes_turned'}),
  opt('Draw the guardian away while Cidric works the symbols.','threshold','Keep its attacks away from Cidric and Elena.',{care:1,hp:-13},{mark:'guardian_diverted'}),
  opt('Ignore the symbols and attack the guardian head-on.','_introDeath','Kael’s strength has a limit.',null,{death:'The guardian killed Kael in the ancient chamber.'})
 ]},
 threshold:{act:'INTRODUCTION · FIRST LIGHT',title:'The World Beyond',place:'Beyond Luminara · The sunlit hillside',text:s=>[
  observed(s,'guardian_diverted')?'Kael staggered toward the gate with a fresh wound in his shoulder. The guardian had chased him across the chamber while Cidric finished the binding. Now only dust remained where it had stood.': 'The runes answered beneath Kael’s hand. Elena’s light died to a glow as the guardian was dragged back into the binding it had guarded for centuries. After a terrible silence, the stone door opened.',
  'Sunlight poured across the chamber floor. Kael and his companions crossed into a land untouched by the Immortals. Grass moved beneath a wind they had never felt in the Pit.',
  observed(s,'elder_lives')?'The old scavenger Lysander stepped into the light with help on either side. Kael could not stop looking at him: a life he might so easily have lost.':'The old scavenger Lysander was absent. Kael had reached freedom, but not with everyone he had promised to bring.',
  'Elena stood beside him, her expression balanced between wonder and exhaustion. “What do we do now?” she asked.',
  p('“We build a new life,” Kael said. “Together.”','thought')
 ],choices:[opt('Turn the page','_finishIntro')]},
 post_hill:{act:'CHAPTER ONE · THE OTHER SIDE',title:'Morning Without Walls',place:'Beyond Luminara · The first hillside',text:s=>[
  isRuined(s)?'There should have been a company here. Instead Kael stood beneath an open sky with the weight of the destroyed Pit on his shoulders. The world was broad; his path through it had narrowed.':'The first sunrise beyond Luminara came quietly. The company woke beneath an unfamiliar sky. Even the air seemed to belong to a different world.',
  isRuined(s)?(observed(s,'searched_ruins')?'Elena was nearby, collecting the last of their provisions. No one else from the old company had made this crossing with them.':'Kael had no companions to wake. His first meal beyond Luminara was eaten in silence.'):(observed(s,'elder_lives')?'The old scavenger Lysander slept by the fire, his bandages still clean. Thorne and his younger brother guarded the camp while Cidric studied the horizon.':'Elena tended the fire. Thorne and his younger brother watched the low hills, while Cidric unfolded his battered map. Ulysses sat near Kael, as he always had.'),
  s.lives>0?p(s.lives===1?'He knew this morning. That was impossible. He remembered the end of the last one.':`He had seen this morning ${s.lives} times before. The sound of wind through the grass no longer meant innocence.`,'memory'):p(inner(s),'thought'),
  isRuined(s)?'Somewhere ahead, smoke curled over a distant crossroads. It might mean shelter. It might mean soldiers.':'A road descended toward a settlement. Smoke rose from its chimneys, and movement stirred near the far bridge.'
 ],choices:s=>[
  ...(s.lives>0&&knows(s,'road_attack')?[opt('Warn them about the soldiers at the bridge.','foresight','You have seen the danger before. Nobody else has.',{focus:1},{mark:'gave_warning'})]:[]),
  ...(s.lives>0&&knows(s,'crossroad_trap')?[opt('Avoid the narrow causeway; you remember the trap.','foresight','Your past experience changes the route.',{focus:1},{mark:'avoided_trap'})]:[]),
  opt('Walk down the main road and see who lives nearby.','road','Learn what the new world is like.'),
  opt('Study the tracks before approaching the settlement.','scout','A cautious route with its own dangers.',{focus:1}),
  ...(!isRuined(s)?[opt('Stay with the companions and talk around the fire.','companion_talk','A quieter moment that can change a relationship.',{bond:1})]:[])
 ]},
 companion_talk:{act:'CHAPTER ONE · A QUIET MOMENT',title:'People Who Do Not Know',place:'Beyond Luminara · The campfire',text:s=>[
  s.lives>0?'Elena smiled as Kael approached. He remembered the way the last life had ended, though she had never witnessed that death.':'Elena moved nearer the fire, warming her palms above the coals. Thorne and his younger brother argued quietly over how to read the map.',
  s.lives>0?'“What is it?” Elena asked. “You look as though you’ve seen a ghost.”':'“You’ve barely spoken since we crossed,” Elena said. “I thought you’d be happier.”',
  p(inner(s),'thought')
 ],choices:s=>[
  opt(s.lives>0?'Tell her you fear something ahead, but not why.':'Admit that freedom feels stranger than expected.','road','Share part of the burden.',{care:1,bond:1},{mark:'shared_worry'}),
  opt('Say you are fine and change the subject.','road','Keep the thoughts to yourself.',{numbness:1},{mark:'concealed_feelings'}),
  ...(s.lives>0?[opt('Tell Elena you remember dying.','road','She will not share the memory, but may believe you.',{bond:1,grief:1},{mark:'confessed_memory'})]:[])
 ]},
 scout:{act:'CHAPTER ONE · TRACKS IN THE MUD',title:'The Narrow Causeway',place:'Beyond Luminara · The old road',text:s=>[
  'Kael found bootprints near the stone causeway. They were fresh. A second set cut into the embankment where someone had waited out of sight.',
  s.lives>0&&knows(s,'crossroad_trap')?p('He remembered the place. He remembered a soldier rising out of the reeds, and the blade that followed.','memory'):'There were two ways forward: a sheltered causeway where an attacker might wait, or a longer path over exposed hills.',
  'Kael could see the market roofs through the trees.'
 ],choices:[
  opt('Take the longer route across the ridge.','road','Caution changes who reaches the crossroads first.',{focus:1},{mark:'ridge_detour'}),
  opt('Cross the causeway quickly, trusting your speed.','_postDeath','The ambush is stronger than it looks.',null,{death:'An unseen soldier drove a spear into Kael at the narrow causeway.',learn:'crossroad_trap'})
 ]},
 foresight:{act:'CHAPTER ONE · THE KNOWING',title:'Before the Blow Falls',place:'Beyond Luminara · The road',text:s=>[
  isRuined(s)?'Kael turned aside before the patrol reached the causeway. The soldiers searched the empty road where he should have been.':'Kael stopped the group before the bridge. He told Cidric where the soldiers would be waiting, although he offered no explanation for how he knew.',
  'The route changed. The ambush that had once taken him by surprise found no one to trap.',
  s.lives>0?p('The others called it good instinct. Only Kael knew he was walking through a life he had already lost.','memory'):'The road was quiet behind them.'
 ],choices:[opt('Approach the crossroads from the hills.','market','The settlement is still in danger.',{focus:1},{mark:'forewarned'})]},
 road:{act:'CHAPTER ONE · AN UNEASY FREEDOM',title:'The Road to the Crossroads',place:'Beyond Luminara · The lower valley',text:s=>[
  'The first village beyond Luminara stood at the meeting of two roads. The stalls were half-closed. Travelers hurried away from the square.',
  isRuined(s)?'Kael recognized the smell of fear from the night the Pit burned. Every instinct told him to watch for fire.':'Ulysses asked whether they should stop and barter. Cidric frowned at the fresh hoofprints near the village wall.',
  observed(s,'guard_killed')?p('He remembered the first royal guard he had killed. Back then, he had told himself the choice was necessary. He had stopped being sure when the soldiers returned.','thought'):p('He had fought guards since childhood without needing to kill them. He wondered how long that principle could survive a world he did not understand.','thought')
 ],choices:[
  opt('Enter the crossroads and speak to the people there.','market','Find out why everyone is fleeing.',{care:1}),
  opt('Circle the village, looking for soldiers.','market','Approach from a position of strength.',{focus:1},{mark:'approach_flank'})
 ]},
 market:{act:'CHAPTER ONE · THE CROSSROADS',title:'A Battle Among Strangers',place:'Beyond Luminara · The market square',text:s=>[
  'Steel rang against stone. A patrol was forcing its way through the marketplace, and a masked commander shouted orders from behind a line of shields.',
  'A family crouched behind an overturned cart. They could not cross the square without stepping into the fighting.',
  'The commander began to retreat. If he escaped, he might return with reinforcements. If Kael pursued him, the family would have to find another way out.',
  p(inner(s),'thought')
 ],choices:[
  opt('Get the civilians to safety first.','protected_market','Keep the family out of harm, even if the commander escapes.',{care:2},{intent:'protect_civilians',mark:'wanted_rescue'}),
  opt('Pursue the commander before he escapes.','pursued_commander','Remove the threat first.',{violence:2},{mark:'chased_commander'}),
  opt('Try to separate the commander from his soldiers without abandoning the family.','balanced_market','A difficult compromise.',{focus:2},{mark:'tactical_rescue'})
 ]},
 protected_market:{act:'CHAPTER ONE · THE CHOICE',title:'The Ones Behind the Cart',place:'Beyond Luminara · The market square',text:s=>[
  'Kael turned away from the fleeing commander and made a path through the fight. The family followed him behind a stone fountain and into an alley.',
  'The commander escaped. Whatever he intended next would now have to be faced another day.',
  observed(s,'guard_killed')?'Kael felt the memory of the boy who once chose to kill a helpless guard. Today he had made a different choice. He could not erase the first, but it did not own every decision.':'Kael recognized the feeling. As a boy, he had spared guards to protect the people of the Pit. The reason was different here, but the decision felt familiar.',
  p('A living person could make another choice. That, at least, was still true.','thought')
 ],choices:[opt('See what the battle has left behind.','prisoner')]},
 ignored_market:{act:'CHAPTER ONE · THE CROSSROADS',title:'He Did Not Turn',place:'Beyond Luminara · The market square',text:[
  'Kael saw the family. He knew exactly what the choice in front of him meant.',
  p('Get them out first, he thought. But his feet were already moving after the commander. If that man escaped, more people would die. At least that was what he told himself.','thought'),
  'He pursued the retreating soldiers. When he finally turned back, the family was still alive—but one of them lay injured beside the cart, and precious minutes had been lost.',
  'He had not tried to kill the civilians. He simply had not fought as hard for them as he might once have done.',
  p('That was the terrible difference between what he meant to do and what he actually did.','thought')
 ],choices:[opt('Face what happened.','prisoner','His disobedience is part of the story now.',{grief:1},{mark:'ignored_player_rescue'})]},
 pursued_commander:{act:'CHAPTER ONE · THE PURSUIT',title:'A Threat Ended',place:'Beyond Luminara · The market square',text:[
  'Kael cut through the soldiers and drove their commander away from the square. The patrol broke formation and retreated.',
  'By the time Kael returned, the family had found shelter, though several bystanders were hurt in the confusion.',
  'The threat had been stopped. The cost of stopping it had not been chosen by Kael alone.'
 ],choices:[opt('See who remains.','prisoner')]},
 balanced_market:{act:'CHAPTER ONE · THE NARROW WAY',title:'A Third Answer',place:'Beyond Luminara · The market square',text:[
  'Kael tipped the overturned cart across the alley, breaking the soldiers’ line of sight. He shouted for the family to run while he stepped between the commander and his escape route.',
  'It was not perfect. The commander escaped with a wound, and a young merchant suffered a broken arm. But the family reached safety.',
  'Sometimes the answer Kael wanted did not exist. He would have to live with what remained.'
 ],choices:[opt('Search the square for anyone left behind.','prisoner')]},
 prisoner:{act:'CHAPTER ONE · A SECOND LINE',title:'The Man Who Surrendered',place:'Beyond Luminara · An empty stall',text:s=>[
  'One soldier had been left behind. His sword lay in the mud and both hands were raised. He was young, terrified, and no longer a threat.',
  s.mind.violence>=4?p('Ending him would be simple. A part of Kael’s mind presented the idea before he could decide whether he wanted it.','thought'):p('The guard in Luminara came back to him: a weapon out of reach, a life that could still be spared.','thought'),
  '“Please,” the soldier whispered. “I’m done fighting.”'
 ],choices:[
  opt('Let him go without a weapon.','spared_prisoner','Do not make a prisoner into another enemy.',{care:2},{mark:'prisoner_spared'}),
  opt('Kill the surrendered soldier.','executed_prisoner','The action may conflict with the Kael you have shaped.',{violence:2},{intent:'execute_prisoner',mark:'wanted_execution'}),
  opt('Bind his hands and ask why the patrol attacked.','questioned_prisoner','Answers before judgment.',{focus:2},{mark:'prisoner_questioned'})
 ]},
 refused_execution:{act:'CHAPTER ONE · THE CROSSROADS',title:'The Blade Would Not Fall',place:'Beyond Luminara · An empty stall',text:[
  'Kael raised the scavenger’s blade. The soldier shut his eyes.',
  'Then Kael stopped. The man before him was no longer fighting. He had no reason to kill him except the anger he had carried into the square.',
  p('No. Not like this.','thought'),
  'He shoved the soldier toward the road and ordered him to run. The choice Kael had been given was not the choice he finally made.'
 ],choices:[opt('Leave the square.','late_ambush','There will be consequences for sparing him.',{care:1},{mark:'refused_execution'})]},
 spared_prisoner:{act:'CHAPTER ONE · RESTRAINT',title:'A Life Left Standing',place:'Beyond Luminara · The roadside',text:[
  'Kael kicked the sword into the drainage ditch and gestured toward the road. The soldier fled without looking back.',
  'There was no reward for it. There might not even be gratitude. But the man was alive, and Kael had decided the fight was over.'
 ],choices:[opt('Follow the road away from the settlement.','late_ambush')]},
 executed_prisoner:{act:'CHAPTER ONE · A LINE CROSSED',title:'No One to Fight Back',place:'Beyond Luminara · The roadside',text:s=>[
  'Kael struck once. The soldier fell without a sound.',
  isRuined(s)?'No companion stood beside him to object. That did not mean there was no one left to answer to.':'A silence opened among the companions. Elena stared at the ground. Ulysses watched Kael with an expression he could not read.',
  'The killing had not made the square safer. It had only made one more death part of Kael’s history.',
  p(inner(s),'thought')
 ],choices:[opt('Move away from the bodies.','late_ambush','The others will remember this.',{grief:1},{mark:'prisoner_executed'})]},
 questioned_prisoner:{act:'CHAPTER ONE · AN ANSWER',title:'Orders From Somewhere Else',place:'Beyond Luminara · The market square',text:[
  'The soldier insisted that his unit had been sent to seize a courier who crossed the valley at dawn. The family had been caught between the patrol and its target.',
  'Kael loosened the bindings enough for the man to leave. The explanation was incomplete, but it told him the violence had not begun with him.',
  'A second set of hoofprints led toward the ridge. Someone might still be tracking them.'
 ],choices:[opt('Follow the hoofprints toward the ridge.','late_ambush','Knowledge may save a life later.',{focus:1},{mark:'heard_courier'})]},
 late_ambush:{act:'CHAPTER ONE · THE REEDS',title:'A Familiar Shape of Danger',place:'Beyond Luminara · The ridge path',text:s=>[
  'Beyond the village, the road narrowed between a bank of reeds and a stone wall. Kael heard armor scrape behind the wall.',
  knows(s,'road_attack')?p('He knew that sound. He had heard it just before dying. His hands trembled, though no one else could understand why.','memory'):'A soldier stepped into view, pointing a crossbow at Kael’s chest. Two more shapes rose behind him.',
  '“You there. Stop.”'
 ],choices:s=>[
  ...(knows(s,'road_attack')?[opt('Duck before the crossbow fires, exactly as you remember.','epilogue','Knowledge from another life changes this encounter.',{focus:2},{mark:'dodged_from_memory'})]:[]),
  opt('Raise your hands and talk.','epilogue','Try to end the confrontation.',{care:1},{mark:'talked_down_patrol'}),
  opt('Rush the crossbowman before he fires.','_postDeath','This time speed may not be enough.',null,{death:'A crossbow bolt pierced Kael’s chest on the ridge road.',learn:'road_attack'})
 ]},
 epilogue:{act:'END OF PROTOTYPE · CHAPTER ONE',title:'A Story That Continues',place:'Beyond Luminara · The open road',text:s=>[
  'The road opened beyond the ridge. Behind Kael were the decisions that had brought him here, and the people who had survived—or failed to survive—the journey.',
  isRuined(s)?'The Pit had burned. The company he might have led had never formed. His life beyond Luminara would belong to a different history.':observed(s,'elder_lives')?'The old Lysander lived to see freedom, a change that made every conversation around the campfire different.':'He had left the old scavenger Lysander behind, but the words spoken in the tunnels still followed him.',
  observed(s,'ignored_player_rescue')?p('He remembered choosing to protect the civilians. He remembered not doing it. He could not pretend the contradiction had not happened.','thought'):p(inner(s),'thought'),
  s.lives>0?`There were things Kael knew that no one else could know. He had died ${s.lives===1?'once':s.lives+' times'}. What he would do with those memories was still his own burden.`:'He had survived the beginning. The world had not yet shown him everything it could take.',
  'The chapters beyond this moment are still unwritten in this prototype. Kael’s history is not finished.'
 ],choices:[
  opt('Read Kael’s journal.','_journal','Reflect on the decisions that brought him here.'),
  opt('Begin a new story from the opening.','_restart','Start a new playthrough; this life does not rewind.')
 ]},
 return_morning:{act:'CHAPTER ONE · THE SAME MORNING',title:'The World Had Not Moved',place:'Beyond Luminara · The first hillside',text:s=>[
  'Wind shifted through the grass. The rising sun touched the same distant hill. The morning had come again.',
  isRuined(s)?'The ruins of the Pit were still behind him. Those who had died there had not come back, and no one was waiting with explanations.':'Elena stirred by the fire. Ulysses said something familiar about the road. Neither looked at Kael as though anything extraordinary had happened.',
  p(s.lives===1?'I remember the blow. I remember dying. So why am I here?':'Again. The same morning. Another death no one else remembers.','memory'),
  s.mind.curiosity>=3?p('If the world returned to an earlier moment, what could he change? How much did he actually know?','thought'):s.mind.numbness>=3?p('The surprise was fading. That frightened him in a different way.','thought'):s.mind.rage>=3?p('He wanted to rage at someone, but there was no one who could explain what had happened.','thought'):p('He studied the faces of those around him. They had never seen him die. For them, nothing had happened.','thought')
 ],choices:[
  opt('Hide the memory and continue as though nothing happened.','post_hill','Kael keeps this knowledge to himself.',{numbness:1},{mark:'hid_recollection'}),
  opt('Test whether the danger will happen again.','post_hill','Let curiosity guide the next life.',{curiosity:1},{mark:'testing_future'}),
  opt('Promise yourself that no one else will die this way.','post_hill','Resolve can shelter or consume.',{care:1,defiance:1},{mark:'protective_vow'})
 ]}
};
