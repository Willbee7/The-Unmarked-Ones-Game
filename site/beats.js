/* Narrative aftermath pages. These are authored scenes, not quotations from the manuscript.
   Only the author/developer sees the keys. The reader sees the lived consequences. */
'use strict';
const ACTION_BEATS={
 early_mercy:{title:'The Price of a Loaf',place:'The Pit · Behind the ration stalls',text:[
  'Kael found the older boy where the paths narrowed behind the ration stalls. Instead of swinging, he pointed to the half-eaten bread in the boy’s hand and the smaller child waiting by the wall.',
  '“You took it from someone who can’t take it back,” Kael said. The boy laughed—until Kael stepped aside and let him see the three scavengers who had come looking for their missing food. None raised a weapon.',
  'The bully dropped the remaining bread into the dust and backed away. Kael cleaned it against his sleeve before giving it to the child. That evening Lysander listened without praising him. “You found a way to end a fight,” the old man said. “Remember why that matters.”'
 ]},
 early_fury:{title:'When He Would Not Stop',place:'The Pit · The ration stalls',text:[
  'Kael caught the bigger boy behind the ration stalls. He was seven and small enough to be laughed at. The laughter stopped when his first strike found the boy’s knee.',
  'The older child hit the ground. Kael struck again after the stolen sack had fallen free. It took the sound of another child shouting his name to make him step back.',
  'He returned the food. The child thanked him, though she kept glancing at his bloodied knuckles. Lysander said very little that night. His silence stayed with Kael longer than any lecture.'
 ]},
 early_cunning:{title:'A Lesson Without a Fight',place:'The Pit · The storeroom walk',text:[
  'Kael followed the bully from far enough away that the boy never noticed. When the stolen food was hidden beneath an overturned crate, Kael marked the place and waited.',
  'The next morning the crate was empty and the younger scavenger had his food. The bully accused everyone in the shelter, but no one could tell him how the sack had vanished.',
  'Lysander spotted the scuff marks on Kael’s boots. “You’ve learned patience,” he said. “Be careful you don’t learn to enjoy making people helpless.”'
 ]},
 alley_tactic:{title:'A Narrower Battlefield',place:'Luminara · The market alleys',text:[
  'Kael ran toward a passage too cramped for three armored men to stand abreast. A flare of fire struck a rain barrel instead of his back. Steam swallowed the mouth of the alley.',
  'He doubled beneath the first guard’s reaching hand, drove a wooden pole between the man’s legs, and pulled his sword free as he fell. The second lost his footing on wet stone. The third never found space to cast.',
  'In the clearing steam, the patrol’s captain tried to stand. Kael had survived by taking away their advantages, not by matching their strength.'
 ]},
 aggressive_tactic:{title:'The First Strike',place:'Luminara · The market alleys',text:[
  'Kael moved before the captain finished raising his hand. He slammed into the man’s exposed wrist. Fire burst sideways into the wall, showering the alley with broken tiles.',
  'The return blow caught Kael beneath the ribs. He swallowed the pain and used the captain’s weight against him, driving him into the other guards before they could regroup.',
  'The outcasts escaped behind him, but several watched Kael with new caution. He had won the opening by turning the encounter violent before anyone else could move.'
 ]},
 protective_tactic:{title:'A Boy Running Toward Danger',place:'Luminara · The upper streets',text:[
  'Kael shouted at the guards and sprinted across the market with a stolen copper bowl raised over his head. They followed the noise, away from the outcasts dragging their sacks through the side streets.',
  'Ice shattered against the walls behind him. He slid beneath a handcart, tipped it into the captain’s path, and used the confusion to wrench a weapon out of reach.',
  'When he finally staggered into the narrow alley, his side ached and his friends were gone. They were gone because he had given them time to escape.'
 ]},
 guards_spared:{title:'The Blade Stayed Still',place:'Luminara · The market alleys',text:s=>[
  'Kael stood over the fallen captain. He could end the man’s life before the other guards reached their feet. The thought arrived, as clear as the blade in his hand.',
  s.flags.includes('early_fury')?'His knuckles still remembered the bigger boy at the ration stalls. He forced himself to loosen his grip.':'He pictured the hidden shelters beneath the city, where children would suffer for whatever he did here.',
  'He kicked the captain’s weapon into a drain and stepped away. “Stay down.” The patrol watched a boy without magic disappear into the alley. They had their lives, and a humiliation to report.'
 ]},
 guard_killed:{title:'The First Life Taken',place:'Luminara · The market alleys',text:s=>[
  'The captain reached for the weapon at his side. Kael could have stepped back. Instead, he drove his scavenger’s blade into the fallen man and felt the struggle end.',
  'The other guards froze. For a heartbeat even the market seemed to go silent. Kael pulled the blade free. Winning a fight had never felt like this.',
  s.flags.includes('early_fury')?'He told himself the captain would have killed him if given the chance. The explanation came quickly, almost too quickly.':'He had watched stronger men die in the Pit, but this was the first life he had ended with his own hands. He could already imagine Lysander’s face when he learned.',
  'The survivors fled toward the palace. One shouted that the boy was a murderer. Kael ran in the opposite direction, knowing the people below would hear that word soon enough.'
 ]},
 guard_unconscious:{title:'Silence in the Alley',place:'Luminara · The market alleys',text:[
  'Kael struck the captain with the flat of the stolen weapon. The man slumped against the wall, breathing but unresponsive.',
  'Kael collected the weapons he could carry and left the rest in the gutter. No one had died. That did not mean the patrol would forgive the humiliation.',
  'A woman at a shuttered window watched him escape. By morning she would be repeating a story about the small boy who had brought royal guards to their knees.'
 ]},
 elena_supported:{title:'A Hand Beside Hers',place:'The Pit · The lantern passages',text:[
  'Kael stayed where he was. The others backed away as the light gathered between Elena’s fingers, bright enough to show every crack in the passage walls.',
  '“You don’t have to put it out for us,” he said. “Just breathe.” Elena stared at him as if she expected him to recoil. He did not.',
  'The flare weakened and went dark. Later she sat beside him without being asked, quietly sharing the last of her bread.'
 ]},
 elena_defended:{title:'The Threat in His Voice',place:'The Pit · The lantern passages',text:[
  'When the others shouted at Elena to stop, Kael stepped between them and her. “Back away,” he said. No one mistook it for a suggestion.',
  'Elena’s light snapped out. One of the younger scavengers stumbled as he retreated. The danger had passed, but the tension remained.',
  'Elena caught Kael by the sleeve. “I needed space,” she told him. “Not another fight.” He had protected her from the crowd. He was less sure he had listened to her.'
 ]},
 elena_training:{title:'A Flame That Could Be Learned',place:'The Pit · The lantern passages',text:[
  'Kael sat across from Elena and placed a small stone between them. “Light this,” he told her. “Not the whole tunnel. Just the stone.”',
  'Her first attempt scorched the wall. The second made the stone glow for an instant. She gritted her teeth, refusing to be comforted or dismissed.',
  'They practiced until both were exhausted. Elena walked back to the shelter with soot on her hands and a look Kael had rarely seen on her face: pride.'
 ]},
 evacuation:{title:'The Warning Spreads',place:'The Pit · The lower shelters',text:[
  'Kael ran from shelter to shelter carrying news of the soldiers. Some believed him immediately. Others accused him of bringing the danger down upon them.',
  'He did not argue. He helped children through the drainage cuts, carried medicine for the older scavengers, and watched families disappear into tunnels they had once been afraid to enter.',
  'By nightfall the Pit had begun emptying before the first patrol arrived. Not everyone escaped, but the massacre Kael feared was no longer inevitable.'
 ]},
 prepared_shelters:{title:'What They Could Carry',place:'The Pit · The refuge passages',text:[
  'Kael returned to the side shelters before answering Lysander’s call to leave. He traded a length of wire for lamp oil, gathered dry cloth, and convinced a reluctant healer to part with a roll of clean bandages.',
  'Every extra bundle weighed on his back. Elena offered to take half. “You’re planning for a disaster,” she said.',
  '“We’ve lived through enough of them,” Kael answered. When the company finally gathered, their packs were heavier and their chances a little better.'
 ]},
 packed_medicine:{title:'The Weight of Preparation',place:'The Pit · The last safe cave',text:[
  'Kael went back through the shelter while everyone else argued over which tunnel to take. He packed clean cloth, bitter medicinal herbs, a second water flask, and a lantern with enough oil for an extra night.',
  'Lysander frowned at the delay but helped tie the bundles. “Every minute we spend here, they’re looking,” he warned.',
  '“And every hour below, someone might bleed,” Kael replied. The old scavenger tightened the final knot without another word.'
 ]},
 hurried_escape:{title:'The Door Left Open',place:'The Pit · The forgotten stair',text:[
  'Kael cut short the argument and ordered the company into the passage before the patrols could reach the shelter.',
  'Their supplies were light. A child called out that a medicine bundle had been left behind, but the sound of boots above them made turning back impossible.',
  'They saved time. The omission would follow them into the tunnels.'
 ]},
 cidric_prepared:{title:'The Map Under the Lamp',place:'The Pit · The last safe cave',text:[
  'While the others slept in uneasy shifts, Kael held a lantern over Cidric’s map. Cidric compared its old symbols to the carvings in the wall, muttering corrections as he worked.',
  'Near dawn he circled a maintenance passage that the company might otherwise have missed. “It’s longer,” Cidric said, “but it might keep our feet dry.”',
  'Kael marked the route in charcoal. The tunnels would test whether Cidric’s interpretation was right.'
 ]},
 flood_wounds:{title:'The Black Water',place:'Luminara · The drowned passage',text:[
  'Kael plunged into the water first. Beneath the surface his boot found no stone. He dropped, caught the edge with one hand, and felt broken masonry cut his leg.',
  'The others hauled him out. Elena knelt beside the wound, but Kael waved her away as soon as he could stand.',
  'They gained an hour on the patrols. He carried the pain into the next chamber.'
 ]},
 dry_route:{title:'A Door Behind the Wall',place:'Luminara · The maintenance tunnels',text:[
  'Cidric found the mark he had drawn on his map: three shallow cuts beneath a cracked arch. Behind it lay a narrow corridor dry enough to leave footprints.',
  'The company passed without entering the flooded section. Kael saw the younger Lysander check every corner with an arrow ready.',
  'Preparation had not defeated the dangers ahead. It had given them one fewer danger to face.'
 ]},
 elder_rescued:{title:'No Farewell Tonight',place:'Luminara · The narrow vaults',text:[
  'Kael dropped to his knees beside Lysander, ripping open the medicine bundle he had insisted they carry. His hands shook as he pressed cloth against the wound.',
  'Thorne and the younger Lysander held back the marauders. Elena spent the smallest burst of magic she could manage to slow the bleeding.',
  'For a moment Kael heard nothing but the old man’s breath. It came again. And again. He was not safe, but he was alive.'
 ]},
 runes_turned:{title:'The Language of the Door',place:'Luminara · The ancient chamber',text:[
  'Kael shouted for Elena to hold the guardian’s attention. Her magic flared against its darkness while Cidric called out symbols from the walls.',
  'Kael traced the pattern across the stone door. For an instant he thought it would not answer. Then the runes brightened beneath his palm and the guardian screamed as its own binding drew it backward.',
  'When the light faded, the door stood still and the company was breathing. Kael could see an opening where there had only been stone.'
 ]},
 guardian_diverted:{title:'The Distance Between Heartbeats',place:'Luminara · The ancient chamber',text:[
  'Kael ran beneath the guardian’s sweeping arm, drawing it away from Cidric and the door. A wave of dark magic caught his shoulder and nearly took his footing.',
  'He kept moving. Behind him Cidric called the last sequence of symbols while Elena steadied the light around them.',
  'The guardian turned too late. Its own spell folded inward and dragged it into the stone. Kael reached the door hurt, trembling, and still upright.'
 ]},
};
function buildActionBeat(mark,s,origin,next){
 const beat=ACTION_BEATS[mark];if(!beat)return null;
 return {origin,target:next,act:STORY[origin]?.act||'THE STORY',title:beat.title,place:beat.place,text:typeof beat.text==='function'?beat.text(s):beat.text};
}
