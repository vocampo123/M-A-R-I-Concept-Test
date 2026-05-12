import { api, LightningElement, wire } from 'lwc';
import { getRecord, getFieldValue } from 'lightning/uiRecordApi';

import NAME_FIELD from '@salesforce/schema/Membership__c.Name';
import TIER_FIELD from '@salesforce/schema/Membership__c.Membership_Tier__c';
import TYPE_FIELD from '@salesforce/schema/Membership__c.Membership_Type__c';
import STATUS_FIELD from '@salesforce/schema/Membership__c.Membership_Status__c';
import MEMBER_SINCE_FIELD from '@salesforce/schema/Membership__c.Member_Since__c';
import TERM_END_FIELD from '@salesforce/schema/Membership__c.Term_End_Date__c';
import LIFETIME_SPEND_FIELD from '@salesforce/schema/Membership__c.Lifetime_Spend__c';
import BILLING_STATUS_FIELD from '@salesforce/schema/Membership__c.Billing_Status__c';

const FIELDS = [
    NAME_FIELD,
    TIER_FIELD,
    TYPE_FIELD,
    STATUS_FIELD,
    MEMBER_SINCE_FIELD,
    TERM_END_FIELD,
    LIFETIME_SPEND_FIELD,
    BILLING_STATUS_FIELD
];

const PLACEHOLDER = {
    name: 'Anderson Family',
    memberId: 'MBR-00178',
    tier: 'Household',
    tierType: 'Household',
    status: 'Active',
    memberSince: '2019-05-14',
    renewalDate: '2026-05-14',
    lifetimeSpend: '$1,680',
    engagementScore: '88',
    riskLevel: 'Low',
    paymentStatus: 'Current'
};

export default class MembershipMemberRecordHeader extends LightningElement {
    @api recordId;
    @api member;

    record;

    @wire(getRecord, { recordId: '$recordId', fields: FIELDS })
    wiredRecord({ data }) {
        if (data) {
            this.record = data;
        }
    }

    get derivedMember() {
        if (this.member) {
            return this.member;
        }
        if (!this.record) {
            return PLACEHOLDER;
        }
        const memberId = getFieldValue(this.record, NAME_FIELD);
        const tier = getFieldValue(this.record, TIER_FIELD);
        const tierType = getFieldValue(this.record, TYPE_FIELD) || tier;
        const status = getFieldValue(this.record, STATUS_FIELD);
        const memberSince = getFieldValue(this.record, MEMBER_SINCE_FIELD);
        const renewalDate = getFieldValue(this.record, TERM_END_FIELD);
        const lifetimeSpend = getFieldValue(this.record, LIFETIME_SPEND_FIELD);
        const paymentStatus = getFieldValue(this.record, BILLING_STATUS_FIELD);

        return {
            name: memberId,
            memberId,
            tier,
            tierType,
            status,
            memberSince,
            renewalDate,
            lifetimeSpend,
            engagementScore: this.computeEngagement(lifetimeSpend),
            riskLevel: this.computeRisk(status, paymentStatus),
            paymentStatus
        };
    }

    get summaryFields() {
        const m = this.derivedMember;
        return [
            { label: 'Tier Type', value: m.tierType ?? '—' },
            { label: 'Status', value: m.status ?? '—' },
            { label: 'Member Since', value: m.memberSince ?? '—' },
            { label: 'Renewal Date', value: m.renewalDate ?? '—' },
            { label: 'Lifetime Spend', value: this.formatCurrency(m.lifetimeSpend) },
            { label: 'Engagement', value: m.engagementScore ?? '—' },
            { label: 'Risk', value: m.riskLevel ?? '—' },
            { label: 'Payment Status', value: m.paymentStatus ?? '—' }
        ];
    }

    formatCurrency(value) {
        if (value == null || value === '') return '—';
        if (typeof value === 'string' && value.startsWith('$')) return value;
        return `$${Number(value).toLocaleString()}`;
    }

    // Engagement and Risk are computed locally because the data model does
    // not yet have dedicated fields for them. Replace with @wire-bound fields
    // once Engagement_Score__c / Risk_Level__c are on Membership__c.
    computeEngagement(lifetimeSpend) {
        const spend = Number(lifetimeSpend);
        if (!isFinite(spend) || spend <= 0) return '—';
        return String(Math.min(100, Math.round(spend / 20)));
    }

    computeRisk(status, paymentStatus) {
        if (status === 'Cancelled') return '—';
        if (status === 'Lapsed' || status === 'Suspended') return 'High';
        if (paymentStatus === 'Failed' || paymentStatus === 'Overdue') return 'High';
        if (status === 'Grace Period') return 'Medium';
        return 'Low';
    }
}
