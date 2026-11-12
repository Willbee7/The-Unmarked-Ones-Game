import asyncio
from playwright.async_api import async_playwright
from pathlib import Path
from urllib.parse import urljoin
from http.server import ThreadingHTTPServer,SimpleHTTPRequestHandler
import threading,os

SITE=str(Path(__file__).resolve().parents[1] / 'site')
class Quiet(SimpleHTTPRequestHandler):
 def log_message(self,*args):pass
 def __init__(self,*args,**kwargs):super().__init__(*args, directory=SITE,**kwargs)
server=ThreadingHTTPServer(('127.0.0.1',0),Quiet)
port=server.server_port
thread=threading.Thread(target=server.serve_forever,daemon=True);thread.start()
base='about:blank'
HTML=Path(SITE,'index.html').read_text().replace('<script src="story.js"></script><script src="beats.js"></script><script src="narrator.js"></script><script src="engine.js"></script>','')
STYLE=Path(SITE,'style.css').read_text()
STORYJS=Path(SITE,'story.js').read_text()
ENGINEJS=Path(SITE,'engine.js').read_text()
BEATSJS=Path(SITE,'beats.js').read_text()
NARRATORJS=Path(SITE,'narrator.js').read_text()
async def load_page(page):
 await page.set_content(HTML)
 await page.add_style_tag(content=STYLE)
 await page.evaluate("""() => {window.__ENABLE_TEST__=true;window.__storage=window.__storage||{};Object.defineProperty(window,'localStorage',{configurable:true,value:{getItem(k){return Object.prototype.hasOwnProperty.call(window.__storage,k)?window.__storage[k]:null},setItem(k,v){window.__storage[k]=String(v)},removeItem(k){delete window.__storage[k]},clear(){window.__storage={}}}})}""")
 await page.add_script_tag(content=STORYJS)
 await page.add_script_tag(content=BEATSJS)
 await page.add_script_tag(content=NARRATORJS)
 await page.add_script_tag(content=ENGINEJS)


async def click(page,starts):
 locator=page.locator('.choice .label').filter(has_text=starts).first
 if await locator.count()==0:
  names=await page.locator('.choice .label').all_text_contents();raise AssertionError(f'Choice {starts!r} missing. Have {names}. title={await page.locator("#title").inner_text()}')
 await locator.click()
 if await page.evaluate('window.__UNMARKED_TEST__.scene()')=='_beat':
  assert await page.locator('#story p').count()>=2
  await page.locator('.choice .label').filter(has_text='Turn the page').first.click()

async def start(page,route='compassion'):
 await page.evaluate('window.__UNMARKED_TEST__.restart()')
 await click(page,'Turn the page');await click(page,'Follow the cry');await click(page,'Seven years later')
 await click(page,'Get the food' if route=='compassion' else 'Beat the bully')
 await click(page,'Draw them into' if route=='compassion' else 'Attack the captain')
 await click(page,'Leave the guards alive' if route=='compassion' else 'Kill the helpless')
 await click(page,'Return beneath')
 await click(page,'Stand beside' if route=='compassion' else 'Tell the others')
 if route=='compassion': await click(page,'Listen to what Lysander')
 else: await click(page,'Warn the shelters')
 await click(page,'Gather bandages' if route=='compassion' else 'Leave at once')
 await click(page,'Use the ledges')
 await click(page,'Tell Elena')
 await click(page,'Carry his words')
 await click(page,'Ask Elena to hold')
 await click(page,'Turn the page')
 return await page.evaluate('window.__UNMARKED_TEST__.get()')

