# Fit-Gap — Loyalty Management vs Membership PRD

**Generated:** 2026-05-07 against org `npc-loyalty-demo`
**Method:** Direct schema describe + record count via SF CLI; no metadata retrieval.
**Authoritative source:** [`membership-model-definition-2026-03.pdf`](./membership-model-definition-2026-03.pdf)
**Concept reference:** [`concepts/01-membership-tier-definitions.png`](./concepts/01-membership-tier-definitions.png), [`concepts/03-promotions-and-discounts.png`](./concepts/03-promotions-and-discounts.png)

## TL;DR

Loyalty Management is fully provisioned in this org with all the schema needed for **Membership Tier Definitions, Benefits, and Promotions**. Every relevant standard object exists and is queryable; data tables are empty. **Do not create a custom `Membership_Tier__c` object** — reuse `LoyaltyProgram` + `LoyaltyTierGroup` + `LoyaltyTier` + `LoyaltyTierMshpFeeOption` + `LoyaltyTierBenefit` + `Benefit` + `Promotion` and extend with a small set of custom fields for the PRD-identified gaps.

The PRD's claim that pricing & renewal "Does Not Meet" Loyalty Cloud (§3.2) is partially out of date: `LoyaltyTierMshpFeeOption` already covers base price, duration type, and effective dating per tier. Only FMV, renewal window, grace period, and pro-rating remain as extension fields. Full billing/payment processing (Revenue Cloud integration) is genuinely out of scope of Loyalty Cloud, but that's a later PRD area, not the Tier Definitions area we're scoping now.

## Inventory — what exists in the org

All objects below are present and queryable. Record counts in this org are zero unless noted.

### Membership tier schema

| Object | Role | Key fields used |
|---|---|---|
| `LoyaltyProgram` | Program container | `Status`, `IsPrimary`, `EscrowPeriod`, `Description` |
| `LoyaltyTierGroup` | Tier set | `TierModel` (Calendar/Anniversary), `TierPeriodUnit`, `TierPeriodQuantity`, `IsActive`, `IsPrimary`, `IsHiddenToMembers`, `ExtendExpiration`, `QpResetPeriod` |
| `LoyaltyTier` | Individual tier (Patron, Supporter, etc.) | `Name`, `SequenceNumber`, `Description`, `MinimumEligibleBalance`, `MaximumEligibleBalance`, `Color` |
| **`LoyaltyTierMshpFeeOption`** | **Tier pricing** | **`MembershipFee`, `FeeType`, `MembershipDurationType`, `Points`, `EffectiveStartDateTime`, `EffectiveEndDateTime`, `IsActive`** |

### Benefits schema

| Object | Role | Key fields |
|---|---|---|
| `Benefit` | Benefit definition | `Value`, `IsActive`, `BenefitStatus`, `Start/EndDateTime`, `MinBenefitAmount`, `MaxBenefitAmount`, disbursement counters (`CurrentYearDisbursedQty`, etc.), `ImageUrl`, `IsBenefitSelectionAllowed` |
| `BenefitType` | Benefit catalog | `Category`, `ProcessType`, `Type`, `UnitofMeasureId` |
| `BenefitAction` | Flow-driven fulfillment | `FlowDefinition`, `Type`, `IsBenefitUpdateAllowed`, `IsBenefitExpirationAllowed` |
| `LoyaltyTierBenefit` | Tier ↔ Benefit junction | `LoyaltyTierId`, `BenefitId` |
| `Voucher` | Capped redemption instance | `FaceValue`, `DiscountPercent`, `RemainingValue`, `ContactId`, `BenefitId`, `PromotionId`, `EffectiveDate`, `ExpirationDate` |
| `VoucherDefinition` | Voucher template | 35 fields |

### Promotions schema

