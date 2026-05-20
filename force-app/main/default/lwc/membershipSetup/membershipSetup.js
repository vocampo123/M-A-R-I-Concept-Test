import { LightningElement, track } from 'lwc';
import { ShowToastEvent } from 'lightning/platformShowToastEvent';

const STEP_PROGRAM = 'program';
const STEP_TIERS = 'tiers';
const STEP_BENEFITS = 'benefits';
const STEP_TIER_BENEFIT_MAP = 'tierBenefitMap';
const STEP_PAYMENT_METHODS = 'paymentMethods';
const STEP_PRICING_TERMS = 'pricingTerms';
const STEP_GRACE_AUTOMATION = 'graceAutomation';
const STEP_TAX_FMV = 'taxFmv';
const STEP_REVENUE_RECOGNITION = 'revenueRecognition';
const STEP_REVIEW = 'review';

const STEP_ORDER = [
    STEP_PROGRAM,
    STEP_TIERS,
    STEP_BENEFITS,
    STEP_TIER_BENEFIT_MAP,
    STEP_PAYMENT_METHODS,
    STEP_PRICING_TERMS,
    STEP_GRACE_AUTOMATION,
    STEP_TAX_FMV,
    STEP_REVENUE_RECOGNITION,
    STEP_REVIEW
];

const STEP_LABELS = {
    [STEP_PROGRAM]: 'Loyalty Program',
    [STEP_TIERS]: 'Tiers',
    [STEP_BENEFITS]: 'Benefits',
    [STEP_TIER_BENEFIT_MAP]: 'Tier-Benefit Mapping',
    [STEP_PAYMENT_METHODS]: 'Payment Methods',
    [STEP_PRICING_TERMS]: 'Pricing & Terms',
    [STEP_GRACE_AUTOMATION]: 'Status Automation',
    [STEP_TAX_FMV]: 'Tax & FMV',
    [STEP_REVENUE_RECOGNITION]: 'Revenue Recognition',
    [STEP_REVIEW]: 'Review & Activate'
};

const SEED_TIERS = [
    {
        id: 'tier-bronze-individual',
        name: 'Bronze',
        type: 'Individual',
        term: 'Anniversary',
        seats: 1,
        dues: 50,
        graceDays: 30,
        renewalWindow: 60,
        visibility: 'Public',
        eligibility: 'Open enrollment',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-bronze-family',
        name: 'Bronze',
        type: 'Family',
        term: 'Anniversary',
        seats: 4,
        dues: 90,
        graceDays: 30,
        renewalWindow: 60,
        visibility: 'Public',
        eligibility: 'Open enrollment',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-bronze-corporate',
        name: 'Bronze',
        type: 'Corporate',
        term: 'Calendar',
        seats: 10,
        dues: 500,
        graceDays: 60,
        renewalWindow: 90,
        visibility: 'Public',
        eligibility: 'Sales-assisted',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-silver-individual',
        name: 'Silver',
        type: 'Individual',
        term: 'Anniversary',
        seats: 1,
        dues: 150,
        graceDays: 30,
        renewalWindow: 60,
        visibility: 'Public',
        eligibility: 'Open enrollment',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-silver-family',
        name: 'Silver',
        type: 'Family',
        term: 'Anniversary',
        seats: 4,
        dues: 250,
        graceDays: 30,
        renewalWindow: 60,
        visibility: 'Public',
        eligibility: 'Open enrollment',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-silver-corporate',
        name: 'Silver',
        type: 'Corporate',
        term: 'Calendar',
        seats: 25,
        dues: 1500,
        graceDays: 60,
        renewalWindow: 90,
        visibility: 'Public',
        eligibility: 'Sales-assisted',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-gold-individual',
        name: 'Gold',
        type: 'Individual',
        term: 'Anniversary',
        seats: 1,
        dues: 350,
        graceDays: 45,
        renewalWindow: 90,
        visibility: 'Public',
        eligibility: 'Open enrollment',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-gold-family',
        name: 'Gold',
        type: 'Family',
        term: 'Anniversary',
        seats: 4,
        dues: 550,
        graceDays: 45,
        renewalWindow: 90,
        visibility: 'Public',
        eligibility: 'Open enrollment',
        lifecycleStatus: 'Active'
    },
    {
        id: 'tier-gold-corporate',
        name: 'Gold',
        type: 'Corporate',
        term: 'Calendar',
        seats: 50,
        dues: 5000,
        graceDays: 60,
        renewalWindow: 90,
        visibility: 'Invite-only',
        eligibility: 'Sales-assisted',
        lifecycleStatus: 'Active'
    }
];

