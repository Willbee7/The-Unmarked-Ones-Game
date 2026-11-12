# Prototype IV: action and narration pipeline

```text
Reader chooses an existing option or types an action
                              |
                    Typed action only
                              v
           Private Netlify narrator function (optional)
               - access passphrase required
               - OpenAI key held server-side
               - validates prompt + response
               - selects an *existing* option ID or "improvise"
               - produces immediate narrative of an attempt, not a completed event
                              |
             service unavailable? -> offline keyword interpreter
                              |
                        Player reads prose
                              |
                  Game's authoritative `choose()`
               + Independent Will checks
               + canonical / butterfly-effect branch resolution
               + injury, death, memory, interpersonal consequences
               + browser save
```

## Current limits
- Author-owned branching scenes remain the source of major world-state transitions; AI does not dynamically invent multi-chapter canon divergence.
- Two side-action attempts per scene to prevent loops without meaningful state advances.
- Text generation operates at action staging, before a prewritten consequential beat.
- No cross-device save sync, no user accounts, and no freeform multi-step planner yet.
- No production-grade anti-abuse/authentication. The access passphrase is suitable for limited personal testing, not a public multi-user release.
- API provider integration has **mock tests**, not a live paid call.

## Next development goals
1. Give the game engine a typed world-state schema with locations, characters, schedules, inventory, evidence and relationships.
2. Use a deterministic adjudicator for attempted actions, including probabilities, available tools, and character resistance.
3. Let AI propose constrained consequences but never apply them unless a server validator confirms they are possible.
4. Generate new scene prose after the adjudication, so the narration truly changes instead of restating an existing paragraph.
5. Create path-mapping and continuity tests for both reconverging and permanently divergent histories.
6. Add secure per-user accounts, spend limits, and moderation/abuse protection before opening unlimited AI generation to the public.
