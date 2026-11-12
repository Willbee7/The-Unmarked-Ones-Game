# Prototype V architecture

## Current request path

```text
Player selects authored decision OR types an attempted action
   |
   +--- Authored decision ----------------------+
   |                                            |
   +--- Typed action ---- private narrator? ----+
                         | (optional)
               AI-written immediate attempt
               + permitted option ID or small improv
                         |
                         v
         Deterministic story engine / Independent Will
                - history and personality
                - injury, deaths, material outcomes
                - dialogue and passage mutations
                - scene and introduction transition
                         |
                         v
             Novel prose + persistent browser save
```

## Canonical introduction boundary

`birth → judgment → found → training → ... → threshold (ESCAPE, NOT AN UNLOCK) → ... → taken → dream_mountain → dream_assault → dream_throne → dream_fall → dream_break → cell_awake (INTRODUCTION COMPLETE)`

`assignScene('cell_awake')` invokes `finishIntroduction()` and creates a provisional return anchor. This is not a death or a memory event. `die()` decides whether to issue an ordinary game over or post-introduction recollection **only** based on `introComplete`. A separate alternate path can avoid `cell_awake` entirely and therefore remains in the introduction until a suitable future endpoint is authored.

## Why the AI narrator cannot mutate state directly

An LLM may suggest plausible prose but can contradict a character's survival, hidden knowledge, or the return rules. The hosted function receives a small scene excerpt, recent visible decisions, and selected psychological context; it returns an attempted-action passage and an allowed branch id or an `improvise` label. The deterministic engine validates and applies the actual consequence.

## Future architecture

1. **World ledger:** durable character existence, positions, relationships, knowledge provenance, equipment, causal events, and immutable history log.
2. **Intent adjudicator:** can Kael attempt this? Does Kael resist, modify, or comply? What can realistically change?
3. **Conditional scene writer:** write final prose *after* validated outcomes, not just the attempted action before it.
4. **Private lore retrieval:** use only relevant portions from the full author manuscript, mark spoilers as inaccessible to the player's timeline, separate canonical facts from possible events.
5. **Alternate introduction conclusions:** define major divergent arcs with meaningful gates instead of forcing the prisoner cell or leaving branches permanently unresolved.
6. **Secure platform:** individual accounts/permissions, server-side saving, usage quotas, telemetry, abuse protection, cost controls before broad public use.

Current Netlify access passphrase and process-local rate limit are for **personal testing**, not a public production launch.
