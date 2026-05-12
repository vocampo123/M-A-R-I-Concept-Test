/*
 * Seed data for the Promotions & Discounts feature.
 *
 * Creates / upserts (idempotent on Promotion.Name):
 *   - 6 Promotion records modelled on the concept screen
 *     (docs/prd/concepts/03-promotions-and-discounts.png):
 *       1. Spring Renewal Special   — 20% off renewal,    Mar–May
 *       2. First Month Free          — first month free,   ongoing
 *       3. Senior Pricing            — 15% off for 65+,    ongoing
 *       4. Refer-a-Friend            — $25 credit,         ongoing
 *       5. Corporate Match           — employer match,     ongoing
 *       6. Family Day Pass           — free guest pass,    summer
 *   - LoyaltyTierPromotion junction rows wiring each promo to the
 *     tiers it applies to (uses tiers seeded by membership_tiers.apex).
 *
 * Prerequisite: scripts/seed/membership_tiers.apex must have been run
 * first (creates the LoyaltyProgram + 6 tiers we attach promos to).
 *
 * Idempotent on Promotion.Name and on (LoyaltyTierId, PromotionId)
 * for the junctions. Safe to re-run.
 *
 * Run: sf apex run -f scripts/seed/promotions.apex -o npc-loyalty-demo
 */

// ---------------------------------------------------------------------------
// 1. Resolve the Loyalty Program + tiers seeded by membership_tiers.apex
// ---------------------------------------------------------------------------
String programName = 'Zoo Membership Program';
List<LoyaltyProgram> programs = [
    SELECT Id FROM LoyaltyProgram WHERE Name = :programName LIMIT 1
];
if (programs.isEmpty()) {
    throw new System.IllegalArgumentException(
        'LoyaltyProgram "' + programName + '" not found. ' +
        'Run scripts/seed/membership_tiers.apex first.'
    );
}
LoyaltyProgram program = programs[0];

Map<String, LoyaltyTier> tiersByName = new Map<String, LoyaltyTier>();
for (LoyaltyTier t : [
    SELECT Id, Name FROM LoyaltyTier
    WHERE LoyaltyTierGroup.LoyaltyProgramId = :program.Id
]) {
    tiersByName.put(t.Name, t);
}
if (tiersByName.isEmpty()) {
    throw new System.IllegalArgumentException(
        'No LoyaltyTier records found for program "' + programName + '". ' +
        'Run scripts/seed/membership_tiers.apex first.'
    );
}

// ---------------------------------------------------------------------------
// 2. Promotion configs
// ---------------------------------------------------------------------------
// Date math anchors: today's start-of-month, plus a few derived windows so
// the seed produces realistic "currently active" / "upcoming" mixes.
Date today = Date.today();
Date thisMonthStart = today.toStartOfMonth();
Date nextYear = today.addYears(1);

// Spring window: Mar 1 – May 31 of the current year (or next year if past).
Date springStart = Date.newInstance(today.year(), 3, 1);
Date springEnd   = Date.newInstance(today.year(), 5, 31);
if (today > springEnd) {
    springStart = springStart.addYears(1);
    springEnd   = springEnd.addYears(1);
}

// Summer window: Jun 1 – Aug 31.
Date summerStart = Date.newInstance(today.year(), 6, 1);
Date summerEnd   = Date.newInstance(today.year(), 8, 31);
if (today > summerEnd) {
    summerStart = summerStart.addYears(1);
    summerEnd   = summerEnd.addYears(1);
}

