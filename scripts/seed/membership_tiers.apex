/*
 * Seed data for the Membership Tier Definitions feature.
 *
 * Creates / upserts:
 *   - 1 LoyaltyProgram (Zoo Membership Program)
 *   - 1 LoyaltyTierGroup (anniversary, 1-year cycle)
 *   - 1 LoyaltyProgramCurrency (qualifying)
 *   - 6 LoyaltyTiers with extension fields and MinimumEligibleBalance ranges
 *     so Loyalty Cloud auto-tier-assignment works
 *   - 6 LoyaltyTierMshpFeeOption records (one current fee per tier)
 *   - 1 BenefitType + 5 Benefits + 12 LoyaltyTierBenefit junction rows
 *   - 1 LoyaltyProgramMember per existing Membership__c (auto-creates a
 *     LoyaltyMemberTier in the entry tier), then reassigns each LMT to a
 *     desired tier so all 6 tiers are represented in the demo data
 *
 * Idempotent on program name. Safe to re-run.
 *
 * Run: sf apex run -f scripts/seed/membership_tiers.apex -o <org-alias>
 */

// ---------------------------------------------------------------------------
// 1. Loyalty Program
// ---------------------------------------------------------------------------
String programName = 'Zoo Membership Program';
LoyaltyProgram program;
List<LoyaltyProgram> existing = [
    SELECT Id, Name FROM LoyaltyProgram WHERE Name = :programName LIMIT 1
];
if (!existing.isEmpty()) {
    program = existing[0];
} else {
    program = new LoyaltyProgram(
        Name = programName,
        Status = 'Active',
        IsPrimary = true
    );
    insert program;
}
System.debug('Program: ' + program.Id);

// ---------------------------------------------------------------------------
// 2. Loyalty Tier Group (anniversary cycle, 1-year period)
// ---------------------------------------------------------------------------
String tierGroupName = 'Annual Membership Tiers';
LoyaltyTierGroup tierGroup;
List<LoyaltyTierGroup> tgExisting = [
    SELECT Id FROM LoyaltyTierGroup
    WHERE LoyaltyProgramId = :program.Id AND Name = :tierGroupName LIMIT 1
];
if (!tgExisting.isEmpty()) {
    tierGroup = tgExisting[0];
} else {
    tierGroup = new LoyaltyTierGroup(
        Name = tierGroupName,
        LoyaltyProgramId = program.Id,
        Description = 'Anniversary-based annual membership tiers.',
        TierModel = 'Anniversary',
        TierPeriodUnit = 'Years',
        TierPeriodQuantity = 1,
        QpResetPeriod = 'Years',
        QpResetFrequency = 1,
        IsActive = true,
        IsPrimary = true
    );
    insert tierGroup;
}
System.debug('Tier Group: ' + tierGroup.Id);

// ---------------------------------------------------------------------------
// 2b. Loyalty Program Currency (qualifying points, scoped to the tier group)
// ---------------------------------------------------------------------------
LoyaltyProgramCurrency programCurrency;
List<LoyaltyProgramCurrency> currencyExisting = [
    SELECT Id FROM LoyaltyProgramCurrency WHERE LoyaltyProgramId = :program.Id LIMIT 1
];
if (!currencyExisting.isEmpty()) {
    programCurrency = currencyExisting[0];
} else {
    SObjectType lpcType = Schema.getGlobalDescribe().get('LoyaltyProgramCurrency');
    SObject pc = lpcType.newSObject();
    pc.put('Name', 'Membership Points');
    pc.put('LoyaltyProgramId', program.Id);
    pc.put('LoyaltyTierGroupId', tierGroup.Id);
    pc.put('CurrencyType', 'Qualifying');
    insert pc;
    programCurrency = (LoyaltyProgramCurrency) pc;
}
System.debug('Program Currency: ' + programCurrency.Id);

