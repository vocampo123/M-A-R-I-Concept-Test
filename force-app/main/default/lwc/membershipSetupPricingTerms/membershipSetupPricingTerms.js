import { LightningElement, api } from 'lwc';

const TERM_OPTIONS = [
    { label: 'Anniversary — term starts on each member’s join date', value: 'anniversary' },
    { label: 'Calendar — every term aligns to the calendar year', value: 'calendar' }
];

const CURRENCY_OPTIONS = [
    { label: 'USD — US Dollar', value: 'USD' },
    { label: 'EUR — Euro', value: 'EUR' },
    { label: 'GBP — British Pound', value: 'GBP' },
    { label: 'CAD — Canadian Dollar', value: 'CAD' },
    { label: 'AUD — Australian Dollar', value: 'AUD' }
];

const UPGRADE_OPTIONS = [
    { label: 'Prorate to end of term', value: 'prorateToTermEnd' },
    { label: 'Charge difference immediately', value: 'chargeImmediate' },
    { label: 'Defer until next renewal', value: 'deferToRenewal' }
];

const CANCEL_OPTIONS = [
    { label: 'No proration — charge full price', value: 'noProration' },
    { label: 'Refund unused portion', value: 'refundUnused' },
    { label: 'Credit account for unused portion', value: 'creditAccount' }
];

export default class MembershipSetupPricingTerms extends LightningElement {
    @api program = {};
    @api billing = {};

    termOptions = TERM_OPTIONS;
    currencyOptions = CURRENCY_OPTIONS;
    upgradeOptions = UPGRADE_OPTIONS;
    cancelOptions = CANCEL_OPTIONS;

    get defaultTermType() {
        return this.program.defaultTermType || 'anniversary';
    }
    get defaultCurrency() {
        return this.program.defaultCurrency || 'USD';
    }
    get defaultGraceDays() {
        return this.program.defaultGraceDays ?? 30;
    }

    get baseRenewalWindow() {
        return this.billing.baseRenewalWindow ?? 30;
    }
    get midCycleUpgrade() {
        return this.billing.midCycleUpgradeProration || 'prorateToTermEnd';
    }
    get cancellationProration() {
        return this.billing.cancellationProration || 'noProration';
    }
    get allowDuesWaivers() {
        return Boolean(this.billing.allowDuesWaivers);
    }
    get generateInvoicesAlways() {
        return this.billing.generateInvoicesAlways !== false;
    }

    handleTermChange(event) {
        this.dispatchProgramField('defaultTermType', event.detail.value);
    }
    handleCurrencyChange(event) {
        this.dispatchProgramField('defaultCurrency', event.detail.value);
    }
    handleGraceChange(event) {
        this.dispatchProgramField('defaultGraceDays', event.target.value);
    }

    handleRenewalWindow(event) {
        this.dispatchBillingField('baseRenewalWindow', event.target.value);
    }
    handleUpgradeChange(event) {
        this.dispatchBillingField('midCycleUpgradeProration', event.detail.value);
    }
    handleCancelChange(event) {
        this.dispatchBillingField('cancellationProration', event.detail.value);
    }
    handleWaiversChange(event) {
        this.dispatchBillingField('allowDuesWaivers', event.target.checked);
    }
    handleInvoicesChange(event) {
        this.dispatchBillingField('generateInvoicesAlways', event.target.checked);
    }

    dispatchBillingField(field, value) {
        this.dispatchEvent(
            new CustomEvent('fieldchange', {
                bubbles: true,
                composed: true,
                detail: { field, value }
            })
        );
    }

    dispatchProgramField(field, value) {
        this.dispatchEvent(
            new CustomEvent('programfieldchange', {
                bubbles: true,
                composed: true,
                detail: { field, value }
            })
        );
    }
}
