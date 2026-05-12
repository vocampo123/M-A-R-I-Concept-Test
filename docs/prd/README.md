# Membership Model Definition — PRD & Concepts

This folder is the source of truth for the membership product requirements driving the work in this repo. **Do not rebuild from chat memory — start here.**

## Source artifacts

- **PRD (authoritative):** [`membership-model-definition-2026-03.pdf`](./membership-model-definition-2026-03.pdf) — _PRD: Membership Model Definition (Loyalty Cloud Foundation), WIP March 2026._
- **Org fit-gap analysis:** [`fit-gap-loyalty-management.md`](./fit-gap-loyalty-management.md) — what already exists in the target org for Membership Tiers, Benefits, and Promotions. Reuse-first decisions are anchored here. Read this before any new tier/benefit/promo build.
- **Concept mocks:** [`concepts/`](./concepts/) — directional UX from product, not approved designs. Use as scope signal, not pixel reference.
  - `00-flow-overview.png` — hand-drawn flow: Home/Command Center → Membership Tier Definitions → Billing & Automation; Members Page → Members Detail
  - `01-membership-tier-definitions.png` — tier setup table (Patron/Supporter/Family/Contributor/Fellow/Corporate, type, term, dues, members, benefits, grace, visibility)
  - `02-billing-and-automation.png` — multi-step setup (Payment Methods, Pricing & Terms, Grace & Automation, Tax & FMV, Revenue Recognition)
  - `03-promotions-and-discounts.png` — promo list + detail (Spring Renewal Special, First Month Free, Senior Pricing, etc.)
  - `04-reports-and-analytics.png` — KPI cards (Active/Grace/Lapsed/Cancelled), Members by Tier table, Renewals/Benefit/Financial tabs
  - `98-prototype-member-detail.png` — local prototype reference for the deployed Member Record page
  - `99-misc-tab-label.png` — utility screenshot from earlier debugging

## What the PRD covers

The PRD scopes a **foundational layer** for membership management on Salesforce, anchored on Loyalty Cloud as the foundation and integrating with Revenue Cloud for pricing/billing.

### Personas
- **Membership Director (primary)** — defines pricing/renewal strategy, tracks benefit utilization, sees member health, prevents churn.
- **Member (secondary)** — frictionless access to benefits and digital credentials; recognition for loyalty.

### In-scope (per PRD §Scope)
1. **Membership Model Definition** — tiers (Individual, Household, Corporate, Student), term types (Anniversary vs Calendar), benefits.
2. **Member Tracking** — lifecycle status, history, benefit entitlement mapping.
3. **Revenue & Billing Basics** — pricing, automated invoicing, renewals.
4. **Core Automation** — status transitions (Active → Grace → Lapsed), payment failure workflows, benefit provisioning.
5. **Connective Tissue** — Loyalty + Commerce + Revenue Cloud + Salesforce Payments integration.

### Explicitly out of scope (this PRD)
- Advanced AI agents, analytics, Slack-first UX.
- Archetype-specific features for any single membership organization type.

## User stories at a glance

Pulled from PRD §2 (User Experience & Functional Requirements). See the PDF for full acceptance criteria.

### Membership Model Definition
- Create multiple membership tiers (name, type, description, term type, seats, visibility, eligibility).
- Define pricing & renewal strategy (base price, duration, FMV, renewal window, grace period, pro-rating).
- Associate benefits to tiers, with caps, redemption time frames, and effective dates.
- Track member details: type, tier, status, IDs, term dates, price paid, action taken, lifetime spend, member-since, lifetime months, household members, interests, communication preferences, credentials, CE credits, donation/volunteer history.
- Track renewal & billing per member (payment method, billing status, history, auto-renew, outstanding revenue).
- Track member activity (benefits available/used, household activity, unified timeline).
- Track corporate memberships (POC, allotted/used seats, roster, transfer rules).
- Reports for member base monitoring (mailing lists, by tier/status, upcoming renewals, grace period, benefit usage, dues forecast, LTV).
- Admin automation toggles (status transitions, benefit provisioning, benefit versioning, automatic assignment, corporate sign-ups, early renewals).
- Issue digital member cards / QR codes (incl. Apple/Google Wallet).

### Billing & Revenue Management
- Automated revenue recognition by product type.
- Recurring membership billing, dues waivers, payment plans, billing hierarchies (corporate consolidated invoicing).
- Invoice management (rules, FMV vs donation amounts, credits/adjustments/refunds, aging reports).
- Payment processing (one-time, recurring, mixed-cart, multiple methods incl. CC/ACH/cash/check/digital wallets, stored methods, location-based tax, $0 redemption checkout).
- Conditional pricing & proration (formula-based, daily/weekly/monthly/quarterly).
- Merchandise sales (mixed cart with membership).
- Promotions tied to campaigns (% off, fixed off, first month free, free gift).
- Bundles, cross-sell, upsell.
- Admin automation toggles (renewals, payment failures, upgrade/downgrade billing, FMV calc, GL mapping, refund logic).