const SEED_BENEFITS = [
    {
        id: 'ben-admission',
        name: 'Free Admission',
        type: 'Access',
        valueDescription: 'Per-visit free entry',
        cap: 'Unlimited',
        redemptionWindow: 'Anytime during term'
    },
    {
        id: 'ben-guest-passes',
        name: 'Guest Passes',
        type: 'Access',
        valueDescription: 'One-time guest entry',
        cap: 'Per-tier allotment',
        redemptionWindow: '30 days after issue'
    },
    {
        id: 'ben-shop-discount',
        name: 'Gift Shop Discount',
        type: 'Discount',
        valueDescription: '20% off retail',
        cap: 'No cap',
        redemptionWindow: 'Anytime during term'
    },
    {
        id: 'ben-events',
        name: 'Members-Only Events',
        type: 'Event',
        valueDescription: 'Exclusive event access',
        cap: 'All eligible events',
        redemptionWindow: 'Per event invite'
    },
    {
        id: 'ben-magazine',
        name: 'Quarterly Magazine',
        type: 'Content',
        valueDescription: '4 print issues / year',
        cap: '4 per term',
        redemptionWindow: 'Auto-mailed'
    }
];

const SEED_TIER_BENEFIT_MAP = [
    { tierId: 'tier-bronze-individual', benefitId: 'ben-admission', cap: 2, included: true },
    { tierId: 'tier-bronze-individual', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-bronze-family', benefitId: 'ben-admission', cap: 4, included: true },
    { tierId: 'tier-bronze-family', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-bronze-corporate', benefitId: 'ben-admission', cap: 15, included: true },
    { tierId: 'tier-bronze-corporate', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-silver-individual', benefitId: 'ben-admission', cap: 6, included: true },
    { tierId: 'tier-silver-individual', benefitId: 'ben-shop-discount', cap: null, included: true },
    { tierId: 'tier-silver-individual', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-silver-family', benefitId: 'ben-admission', cap: 999, included: true },
    { tierId: 'tier-silver-family', benefitId: 'ben-guest-passes', cap: 4, included: true },
    { tierId: 'tier-silver-family', benefitId: 'ben-shop-discount', cap: null, included: true },
    { tierId: 'tier-silver-family', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-silver-corporate', benefitId: 'ben-admission', cap: 999, included: true },
    { tierId: 'tier-silver-corporate', benefitId: 'ben-guest-passes', cap: 15, included: true },
    { tierId: 'tier-silver-corporate', benefitId: 'ben-shop-discount', cap: null, included: true },
    { tierId: 'tier-silver-corporate', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-gold-individual', benefitId: 'ben-admission', cap: 999, included: true },
    { tierId: 'tier-gold-individual', benefitId: 'ben-guest-passes', cap: 6, included: true },
    { tierId: 'tier-gold-individual', benefitId: 'ben-shop-discount', cap: null, included: true },
    { tierId: 'tier-gold-individual', benefitId: 'ben-events', cap: 6, included: true },
    { tierId: 'tier-gold-individual', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-gold-family', benefitId: 'ben-admission', cap: 999, included: true },
    { tierId: 'tier-gold-family', benefitId: 'ben-guest-passes', cap: 12, included: true },
    { tierId: 'tier-gold-family', benefitId: 'ben-shop-discount', cap: null, included: true },
    { tierId: 'tier-gold-family', benefitId: 'ben-events', cap: 12, included: true },
    { tierId: 'tier-gold-family', benefitId: 'ben-magazine', cap: 4, included: true },
    { tierId: 'tier-gold-corporate', benefitId: 'ben-admission', cap: 999, included: true },
    { tierId: 'tier-gold-corporate', benefitId: 'ben-guest-passes', cap: 50, included: true },
    { tierId: 'tier-gold-corporate', benefitId: 'ben-shop-discount', cap: null, included: true },
    { tierId: 'tier-gold-corporate', benefitId: 'ben-events', cap: 999, included: true },
    { tierId: 'tier-gold-corporate', benefitId: 'ben-magazine', cap: 4, included: true }
];

const SEED_FMV_BY_TIER = {
    'tier-bronze-individual': 15,
    'tier-bronze-family': 30,
    'tier-bronze-corporate': 100,
    'tier-silver-individual': 35,
    'tier-silver-family': 75,
    'tier-silver-corporate': 300,
    'tier-gold-individual': 75,
    'tier-gold-family': 125,
    'tier-gold-corporate': 1000
};

const SEED_REVREC_RULES = [
    {
        id: 'rule-dues',
        productType: 'Annual Membership Dues',
        recognitionRule: 'Straight-Line Over Term',
        frequency: 'Monthly',
        deferralAccount: 'Deferred Membership Revenue',
        recognitionAccount: 'Membership Revenue'
    },
    {
        id: 'rule-shop',
        productType: 'Gift Shop / Merchandise',
        recognitionRule: 'Recognize Immediately',
        frequency: 'On Sale',
        deferralAccount: 'N/A',
        recognitionAccount: 'Retail Revenue'
    },
    {
        id: 'rule-event',
        productType: 'Event Registration',
        recognitionRule: 'Event-Based',
        frequency: 'On Event Date',
        deferralAccount: 'Deferred Event Revenue',
        recognitionAccount: 'Event Revenue'
    },
    {
        id: 'rule-donation',
        productType: 'Donations',
        recognitionRule: 'Recognize Immediately',
        frequency: 'On Receipt',
        deferralAccount: 'N/A',
        recognitionAccount: 'Contribution Revenue'
    }
];

const ICON_DONE = 'utility:check';
const ICON_PENDING = 'utility:circle';

export default class MembershipSetup extends LightningElement {
    @track currentStep = STEP_PROGRAM;

    @track program = {
        name: 'Zoo Membership Program',
        description: 'Annual membership program offering tiered access, guest privileges, and event invitations.',
        defaultTermType: 'anniversary',
        defaultCurrency: 'USD',
        defaultGraceDays: 30
    };

    @track tiers = SEED_TIERS.map((t) => ({ ...t }));
    @track benefits = SEED_BENEFITS.map((b) => ({ ...b }));
    @track tierBenefitMap = SEED_TIER_BENEFIT_MAP.map((m) => ({ ...m }));

    @track billing = {
        paymentMethods: ['creditCard', 'ach'],
        mixedCart: true,
        zeroCheckout: true,
        installments: false,
        baseRenewalWindow: 30,
        midCycleUpgradeProration: 'prorateToTermEnd',
        cancellationProration: 'noProration',
        allowDuesWaivers: false,
        generateInvoicesAlways: true,
        defaultGraceDays: 30,
        maxFailedPaymentRetries: 3,
        retryIntervalDays: 7,
        autoTransitions: true,
        autoCancelAfterLapsedDays: 365,
        emailOnGrace: true,
        emailOnLapsed: true,
        revokeOnLapse: false,
        transitionToLapsed: 'afterGrace',
        taxMode: 'auto',
        fmvEnabled: true,
        fmvByTier: { ...SEED_FMV_BY_TIER },
        printFmvOnInvoices: true,
        autoRevenueRecognitionDeferral: true,
        revenueRecognitionPolicy: 'monthly',
        revenueRecognitionRules: SEED_REVREC_RULES.map((r) => ({ ...r }))
    };

    get currentStepValue() {
        return this.currentStep;
    }

    get currentStepLabel() {
        return STEP_LABELS[this.currentStep] || 'Membership Setup';
    }

    get currentStepIndex() {
        return STEP_ORDER.indexOf(this.currentStep) + 1;
    }

    get totalSteps() {
        return STEP_ORDER.length;
    }

    get stepCounter() {
        return `Step ${this.currentStepIndex} of ${this.totalSteps}`;
    }

    get isFirstStep() {
        return STEP_ORDER.indexOf(this.currentStep) === 0;
    }

    get isLastStep() {
        return STEP_ORDER.indexOf(this.currentStep) === STEP_ORDER.length - 1;
    }

    get nextLabel() {
        return this.isLastStep ? 'Activate Program' : 'Next';
    }

    get isProgram() {
        return this.currentStep === STEP_PROGRAM;
    }
    get isTiers() {
        return this.currentStep === STEP_TIERS;
    }
    get isBenefits() {
        return this.currentStep === STEP_BENEFITS;
    }
    get isTierBenefitMap() {
        return this.currentStep === STEP_TIER_BENEFIT_MAP;
    }
    get isPaymentMethods() {
        return this.currentStep === STEP_PAYMENT_METHODS;
    }
    get isPricingTerms() {
        return this.currentStep === STEP_PRICING_TERMS;
    }
    get isGraceAutomation() {
        return this.currentStep === STEP_GRACE_AUTOMATION;
    }
    get isTaxFmv() {
        return this.currentStep === STEP_TAX_FMV;
    }
    get isRevenueRecognition() {
        return this.currentStep === STEP_REVENUE_RECOGNITION;
    }
    get isReview() {
        return this.currentStep === STEP_REVIEW;
    }

    get programIcon() {
        return this.program?.name && this.program?.description ? ICON_DONE : ICON_PENDING;
    }
    get tiersIcon() {
        return this.tiers.length > 0 ? ICON_DONE : ICON_PENDING;
    }
    get benefitsIcon() {
        return this.benefits.length > 0 ? ICON_DONE : ICON_PENDING;
    }
    get tierBenefitMapIcon() {
        return this.tierBenefitMap.length > 0 ? ICON_DONE : ICON_PENDING;
    }
    get paymentMethodsIcon() {
        return (this.billing.paymentMethods || []).length > 0 ? ICON_DONE : ICON_PENDING;
    }
    get pricingTermsIcon() {
        return this.tiers.length > 0 && this.tiers.every((t) => t.dues != null) ? ICON_DONE : ICON_PENDING;
    }
    get graceAutomationIcon() {
        return this.billing.defaultGraceDays != null ? ICON_DONE : ICON_PENDING;
    }
    get taxFmvIcon() {
        return this.billing.taxMode ? ICON_DONE : ICON_PENDING;
    }
    get revenueRecognitionIcon() {
        return (this.billing.revenueRecognitionRules || []).length > 0 ? ICON_DONE : ICON_PENDING;
    }
    get reviewIcon() {
        return ICON_PENDING;
    }

    handleStepSelect(event) {
        const name = event.detail?.name;
        if (name && STEP_ORDER.includes(name)) {
            this.currentStep = name;
            this.scrollToTop();
        }
    }

    handleNext() {
        const idx = STEP_ORDER.indexOf(this.currentStep);
        if (idx < STEP_ORDER.length - 1) {
            this.currentStep = STEP_ORDER[idx + 1];
            this.scrollToTop();
            return;
        }
        this.handleFinish();
    }

    handleBack() {
        const idx = STEP_ORDER.indexOf(this.currentStep);
        if (idx > 0) {
            this.currentStep = STEP_ORDER[idx - 1];
            this.scrollToTop();
        }
    }

    handleSaveAndExit() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Progress saved',
                message: 'Your setup progress has been saved. You can return any time from the Membership Setup tab.',
                variant: 'success'
            })
        );
    }

    handleCancel() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Setup cancelled',
                message: 'Unsaved changes were discarded.',
                variant: 'info'
            })
        );
    }

    handleFinish() {
        this.dispatchEvent(
            new ShowToastEvent({
                title: 'Membership program activated',
                message: `Your membership program "${this.program.name}" is configured and ready for members.`,
                variant: 'success'
            })
        );
    }

    handleProgramChange(event) {
        const { field, value } = event.detail || {};
        if (!field) return;
        this.program = { ...this.program, [field]: value };
    }

    handleTiersChange(event) {
        const { tiers } = event.detail || {};
        if (!Array.isArray(tiers)) return;
        this.tiers = tiers;
    }

    handleBenefitsChange(event) {
        const { benefits } = event.detail || {};
        if (!Array.isArray(benefits)) return;
        this.benefits = benefits;
    }

    handleTierBenefitMapChange(event) {
        const { map } = event.detail || {};
        if (!Array.isArray(map)) return;
        this.tierBenefitMap = map;
    }

    handleBillingChange(event) {
        const { field, value } = event.detail || {};
        if (!field) return;
        this.billing = { ...this.billing, [field]: value };
    }

    handleFmvByTierChange(event) {
        const { tierId, value } = event.detail || {};
        if (!tierId) return;
        this.billing = {
            ...this.billing,
            fmvByTier: { ...this.billing.fmvByTier, [tierId]: value }
        };
    }

    handleRevRecRulesChange(event) {
        const { rules } = event.detail || {};
        if (!Array.isArray(rules)) return;
        this.billing = { ...this.billing, revenueRecognitionRules: rules };
    }

    scrollToTop() {
        const root = this.template.querySelector('.msc-shell');
        if (root && typeof root.scrollIntoView === 'function') {
            root.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    }
}
