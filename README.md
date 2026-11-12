# The Unmarked Ones — Prototype V: The Living Introduction

A browser-playable, novel-style interactive fantasy based on the author's manuscript. The manuscript is a **reference for the world**, not an inflexible script. Scene descriptions and aftermaths react to Kael's decisions, and some choices can permanently divert the story from the canonical sequence.

## The most important correction

**The introduction does not end at the Pit or when Kael reaches the outside world.** The canonical introduction continues through the resistance, apparent defeat of Seraphina, and illusory victory. **Only when Kael awakens in the royal dungeon from the false future does the introduction end.** That awakening is an illusion reveal, NOT a death. Pre-awakening death is an ordinary full restart with no memory. True death after the awakening can initiate Kael's private experience of an earlier moment; other characters remember nothing from a life they did not experience.

These rules are deliberately hidden from players in the introduction. The protagonist discovers what is happening through his own narration later.

## What is playable now

- Kael's origin, rescue by the **older scavenger Lysander**, childhood, and first conflict in the Pit.
- Royal guard confrontation: sparing the guard follows an event compatible with the manuscript; killing the guard changes the response to the Pit, and a severe massacre can create a fundamentally different history.
- Friendship with Elena, preparations for escape, and ancient passages, including a branch where the older Lysander survives.
- First days beyond Luminara, personality-sensitive civilian and surrendered-soldier choices, Ulysses' tension, capture, an apparent victory, and the **cell-awakening introduction boundary**.
- A short post-awakening dungeon excerpt with the first example of private recollection after **actual death**. Severe injury does not trigger it.
- **Independent Will**: when a behavior is well established, Kael may act differently from the player's chosen intention. That difference is narrated as action, not as a pop-up mechanic.
- Choice-aftereffects as third-person novel passages. Freeform typed actions are supported in limited form: they can match an existing choice or permit up to two small, non-branching actions per scene.
- Browser autosave, journal, adjustable font size, save export/import.

**Limit:** This is a substantial proof of concept, not the entire 53-part manuscript. Routes that radically alter history currently reach a clearly labeled *unfinished alternate introduction* rather than being forced into the canonical prison. The full emotionally aware AI narrator and all future world states are not implemented as unconstrained generation.

## Which ZIP to use

### `The-Unmarked-Ones-V-Play-Now.zip`

A static website ZIP with `index.html` at its root. Upload it using your existing **Netlify site's Deploys/manual deploy** area, or serve its contents from any normal static host. You can read, make choices, and type actions using the **limited offline interpreter**. This package has **no server-side AI**.

To test on your computer: unzip it and, from that extracted folder, run:

```bash
python -m http.server 8000
```

Then open `http://localhost:8000` in Chrome or Edge. Double-clicking `index.html` can also work on desktops, but a local web server is more reliable. An iPhone Files preview is **not** a supported way to play; open the published website in Safari.

### `The-Unmarked-Ones-V-AI-Ready.zip`

Complete source directory. For the private AI narrator, push its **contents** to a **separate GitHub game repository** (never the trading bot repository) and connect that repository to Netlify. At repo root, retain:

```
site/index.html
site/engine.js
site/story.js
site/beats.js
site/narrator.js
netlify/functions/narrate.mjs
netlify.toml
```

Netlify should use the included configuration: `publish = "site"`, functions directory = `netlify/functions`, and no build command. Add server-side environment variables **`OPENAI_API_KEY`** and **`NARRATOR_ACCESS_CODE`** in the Netlify site dashboard, with functions access, and redeploy. The second value is a long private passphrase; enter *that passphrase* inside the game's Menu. **Never paste your OpenAI API key into the game, GitHub, this chat, or a public file.** Paid API usage and rate limits apply. ChatGPT subscription billing is separate from OpenAI API billing.

The hosted AI presently writes an **attempt** and chooses a suitable authored branch or small improvised action. The game engine alone resolves deaths, relationships, irreversible consequences, Kael's resistance, and introduction status. AI is not allowed to invent a permanent world mutation yet. Without valid hosting, key, or access code the game still works with its offline fallback.

Security caution: The current passphrase/IP limiter is only suitable for limited private testing. It is **not** a production multi-user authentication or spending-control solution.

## Save compatibility

Prototype V uses a **new browser save namespace** to avoid importing Prototype IV saves that had the wrong introduction boundary. Existing older saves are not deleted, but they are not silently migrated. Prototype V export files have version 5 and may be imported into another Prototype V installation.

## Canon and continuity choices

- Seraphina's reign; the other twelve kingdoms; Unmarked class status; Kael's unusually stubborn physical resilience and initial no-kill position.
- Elder **Lysander the scavenger** raises Kael. **Thorne's younger brother Lysander** is a different character.
- The seeming victory over Seraphina is illusory. The dungeon wake-up reveals the truth.
- The manuscript is an author's source, not a series of required dialogue lines. Alternate events are permitted when they follow causally from actions.
- Kael's psychological response can include compassion, rage, grief, numbness, acceptance, and curiosity, not a binary good/evil alignment.
- Personal experiences and thoughts do not automatically grant someone else supernatural knowledge.

The complete manuscript text is intentionally **not bundled** in this public-site project. Keep the author's large source archive in a private workspace, not in a publicly deployed website.

## Tests performed for this build

```bash
node --check site/engine.js
node --check site/story.js
node --check site/beats.js
node --check site/narrator.js
node --check netlify/functions/narrate.mjs
node tests/test_story_vm.cjs
node tests/test_backend.mjs
```

They verify canonical progression, the corrected cell boundary, earlier ordinary deaths, later Kael-only memories, catastrophic alternate histories, Independent Will, offline choice mapping, and server request validations using simulated API responses. **A live OpenAI API call, live Netlify deployment, and physical iPhone test have not been performed.** A Chromium test file is included but could not be executed in this environment due to its browser navigation policy.

## Recommended next development stage

Build a world-state ledger and consequence adjudicator that store **who is alive, which facts are known, where everyone is, and what Kael believes**, then pass only relevant manuscript lore to the AI narrator. That will let typed actions create validated new scenes instead of always mapping back to predefined decisions, while preserving continuity and keeping costs manageable.
