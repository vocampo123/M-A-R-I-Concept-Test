import { LightningElement, api } from 'lwc';

const TAX_OPTIONS = [
    { label: 'Auto — based on member location', value: 'auto' },
    { label: 'Flat rate', value: 'flat' },
    { label: 'Tax-exempt program', value: 'exempt' }
];

const COLUMNS = [
    { label: 'Tier', fieldName: 'tierName' },
    { label: 'Type', fieldName: 'tierType' },
    {
        label: 'Annual Dues',
        fieldName: 'dues',
        type: 'currency',
        typeAttributes: { currencyCode: 'USD' }
    },
    {
        label: 'Fair Market Value',
        fieldName: 'fmv',
        type: 'currency',
        typeAttributes: { currencyCode: 'USD' },
        editable: true
    },
    {
        label: 'Tax-Deductible Portion',
        fieldName: 'deductible',
        type: 'currency',
        typeAttributes: { currencyCode: 'USD' }
    }
];

export default class MembershipSetupTaxFmv extends LightningElement {
    @api tiers = [];
    @api billing = {};

    columns = COLUMNS;
    taxOptions = TAX_OPTIONS;
    draftValues = [];

    get hasTiers() {
        return this.tiers.length > 0;
    }
    get fmvEnabled() {
        return this.billing.fmvEnabled !== false;
    }
    get printFmvOnInvoices() {
        return this.billing.printFmvOnInvoices !== false;
    }
    get autoRevenueRecognitionDeferral() {
        return this.billing.autoRevenueRecognitionDeferral !== false;
    }
    get taxMode() {
        return this.billing.taxMode || 'auto';
    }

    get rows() {
        const fmvByTier = this.billing.fmvByTier || {};
        return this.tiers.map((t) => {
            const fmv = fmvByTier[t.id] ?? 0;
            const deductible = Math.max(0, (t.dues ?? 0) - fmv);
            return {
                id: t.id,
                tierName: t.name,
                tierType: t.type,
                dues: t.dues ?? 0,
                fmv,
                deductible
            };
        });
    }

    handleSave(event) {
        const updates = event.detail.draftValues || [];
        updates.forEach((u) => {
            this.dispatchEvent(
                new CustomEvent('fmvtierchange', {
                    bubbles: true,
                    composed: true,
                    detail: { tierId: u.id, value: Number(u.fmv) || 0 }
                })
            );
        });
        this.draftValues = [];
    }
    handleCancel() {
        this.draftValues = [];
    }

    handleFmvEnabled(event) {
        this.dispatch('fmvEnabled', event.target.checked);
    }
    handlePrintFmv(event) {
        this.dispatch('printFmvOnInvoices', event.target.checked);
    }
    handleDeferralChange(event) {
        this.dispatch('autoRevenueRecognitionDeferral', event.target.checked);
    }
    handleTaxModeChange(event) {
        this.dispatch('taxMode', event.detail.value);
    }

    dispatch(field, value) {
        this.dispatchEvent(
            new CustomEvent('fieldchange', {
                bubbles: true,
                composed: true,
                detail: { field, value }
            })
        );
    }
}
