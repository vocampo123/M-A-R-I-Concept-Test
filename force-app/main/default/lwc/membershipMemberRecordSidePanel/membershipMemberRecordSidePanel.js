import { api, LightningElement } from 'lwc';

const DEFAULT_MEMBER = {
    notes: 'Highly engaged family household. Renews on time each year. Good candidate for upgrade to Gold Household.',
    pricePaid: 240,
    paymentStatus: 'Current',
    autoRenew: true,
    renewalDate: '2026-05-14',
    recentActivity: [
        { id: 'a1', type: 'visit', icon: 'standard:event', title: 'Family Visit', date: '2026-04-10', description: 'Full family admission used. Cafe discount applied.' },
        { id: 'a2', type: 'event', icon: 'standard:event', title: 'Kids Science Day', date: '2026-03-22', description: 'Attended members-only Kids Science Day.' },
        { id: 'a3', type: 'email', icon: 'standard:email', title: 'Renewal Confirmation', date: '2025-05-14', description: 'Renewal auto-processed successfully.' },
    ],
};

export default class MembershipMemberRecordSidePanel extends LightningElement {
    @api recordId;
    @api member = DEFAULT_MEMBER;

    get activeMember() {
        return this.member ?? DEFAULT_MEMBER;
    }

    get notes() {
        return this.activeMember.notes;
    }

    get billingSnapshot() {
        const member = this.activeMember;
        return [
            { label: 'Price Paid', value: this.formatCurrency(member.pricePaid) },
            { label: 'Payment Status', value: member.paymentStatus },
            { label: 'Auto-Renew', value: member.autoRenew ? 'On' : 'Off' },
            { label: 'Renewal Date', value: member.renewalDate },
        ];
    }

    get recentActivity() {
        return this.activeMember.recentActivity ?? [];
    }

    formatCurrency(value) {
        return `$${Number(value ?? 0).toLocaleString()}`;
    }
}
