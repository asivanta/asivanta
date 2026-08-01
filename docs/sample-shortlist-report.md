# Sample: Korean Supplier Shortlist Report

> **Internal note (not part of the report).** This is a draft of the sample
> report we show buyers before they pay. Every supplier here is an **anonymized
> composite** — a made-up example built from typical market patterns, not a real
> company. That is on purpose: a public sample must never leak a real supplier's
> file, and must never be mistaken for a real record. Keep the "Sample" banner
> and the composite wording in every version we publish.
>
> Status: content draft for John's review. Do not publish until approved. Once
> the words are approved, the next step is the designed one-pager + PDF.

---

<p align="center"><strong>SAMPLE REPORT — ILLUSTRATIVE EXAMPLE ONLY</strong><br>
All supplier names, numbers, and details below are composites created for
demonstration. They do not describe real companies.</p>

---

# Korean Supplier Shortlist Report

**Prepared for:** Northline Electronics (example buyer, Illinois, USA)
**Product scope:** SMD quartz crystals and clock oscillators for a controls product line
**Report type:** Starter Shortlist (5 candidates screened, 3 recommended)
**Prepared by:** ASIVANTA
**Report date:** Sample — undated
**Pages:** 1 summary + 3 supplier profiles + next-step plan

---

## 1. What you asked for

You are moving part of your crystal and oscillator buying from a single
distributor to direct Korean suppliers. Your ask, in your words:

> "We need two or three Korean makers who can hold ±10 ppm at 3.2×2.5 mm,
> take orders around 50k–200k pieces a year, and actually answer engineering
> questions. We have been burned by traders who disappear after the sample."

We turned that into five screening rules:

| #   | Rule                                          | Why it matters to you                                          |
| --- | --------------------------------------------- | -------------------------------------------------------------- |
| 1   | Makes the part, not just sells it             | You need process answers, not forwarded emails                 |
| 2   | 3.2×2.5 mm SMD in the active catalog          | Your footprint is fixed on the current board                   |
| 3   | ±10 ppm or tighter available in volume        | Your timing budget has no room                                 |
| 4   | Comfortable at 50k–200k pcs/year              | Too small and they cannot deliver; too big and you are ignored |
| 5   | Real technical contact who replies in English | The #1 thing that broke your last two attempts                 |

---

## 2. How we searched

We do not run a directory scrape. Each candidate was found and checked by hand.

**Where we looked**

- Korean corporate registry listings and public business-ID records
- Korea Trade-Investment (KOTRA) and industry association member lists
- Component distributor catalogs that list Korean makers by part number
- Datasheet archives — who actually publishes their own datasheets
- Korean-language company sites and news, read in Korean (this is where the
  difference between a maker and a reseller usually shows)

**What we checked on each one**

- Business identity: registration, address, company age, size signals
- Capability match: is your exact size/tolerance in their real catalog
- Maker vs trader: do they publish process, plant photos, their own datasheets
- Consistency: does the Korean site say the same thing as the English site
- Responsiveness: we sent one plain technical question and timed the reply

**What we did not do**
We did not visit factories, audit quality systems, run financial credit checks,
or test parts. Those are separate services. This report tells you who is worth
your time — it does not certify anyone.

---

## 3. Shortlist at a glance

Five screened, three recommended. Scores are our judgment on the evidence we
saw, on a 1–5 scale.

