import { LightningElement, api } from 'lwc';

const PAYMENT_METHOD_LABELS = {
    creditCard: 'Credit / Debit Card',
    ach: 'ACH / Bank Transfer',
    paypal: 'PayPal',
    applePay: 'Apple Pay',
    googlePay: 'Google Pay',
    check: 'Check (Offline)'
};

const POLICY_LABELS = {
    monthly: 'Recognize monthly over the term',
    pos: 'Recognize at point of sale',
    custom: 'Custom schedule'
};

const TAX_LABELS = {
    auto: 'Auto — based on member location',
    flat: 'Flat rate',
    exempt: 'Tax-exempt program'
};

const TIER_COLUMNS = [
    { label: 'Tier', fieldName: 'name' },
    { label: 'Type', fieldName: 'type' },
    { label: 'Term', fieldName: 'term' },
    { label: 'Seats', fieldName: 'seats', type: 'number' },
    {
        label: 'Annual Dues',
        fieldName: 'dues',
        type: 'currency',
        typeAttributes: { currencyCode: 'USD' }
    },
    {
        label: 'FMV',
        fieldName: 'fmv',
        type: 'currency',
        typeAttributes: { currencyCode: 'USD' }
    },
    { label: 'Lifecycle', fieldName: 'lifecycleStatus' }
];

export default class MembershipSetupReviewPhase extends LightningElement {
    @api program = {};
    @api tiers = [];
    @api benefits = [];
    @api tierBenefitMap = [];
    @api billing = {};

    tierColumns = TIER_COLUMNS;

    get programName() {
        return this.program.name || 'Untitled program';
    }
    get programDescription() {
        return this.program.description || 'No description provided.';
    }
    get tierCount() {
        return this.tiers.length;
    }
    get benefitCount() {
        return this.benefits.length;
    }
    get mappingCount() {
        return this.tierBenefitMap.filter((m) => m.included).length;
    }
    get paymentMethodLabels() {
        const list = (this.billing.paymentMethods || [])
            .map((v) => PAYMENT_METHOD_LABELS[v] || v)
            .join(', ');
        return list || 'None enabled';
    }
    get policyLabel() {
        return POLICY_LABELS[this.billing.revenueRecognitionPolicy] || 'Not set';
    }
    get taxLabel() {
        return TAX_LABELS[this.billing.taxMode] || 'Not set';
    }
    get graceLabel() {
        return `${this.billing.defaultGraceDays ?? 30} days default · ${this.billing.maxFailedPaymentRetries ?? 3} retries`;
    }
    get fmvLabel() {
        return this.billing.fmvEnabled ? 'Enabled per tier' : 'Not enabled';
    }

    get tierRows() {
        const fmvByTier = this.billing.fmvByTier || {};
        return this.tiers.map((t) => ({
            id: t.id,
            name: t.name,
            type: t.type,
            term: t.term,
            seats: t.seats,
            dues: t.dues,
            fmv: fmvByTier[t.id] ?? 0,
            lifecycleStatus: t.lifecycleStatus
        }));
    }

    get summaryCards() {
        return [
            {
                id: 'tiers',
                icon: 'standard:hierarchy',
                label: 'Tiers',
                value: String(this.tierCount),
                detail: this.tierCount === 1 ? 'tier configured' : 'tiers configured'
            },
            {
                id: 'benefits',
                icon: 'standard:reward',
                label: 'Benefits',
                value: String(this.benefitCount),
                detail: this.benefitCount === 1 ? 'benefit defined' : 'benefits defined'
            },
            {
                id: 'mappings',
                icon: 'standard:relationship',
                label: 'Mappings',
                value: String(this.mappingCount),
                detail: 'tier-benefit links'
            },
            {
                id: 'payments',
                icon: 'standard:product_transfer',
                label: 'Payment Methods',
                value: String((this.billing.paymentMethods || []).length),
                detail: 'methods enabled'
            }
        ];
    }
}
