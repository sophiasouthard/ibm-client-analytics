# IBM Client Analytics — Bob-Native Template

A step-by-step guide for IBM Partner Technical Specialists (PTSs) to build a living, evidence-backed
partnership tracker for any IBM Business Partner (VAR/Sell partner).

The output is a single self-contained HTML file — no database, no server, no code required.
Everything runs inside Bob.

---

## What You're Building

A single HTML page with these tabs:

| Tab | What it shows |
|---|---|
| Dashboard | Quota progress, top deals by size, pipeline by stage and product |
| Pipeline | Every opportunity — filterable by product, stage, and status (Active / At Risk / Stalled) |
| Growth | How the partnership has grown over time |
| Efficiency | Where your time is going vs. where the money is |
| What's Working & What Isn't | Honest verdict on every tactic — evidence-backed |
| ↳ Evidence | The raw meeting log, email, and usage data behind each verdict |
| Meeting Log | Every partner and customer meeting logged and filterable |
| ↳ Customer Meetings | Isolated view of customer-facing activity only |
| Email Log | Outbound and inbound threads logged and filterable |
| Contacts | Card view of every partner contact with role, region, and engagement level |
| Action Items | Open actions with inline status dropdowns you can update live |
| Upcoming Opptys | Deep-dive on the 3–5 most important accounts in flight |

---

## Prerequisite Access Checklist

Before you start, confirm you have access to all of the following.
See [`PREREQUISITES.md`](./PREREQUISITES.md) for detail on each.

- [ ] **Bob** (IBM watsonx Code Assistant) — to run all the prompts in this repo
- [ ] **IBM VAR Channel Strategist mode** — install from [`.bob/custom_modes.yaml`](./.bob/custom_modes.yaml)
- [ ] **Tavily MCP** — connected and working in Bob (for partner research)
- [ ] **IBM Data & AI Docs MCP** — connected (for IBM product positioning)
- [ ] **Your opportunity data** — exported from Salesforce/SFDC as CSV or Excel
- [ ] **Your meeting log** — calendar export or manual log covering the last 90 days
- [ ] **Your email log** — key threads and summaries (does not need to be exhaustive)
- [ ] **Your quota** — your FY target number from your manager
- [ ] **Partner usage data** (optional but high-value) — Bob/Orchestrate builder provisioning report,
     watsonx Orchestrate DAU chart if available

---

## How to Use This Repo

### Step 1 — Research your partner
Open Bob in **IBM VAR Channel Strategist** mode and run the prompt in
[`prompts/01-research-your-partner.md`](./prompts/01-research-your-partner.md).

This uses Tavily to pull public information about your partner: IBM tier, products they sell,
industries they cover, distributor (Arrow or direct), and any recent news.

### Step 2 — Gather and format your data
Follow the instructions in [`prompts/02-gather-your-data.md`](./prompts/02-gather-your-data.md).

You'll paste or upload your opportunity export, meeting log, email log, and quota.
Bob will help you structure each into the format the tracker expects.

### Step 3 — Build the tracker
Run the prompt in [`prompts/03-build-the-tracker.md`](./prompts/03-build-the-tracker.md).

Bob will generate the full HTML tracker, pre-populated with your partner's data.
It uses the mock template in [`mock-data/partner-tracker-template.html`](./mock-data/partner-tracker-template.html)
as the structural reference — your output will follow the same layout but with your data.

### Step 4 — Interpret what's working
Run the prompt in [`prompts/04-interpret-whats-working.md`](./prompts/04-interpret-whats-working.md).

This is the most important step. Bob will analyse your data and write an honest, evidence-backed
"What's Working & What Isn't" section — distinguishing your inputs from your partner's follow-through,
and diagnosing whether the gap is effort or partner buy-in.

---

## The Core Distinction This Tracker Is Built Around

> **Activity is not outcome.**

The tracker is designed to separate:
- What *you* did (meetings run, demos delivered, reports built, sessions enabled)
- What *your partner* did as a result (deals registered, demos run independently, pipeline sourced)

A partner that attends enablement sessions but never demos independently is not a self-sufficient
reseller. This tracker makes that gap visible — and gives you the evidence to have the right
executive conversation.

---

## Repo Structure

```
ibm-partner-tracker/
├── README.md                          ← You are here
├── PREREQUISITES.md                   ← What you need before you start
├── prompts/
│   ├── 01-research-your-partner.md   ← Tavily research prompt
│   ├── 02-gather-your-data.md        ← Data formatting prompt
│   ├── 03-build-the-tracker.md       ← Tracker generation prompt
│   └── 04-interpret-whats-working.md ← Diagnosis prompt
├── mock-data/
│   └── partner-tracker-template.html ← Full mock tracker (Acme Corp)
└── .bob/
    └── custom_modes.yaml             ← IBM VAR Channel Strategist mode
```

---

## Key Concepts for IBM PTSs

### What is a VAR?
A Value Added Reseller buys IBM product at a discount and resells it — adding value through
configuration, implementation, and support. The "value added" part is what earns them higher
margins than a commodity reseller.

### What is the PTS role actually for?
Your job is to make the VAR independently capable, then step back. The PTS is not the partner's
sales engineer. If you are running every demo, every customer call, and every follow-up — the
partner has not been enabled, they have become dependent on you. That does not scale.

### What does "self-sufficient reseller" look like?
A partner is self-sufficient when:
1. An AE qualifies and positions IBM without you on the call
2. An engineer runs a demo without you present
3. They register deals in MySA *before* calling you
4. At least one engineer holds a current IBM AI proficiency badge
5. They source 3+ IBM opportunities independently
6. They can implement a basic IBM AI deployment post-sale

### Why does partner leadership buy-in matter more than individual seller enthusiasm?
In the IBM VAR channel, a PTS can do everything right — sessions, demos, events, reports — and
still produce no pipeline if the partner's VP Sales or CTO hasn't designated IBM as a strategic
revenue priority. That designation means AEs are *comp-directed* to pursue IBM pipeline and
architects are *evaluated* on IBM certifications. Without it, participation is voluntary.
Voluntary participation produces results for the sellers who personally buy in, and zero for
everyone else. The tracker makes this pattern visible so you can have the right conversation.

---

## Credits

Built by Sophia Southard, IBM Partner Technical Specialist.
Template stripped of all client-specific data for sharing.