|                             | **Supplier A**                         | **Supplier B**                                        | **Supplier C**                         |
| --------------------------- | -------------------------------------- | ----------------------------------------------------- | -------------------------------------- |
| **Profile**                 | Mid-size maker, Gyeonggi, est. 1998    | Small specialist maker, Busan, est. 2011              | Maker + export arm, Incheon, est. 1989 |
| **Headcount signal**        | ~120                                   | ~35                                                   | ~300                                   |
| **Maker or trader**         | Maker (own plant)                      | Maker (own plant)                                     | Maker + affiliated trading arm         |
| **Your footprint 3.2×2.5**  | Yes, catalog standard                  | Yes, standard                                         | Yes, plus tighter sizes                |
| **±10 ppm in volume**       | Yes                                    | Yes, ±5 ppm too                                       | Yes                                    |
| **Fit for 50k–200k/yr**     | 5 — your size is their sweet spot      | 4 — you would be a large customer                     | 3 — you are a small account            |
| **English technical reply** | 5 — engineer replied in 1 business day | 3 — sales replied in 3 days, engineer looped in later | 4 — fast, but sales-only answers       |
| **Transparency**            | 4                                      | 5                                                     | 3                                      |
| **Overall fit**             | **4.6**                                | **4.1**                                               | **3.4**                                |
| **Our call**                | **Start here**                         | **Strong second, best for tight tolerance**           | **Backup / high-volume later**         |

**Two we screened out:** one candidate turned out to be a trading company
reselling another maker's parts under its own label. Another does not make your
footprint below ±20 ppm. In your real report both are named, with the reason, so
you never waste time rediscovering them — see §5 for how we write that up.

---

## 4. Supplier profiles

### Supplier A — recommended first contact

**What they are.** A mid-size quartz component maker in Gyeonggi Province,
operating since 1998, with its own plant and about 120 people. Crystals and
clock oscillators are their main business, not a side line.

**Why they fit you**

- Your 3.2×2.5 mm ±10 ppm part is a standard catalog item, not a special
- Their typical order sizes appear to sit right around your 50k–200k range,
  so you are a normal customer, not a nuisance and not an afterthought
- They publish their own datasheets with their own part numbering — a good
  sign of a real maker
- An application engineer, not a salesperson, answered our test question about
  load capacitance and drive level, in English, in one business day

**What to watch**

- Single production site. Fine day to day, but a fire, flood, or labor issue is
  a single point of failure. Worth a second source in year one.
- Their English site is thinner than their Korean site. Ask for the Korean
  catalog and have it read — the real spec range is larger than the English
  page suggests.

**Evidence we saw:** registry record matching the stated address and founding
year; own-brand datasheets; distributor listings carrying their part numbers;
plant photos consistent with the stated size; one engineer reply.
**Not verified:** actual capacity, on-time delivery record, quality system
certificates in force today, financial health.

**Open questions to ask them**

1. Who owns the tooling for a custom frequency, and what happens if we leave?
2. What is your standard lead time at 50k pieces, and what changes it?
3. Can we get a first-article inspection report and a reflow profile with the
   samples?
4. Do you have a second line or partner plant if your line goes down?

---

### Supplier B — recommended, best on tolerance

**What they are.** A small specialist maker in Busan, operating since 2011,
roughly 35 people, focused narrowly on tight-tolerance crystals.

**Why they fit you**

- They hold ±5 ppm as a normal product, which gives you room if your timing
  budget tightens in the next design
- The most transparent of the five: process steps, test equipment, and
  measurement method are described openly on their own site
- At your volume you would be one of their more important customers, which
  usually means real attention

**What to watch**

- Their reply came from sales in three days and only reached an engineer after
  we pushed. Slower than Supplier A. Not a dealbreaker, but set expectations.
- Small company. Great service, thinner buffer if you suddenly triple volume.
- Confirm English support is a person, not a translation tool, before you
  commit to a program.

**Evidence we saw:** registry record; detailed own-site process documentation;
association membership; one sales reply plus a later engineer follow-up.
**Not verified:** capacity headroom, certificate status, financial health.

**Open questions to ask them**

1. What is your monthly capacity for our part, and how much is already booked?
2. Who is our named technical contact, and what is their working-hours window?
3. What is your price break structure from 50k to 200k per year?
4. Can you support ±5 ppm at our footprint without a price jump?

---

### Supplier C — backup, revisit at higher volume

**What they are.** A long-established Incheon maker, since 1989, around 300
people, with an affiliated trading arm that handles much of the export.