| Object | Role | Key fields |
|---|---|---|
| `Promotion` | Promotional offer | `Status`, `IsActive`, `StartDate/EndDate`, `LoyaltyPromotionType`, `PromotionCode`, `IsEnrollmentRequired`, `MaximumRewardValue`, `MaximumVoucherCount`, `DefaultVoucherDefinitionId` |
| `LoyaltyTierPromotion` | Tier ↔ Promotion junction | `LoyaltyTierId`, `PromotionId` |
| `PromotionMarketSegment` | Promo audience targeting | `MarketSegmentId` |

### Member-tier assignment schema

| Object | Role | Key fields |
|---|---|---|
| `LoyaltyProgramMember` | Member enrollment | `MembershipNumber`, `MemberStatus`, `MemberType` (Individual/Group/Corporate), `EnrollmentDate`, `MembershipEndDate`, `RelatedCorporateMembershipId`, `GroupName`, `IsEligibleForTierAssessment` |
| `LoyaltyMemberTier` | Member's tier over time | `LoyaltyMemberId`, `LoyaltyTierId`, `EffectiveDate`, `TierExpirationDate`, `ChangeReasonType`, `ReasonForChange`, `AreBenefitsAssigned` |

### Standard tabs already shipped (relevant subset)

`LoyaltyProgram`, `LoyaltyTierGroup`, `LoyaltyTier`, `LoyaltyTierBenefit`, `LoyaltyTierMshpFeeOption`, `LoyaltyTierPromotion`, `Promotion`, `Benefit`, `BenefitType`, `Voucher`, `VoucherDefinition`, plus 23 more in the loyalty namespace including a guided setup tab (`LoyaltyProgramGuidedSetup` — "Loyalty Program Simplified Setup").

### Standard apps & flexipages

- `Loyalty Management` (Console app, fully shipped).
- `Loyalty_Program_Member_Record_Page` flexipage (already in `force-app/`; matches the standard surface for the Loyalty member record).

## Fit-gap — Membership Tiers (PRD §3.1) and Pricing (§3.2)

| PRD requirement | Existing asset | Recommendation | Confidence |
|---|---|---|---|
| Tier name | `LoyaltyTier.Name` | Reuse | High |
| Tier description | `LoyaltyTier.Description` | Reuse | High |
| Term type (Calendar vs Anniversary) | `LoyaltyTierGroup.TierModel` | Reuse | High |
| Term length | `LoyaltyTierGroup.TierPeriodUnit` + `TierPeriodQuantity` | Reuse | High |
| Tier sequencing | `LoyaltyTier.SequenceNumber` | Reuse | High |
| Tier visual badge color | `LoyaltyTier.Color` | Reuse | High |
| **Base price per tier** | `LoyaltyTierMshpFeeOption.MembershipFee` | **Reuse — PRD missed this** | High |
| **Price duration on tier** | `LoyaltyTierMshpFeeOption.MembershipDurationType` | **Reuse — PRD missed this** | High |
| **Effective dating of tier price** | `LoyaltyTierMshpFeeOption.EffectiveStart/EndDateTime` | **Reuse — PRD missed this** | High |
| Tier type (Individual / Household / Corporate) | `LoyaltyProgramMember.MemberType` (member-level only) | Extend `LoyaltyTier` with `Tier_Type__c` | High |
| Members included (seat count) | _not present_ | Extend `LoyaltyTier` with `Seat_Count__c` | High |
| Named vs unnamed seats | partially `Voucher` (PRD-acknowledged workaround) | Reuse + extend with `Seat_Naming__c` flag | Medium |
| Visibility (public/private) | `LoyaltyTierGroup.IsHiddenToMembers` (group-level only) | Extend `LoyaltyTier` with `Visibility__c` | High |
| Eligibility rules | _not present_ — PRD-acknowledged gap | Extend `LoyaltyTier` with `Eligibility_Rules__c` (text or picklist) | Medium |
| Fair Market Value (FMV) | _not present_ | Extend `LoyaltyTier` or `LoyaltyTierMshpFeeOption` with `Fair_Market_Value__c` | High |
| Renewal window length | _not present_ | Extend `LoyaltyTier` with `Renewal_Window_Days__c` | High |
| Grace period | _not present_ | Extend `LoyaltyTier` with `Grace_Period_Days__c` | High |
| Pro-rating rules | _not present_ — Revenue Cloud territory long-term | Extend `LoyaltyTier` with `Proration_Rule__c` picklist for now | Medium |