// ---------------------------------------------------------------------------
// 3. Tiers + Fee Options
// ---------------------------------------------------------------------------
// minBalance / maxBalance define qualifying-points ranges that Loyalty Cloud
// uses for auto-tier-assignment. Patron is the entry tier (min 0). Top tier
// has no upper bound.
List<Map<String, Object>> tierConfigs = new List<Map<String, Object>>{
    new Map<String, Object>{
        'name' => 'Patron',
        'sequence' => 1,
        'description' => 'Entry-level supporter membership.',
        'tierType' => 'Individual',
        'seats' => 1,
        'seatNaming' => 'Named',
        'visibility' => 'Public',
        'eligibility' => 'Open to all individuals.',
        'renewalWindow' => 30,
        'grace' => 30,
        'fmv' => 50,
        'fee' => 75,
        'lifecycle' => 'Active',
        'minBalance' => 0,
        'maxBalance' => 100
    },
    new Map<String, Object>{
        'name' => 'Supporter',
        'sequence' => 2,
        'description' => 'Member-plus-guest with bring-a-friend privileges.',
        'tierType' => 'Individual',
        'seats' => 2,
        'seatNaming' => 'Unnamed',
        'visibility' => 'Public',
        'eligibility' => 'Open to all individuals.',
        'renewalWindow' => 30,
        'grace' => 30,
        'fmv' => 90,
        'fee' => 150,
        'lifecycle' => 'Active',
        'minBalance' => 100,
        'maxBalance' => 200
    },
    new Map<String, Object>{
        'name' => 'Family',
        'sequence' => 3,
        'description' => 'Two adults plus children in the household.',
        'tierType' => 'Household',
        'seats' => 5,
        'seatNaming' => 'Named',
        'visibility' => 'Public',
        'eligibility' => 'One household per membership; up to 2 named adults.',
        'renewalWindow' => 45,
        'grace' => 30,
        'fmv' => 110,
        'fee' => 200,
        'lifecycle' => 'Active',
        'minBalance' => 200,
        'maxBalance' => 350
    },
    new Map<String, Object>{
        'name' => 'Contributor',
        'sequence' => 4,
        'description' => 'Includes guest passes and members-only events.',
        'tierType' => 'Household',
        'seats' => 6,
        'seatNaming' => 'Named',
        'visibility' => 'Public',
        'eligibility' => 'Households with 2 named adults; supports recognition wall.',
        'renewalWindow' => 60,
        'grace' => 45,
        'fmv' => 175,
        'fee' => 350,
        'lifecycle' => 'Active',
        'minBalance' => 350,
        'maxBalance' => 500
    },
    new Map<String, Object>{
        'name' => 'Fellow',
        'sequence' => 5,
        'description' => 'Premium tier with backstage tours and curator access.',
        'tierType' => 'Household',
        'seats' => 8,
        'seatNaming' => 'Named',
        'visibility' => 'Public',
        'eligibility' => 'Donor-level recognition; tax-deductible portion above FMV.',
        'renewalWindow' => 60,
        'grace' => 60,
        'fmv' => 225,
        'fee' => 500,
        'lifecycle' => 'Active',
        'minBalance' => 500,
        'maxBalance' => 1500
    },
    new Map<String, Object>{
        'name' => 'Corporate',
        'sequence' => 6,
        'description' => 'Company-sponsored membership with employee passes.',
        'tierType' => 'Corporate',
        'seats' => 25,
        'seatNaming' => 'Unnamed',
        'visibility' => 'Invite-Only',
        'eligibility' => 'Companies with active sponsorship agreement; HR seat allocation.',
        'renewalWindow' => 90,
        'grace' => 60,
        'fmv' => 600,
        'fee' => 1500,
        'lifecycle' => 'Active',
        'minBalance' => 1500,
        'maxBalance' => null
    }
};

List<LoyaltyTier> existingTiers = [
    SELECT Id, Name FROM LoyaltyTier WHERE LoyaltyTierGroupId = :tierGroup.Id
];
Map<String, LoyaltyTier> tiersByName = new Map<String, LoyaltyTier>();
for (LoyaltyTier t : existingTiers) {
    tiersByName.put(t.Name, t);
}

