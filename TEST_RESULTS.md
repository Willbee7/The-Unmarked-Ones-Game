# Automated checks, Prototype IV

- PASS: Original opening; no hidden-death spoilers in UI
- PASS: Distinct narrative results for mercy/violence
- PASS: Canonical introduction and elder's death
- PASS: Major alternate-history route
- PASS: Intro true death: ordinary reset with no memory
- PASS: Post-intro true death: Kael-only recollection
- PASS: Ruthless Kael resisting civilian rescue request
- PASS: Compassionate Kael resisting prisoner execution request
- PASS: Browser save and mobile widths 320, 375, 390, 430, 768
- PASS: AI response mock: custom typed action stages a novel passage and maps to an authorized game choice
- PASS: Offline fallback mock: no AI service needed for limited typed-action mapping
- PASS: Improvised side actions cannot rewrite major world facts; limited to two per scene
- PASS: Backend refuses missing key/passphrase, invalid scene data, hostile origin, unauthorized branch, premature spoiler
- PASS: No uncaught JavaScript errors in automated browser tests

CAVEAT: AI provider and Netlify deployment have not been exercised against a live key/account. No claim is made about successful live billing, provider latency, or every possible arbitrary typed input.