## Fit-gap — Benefits (PRD §3.3)

| PRD requirement | Existing asset | Recommendation | Confidence |
|---|---|---|---|
| Tier ↔ benefit association | `LoyaltyTierBenefit` | Reuse | High |
| Multiple benefit types | `BenefitType` (`Category`, `ProcessType`) | Reuse | High |
| Benefit value / cap | `Benefit.Value`, `MinBenefitAmount`, `MaxBenefitAmount`, disbursement counters | Reuse | High |
| Benefit redemption time frame | `Benefit.StartDateTime`, `EndDateTime` | Reuse | High |
| Effective dates on tier↔benefit | _not present on `LoyaltyTierBenefit`_ — PRD-confirmed gap | Extend `LoyaltyTierBenefit` with `Effective_Start__c` / `Effective_End__c` | High |
| Capped per-period redemption | `BenefitAction` + `Voucher` (PRD calls out as complex) | Reuse — document admin complexity | Medium |

## Fit-gap — Promotions (PRD billing & promotions section)

| PRD requirement | Existing asset | Recommendation | Confidence |
|---|---|---|---|
| Promotions list & detail | `Promotion` (46 fields out of box) | Reuse | High |
| Promo by tier | `LoyaltyTierPromotion` junction | Reuse | High |
| Promo audience targeting | `PromotionMarketSegment` | Reuse | High |
| Promo activation / eligibility | `Promotion.IsActive`, `IsEnrollmentRequired`, `EnrollmentStartDate`, `EnrollmentEndDate` | Reuse | High |
| Promo voucher / discount issuance | `Promotion.DefaultVoucherDefinitionId` + `Voucher` | Reuse | High |
| Concept screen "Promotions" page | Standard `Promotion` list view + tab | Reuse list view first; only build custom LWC if the visual doesn't match | High |

## Fit-gap — Member tier assignment

| PRD requirement | Existing asset | Recommendation | Confidence |
|---|---|---|---|
| Member's current tier | `LoyaltyMemberTier` | Reuse | High |
| Tier history / change reason | `LoyaltyMemberTier.ChangeReasonType`, `ReasonForChange` | Reuse | High |
| Tier expiration | `LoyaltyMemberTier.TierExpirationDate` | Reuse | High |
| Linkage from `Membership__c` | `Membership__c.Loyalty_Program_Member__c` (already deployed) → `LoyaltyProgramMember` → `LoyaltyMemberTier` → `LoyaltyTier` | Reuse — existing repo wiring | High |

## Recommendation summary

1. **Reuse:** `LoyaltyProgram`, `LoyaltyTierGroup`, `LoyaltyTier`, `LoyaltyTierMshpFeeOption`, `LoyaltyTierBenefit`, `Benefit`, `BenefitType`, `BenefitAction`, `Voucher`, `VoucherDefinition`, `Promotion`, `LoyaltyTierPromotion`, `PromotionMarketSegment`, `LoyaltyProgramMember`, `LoyaltyMemberTier`.
2. **Configure:** Seed one `LoyaltyProgram` ("Zoo Membership Program"), one `LoyaltyTierGroup`, and the 6 tiers from the concept screen (Patron / Supporter / Family / Contributor / Fellow / Corporate). Each tier gets a `LoyaltyTierMshpFeeOption` for price + duration.
3. **Extend `LoyaltyTier`** with these custom fields to fill PRD gaps: `Tier_Type__c`, `Seat_Count__c`, `Seat_Naming__c`, `Visibility__c`, `Eligibility_Rules__c`, `Renewal_Window_Days__c`, `Grace_Period_Days__c`, `Fair_Market_Value__c`, `Proration_Rule__c`.
4. **Extend `LoyaltyTierBenefit`** with `Effective_Start__c`, `Effective_End__c`.
5. **App nav:** Either reuse the standard `Loyalty Management` console app, or pin standard tabs (`LoyaltyTier`, `LoyaltyTierGroup`, `Promotion`, `Benefit`) into the existing `Membership_Operations` app so the Membership Director has a single workspace.
6. **Wire** `Membership__c.Loyalty_Program_Member__c` (already deployed) → `LoyaltyProgramMember` → `LoyaltyMemberTier` → `LoyaltyTier` so each zoo membership inherits tier definition (price, term, benefits, promos) from Loyalty Cloud.
7. **Concept screen "Membership Tier Definitions":** start with the standard `LoyaltyTier` tab and list view. Only build a custom LWC if the standard list view doesn't deliver the screenshot's columns (member count, benefit count, grace days badge).

