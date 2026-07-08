# Prompt 03 — Build the Tracker

**Mode:** Agent (default)  
**MCP tools needed:** None  
**When to run:** After Step 2. You should have your four formatted data tables ready
(pipeline, meetings, emails, contacts), your partner profile from Step 1, and your quota number.

---

## Overview

This prompt asks Bob to generate the full HTML tracker using your structured data.
The output is a single self-contained `.html` file you open in any browser — no server needed.

The mock tracker at [`mock-data/partner-tracker-template.html`](../mock-data/partner-tracker-template.html)
is the structural reference Bob will follow. Do not paste the mock template into this prompt —
Bob already knows the structure from this repo. Just provide your data.

---

## The Prompt

```
I need you to build a client analytics HTML file for my IBM Business Partner engagement.
Use the structure and styling of the partner-tracker-template.html from this repo as your reference.

Here is everything you need:

---
PARTNER NAME: [e.g. Acme Solutions]
PARTNER IBM TIER: [Silver / Gold / Platinum]
PARTNER PROFILE: [Paste the one-paragraph profile from Step 1]
MY QUOTA (FY target): $[YOUR QUOTA]
MY NAME: [YOUR NAME]
MY TITLE: [e.g. Partner Technical Specialist, IBM Ecosystem]
TRACKER DATE: [Month Year, e.g. July 2026]
---

PIPELINE DATA (from Step 2A):
[Paste your formatted pipeline table]

---

MEETING LOG (from Step 2B):
[Paste your formatted meeting table]

---

EMAIL LOG (from Step 2C):
[Paste your formatted email table]

---

CONTACTS (from Step 2D):
[Paste your formatted contact table]

---

USAGE DATA (if available — paste builder list, active users, agents built, Bobcoins/usage metrics):
[Paste or skip]

---

Please build the full tracker HTML with all 12 tabs:
1. Dashboard — quota progress bar, top deals by value, pipeline by stage and product
2. Pipeline — filterable table (product, stage, status). Status values: Active / At Risk / Stalled
3. Growth — before/after comparison showing how the partnership has grown
4. Efficiency — time vs. revenue scorecard with verdict on each activity type
5. What's Working & What Isn't — leave this as a placeholder with a note saying
   "Run prompts/04-interpret-whats-working.md to complete this tab"
6. ↳ Evidence — same placeholder
7. Meeting Log — filterable by topic and type
8. ↳ Customer Meetings — isolated view of customer-facing meetings only
9. Email Log — filterable by topic
10. Contacts — card grid view
11. Action Items — table with inline status dropdowns (Scheduled / In Progress / Started /
    Not Started / Accepted / Planning / Done). Each status should be colour-coded.
12. Upcoming Opptys — deep-dive section on your top 3–5 active accounts

Style requirements:
- Single self-contained HTML file — all CSS inline, no external dependencies
- Colour palette: bg #f7f8fa, surface #ffffff, border #d0d7e2, text #1f2328,
  muted #57606a, IBM blue #1c3a6b / #1d57b0, accent #3b82d4
- Font: -apple-system, "Segoe UI", system-ui, sans-serif
- Tab navigation in the header bar — CSS-driven, no frameworks
- All filters (pipeline, meetings, emails, action items) must work via vanilla JavaScript
- Add <!DOCTYPE html> at the top
- Footer: "Made with IBM Bob"

Output the complete HTML as a single code block. Do not truncate.
```

---

## After Bob generates the HTML

1. Copy the full HTML output from Bob
2. Save it as `[partner-name]-tracker.html` in a folder on your desktop
3. Open it in Chrome or Safari — it should work immediately with no setup
4. If anything looks wrong (tab doesn't switch, filter doesn't work), paste the broken section
   back into Bob and ask it to fix the specific issue

---

## Common fixes

**Tabs not switching:**
```
The tab navigation in my tracker isn't working. Here is the relevant HTML and JS:
[paste the tab nav + script section]
Fix it so clicking a tab label shows the correct panel and hides the others.
```

**Pipeline filter not working:**
```
The pipeline filter dropdowns aren't filtering the table. Here is the filter HTML and JS:
[paste]
Fix the JavaScript so the multi-select dropdowns correctly show/hide rows.
```

**HTML too long and got cut off:**
```
The HTML was truncated. Please continue from where you left off, starting at:
[paste the last few lines Bob generated]
```
