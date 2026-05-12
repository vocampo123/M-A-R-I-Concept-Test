/**
 * Resolves the current LoyaltyTier for a given Membership__c by traversing
 * Membership__c.Loyalty_Program_Member__c -> LoyaltyMemberTier -> LoyaltyTier.
 * Used by the memberTierSnapshot LWC on the Membership record page.
 *
 * Uses Database.query for LoyaltyTierMshpFeeOption because that sObject is
 * not exposed to Apex as a static type in some Loyalty Cloud orgs.
 */
public with sharing class MemberTierController {

    public class MemberTierSnapshot {
        @AuraEnabled public Id tierId { get; set; }
        @AuraEnabled public String tierName { get; set; }
        @AuraEnabled public String tierType { get; set; }
        @AuraEnabled public String visibility { get; set; }
        @AuraEnabled public String lifecycleStatus { get; set; }
        @AuraEnabled public Decimal renewalWindowDays { get; set; }
        @AuraEnabled public Decimal gracePeriodDays { get; set; }
        @AuraEnabled public Decimal fairMarketValue { get; set; }
        @AuraEnabled public Decimal annualDues { get; set; }
        @AuraEnabled public String tierGroupName { get; set; }
        @AuraEnabled public String programName { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static MemberTierSnapshot getSnapshotForMembership(Id membershipId) {
        if (membershipId == null) {
            return null;
        }

        List<Membership__c> memberships = [
            SELECT Id, Loyalty_Program_Member__c
            FROM Membership__c
            WHERE Id = :membershipId
            LIMIT 1
        ];
        if (memberships.isEmpty() || memberships[0].Loyalty_Program_Member__c == null) {
            return null;
        }
        Id lpmId = memberships[0].Loyalty_Program_Member__c;

        List<LoyaltyMemberTier> tierLinks = [
            SELECT Id,
                   LoyaltyTierId,
                   LoyaltyTier.Name,
                   LoyaltyTier.Tier_Type__c,
                   LoyaltyTier.Visibility__c,
                   LoyaltyTier.Lifecycle_Status__c,
                   LoyaltyTier.Renewal_Window_Days__c,
                   LoyaltyTier.Grace_Period_Days__c,
                   LoyaltyTier.Fair_Market_Value__c,
                   LoyaltyTier.LoyaltyTierGroup.Name,
                   LoyaltyTier.LoyaltyTierGroup.LoyaltyProgram.Name
            FROM LoyaltyMemberTier
            WHERE LoyaltyMemberId = :lpmId
            ORDER BY CreatedDate DESC
            LIMIT 1
        ];
        if (tierLinks.isEmpty()) {
            return null;
        }

        LoyaltyMemberTier link = tierLinks[0];
        MemberTierSnapshot snapshot = new MemberTierSnapshot();
        snapshot.tierId = link.LoyaltyTierId;
        snapshot.tierName = link.LoyaltyTier.Name;
        snapshot.tierType = link.LoyaltyTier.Tier_Type__c;
        snapshot.visibility = link.LoyaltyTier.Visibility__c;
        snapshot.lifecycleStatus = link.LoyaltyTier.Lifecycle_Status__c;
        snapshot.renewalWindowDays = link.LoyaltyTier.Renewal_Window_Days__c;
        snapshot.gracePeriodDays = link.LoyaltyTier.Grace_Period_Days__c;
        snapshot.fairMarketValue = link.LoyaltyTier.Fair_Market_Value__c;
        snapshot.tierGroupName = link.LoyaltyTier.LoyaltyTierGroup != null
            ? link.LoyaltyTier.LoyaltyTierGroup.Name
            : null;
        snapshot.programName = link.LoyaltyTier.LoyaltyTierGroup != null
                && link.LoyaltyTier.LoyaltyTierGroup.LoyaltyProgram != null
            ? link.LoyaltyTier.LoyaltyTierGroup.LoyaltyProgram.Name
            : null;

        Decimal dues = 0;
        Id tierId = link.LoyaltyTierId;
        String feeQuery = 'SELECT MembershipFee FROM LoyaltyTierMshpFeeOption WHERE LoyaltyTierId = :tierId';
        for (SObject fee : Database.query(feeQuery)) {
            Object amt = fee.get('MembershipFee');
            if (amt != null) {
                dues += (Decimal) amt;
            }
        }
        snapshot.annualDues = dues;

        return snapshot;
    }
}
