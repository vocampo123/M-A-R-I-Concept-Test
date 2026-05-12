import { LightningElement } from 'lwc';
import { getCurrentRoute } from '../../../router';
import { getMemberById, MEMBERS } from 'data/members';

const HOUSEHOLD_DEFAULT_ID = 'm003';

export default class LoyaltyMemberDetail extends LightningElement {
    tierHistoryColumns = [
        { label: 'Tier', fieldName: 'tier', type: 'text' },
        { label: 'Effective Date', fieldName: 'effectiveDate', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Expiration Date', fieldName: 'expirationDate', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Reason', fieldName: 'reason', type: 'text' },
    ];

    voucherColumns = [
        { label: 'Code', fieldName: 'code', type: 'text' },
        { label: 'Benefit', fieldName: 'benefit', type: 'text' },
        { label: 'Face Value', fieldName: 'faceValue', type: 'currency', typeAttributes: { currencyCode: 'USD', minimumFractionDigits: 0 } },
        { label: 'Status', fieldName: 'status', type: 'text' },
        { label: 'Expiration', fieldName: 'expirationDate', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
    ];

    activityColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Activity', fieldName: 'title', type: 'text' },
        { label: 'Description', fieldName: 'description', type: 'text' },
    ];

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

    get member() {
        const route = getCurrentRoute();
        const fromRoute = getMemberById(route?.params?.id);
        if (fromRoute) {
            return fromRoute;
        }
        return getMemberById(HOUSEHOLD_DEFAULT_ID) ?? MEMBERS[0];
    }

    get programDetailRows() {
        const member = this.member;
        return [
            { id: 'pd-1', fields: [
                { label: 'Member Type', value: member.tierType ?? '—' },
                { label: 'Membership Tier', value: member.tier ?? '—' },
            ] },
            { id: 'pd-2', fields: [
                { label: 'Membership Number', value: member.memberId ?? '—' },
                { label: 'Member Status', value: member.status ?? '—' },
            ] },
            { id: 'pd-3', fields: [
                { label: 'Member Since', value: member.memberSince ?? '—' },
                { label: 'Term Start Date', value: member.termStartDate ?? '—' },
            ] },
            { id: 'pd-4', fields: [
                { label: 'Term End Date', value: member.termEndDate ?? member.renewalDate ?? '—' },
                { label: 'Action Taken', value: member.actionTaken ?? '—' },
            ] },
            { id: 'pd-5', fields: [
                { label: 'Highest Tier Achieved', value: member.highestTier ?? member.tier ?? '—' },
                { label: 'Lifetime Months', value: this.formatNumber(member.lifetimeMonths) },
            ] },
            { id: 'pd-6', fields: [
                { label: 'Lifetime Spend', value: this.formatCurrency(member.lifetimeSpend) },
                { label: 'Acquisition Channel', value: member.acquisitionChannel ?? '—' },
            ] },
            { id: 'pd-7', fields: [
                { label: 'Auto-Renew', value: member.autoRenew ? 'On' : 'Off' },
                { label: 'Last Activity Date', value: member.lastActivity ?? '—' },
            ] },
        ];
    }

    get contactDetailRows() {
        const member = this.member;
        return [
            { id: 'cd-1', fields: [
                { label: 'Name', value: member.name ?? '—' },
                { label: 'Preferred Contact', value: member.preferredContact ?? '—' },
            ] },
            { id: 'cd-2', fields: [
                { label: 'Email', value: member.email ?? '—' },
                { label: 'Phone', value: member.phone ?? '—' },
            ] },
            { id: 'cd-3', fields: [
                { label: 'Address', value: member.address ?? '—' },
                { label: 'Loyalty Points', value: this.formatNumber(member.loyaltyPoints) },
            ] },
        ];
    }

    get engagementDetailRows() {
        const member = this.member;
        return [
            { id: 'ed-1', fields: [
                { label: 'Engagement Score', value: this.engagementScore },
                { label: 'Risk Level', value: member.riskLevel ?? '—' },
            ] },
            { id: 'ed-2', fields: [
                { label: 'Sentiment', value: member.sentiment ?? '—' },
                { label: 'Loyalty Points', value: this.formatNumber(member.loyaltyPoints) },
            ] },
            { id: 'ed-3', fields: [
                { label: 'Lifetime Spend', value: this.formatCurrency(member.lifetimeSpend) },
                { label: 'Payment Status', value: member.paymentStatus ?? '—' },
            ] },
        ];
    }

    get hasBenefits() {
        return this.benefits.length > 0;
    }

    get tierHistory() {
        return this.member.tierHistory ?? [];
    }

    get hasTierHistory() {
        return this.tierHistory.length > 0;
    }

    get vouchers() {
        return this.member.vouchers ?? [];
    }

