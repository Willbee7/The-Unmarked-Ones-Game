# THE UNMARKED ONES · PROTOTYPE IV

**A playable, phone-friendly living novel, now with typed actions and an optional AI narrator.**

## Which package should I use?

**Play Now ZIP** (`The-Unmarked-Ones-Play-Now-IV.zip`): upload to your existing Netlify Drop site, or open from a real web server. The original branching game works and the new "write your own action" textbox uses a **limited, local interpreter**. This ZIP contains no AI server function or key. Do not expect unrestricted AI narration from Netlify Drop.

**AI-ready Project ZIP** (`The-Unmarked-Ones-AI-Ready-IV.zip`): use for the optional OpenAI-powered narrator with a **Git-connected Netlify deployment** or the Netlify CLI. This package includes `site/` and `netlify/functions/narrate.mjs`. The AI endpoint uses a server-side API key and a private access passphrase. It is not enabled by uploading the ZIP through Netlify Drop alone.

## What's new

- **Type an action** in Kael's first controllable scenes. Examples: “I try talking to the bully before fighting,” “I strike the guard before he casts,” “I check the wall for a concealed passage.”
- **When AI is connected:** a server-side model reads the current scene, Kael's limited visible history, and the available authored decisions. It writes a short third-person passage describing his attempted action and selects the closest authorized branch, or classifies a small side action as `improvise`.
- **When AI is unavailable:** the same box still works via a limited keyword interpreter. It is not a true AI narrator. Its output is explicitly labeled “Offline action interpretation.”
- **The game engine remains authoritative.** The AI cannot rewrite facts, kill a character, activate memory, bypass the introduction, or force Kael to obey a command his developed personality resists. Major world changes require authored branches. There are at most two non-branching side actions per scene in this prototype.
- Standard choices, bookmarks, old saves, hidden death rules, and the butterfly-effect story remain intact.

## Important narrative boundaries

The source manuscript is the canonical **world history and character foundation**, not a verbatim script the player must read. The actual route depends on actions and consequences. Not all future alternate worlds are authored yet.

1. Queen Seraphina rejects Kael, born without magic, and elder scavenger Lysander rescues him in the Pit of Silence.
2. Young Kael's no-kill rule is canonical during the royal guard encounter. Killing a guard creates alternate history and may escalate retaliation.
3. The elder Lysander and Thorne's **younger brother** Lysander are distinct people.
4. During the introduction, **true death causes an ordinary full restart**. No premature hints.
5. After the introduction, true death begins a strange experience only Kael can remember. Injuries and unconsciousness alone do not trigger it.
6. Kael has an evolving emotional life and **Independent Will**; a player instruction can produce a different action when earned by past choices.
7. The manuscript's apparent defeat of the queen is a later illusion, not the actual chronology. Prototype IV does not implement the full Chapter 11 story.

## Deploy the Play Now ZIP (no AI setup)

1. On iPhone, download **The-Unmarked-Ones-Play-Now-IV.zip**.
2. Open your existing Netlify site dashboard > Deploys, then use its manual upload area to publish the website ZIP. This package has `index.html` at its top level.
3. Open the site in Safari. After Kael's early origin pages, the age-seven scene has a textbox labeled "Or write your own action".
4. For a no-code test, type `I talk to the bully and ask for the food back.` and press **Attempt this action**. Offline interpretation works; tap **Discover what happens next** to apply the actual consequence.

If you are upgrading the same Netlify site, browser localStorage should retain the previous Prototype III save on that origin. **Export a save from the current site's Menu first**, just in case.

## Deploy the full AI narrator (Git-connected Netlify)

This requires a separate **OpenAI API key** with API billing. A ChatGPT subscription doesn't itself supply API usage.

1. Unzip **The-Unmarked-Ones-AI-Ready-IV.zip** and upload the contents to a **private GitHub repository**. Keep the directory layout intact: `site/index.html`, `netlify/functions/narrate.mjs`, and `netlify.toml` at repo root. Never commit your key or access passphrase.
2. In Netlify, import the GitHub repository as a new site or connect it as the source for your current site. The included `netlify.toml` sets `site` as the publish directory and `netlify/functions` as the serverless functions directory. Leave the build command blank.
3. In Netlify environment variables, add **`OPENAI_API_KEY`** with your private API key, and **`NARRATOR_ACCESS_CODE`** with a long secret passphrase (20+ random characters recommended). Make sure these are available to **Functions**. Do not store either in source or a `netlify.toml` file.
4. Trigger a new Netlify deployment. Check the deploy summary for a published `narrate` function. Without a deployed function, the game stays in offline-interpreter mode.
5. Open the website on your iPhone. Choose **Menu > Enter narrator passphrase** and enter the **access code** (never the OpenAI API key). This code is stored on that device in browser localStorage. Choose a typed action. The game should show **AI narration** in the generated prelude if the service responds.
6. If the AI key/code is missing, invalid, the function cannot be reached, or the provider request fails, the game safely uses the offline interpreter and the canonical story engine still works.

**Cost and privacy:** API calls may have charges. The request sends the player's typed action plus a small window of relevant scene text, recent journal and Kael's visible psychological context to the AI provider. Do not put personal information into player text. The optional passphrase restricts casual access; this is not a full production authentication system. Before a public launch, add durable per-user authentication, centralized rate limiting, monitoring, quotas, and spending alerts. To disable AI instantly, remove `OPENAI_API_KEY` or `NARRATOR_ACCESS_CODE` and redeploy.

## Working locally

- Static reading: serve `site/` with a local HTTP server (e.g. `python -m http.server 8000 --directory site`), then open `http://localhost:8000` on a computer.
- Test the AI function locally with the Netlify CLI (`npx netlify-cli dev`) while both environment variables are configured. Do not put the real key in committed files.

## Automated tests performed

- `python tests/test_regression.py` — original story routes, guard outcomes, intro death, post-intro memory, independent will, responsive layouts.
- `python tests/test_freeform.py` — simulated successful AI output, offline fallback, minor side actions, no uncaught browser errors.
- `node tests/test_backend.mjs` — private passphrase, no-key handling, request validation, structured API responses, rejected invalid choices and premature spoilers.

**Live provider and production Netlify tests have NOT been run here:** they require the site and account owner's configuration and approval. The app works with the offline interpreter until that is done.
