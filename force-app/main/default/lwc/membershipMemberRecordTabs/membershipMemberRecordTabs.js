import { api, LightningElement } from 'lwc';

const DEFAULT_MEMBER = {
    email: 'j.anderson@family.net',
    phone: '(510) 555-0334',
    preferredContact: 'Email',
    address: '88 Maple Ave, Oakland, CA 94601',
    memberId: 'MBR-00178',
    tier: 'Household',
    tierType: 'Household',
    status: 'Active',
    memberSince: '2019-05-14',
    renewalDate: '2026-05-14',
    autoRenew: true,
    acquisitionChannel: 'Referral',
    engagementScore: 88,
    riskLevel: 'Low',
    sentiment: 'Positive',
    loyaltyPoints: 1680,
    lifetimeSpend: 1680,
    paymentStatus: 'Current',
    billingHistory: [
        { id: 'bh1', date: '2025-05-14', description: 'Annual Renewal - Household', amount: 240, status: 'Paid' },
        { id: 'bh2', date: '2024-05-14', description: 'Annual Renewal - Household', amount: 240, status: 'Paid' },
    ],
    benefits: [
        { id: 'b1', name: 'Free Admission (2 Adults, 2 Kids)', available: 4, used: 4, remaining: 0 },
        { id: 'b2', name: 'Guest Passes', available: 2, used: 1, remaining: 1 },
        { id: 'b3', name: 'Cafe Discount (15%)', available: null, used: 6, remaining: null },
        { id: 'b4', name: 'Members-Only Events', available: 4, used: 2, remaining: 2 },
    ],
    recentActivity: [
        { id: 'a1', date: '2026-04-10', title: 'Family Visit', description: 'Full family admission used. Cafe discount applied.' },
        { id: 'a2', date: '2026-03-22', title: 'Kids Science Day', description: 'Attended members-only Kids Science Day.' },
        { id: 'a3', date: '2025-05-14', title: 'Renewal Confirmation', description: 'Renewal auto-processed successfully.' },
    ],
};

export default class MembershipMemberRecordTabs extends LightningElement {
    @api member = DEFAULT_MEMBER;

    billingColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Description', fieldName: 'description', type: 'text' },
        { label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'USD', minimumFractionDigits: 0 } },
        { label: 'Status', fieldName: 'status', type: 'text' },
    ];

    benefitColumns = [
        { label: 'Benefit', fieldName: 'name', type: 'text' },
        { label: 'Available', fieldName: 'available', type: 'number' },
        { label: 'Used', fieldName: 'used', type: 'number' },
        { label: 'Remaining', fieldName: 'remaining', type: 'number' },
    ];

    activityColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Activity', fieldName: 'title', type: 'text' },
        { label: 'Description', fieldName: 'description', type: 'text' },
    ];

    get activeMember() {
        return this.member ?? DEFAULT_MEMBER;
    }

    get detailSections() {
        const member = this.activeMember;
        return [
            {
                title: 'Contact Information',
                rows: [
                    { id: 'contact-1', fields: [{ label: 'Email', value: member.email }, { label: 'Phone', value: member.phone }] },
                    { id: 'contact-2', fields: [{ label: 'Preferred Contact', value: member.preferredContact }, { label: 'Address', value: member.address }] },
                ],
            },
            {
                title: 'Membership Details',
                rows: [
                    { id: 'membership-1', fields: [{ label: 'Member ID', value: member.memberId }, { label: 'Tier', value: member.tier }] },
                    { id: 'membership-2', fields: [{ label: 'Tier Type', value: member.tierType }, { label: 'Status', value: member.status }] },
                    { id: 'membership-3', fields: [{ label: 'Member Since', value: member.memberSince }, { label: 'Renewal Date', value: member.renewalDate }] },
                    { id: 'membership-4', fields: [{ label: 'Auto-Renew', value: member.autoRenew ? 'On' : 'Off' }, { label: 'Acquisition Channel', value: member.acquisitionChannel }] },
                ],
            },
            {
                title: 'Engagement & Loyalty',
                rows: [
                    { id: 'engagement-1', fields: [{ label: 'Engagement Score', value: member.engagementScore }, { label: 'Risk Level', value: member.riskLevel }] },
                    { id: 'engagement-2', fields: [{ label: 'Sentiment', value: member.sentiment }, { label: 'Loyalty Points', value: member.loyaltyPoints }] },
                    { id: 'engagement-3', fields: [{ label: 'Lifetime Spend', value: this.formatCurrency(member.lifetimeSpend) }, { label: 'Payment Status', value: member.paymentStatus }] },
                ],
            },
        ];
    }

    get billingHistory() {
        return this.activeMember.billingHistory ?? [];
    }

    get benefits() {
        return this.activeMember.benefits ?? [];
    }

    get recentActivity() {
        return this.activeMember.recentActivity ?? [];
    }

    formatCurrency(value) {
        return `$${Number(value ?? 0).toLocaleString()}`;
    }
}