## Build state — PRD coverage map

| PRD area | Concept screen | Repo surface | Status |
|---|---|---|---|
| Member tracking | `00-flow-overview` (Home/Command Center node) | `Membership_Command_Center` flexipage + tab + LWCs | Deployed |
| Member tracking — list | `00-flow-overview` (Members Page node) | Standard `Members` (`Membership__c`) tab + `All Members` list view + 10 seeded records | Deployed |
| Member tracking — detail | `00-flow-overview` (Members Detail node) + `98-prototype-member-detail` | `Membership_Record_Page` flexipage w/ Aura sidebar template, 5 tabs, sidebar LWCs. **Local prototype only:** new **Member Detail** standalone page at `/member-detail` (route added to `routes.config.js`, registered in `app.js` as `page-loyalty-member-detail`, lives in `src/modules/page/loyaltyMemberDetail/`). Recreates the standard Loyalty Program Member record page in membership-director language: header with member identity + compact metadata strip; main column has Program Member Detail, Contact Details, Tier History, Active Vouchers, and Membership Lifecycle cards; right rail has small Renewal card (renewal date, status badge, annual dues, Process Renewal / Update Credit Card / Manual Payment actions), Recognition Badges, Promotions, and Household Roster (Household tier only). Defaults to the Anderson Family (m003 — Household) when no `:id` is in the route. Front-end only — no `@wire`, no Apex; fixtures in `src/modules/data/members/members.js` extended with `tierHistory`, `promotions`, `vouchers`, `badges`, `lifecycleEvents`, `householdRoster`, plus `termStartDate`/`termEndDate`/`actionTaken`/`highestTier`/`lifetimeMonths` for the Household member. | Deployed + activated (record page); new standalone Member Detail page is local-prototype only |
| Membership tier definitions | `01-membership-tier-definitions` | Standard `LoyaltyProgram` + `LoyaltyTierGroup` + `LoyaltyTier` + `LoyaltyTierMshpFeeOption` reused; `LoyaltyTier` extended with 9 fields (Tier_Type__c, Seat_Count__c, Seat_Naming__c, Visibility__c, Eligibility_Rules__c, Renewal_Window_Days__c, Grace_Period_Days__c, Fair_Market_Value__c, Lifecycle_Status__c) and `LoyaltyTierBenefit` with 2 (Effective_Start__c/End__c). `Membership_Tier_Record_Page` flexipage activated for the `Membership_Operations` console (mirrors `Membership_Record_Page` structure with `tierHealthCard` LWC sidebar). 4 curated list views, 3 compact layouts, and standard tabs for Loyalty Tier / Benefit / Promotion are pinned in app nav. `Membership__c` Renewal & Billing tab now hosts `memberTierSnapshot` LWC for cross-linked tier context. Seed data: 1 program (Zoo Membership Program) + 1 tier group + 6 tiers (Patron $75 / Supporter $150 / Family $200 / Contributor $350 / Fellow $500 / Corporate $1500) + 5 benefits + 17 tier↔benefit junctions + 7 LoyaltyProgramMembers wired to the existing 10 `Membership__c` records, distributed across all 6 tiers. See [`fit-gap-loyalty-management.md`](./fit-gap-loyalty-management.md). | Deployed |
| Admin setup wizard (Program, Tiers, Benefits, Tier↔Benefit Mapping, Payment Methods, Pricing & Terms, Grace & Automation, Tax & FMV, Revenue Recognition, Review & Activate) | `02-billing-and-automation` (originally the billing setup) + earlier program/tier concepts | `Membership Setup` tab (`/membership-setup` route) + `membershipSetup` orchestrator (exposed) with a flat 10-step left-rail navigation grouped into 4 sections (Program, Tiers, Billing & Automation, Review). Step LWCs (all internal, exposed=false): `membershipSetupProgramPhase`, `membershipSetupTiersList`, `membershipSetupBenefitsList`, `membershipSetupTierBenefitMap`, `membershipSetupPaymentMethods`, `membershipSetupPricingTerms`, `membershipSetupGraceAutomation`, `membershipSetupTaxFmv`, `membershipSetupRevenueRec`, `membershipSetupReviewPhase`. Page header follows the SLDS 2 single-row pattern (medium icon · step title · Cancel + Save). Pricing per Tier supports inline editing and a "Create Tier" action. **Front-end only** — no `@wire`, no Apex, no record creation. Save / Cancel / Finish toast successes; real persistence to `LoyaltyProgram` / Revenue Cloud / Salesforce Payments not wired. The legacy `Set Up` tab + `setupWizard` page wrapper + `membershipSetupWizard` LWC + its child step LWCs (`membershipSetupHomeStep` / `membershipSetupProgramStep` / `membershipSetupBillingStep`) + `Membership_Setup.flexipage` were removed in favor of this orchestrator. A new flexipage for the org surface has not been authored yet. | UI shipped (local prototype); deployable flexipage and data wiring pending |
| Promotions & discounts | `03-promotions-and-discounts` | Standard `Promotion` + `LoyaltyTierPromotion` reused (no custom object). Compact layout (`Promotion_Compact` showing Name / Status / LoyaltyPromotionType / StartDate / EndDate) deployed; `standard-Promotion` tab pinned in the `Membership_Operations` console; permission set grants Promotion read/write. Seed data: 6 promos (Spring Renewal Special, First Month Free, Senior Pricing, Refer-a-Friend, Corporate Match, Family Day Pass) wired to the seeded program with 19 `LoyaltyTierPromotion` junctions distributing them across the 6 tiers. See `scripts/seed/promotions.apex` (idempotent on Promotion.Name; run after `membership_tiers.apex`). **Front-end only** — no custom Promotion record page, list view, or LWC built yet; users see the standard tab + standard list view + standard detail page. | Seed data deployed |
| Reports & analytics | `04-reports-and-analytics` | _Not built._ Maps to PRD report stories. Should be standard Salesforce reports/dashboards plus summary LWCs only where standard reports can't. | Not started |
| Digital member cards / wallet | (not in concept set) | _Not built._ Maps to PRD §3.6 / digital credentials story. | Not started |

