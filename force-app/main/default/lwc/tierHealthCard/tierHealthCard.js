import { api, LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';
import getTierHealth from '@salesforce/apex/TierHealthController.getTierHealth';

import TIER_NAME_FIELD from '@salesforce/schema/LoyaltyTier.Name';
import TIER_TYPE_FIELD from '@salesforce/schema/LoyaltyTier.Tier_Type__c';
import LIFECYCLE_FIELD from '@salesforce/schema/LoyaltyTier.Lifecycle_Status__c';
import VISIBILITY_FIELD from '@salesforce/schema/LoyaltyTier.Visibility__c';
import RENEWAL_WINDOW_FIELD from '@salesforce/schema/LoyaltyTier.Renewal_Window_Days__c';
import GRACE_FIELD from '@salesforce/schema/LoyaltyTier.Grace_Period_Days__c';
import FMV_FIELD from '@salesforce/schema/LoyaltyTier.Fair_Market_Value__c';

const TIER_FIELDS = [
    TIER_NAME_FIELD,
    TIER_TYPE_FIELD,
    LIFECYCLE_FIELD,
    VISIBILITY_FIELD,
    RENEWAL_WINDOW_FIELD,
    GRACE_FIELD,
    FMV_FIELD
];

export default class TierHealthCard extends LightningElement {
    @api recordId;
    health;
    error;

    @wire(getRecord, { recordId: '$recordId', fields: TIER_FIELDS })
    tier;

    @wire(getTierHealth, { tierId: '$recordId' })
    wiredHealth({ data, error }) {
        if (data) {
            this.health = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.health = undefined;
        }
    }

    get tierName() {
        return getFieldValue(this.tier.data, TIER_NAME_FIELD);
    }

    get tierType() {
        return getFieldValue(this.tier.data, TIER_TYPE_FIELD);
    }

    get lifecycleStatus() {
        return getFieldValue(this.tier.data, LIFECYCLE_FIELD);
    }

    get visibility() {
        return getFieldValue(this.tier.data, VISIBILITY_FIELD);
    }

    get renewalWindow() {
        const value = getFieldValue(this.tier.data, RENEWAL_WINDOW_FIELD);
        return value != null ? `${value} days` : '—';
    }

    get gracePeriod() {
        const value = getFieldValue(this.tier.data, GRACE_FIELD);
        return value != null ? `${value} days` : '—';
    }

    get fairMarketValue() {
        return getFieldValue(this.tier.data, FMV_FIELD);
    }

    get hasFmv() {
        return this.fairMarketValue != null && this.fairMarketValue > 0;
    }

    get memberCount() {
        return this.health ? this.health.memberCount : 0;
    }

    get totalAnnualDues() {
        return this.health ? this.health.totalAnnualDues : 0;
    }

    get activeBenefitsCount() {
        return this.health ? this.health.activeBenefitsCount : 0;
    }

    get activePromotionsCount() {
        return this.health ? this.health.activePromotionsCount : 0;
    }

    get lifecycleVariant() {
        switch (this.lifecycleStatus) {
            case 'Active':
                return 'success';
            case 'Sunset':
                return 'warning';
            case 'Archived':
                return 'inverse';
            default:
                return 'inverse';
        }
    }
}