async def run():
 async with async_playwright() as p:
  browser=await p.chromium.launch(headless=True, executable_path='/usr/bin/chromium',args=['--no-sandbox'])
  c=await browser.new_context(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
  errors=[];c.on('page',lambda x:x.on('pageerror',lambda err:errors.append(str(err))))
  page=await c.new_page()
  await load_page(page)
  assert await page.locator('#title').inner_text()=='A Child Without a Mark'
  assert 'Remember' not in (await page.locator('body').inner_text()),'Premature memory reveal'
  await page.screenshot(path=str(Path(SITE,'preview-phone.png')),full_page=True)
  print('PASS initial mobile visible, no spoiler')
  await page.evaluate('window.__UNMARKED_TEST__.restart()')
  for q in ['Turn the page','Follow the cry','Seven years later']: await click(page,q)
  await page.locator('.choice .label').filter(has_text='Get the food').first.click()
  mercy_text=await page.locator('#story').inner_text()
  assert 'instead of swinging' in mercy_text.lower(),mercy_text
  await page.evaluate('window.__UNMARKED_TEST__.restart()')
  for q in ['Turn the page','Follow the cry','Seven years later']: await click(page,q)
  await page.locator('.choice .label').filter(has_text='Beat the bully').first.click()
  fury_text=await page.locator('#story').inner_text()
  await page.screenshot(path=str(Path(SITE,'preview-consequence.png')),full_page=True)
  assert 'first strike' in fury_text.lower(),fury_text
  assert mercy_text!=fury_text
  print('PASS selected actions receive distinct novel prose before the next chapter')
  s=await start(page,'compassion');assert s['introComplete'] and s['scene']=='post_hill' and s['lives']==0
  print('PASS canonical intro / elder death',s['mind'])
  await click(page,'Walk down the main')
  await click(page,'Enter the crossroads')
  await click(page,'Get the civilians')
  await click(page,'See what the battle')
  await click(page,'Kill the surrendered')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['scene']=='refused_execution',s['scene']
  print('PASS compassionate Kael resists player execution request')
  assert 'would not execute' in (await page.locator('#story').inner_text()).lower() or 'kael stopped' in (await page.locator('#story').inner_text()).lower()
  # Test physical death and memory:
  await click(page,'Leave the square')
  await click(page,'Rush the crossbowman')
  assert await page.locator('#title').inner_text()=='The Last Breath'
  await click(page,'I died. How')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['scene']=='return_morning' and s['lives']==1 and 'road_attack' in s['knowledge']
  assert 'I remember' in (await page.locator('body').inner_text())
  await click(page,'Test whether')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['scene']=='post_hill' and s['lives']==1
  assert await page.locator('.choice .label').filter(has_text='Warn them about').count()==1
  print('PASS post intro death, Kael-only memory, unlocked foreknowledge')
  stored=await page.evaluate('JSON.parse(localStorage.getItem("unmarked-ones-living-novel-v2"))')
  assert stored['lives']==1 and stored['scene']=='post_hill'
  print('PASS save persisted in local storage')
  await page.locator('#journalBtn').click()
  assert 'things only kael recalls' in (await page.locator('#modalBody').inner_text()).lower()
  await page.locator('#closeModal').click()
  await page.screenshot(path=str(Path(SITE,'preview-recollection.png')),full_page=True)
  # violence route, independent will:
  await c.clear_cookies();await page.evaluate('localStorage.clear()')
  s=await start(page,'violent')
  assert s['introComplete'] and 'guard_killed' in s['flags']
  await click(page,'Walk down the main');await click(page,'Enter the crossroads')
  await click(page,'Get the civilians')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['scene']=='ignored_market',s
  assert 'pursued' in (await page.locator('#story').inner_text()).lower()
  print('PASS ruthless Kael resists player protection request',s['mind'])
  # major divergent story:
  await page.evaluate('localStorage.clear()');await page.evaluate('window.__UNMARKED_TEST__.restart()')
  for choice in ['Turn the page','Follow the cry','Seven years later','Beat the bully','Attack the captain','Kill the helpless','Return beneath','Tell the others','Stay and challenge','Search the ruins','Study the map','Follow the pattern','Begin the life']:
   await click(page,choice)
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['introComplete'] and s['scene']=='post_hill' and 'pit_massacre' in s['flags'],s['flags']
  print('PASS full alternate history reached post-intro')
  # intro death ordinary:
  await page.evaluate('localStorage.clear()');await page.evaluate('window.__UNMARKED_TEST__.restart()')
  for choice in ['Turn the page','Follow the cry','Seven years later','Beat the bully','Attack the captain','Kill the helpless','Return beneath','Tell the others','Stay and challenge','Go directly after','Continue']:
   await click(page,choice)
  assert await page.locator('#title').inner_text()=='You Died'
  assert 'remember' not in (await page.locator('body').inner_text()).lower()
  await click(page,'Restart from the beginning')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['scene']=='birth' and s['lives']==0 and not s['flags'] and not s['knowledge']
  print('PASS intro true death is ordinary clean restart')
  # narrow screen no horizontal scroll
  for width in [320,375,390,430,768]:
   await page.set_viewport_size({'width':width,'height':844})
   dims=await page.evaluate('({scroll:document.documentElement.scrollWidth,client:document.documentElement.clientWidth})')
   assert dims['scroll']<=dims['client']+1,(width,dims)
  print('PASS responsive widths: 320,375,390,430,768')
  assert not errors,errors
  print('PASS zero uncaught JS exceptions')
  await browser.close()
 server.shutdown()

asyncio.run(run())