List<Map<String, Object>> promoConfigs = new List<Map<String, Object>>{
    new Map<String, Object>{
        'name' => 'Spring Renewal Special',
        'code' => 'SPRING2026',
        'description' => '20% off renewal dues for members renewing during the spring window.',
        'type' => 'Standard',
        'startDate' => springStart,
        'endDate' => springEnd,
        'tiers' => new List<String>{ 'Patron', 'Supporter', 'Family', 'Contributor', 'Fellow' }
    },
    new Map<String, Object>{
        'name' => 'First Month Free',
        'code' => 'NEWMEMBER1',
        'description' => 'First month free for new individual members on monthly billing.',
        'type' => 'Standard',
        'startDate' => thisMonthStart,
        'endDate' => nextYear,
        'tiers' => new List<String>{ 'Patron', 'Supporter' }
    },
    new Map<String, Object>{
        'name' => 'Senior Pricing',
        'code' => 'SENIOR65',
        'description' => '15% off membership dues for members age 65 and over.',
        'type' => 'Standard',
        'startDate' => thisMonthStart,
        'endDate' => nextYear,
        'tiers' => new List<String>{ 'Patron', 'Supporter', 'Family' }
    },
    new Map<String, Object>{
        'name' => 'Refer-a-Friend',
        'code' => 'REFER25',
        'description' => '$25 credit toward renewal when a referred member enrolls.',
        'type' => 'Standard',
        'startDate' => thisMonthStart,
        'endDate' => nextYear,
        'tiers' => new List<String>{ 'Patron', 'Supporter', 'Family', 'Contributor', 'Fellow' }
    },
    new Map<String, Object>{
        'name' => 'Corporate Match',
        'code' => 'CORPMATCH',
        'description' => 'Employer-matched corporate membership: company match doubles seat allocation.',
        'type' => 'Standard',
        'startDate' => thisMonthStart,
        'endDate' => nextYear,
        'tiers' => new List<String>{ 'Corporate' }
    },
    new Map<String, Object>{
        'name' => 'Family Day Pass',
        'code' => 'FAMDAY',
        'description' => 'Free family day guest pass with summer renewal.',
        'type' => 'Standard',
        'startDate' => summerStart,
        'endDate' => summerEnd,
        'tiers' => new List<String>{ 'Family', 'Contributor', 'Fellow' }
    }
};

// ---------------------------------------------------------------------------
// 3. Upsert Promotion records by Name
// ---------------------------------------------------------------------------
Set<String> promoNames = new Set<String>();
for (Map<String, Object> cfg : promoConfigs) {
    promoNames.add((String) cfg.get('name'));
}

Map<String, Promotion> promosByName = new Map<String, Promotion>();
for (Promotion p : [
    SELECT Id, Name FROM Promotion WHERE Name IN :promoNames
]) {
    promosByName.put(p.Name, p);
}

List<Promotion> promosToInsert = new List<Promotion>();
for (Map<String, Object> cfg : promoConfigs) {
    String name = (String) cfg.get('name');
    if (promosByName.containsKey(name)) {
        continue;
    }
    promosToInsert.add(new Promotion(
        Name = name,
        Description = (String) cfg.get('description'),
        PromotionCode = (String) cfg.get('code'),
        LoyaltyProgramId = program.Id,
        LoyaltyPromotionType = (String) cfg.get('type'),
        Status = 'InProgress',
        IsActive = true,
        StartDate = (Date) cfg.get('startDate'),
        EndDate = (Date) cfg.get('endDate'),
        IsEnrollmentRequired = false
    ));
}
if (!promosToInsert.isEmpty()) {
    insert promosToInsert;
}
for (Promotion p : [SELECT Id, Name FROM Promotion WHERE Name IN :promoNames]) {
    promosByName.put(p.Name, p);
}

// ---------------------------------------------------------------------------
// 4. Wire each Promotion to its tiers via LoyaltyTierPromotion
// ---------------------------------------------------------------------------
Set<Id> promoIds = new Set<Id>();
for (Promotion p : promosByName.values()) { promoIds.add(p.Id); }

Set<String> existingJunctionKeys = new Set<String>();
for (LoyaltyTierPromotion ltp : [
    SELECT LoyaltyTierId, PromotionId FROM LoyaltyTierPromotion
    WHERE PromotionId IN :promoIds
]) {
    existingJunctionKeys.add(ltp.LoyaltyTierId + '|' + ltp.PromotionId);
}

List<LoyaltyTierPromotion> junctionsToInsert = new List<LoyaltyTierPromotion>();
for (Map<String, Object> cfg : promoConfigs) {
    Promotion p = promosByName.get((String) cfg.get('name'));
    if (p == null) { continue; }
    for (String tierName : (List<String>) cfg.get('tiers')) {
        LoyaltyTier t = tiersByName.get(tierName);
        if (t == null) { continue; }
        String key = t.Id + '|' + p.Id;
        if (existingJunctionKeys.contains(key)) { continue; }
        junctionsToInsert.add(new LoyaltyTierPromotion(
            LoyaltyTierId = t.Id,
            PromotionId = p.Id
        ));
    }
}
if (!junctionsToInsert.isEmpty()) {
    insert junctionsToInsert;
}

System.debug('Seeded promotions=' + promosByName.size()
    + ' newPromotions=' + promosToInsert.size()
    + ' newTierJunctions=' + junctionsToInsert.size());
