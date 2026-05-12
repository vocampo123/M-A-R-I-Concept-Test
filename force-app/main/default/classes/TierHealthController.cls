/**
 * Aggregates tier health metrics for the tierHealthCard LWC sidebar on the
 * Membership Tier (LoyaltyTier) record page.
 *
 * Uses Database.query for LoyaltyTierMshpFeeOption and LoyaltyTierPromotion
 * because those sObjects are not exposed to Apex as static types in some
 * Loyalty Cloud orgs, even though they are queryable.
 */
public with sharing class TierHealthController {

    public class TierHealth {
        @AuraEnabled public Integer memberCount { get; set; }
        @AuraEnabled public Decimal totalAnnualDues { get; set; }
        @AuraEnabled public Integer activeBenefitsCount { get; set; }
        @AuraEnabled public Integer activePromotionsCount { get; set; }
    }

    @AuraEnabled(cacheable=true)
    public static TierHealth getTierHealth(Id tierId) {
        TierHealth result = new TierHealth();
        if (tierId == null) {
            return result;
        }

        result.memberCount = [
            SELECT COUNT()
            FROM LoyaltyMemberTier
            WHERE LoyaltyTierId = :tierId
        ];

        Decimal dues = 0;
        String feeQuery = 'SELECT MembershipFee FROM LoyaltyTierMshpFeeOption WHERE LoyaltyTierId = :tierId';
        for (SObject fee : Database.query(feeQuery)) {
            Object amt = fee.get('MembershipFee');
            if (amt != null) {
                dues += (Decimal) amt;
            }
        }
        result.totalAnnualDues = dues;

        Date today = Date.today();
        result.activeBenefitsCount = [
            SELECT COUNT()
            FROM LoyaltyTierBenefit
            WHERE LoyaltyTierId = :tierId
            AND (Effective_End__c = null OR Effective_End__c >= :today)
        ];

        String promoQuery = 'SELECT COUNT() FROM LoyaltyTierPromotion WHERE LoyaltyTierId = :tierId';
        result.activePromotionsCount = Database.countQuery(promoQuery);

        return result;
    }
}
