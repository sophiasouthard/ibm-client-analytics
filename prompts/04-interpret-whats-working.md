# Prompt 04 — Interpret What's Working & What Isn't

**Mode:** IBM VAR Channel Strategist  
**MCP tools needed:** None  
**When to run:** After your tracker HTML exists and you've reviewed it. This prompt generates
the two most important tabs: "What's Working & What Isn't" and "↳ Evidence".

---

## Why this tab matters

This is not a summary tab. It is a diagnostic. The goal is to answer one question:

> **Is your partner becoming a self-sufficient IBM reseller, or are they still dependent on you?**

The honest answer requires separating:
- Your inputs (sessions run, demos delivered, reports built, events attended)
- Your partner's outputs (deals registered, demos run independently, pipeline sourced by AEs)

Most partnership trackers show inputs and call them outcomes. This one doesn't.

---

## The Prompt

```
I am an IBM Partner Technical Specialist. I need you to write the "What's Working & What Isn't"
and "↳ Evidence" tabs for my client analytics tracker.

Use the IBM VAR channel framework:
- A partner is self-sufficient when their AEs qualify IBM opps without me, their engineers demo
  independently, and they register deals before calling me.
- Separate my inputs from my partner's follow-through. Activity is not outcome.
- Where something is working, credit the reason — was it because a specific partner seller
  bought in, or because of a specific tactic?
- Where something is not working, name who failed to follow through — me or my partner's sellers.
  Do not frame partner inaction as my failure.

Here is my data:

---
PIPELINE (Active / At Risk / Stalled breakdown):
[Paste your pipeline table or summary]

MEETINGS (last 90 days):
[Paste your meeting log table]

EMAIL LOG (key threads):
[Paste your email log table]

USAGE DATA (if available):
[Paste builder list, active users, Bobcoins, agents built — or skip]

ACTION ITEMS (current open items and owners):
[Paste your action items table]

PARTNER PROFILE:
[Paste the one-paragraph partner profile from Step 1]
---

Please produce:

1. A one-paragraph "Honest Diagnosis" that states clearly whether this is an effort problem
   or a partner buy-in problem. Cite specific evidence. Do not hedge.

2. A "✓ Working" column with 4–6 verdict cards. For each item that's working, explain
   WHY it worked — specifically, was it because a partner seller chose to engage?

3. A "✗ Not Working" column with 4–6 verdict cards. For each item that's not working,
   name who failed to follow through. Distinguish:
   - Things where my input was present and partner didn't follow through
   - Things where I need to change my approach
   - Things that are outside my control (deal registration disputes, comp plan issues, etc.)

4. A "What Needs to Change — Prioritized" table with 5–7 actions. For each action:
   - What is the action
   - WHO needs to own it (me, or a named partner contact — VP Sales, CTO, specific AE)
   - Why it matters
   - Deadline

5. A "What Needs to Change at the Leadership Level" callout. Be direct: if the partner's
   VP Sales or CTO hasn't designated IBM as a strategic revenue priority, say so. Explain
   what that designation looks like and what evidence would confirm it.

6. An Evidence tab with two tables:
   - "Evidence: What Is Working" — columns: Finding | Why It Counts | Specific Evidence
     (cite exact meeting dates, email threads, pipeline rows, usage report figures)
   - "Evidence: What Is Not Working" — columns: Finding | Sophia's Input | What Partner Did
     (or didn't do) | Evidence
   - A closing callout: "What the evidence shows across the not-working findings" —
     one paragraph grounding everything in the VAR channel pattern.

Format the output as HTML sections I can paste into my tracker.
Use the same styling as the rest of the tracker (colours, badge classes, card layout).
```

---

## Key questions to ask yourself before running this prompt

These will sharpen the output:

1. **Who owns your open action items?** If every action item is owned by you and none by
   partner sellers, that's a structural problem worth naming explicitly.

2. **Have any partner engineers run a customer demo independently?** If not, say so.
   "No Technologent engineer has run a demo without me present" is a specific, falsifiable claim.

3. **Has your partner's VP Sales ever directed their AEs to follow up on an IBM lead?**
   If you've never seen that happen, it's the most important thing to surface.

4. **What would change if you stopped following up for two weeks?** If the answer is "everything
   would stall," the partner has not bought in at the org level.

---

## After running this prompt

Paste the generated HTML sections into your tracker file, replacing the placeholder content
in the p10 and p12 panels.

If the diagnosis feels too harsh or too soft, go back to your evidence and ask:
*"Is this claim backed by something specific in my meeting log, pipeline, or usage data?"*
If yes, keep it. If it's an assertion without evidence, either find the evidence or remove the claim.