List<LoyaltyTier> tiersToInsert = new List<LoyaltyTier>();
List<LoyaltyTier> tiersToUpdate = new List<LoyaltyTier>();
for (Map<String, Object> cfg : tierConfigs) {
    String name = (String) cfg.get('name');
    if (tiersByName.containsKey(name)) {
        // Ensure existing tiers have balance ranges (required for auto-assignment).
        LoyaltyTier existingTier = tiersByName.get(name);
        existingTier.MinimumEligibleBalance = (Decimal) cfg.get('minBalance');
        existingTier.MaximumEligibleBalance = (Decimal) cfg.get('maxBalance');
        tiersToUpdate.add(existingTier);
        continue;
    }
    tiersToInsert.add(new LoyaltyTier(
        Name = name,
        LoyaltyTierGroupId = tierGroup.Id,
        Description = (String) cfg.get('description'),
        SequenceNumber = (Integer) cfg.get('sequence'),
        MinimumEligibleBalance = (Decimal) cfg.get('minBalance'),
        MaximumEligibleBalance = (Decimal) cfg.get('maxBalance'),
        Tier_Type__c = (String) cfg.get('tierType'),
        Seat_Count__c = (Integer) cfg.get('seats'),
        Seat_Naming__c = (String) cfg.get('seatNaming'),
        Visibility__c = (String) cfg.get('visibility'),
        Eligibility_Rules__c = (String) cfg.get('eligibility'),
        Renewal_Window_Days__c = (Integer) cfg.get('renewalWindow'),
        Grace_Period_Days__c = (Integer) cfg.get('grace'),
        Fair_Market_Value__c = (Decimal) cfg.get('fmv'),
        Lifecycle_Status__c = (String) cfg.get('lifecycle')
    ));
}
if (!tiersToInsert.isEmpty()) {
    insert tiersToInsert;
}
if (!tiersToUpdate.isEmpty()) {
    update tiersToUpdate;
}
for (LoyaltyTier t : [SELECT Id, Name FROM LoyaltyTier WHERE LoyaltyTierGroupId = :tierGroup.Id]) {
    tiersByName.put(t.Name, t);
}

// Fee Options — one per tier (LoyaltyTierMshpFeeOption is created via dynamic
// SObject because the type isn't statically resolvable in Apex in this org).
Set<Id> tierIds = new Set<Id>();
for (LoyaltyTier t : tiersByName.values()) {
    tierIds.add(t.Id);
}
Set<Id> tiersWithFees = new Set<Id>();
for (SObject existingFee : Database.query(
    'SELECT LoyaltyTierId FROM LoyaltyTierMshpFeeOption WHERE LoyaltyTierId IN :tierIds'
)) {
    tiersWithFees.add((Id) existingFee.get('LoyaltyTierId'));
}

List<SObject> feesToInsert = new List<SObject>();
SObjectType feeType = Schema.getGlobalDescribe().get('LoyaltyTierMshpFeeOption');
for (Map<String, Object> cfg : tierConfigs) {
    LoyaltyTier t = tiersByName.get((String) cfg.get('name'));
    if (t == null || tiersWithFees.contains(t.Id) || feeType == null) {
        continue;
    }
    SObject fee = feeType.newSObject();
    fee.put('LoyaltyTierId', t.Id);
    fee.put('MembershipFee', (Decimal) cfg.get('fee'));
    fee.put('FeeType', 'Recurring');
    fee.put('MembershipDurationType', 'Years');
    fee.put('EffectiveStartDateTime', DateTime.newInstance(Date.today().toStartOfMonth(), Time.newInstance(0,0,0,0)));
    fee.put('IsActive', true);
    feesToInsert.add(fee);
}
if (!feesToInsert.isEmpty()) {
    insert feesToInsert;
}