## Known limitations after the Membership Tier Definitions deploy

- **Loyalty Cloud auto-enrollment requires `MinimumEligibleBalance` ranges** on every tier — without them, inserting `LoyaltyProgramMember` fails with `Something went wrong while creating Loyalty Member Tier and Loyalty Member Currency records`. The seed script populates these ranges (Patron 0–100, Supporter 100–200, …, Corporate 1500–∞). If you reset tiers manually, re-run `scripts/seed/membership_tiers.apex`.
- **Promotion picklist values are org-restricted.** In `npc-loyalty-demo`, valid `Promotion.Status` is `Draft / InProgress / Complete / Cancelled` (not `Active`) and `Promotion.LoyaltyPromotionType` is `Standard / Cumulative / Joint` (not `Promotion Code` / `Member Group` / `Time Period`). `Cumulative` requires a `CumulativeUsageTarget`; `Joint` requires partner contributions summing to 100% before `IsActive=true` is allowed. The seed uses `Standard` + `InProgress` for all 6 promos to avoid these constraints. If you change a promo's type via the UI later, supply the dependent fields.
- **Members-by-Tier report chart** is not pinned to the LoyaltyTier list view yet — the report metadata wasn't authored in this iteration. The 4 list views (All / Active / Public / Corporate) are deployed without a chart.
- **Out-of-scope per the plan:** Path B custom datatable LWC for the tier list page, dedicated record pages for `Benefit` and `Promotion`, the `tierBadge` reusable LWC, Quick Actions / screen flows (Add Benefit, Set Pricing, Run a Promotion), validation rules, the Reports & Analytics tab, and the full Billing & Revenue Management surface.

## Identified PRD gaps that constrain implementation

These come from the PRD's "Identified Gap" call-outs and matter for any new build in this area:

- **Adult vs child distinction on person account** is missing for household memberships (§3.1).
- **Pricing/renewal attributes do not exist on Loyalty Tier objects** — must integrate Revenue Cloud (§3.2). This is the primary blocker for a real Billing & Automation build.
- **Capped benefit usage** is complex in Loyalty (Benefit Actions + Vouchers); admins struggle. Effective dates on tier↔benefit links are missing (§3.3).
- **Member status picklist is locked** to Active/Inactive/Merged (§3.4).
- **No native fields for credential status or CE credits** (§3.4).
- **No household/corporate roll-up of member activity** (§3.4).
- **No out-of-box corporate roster view** with seats + benefit usage (§3.5).

## How to use this folder

- **Before any new membership-domain build:** read the matching PRD section, look at the matching concept screen, and check the build state table above. Update the build state table when something ships.
- **When the PRD or concepts change:** replace the file in place (don't add a versioned copy). Update the README to reflect new scope.
- **Concept screens are not pixel specs.** They are scope signals from product. Real designs should come from UX before locking down screen behavior.