    get hasVouchers() {
        return this.vouchers.length > 0;
    }

    get recentActivity() {
        return this.member.recentActivity ?? [];
    }

    get billingHistory() {
        return this.member.billingHistory ?? [];
    }

    get benefits() {
        return this.member.benefits ?? [];
    }

    get lifecycleEvents() {
        const events = this.member.lifecycleEvents ?? [];
        return events.map((event) => ({
            ...event,
            title: event.label,
            type: this.deriveLifecycleType(event.label),
        }));
    }

    get hasLifecycleEvents() {
        return this.lifecycleEvents.length > 0;
    }

    deriveLifecycleType(label) {
        const text = String(label ?? '').toLowerCase();
        if (text.includes('joined') || text.includes('enroll') || text.includes('signed up')) {
            return 'joined';
        }
        if (text.includes('renew')) {
            return 'renewed';
        }
        if (text.includes('upgrade')) {
            return 'upgrade';
        }
        if (text.includes('downgrade')) {
            return 'downgrade';
        }
        if (text.includes('lapse')) {
            return 'lapsed';
        }
        if (text.includes('reactiv')) {
            return 'reactivated';
        }
        if (text.includes('payment') || text.includes('paid')) {
            return 'payment';
        }
        return 'general';
    }

    get promotions() {
        return this.member.promotions ?? [];
    }

    get hasPromotions() {
        return this.promotions.length > 0;
    }

    get badges() {
        return this.member.badges ?? [];
    }

    get hasBadges() {
        return this.badges.length > 0;
    }

    get householdRoster() {
        return this.member.householdRoster ?? [];
    }

    get isHousehold() {
        const type = (this.member.tierType ?? '').toLowerCase();
        return type === 'household' && this.householdRoster.length > 0;
    }

    get profileFields() {
        const m = this.member;
        return [
            { id: 'pf-tier', icon: 'utility:ribbon', label: 'Membership Tier', value: m.tier ?? '—' },
            { id: 'pf-tier-type', icon: 'utility:groups', label: 'Tier Type', value: m.tierType ?? '—' },
            { id: 'pf-status', icon: 'utility:check', label: 'Status', value: m.status ?? '—' },
            { id: 'pf-member-since', icon: 'utility:date_input', label: 'Member Since', value: m.memberSince ?? '—' },
            { id: 'pf-renewal-date', icon: 'utility:event', label: 'Renewal Date', value: m.renewalDate ?? '—' },
            { id: 'pf-lifetime-spend', icon: 'utility:money', label: 'Lifetime Spend', value: this.formatCurrency(m.lifetimeSpend) },
            { id: 'pf-engagement', icon: 'utility:trending', label: 'Engagement', value: this.engagementScore },
            { id: 'pf-risk', icon: 'utility:warning', label: 'Risk', value: this.riskLevel },
            { id: 'pf-payment-status', icon: 'utility:contract_payment', label: 'Payment Status', value: m.paymentStatus ?? '—' },
        ];
    }

    get profileSubtitle() {
        return this.member.address ?? '';
    }

    get profileAvatarIcon() {
        const type = String(this.member.tierType ?? '').toLowerCase();
        if (type === 'household') {
            return 'standard:household';
        }
        if (type === 'corporate') {
            return 'standard:account';
        }
        return 'standard:person_account';
    }

    get engagementScore() {
        const value = this.member.engagementScore;
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        return String(value);
    }

    get riskLevel() {
        return this.member.riskLevel ?? '—';
    }

    get renewalStatusBadge() {
        const status = this.member.status ?? 'Active';
        const isAtRisk = ['Grace Period', 'Lapsed', 'Suspended'].includes(status);
        return {
            label: status,
            variant: isAtRisk ? 'warning' : 'success',
        };
    }

    get annualDuesFormatted() {
        return this.formatCurrency(this.member.pricePaid ?? 0);
    }

    get renewalDateFormatted() {
        return this.member.renewalDate ?? this.member.termEndDate ?? '—';
    }

    get pageTitle() {
        return this.member.name ?? 'Member Detail';
    }

    get headerObjectLabel() {
        const type = String(this.member.tierType ?? '').toLowerCase();
        if (type === 'household') {
            return 'Household';
        }
        if (type === 'corporate') {
            return 'Corporate Member';
        }
        return 'Member';
    }

    get headerMetaText() {
        const id = this.member.memberId;
        const detail = this.member.tierType ?? this.member.tier;
        if (id && detail) {
            return `${id} \u00B7 ${detail}`;
        }
        return id ?? detail ?? '';
    }

    formatCurrency(value) {
        return `$${Number(value ?? 0).toLocaleString()}`;
    }

    formatNumber(value) {
        if (value === null || value === undefined || value === '') {
            return '—';
        }
        return Number(value).toLocaleString();
    }
}