// ---------------------------------------------------------------------------
// 4. Benefits + Junctions
// ---------------------------------------------------------------------------
// Unit of Measure for Benefit (Loyalty Cloud requires one even though the
// metadata marks it nillable).
UnitOfMeasure uom;
List<UnitOfMeasure> uomExisting = [SELECT Id FROM UnitOfMeasure WHERE Name = 'Each' LIMIT 1];
if (!uomExisting.isEmpty()) {
    uom = uomExisting[0];
} else {
    uom = new UnitOfMeasure(Name = 'Each', UnitCode = 'EA');
    insert uom;
}

String benefitTypeName = 'Membership Benefit';
BenefitType benefitType;
List<BenefitType> btExisting = [
    SELECT Id FROM BenefitType WHERE Name = :benefitTypeName LIMIT 1
];
if (!btExisting.isEmpty()) {
    benefitType = btExisting[0];
} else {
    benefitType = new BenefitType(
        Name = benefitTypeName,
        Description = 'Member-facing benefit (admission, discount, perk).',
        LoyaltyProgramId = program.Id,
        UnitofMeasureId = uom.Id,
        ProcessType = 'Loyalty'
    );
    insert benefitType;
}

List<Map<String, Object>> benefitConfigs = new List<Map<String, Object>>{
    new Map<String, Object>{ 'name' => 'Free General Admission', 'description' => 'Unlimited free general admission for all named members.' },
    new Map<String, Object>{ 'name' => 'Member Guest Pass', 'description' => 'Bring-a-guest passes per visit.' },
    new Map<String, Object>{ 'name' => 'Gift Shop Discount 10%', 'description' => '10% off purchases in the gift shop.' },
    new Map<String, Object>{ 'name' => 'Members-Only Events', 'description' => 'Access to quarterly members-only events.' },
    new Map<String, Object>{ 'name' => 'Backstage Tour', 'description' => 'Annual backstage tour with curator.' }
};

Map<String, Benefit> benefitsByName = new Map<String, Benefit>();
for (Benefit b : [SELECT Id, Name FROM Benefit WHERE Name IN ('Free General Admission','Member Guest Pass','Gift Shop Discount 10%','Members-Only Events','Backstage Tour')]) {
    benefitsByName.put(b.Name, b);
}
List<Benefit> benefitsToInsert = new List<Benefit>();
for (Map<String, Object> cfg : benefitConfigs) {
    String name = (String) cfg.get('name');
    if (benefitsByName.containsKey(name)) {
        continue;
    }
    benefitsToInsert.add(new Benefit(
        Name = name,
        BenefitTypeId = benefitType.Id,
        UnitId = uom.Id,
        IsActive = true
    ));
}
if (!benefitsToInsert.isEmpty()) {
    insert benefitsToInsert;
}
for (Benefit b : [SELECT Id, Name FROM Benefit WHERE Name IN ('Free General Admission','Member Guest Pass','Gift Shop Discount 10%','Members-Only Events','Backstage Tour')]) {
    benefitsByName.put(b.Name, b);
}

// Tier-to-benefit assignment matrix
Map<String, List<String>> tierBenefitMatrix = new Map<String, List<String>>{
    'Patron' => new List<String>{ 'Free General Admission' },
    'Supporter' => new List<String>{ 'Free General Admission', 'Member Guest Pass' },
    'Family' => new List<String>{ 'Free General Admission', 'Member Guest Pass', 'Gift Shop Discount 10%' },
    'Contributor' => new List<String>{ 'Free General Admission', 'Member Guest Pass', 'Gift Shop Discount 10%', 'Members-Only Events' },
    'Fellow' => new List<String>{ 'Free General Admission', 'Member Guest Pass', 'Gift Shop Discount 10%', 'Members-Only Events', 'Backstage Tour' },
    'Corporate' => new List<String>{ 'Free General Admission', 'Members-Only Events' }
};

Set<String> existingJunctionKeys = new Set<String>();
for (LoyaltyTierBenefit existingJunction : [
    SELECT LoyaltyTierId, BenefitId FROM LoyaltyTierBenefit WHERE LoyaltyTierId IN :tierIds
]) {
    existingJunctionKeys.add(existingJunction.LoyaltyTierId + '|' + existingJunction.BenefitId);
}

