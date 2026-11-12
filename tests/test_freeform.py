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
  page=await c.new_page()
  errors=[];page.on('pageerror',lambda err:errors.append(str(err)))
  async def mock(route,choice='0',passage='Kael looked up from the stone and considered his next movement. He knew that the action he intended was only a beginning, not the result. His breath slowed while he weighed the risk to everyone around him. Something in his thoughts sharpened, and he prepared to act before hesitation could swallow the moment.',tone='care',status=200):
   await route.fulfill(status=status,content_type='application/json',body=__import__('json').dumps({'option':choice,'tone':tone,'passage':passage}))
  await load_page(page)
  assert await page.locator('#freeActionPanel').is_hidden()
  for t in ['Turn the page','Follow the cry','Seven years later']:await click(page,t)
  assert await page.locator('#freeActionPanel').is_visible()
  await page.screenshot(path=str(Path(SITE,'preview-freeform.png')),full_page=True)
  await page.evaluate("localStorage.setItem('unmarked-narrator-access','test-passphrase-secret')")
  await page.evaluate("window.fetch=async()=>({ok:true,json:async()=>({option:'0',tone:'care',passage:'Kael looked up from the stone and considered his next movement. He knew that the action he intended was only a beginning, not the result. His breath slowed while he weighed the risk to everyone around him. Something in his thoughts sharpened, and he prepared to act before hesitation could swallow the moment.'})})")
  await page.locator('#freeActionInput').fill('I talk to the bully and ask him to give the food back.')
  await page.locator('#narrateBtn').click()
  await page.wait_for_function('window.__UNMARKED_TEST__.scene()==="_typedPrelude"')
  assert 'Kael looked up' in (await page.locator('#story').inner_text())
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert 'early_mercy' not in s['flags'] # no world change until authorial resolution
  await click(page,'Discover what happens next')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert 'early_mercy' in s['flags'] and s['scene']=='upper_streets'
  print('PASS AI interprets typed input and applies engine-authorized choice')
  # Offline fallback
  await page.evaluate("window.fetch=async()=>({ok:false,status:503})")
  await page.evaluate('window.__UNMARKED_TEST__.restart()')
  for t in ['Turn the page','Follow the cry','Seven years later']:await click(page,t)
  await page.locator('#freeActionInput').fill('I punch the bully and beat him')
  await page.locator('#narrateBtn').click()
  await page.wait_for_function('window.__UNMARKED_TEST__.scene()==="_typedPrelude"')
  assert (await page.evaluate('window.__UNMARKED_TEST__.get()'))['pendingTyped']['source']=='local'
  await click(page,'Discover what happens next')
  assert 'early_fury' in (await page.evaluate('window.__UNMARKED_TEST__.get()'))['flags']
  print('PASS offline interpreter handles text without pretending AI is active')
  # AI improvise route w/o invented states
  await page.evaluate("window.fetch=async()=>({ok:true,json:async()=>({option:'improvise',tone:'focus',passage:'Kael looked up from the stone and considered his next movement. He knew that the action he intended was only a beginning, not the result. His breath slowed while he weighed the risk to everyone around him. Something in his thoughts sharpened, and he prepared to act before hesitation could swallow the moment.'})})")
  await page.evaluate('window.__UNMARKED_TEST__.restart()')
  for t in ['Turn the page','Follow the cry','Seven years later']:await click(page,t)
  await page.locator('#freeActionInput').fill('I make a small map of the shelter floor')
  await page.locator('#narrateBtn').click()
  await page.wait_for_function('window.__UNMARKED_TEST__.scene()==="_typedPrelude"')
  await click(page,'Discover what happens next')
  s=await page.evaluate('window.__UNMARKED_TEST__.get()')
  assert s['scene']=='training' and s['improvCounts']['training']==1 and len(s['flags'])==0
  assert 'Kael looked up from the stone' in (await page.locator('#story').inner_text())
  await page.locator('#freeActionInput').fill('I pause, counting footsteps')
  await page.locator('#narrateBtn').click()
  await page.wait_for_function('window.__UNMARKED_TEST__.scene()==="_typedPrelude"')
  await click(page,'Discover what happens next')
  assert await page.locator('#freeActionPanel').is_hidden()
  assert await page.locator('.choice').count()>0
  print('PASS optional side actions do not invent new canonical facts or soft-lock scene')
  # No AI local options for birth etc
  await page.evaluate('window.__UNMARKED_TEST__.restart()')
  assert await page.locator('#freeActionPanel').is_hidden()
  assert not errors,errors
  await page.screenshot(path=str(Path(SITE,'preview-v4-intro.png')),full_page=True)
  print('PASS no JS exceptions and initial game still works')
  await browser.close()
 server.shutdown()

asyncio.run(run())