**Why they are on the list**

- Deepest catalog of the three, including sizes below yours if you shrink the
  board later
- Long track record and the scale to absorb a big volume jump
- Fast, professional replies

**Why they are not first**

- At 50k–200k pieces a year you are a small account here. Expect standard
  service, not attention.
- Our questions were answered by sales, and technical detail came back thin.
  We could not confirm how directly you would reach an engineer.
- Export runs through the affiliated trading arm, which adds a layer between
  you and the plant. Not a red flag — it is common — but it changes who you are
  actually dealing with when something goes wrong.

**Evidence we saw:** registry records for both the maker and the trading arm;
broad catalog; distributor presence; one sales reply.
**Not verified:** the relationship terms between maker and trading arm,
engineer access, your account's priority.

**Open questions to ask them**

1. Do we contract with the maker or the trading company, and who warrants the parts?
2. Can we have direct engineering contact, or does everything route through sales?
3. What is your minimum for direct-from-plant pricing?

---

## 5. The two we screened out, and why

**Candidate D — presented as a maker, appears to be a trader.** The website
shows a plant, but the photos also appear on another company's site, the
datasheets are another maker's with the logo changed, and the registered
business type does not match manufacturing. We may be wrong, and we did not
visit. But you asked for makers, and the evidence points the other way. Skip.

**Candidate E — real maker, wrong part.** Genuine, well-documented, and
straightforward. They simply do not offer your footprint tighter than ±20 ppm.
Good company, wrong fit. Worth remembering if you ever need their sizes.

---

## 6. What this report is not

We want you to use this correctly, so here is the honest edge of it.

- **This is a screening, not an audit.** We reviewed public records, catalogs,
  published documents, and direct replies. We did not visit any site, inspect
  any line, or test any part.
- **We did not run credit or financial checks.** A company can pass everything
  here and still be in financial trouble.
- **Certificates were not confirmed as currently in force.** Where a supplier
  publishes one, we say so. Confirming it is live is a separate step.
- **People change.** The engineer who answered us well may leave. Re-check the
  contact quality at the start of any real program.
- **Judgment is judgment.** The scores are our reasoned opinion on the evidence
  we saw, and we show you the evidence so you can disagree with us.

This report lowers your risk and saves you weeks. It does not remove risk, and
anyone who tells you their report does is selling you something else.

---

## 7. Your next step

A 30-day plan you can run yourself.

**Week 1 — First contact.** Email Supplier A and Supplier B on the same day
with the same request. We include a ready-to-send email and the four questions
per supplier from §4. Send both; compare how they answer, not just what.

**Week 2 — Compare the answers.** Score each on: did an engineer reply, did
they answer the tooling-ownership question directly, did the lead time come
with conditions. Evasion on tooling is the single most useful early signal.

**Week 3 — Samples.** Request samples from both, plus a first-article report
and a reflow profile. Pay for samples yourself; never wire a deposit at this
stage. Ship to your own address, not a freight forwarder you have not used.

**Week 4 — Decide the pilot.** Pick one for a small paid pilot order and keep
the other warm as your second source. Do not consolidate onto one supplier in
year one.

**Payment safety, always.** Verify bank details by phone with a number you
found yourself, not one from an email. Changed bank details arriving by email
are the most common way buyers lose money in this trade — treat any such
message as fraud until you have voice-confirmed it.

---

## 8. Want us to go further?

This Starter Shortlist gets you to the right door. If you want us to walk
through it with you, the deeper package adds:

- Direct outreach to the shortlist in Korean, on your behalf
- Reply handling and translation until you have real quotes side by side
- A quote comparison sheet that puts true landed cost next to unit price
- Sample-stage coordination and a payment-safety checklist for your finance team

---

<p align="center"><em>ASIVANTA — Korean supplier shortlists for U.S. buyers.<br>
Sample report. Composite examples. Not a description of real companies.</em></p>