List<LoyaltyTierBenefit> junctionsToInsert = new List<LoyaltyTierBenefit>();
for (String tierName : tierBenefitMatrix.keySet()) {
    LoyaltyTier t = tiersByName.get(tierName);
    if (t == null) {
        continue;
    }
    for (String benefitName : tierBenefitMatrix.get(tierName)) {
        Benefit b = benefitsByName.get(benefitName);
        if (b == null) {
            continue;
        }
        String key = t.Id + '|' + b.Id;
        if (existingJunctionKeys.contains(key)) {
            continue;
        }
        junctionsToInsert.add(new LoyaltyTierBenefit(
            Name = tierName + ' - ' + benefitName,
            LoyaltyTierId = t.Id,
            BenefitId = b.Id,
            Effective_Start__c = Date.today().toStartOfMonth()
        ));
    }
}
if (!junctionsToInsert.isEmpty()) {
    insert junctionsToInsert;
}

// ---------------------------------------------------------------------------
// 5. Wire existing Membership__c records to LoyaltyProgramMember + LMT
// ---------------------------------------------------------------------------
// Inserting a LoyaltyProgramMember triggers platform-managed auto-creation of
// LoyaltyMemberTier (entry tier) and LoyaltyMemberCurrency, which only works
// once tiers have MinimumEligibleBalance ranges populated (handled above).
// We then update the auto-created LMT to a desired tier per a rotation so all
// 6 tiers are represented in the demo.

List<Membership__c> memberships = [
    SELECT Id, Contact__c, Account__c, Loyalty_Program_Member__c
    FROM Membership__c
    ORDER BY CreatedDate
];

Set<Id> contactIds = new Set<Id>();
for (Membership__c m : memberships) {
    if (m.Contact__c != null) { contactIds.add(m.Contact__c); }
}

Map<Id, LoyaltyProgramMember> lpmByContact = new Map<Id, LoyaltyProgramMember>();
for (LoyaltyProgramMember lpm : [
    SELECT Id, ContactId FROM LoyaltyProgramMember
    WHERE ProgramId = :program.Id AND ContactId IN :contactIds
]) {
    lpmByContact.put(lpm.ContactId, lpm);
}

List<LoyaltyProgramMember> lpmsToInsert = new List<LoyaltyProgramMember>();
for (Membership__c m : memberships) {
    if (m.Contact__c == null || lpmByContact.containsKey(m.Contact__c)) { continue; }
    lpmsToInsert.add(new LoyaltyProgramMember(
        MembershipNumber = 'ZMP-' + String.valueOf(m.Id),
        ProgramId = program.Id,
        ContactId = m.Contact__c,
        EnrollmentDate = Date.today().toStartOfMonth(),
        MemberStatus = 'Active',
        MemberType = 'Individual'
    ));
}
if (!lpmsToInsert.isEmpty()) {
    insert lpmsToInsert;
    for (LoyaltyProgramMember lpm : lpmsToInsert) {
        lpmByContact.put(lpm.ContactId, lpm);
    }
}

List<Membership__c> membershipsToUpdate = new List<Membership__c>();
for (Membership__c m : memberships) {
    if (m.Contact__c == null) { continue; }
    LoyaltyProgramMember lpm = lpmByContact.get(m.Contact__c);
    if (lpm == null) { continue; }
    if (m.Loyalty_Program_Member__c != lpm.Id) {
        m.Loyalty_Program_Member__c = lpm.Id;
        membershipsToUpdate.add(m);
    }
}
if (!membershipsToUpdate.isEmpty()) {
    update membershipsToUpdate;
}

// Reassign auto-created Patron LMTs per a rotation that touches all 6 tiers.
List<String> tierRotation = new List<String>{
    'Patron', 'Supporter', 'Family', 'Contributor', 'Fellow', 'Corporate', 'Family'
};