## What this changes vs the original PRD

- **Removes a custom `Membership_Tier__c` object from scope.** The PRD did not assert one was needed; this fit-gap rules it out for sure.
- **Reframes PRD §3.2** ("Does Not Meet"): pricing-on-tier (base price + duration + effective dating) is in fact in the box via `LoyaltyTierMshpFeeOption`. The remaining gaps (FMV, renewal window, grace period, pro-rating) are extension fields, not a Revenue Cloud integration. Full billing/payment processing remains genuinely out of Loyalty Cloud's scope and stays a Revenue Cloud / Salesforce Payments concern in PRD's Billing & Revenue Management section.
- **Promotions concept screen is mostly free.** Standard `Promotion` tab + list view + record page; junction to tiers via `LoyaltyTierPromotion`.
- **Aligns with the PRD's own intent** ("Membership Model Definition (Loyalty Cloud Foundation)") — Loyalty is the foundation, not a parallel custom model.

## Open questions

- Do we want the Membership Director to work in the standard `Loyalty Management` console, or pin Loyalty tabs into our existing `Membership_Operations` console for a single-pane experience?
- Is `Tier_Type__c` (Individual/Household/Corporate) on `LoyaltyTier` the right home, or should it stay tied to `LoyaltyProgramMember.MemberType` and be derived?
- For tier visibility, do we need invite-only mechanics (vouchers/codes) or just a `Public/Private` flag for now?
- Should `Fair_Market_Value__c` live on `LoyaltyTier` (one value per tier) or `LoyaltyTierMshpFeeOption` (per fee variant)?
- Pro-rating: extension picklist now, Revenue Cloud later? Or skip until Billing & Automation work begins?

## Verification commands used

```bash
# Confirm objects exist + describe key fields
sf sobject describe --sobject LoyaltyProgram -o npc-loyalty-demo
sf sobject describe --sobject LoyaltyTierGroup -o npc-loyalty-demo
sf sobject describe --sobject LoyaltyTier -o npc-loyalty-demo
sf sobject describe --sobject LoyaltyTierMshpFeeOption -o npc-loyalty-demo
sf sobject describe --sobject LoyaltyTierBenefit -o npc-loyalty-demo
sf sobject describe --sobject LoyaltyTierPromotion -o npc-loyalty-demo
sf sobject describe --sobject Benefit -o npc-loyalty-demo
sf sobject describe --sobject Promotion -o npc-loyalty-demo
sf sobject describe --sobject LoyaltyMemberTier -o npc-loyalty-demo
sf sobject describe --sobject Voucher -o npc-loyalty-demo

# Confirm record counts
sf data query -o npc-loyalty-demo -q "SELECT COUNT() FROM LoyaltyProgram"
sf data query -o npc-loyalty-demo -q "SELECT COUNT() FROM LoyaltyTier"
sf data query -o npc-loyalty-demo -q "SELECT COUNT() FROM Promotion"

# Confirm standard tabs and apps exist
sf data query -o npc-loyalty-demo -q "SELECT Name, Label, SobjectName FROM TabDefinition WHERE Name LIKE 'standard-Loyalty%'"
sf data query -o npc-loyalty-demo -q "SELECT Label, DeveloperName, NavType FROM AppDefinition WHERE Label LIKE '%Loyalty%'"
```
