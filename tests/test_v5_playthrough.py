"""End-to-end browser checks for the corrected introduction boundary and diverging paths."""
from pathlib import Path
from playwright.sync_api import sync_playwright
import contextlib, http.server, socketserver, threading

SITE=Path(__file__).resolve().parents[1]/'site'
PORT=9877
class Quiet(http.server.SimpleHTTPRequestHandler):
    def log_message(self, fmt, *args): pass

with contextlib.ExitStack() as stack:
    import os
    os.chdir(SITE)
    server=socketserver.TCPServer(('127.0.0.1',PORT),Quiet)
    threading.Thread(target=server.serve_forever,daemon=True).start()
    stack.callback(server.shutdown)
    with sync_playwright() as p:
        browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
        stack.callback(browser.close)
        page=browser.new_page(viewport={'width':390,'height':844},device_scale_factor=2,is_mobile=True,has_touch=True)
        errors=[]
        page.on('pageerror',lambda err:errors.append(str(err)))
        page.goto(f'http://127.0.0.1:{PORT}/index.html?test=1')
        def cur(): return page.evaluate('window.__UNMARKED_TEST__.get()')
        def choose_at(scene, i):
            assert cur()['scene']==scene,(scene,cur()['scene'])
            page.evaluate('([scene,index])=>choose(STORY[scene].choices instanceof Function ? STORY[scene].choices(state)[index] : STORY[scene].choices[index])',[scene,i])
            if cur()['scene']=='_beat':
                page.evaluate('()=>choose({next:"_continueBeat"})')
        def jump_to(scene): page.evaluate('s=>window.__UNMARKED_TEST__.set(s)',scene)
        assert cur()['scene']=='birth'
        for scene in ['birth','judgment','found']:
            choose_at(scene,0)
        choose_at('training',0)
        choose_at('upper_streets',0)
        choose_at('guards_downed',0)
        choose_at('queen_report',0)
        choose_at('elena_youth',0)
        choose_at('hunt',0)
        choose_at('gather',0)
        choose_at('tunnel',0)
        # route around marauder injury
        mara=cur()['scene'];assert mara=='marauders',mara
        choose_at('marauders',0)
        intermediate=cur()['scene']; print('after marauders',intermediate)
        if intermediate=='elder_death': choose_at('elder_death',0)
        if intermediate=='elder_saved': choose_at('elder_saved',0)
        choose_at('rune_chamber',0)
        assert cur()['scene']=='threshold'
        assert cur()['introComplete'] is False,'Introduction ended on escape (bug)'
        choose_at('threshold',0)
        assert cur()['scene']=='post_hill' and not cur()['introComplete']
        # these are still introduction
        choose_at('post_hill',0) # road
        choose_at('road',0) # market? inspect
        print('after road',cur()['scene'])
        # Move forward by authored route through prisoner and late ambush.
        if cur()['scene']=='market': choose_at('market',0)
        if cur()['scene']=='protected_market': choose_at('protected_market',0)
        if cur()['scene']=='ignored_market': choose_at('ignored_market',0)
        if cur()['scene']=='pursued_commander':choose_at('pursued_commander',0)
        if cur()['scene']=='balanced_market':choose_at('balanced_market',0)
        if cur()['scene']=='prisoner': choose_at('prisoner',0)
        if cur()['scene']=='spared_prisoner': choose_at('spared_prisoner',0)
        if cur()['scene']=='late_ambush': choose_at('late_ambush',0)
        assert cur()['scene']=='epilogue',cur()['scene']
        choose_at('epilogue',0)
        choose_at('camp_pressure',0)
        choose_at('night_trap',0)
        choose_at('taken',0)
        choose_at('dream_mountain',0)
        choose_at('dream_assault',0)
        choose_at('dream_throne',0)
        choose_at('dream_fall',0)
        assert cur()['scene']=='dream_break' and not cur()['introComplete']
        choose_at('dream_break',0)
        assert cur()['scene']=='cell_awake' and cur()['introComplete']
        assert cur()['anchor'] is not None
        assert cur()['lives']==0
        page.screenshot(path=str(SITE/'preview-cell.png'),full_page=True)
        choose_at('cell_awake',2)
        assert cur()['scene']=='cell_watch'
        choose_at('cell_watch',2)
        assert cur()['scene']=='_postDeath'
        assert cur()['lives']==0
        page.evaluate('()=>choose(feelingChoices()[0])')
        assert cur()['scene']=='return_cell' and cur()['lives']==1
        assert 'cell_execution' in cur()['knowledge']
        page.screenshot(path=str(SITE/'preview-return.png'),full_page=True)
        choose_at('return_cell',0)
        assert cur()['scene']=='cell_watch'
        # memory now affects available option
        assert 'remembers' in page.locator('#choices').inner_text()
        print('PASS: canon prologue, escape still intro, dream->cell unlock, true death remembers')
        # alt guard killing -> massacre -> no forced cell and death ordinary
        page.evaluate('()=>restart()')
        for scene in ['birth','judgment','found']: choose_at(scene,0)
        choose_at('training',1)
        choose_at('upper_streets',1)
        choose_at('guards_downed',1)
        choose_at('queen_report',0)
        choose_at('elena_youth',1)
        choose_at('hunt',1)
        assert cur()['scene']=='pit_burning'
        choose_at('pit_burning',1)
        assert cur()['scene']=='reckless_revenge'
        choose_at('reckless_revenge',0)
        assert cur()['scene']=='_introDeath' and cur()['introComplete']==False
        assert cur()['lives']==0 and len(cur()['memories'])==0
        assert 'remember' not in page.locator('#story').inner_text().lower()
        page.evaluate('()=>choose({next:"_restart"})')
        assert cur()['scene']=='birth' and not cur()['introComplete'] and cur()['mind']['violence']==0
        print('PASS: early death game over, no memories and full reset')
        # alternate branch survives but does not unlock
        for scene in ['birth','judgment','found']: choose_at(scene,0)
        choose_at('training',1);choose_at('upper_streets',1);choose_at('guards_downed',1);choose_at('queen_report',0);choose_at('elena_youth',1);choose_at('hunt',1)
        choose_at('pit_burning',0);choose_at('shattered_years',0);choose_at('solitary_gate',0);choose_at('alternate_threshold',0)
        assert cur()['scene']=='alternate_horizon' and not cur()['introComplete']
        choose_at('alternate_horizon',0)
        assert cur()['scene']=='alternate_excerpt' and not cur()['introComplete']
        print('PASS: catastrophic divergence avoids forced prison cell')
        # inspect mobile overflow
        assert page.evaluate('document.documentElement.scrollWidth <= innerWidth+2')
        assert not errors,errors
        print('PASS: no JS page errors, mobile widths')