List<Id> lpmIds = new List<Id>();
for (LoyaltyProgramMember lpm : lpmByContact.values()) { lpmIds.add(lpm.Id); }
Map<Id, LoyaltyMemberTier> currentTierByLpm = new Map<Id, LoyaltyMemberTier>();
for (LoyaltyMemberTier lmt : [
    SELECT Id, Name, LoyaltyMemberId, LoyaltyTierId
    FROM LoyaltyMemberTier
    WHERE LoyaltyMemberId IN :lpmIds
]) {
    currentTierByLpm.put(lmt.LoyaltyMemberId, lmt);
}

Map<Id, LoyaltyMemberTier> tierUpdatesByLmtId = new Map<Id, LoyaltyMemberTier>();
Set<Id> processedLpmIds = new Set<Id>();
Integer rotationIdx = 0;
for (Membership__c m : memberships) {
    if (m.Contact__c == null) { continue; }
    LoyaltyProgramMember lpm = lpmByContact.get(m.Contact__c);
    if (lpm == null || processedLpmIds.contains(lpm.Id)) { continue; }
    processedLpmIds.add(lpm.Id);

    String desiredName = tierRotation[Math.mod(rotationIdx, tierRotation.size())];
    rotationIdx++;
    LoyaltyTier desired = tiersByName.get(desiredName);
    if (desired == null) { continue; }

    LoyaltyMemberTier existing = currentTierByLpm.get(lpm.Id);
    if (existing == null) { continue; }
    existing.LoyaltyTierId = desired.Id;
    existing.Name = desiredName;
    existing.EffectiveDate = Date.today();
    existing.ReasonForChange = 'Initial enrollment seed';
    tierUpdatesByLmtId.put(existing.Id, existing);
}
if (!tierUpdatesByLmtId.isEmpty()) {
    update tierUpdatesByLmtId.values();
}

// ---------------------------------------------------------------------------
// 6. Seed Membership__c statuses so the "Members Requiring Attention" list
//    view (used by the Command Center alert) has data to show.
// ---------------------------------------------------------------------------
List<Membership__c> sortedMemberships = [
    SELECT Id, Name, Membership_Status__c, Billing_Status__c
    FROM Membership__c
    ORDER BY Name
];

Map<String, Map<String, String>> demoStatusOverrides = new Map<String, Map<String, String>>{
    'MBR-0001' => new Map<String, String>{ 'status' => 'Grace Period', 'billing' => 'Overdue' },
    'MBR-0003' => new Map<String, String>{ 'status' => 'Active',       'billing' => 'Failed' },
    'MBR-0005' => new Map<String, String>{ 'status' => 'Lapsed',       'billing' => 'Failed' },
    'MBR-0007' => new Map<String, String>{ 'status' => 'Suspended',    'billing' => 'Overdue' }
};

List<Membership__c> statusUpdates = new List<Membership__c>();
for (Membership__c m : sortedMemberships) {
    if (!demoStatusOverrides.containsKey(m.Name)) { continue; }
    Map<String, String> overrideValues = demoStatusOverrides.get(m.Name);
    Boolean changed = false;
    if (m.Membership_Status__c != overrideValues.get('status')) {
        m.Membership_Status__c = overrideValues.get('status');
        changed = true;
    }
    if (m.Billing_Status__c != overrideValues.get('billing')) {
        m.Billing_Status__c = overrideValues.get('billing');
        changed = true;
    }
    if (changed) { statusUpdates.add(m); }
}
if (!statusUpdates.isEmpty()) {
    update statusUpdates;
}

System.debug('Seeded program=' + program.Id
    + ' tiers=' + tiersByName.size()
    + ' benefits=' + benefitsByName.size()
    + ' junctions=' + junctionsToInsert.size()
    + ' feeOptions=' + feesToInsert.size()
    + ' lpms=' + lpmByContact.size()
    + ' membershipsWired=' + membershipsToUpdate.size()
    + ' tierAssignments=' + tierUpdatesByLmtId.size()
    + ' statusOverrides=' + statusUpdates.size());
