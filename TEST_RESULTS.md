# Prototype V validation

## Passed

- JavaScript syntax checks for every shipped engine/narrator source file
- Node story-engine execution: escape from Luminara does **not** complete the introduction
- Node story-engine execution: false victory breaks into prison scene, and **only then** `introComplete` becomes true
- Node story-engine execution: true death inside the dungeon returns with personal memory; no one else gains it
- Node story-engine execution: before the prison awakening, death restarts from Kael's birth with no memory or developed traits
- Node story-engine execution: catastrophic Pit alternate remains an introduction and does not force the prison awakening
- Node story-engine execution: violent Kael can resist an order to prioritize civilian rescue
- Node story-engine execution: compassionate Kael can resist the execution of a surrendered prisoner
- Node fallback interpreter: typed mercy/violence actions map to supported opening decisions
- Netlify function mock tests: rejects missing API configuration, incorrect passphrase, cross-origin browser requests, invalid payload, illegal option IDs, and premature memory spoilers; accepts valid structured mock response

## Not tested here

- Browser visual layout and actual button clicks via Chromium: this environment's browser is prevented from navigating to file and local HTTP URLs. The included browser playthrough script can be run elsewhere.
- Live OpenAI API provider and real billing
- Live Netlify deployment on the author's account
- Physical iPhone Safari

## Known scope limits

- Alternate-introduction histories are unfinished excerpts, not complete new campaigns.
- Freeform AI produces attempted actions and maps to authored branches, not unlimited independently simulated narratives.
- The current Netlify function limits per process instance, not globally.
- Prototype IV saves are not migrated automatically because they contain the previous incorrect introduction boundary.
