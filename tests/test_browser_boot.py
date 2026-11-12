from playwright.sync_api import sync_playwright
with sync_playwright() as p:
 browser=p.chromium.launch(headless=True, executable_path='/usr/bin/chromium', args=['--no-sandbox'])
 page=browser.new_page()
 print('blank url',page.url)
 try: print('eval',page.evaluate('1+2'))
 except Exception as e: print('eval error',str(e)[:300])
 try: page.set_content('<html><body><p id="test">HELLO WORLD</p></body></html>');print('set_content',page.locator('#test').inner_text())
 except Exception as e: print('set_content error',str(e)[:300])
 try: page.evaluate("Object.defineProperty(window,'localStorage',{value:{data:{},setItem(k,v){this.data[k]=v},getItem(k){return this.data[k]||null}}})");print('localstorage stub yes')
 except Exception as e: print('stub error',str(e)[:300])
 browser.close()
