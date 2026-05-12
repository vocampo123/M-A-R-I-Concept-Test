import { LightningElement, api } from 'lwc';

const POLICY_OPTIONS = [
    { label: 'Recognize monthly over the term', value: 'monthly' },
    { label: 'Recognize at point of sale', value: 'pos' },
    { label: 'Custom schedule (configure later)', value: 'custom' }
];

const COLUMNS = [
    { label: 'Product Type', fieldName: 'productType', editable: true },
    { label: 'Recognition Rule', fieldName: 'recognitionRule', editable: true },
    { label: 'Frequency', fieldName: 'frequency', editable: true },
    { label: 'Deferral Account', fieldName: 'deferralAccount', editable: true },
    { label: 'Recognition Account', fieldName: 'recognitionAccount', editable: true },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [{ label: 'Remove rule', name: 'remove' }]
        }
    }
];

export default class MembershipSetupRevenueRec extends LightningElement {
    @api billing = {};

    columns = COLUMNS;
    policyOptions = POLICY_OPTIONS;
    draftValues = [];

    get rules() {
        return this.billing.revenueRecognitionRules || [];
    }
    get hasRules() {
        return this.rules.length > 0;
    }
    get policy() {
        return this.billing.revenueRecognitionPolicy || 'monthly';
    }

    handlePolicyChange(event) {
        this.dispatchEvent(
            new CustomEvent('fieldchange', {
                bubbles: true,
                composed: true,
                detail: {
                    field: 'revenueRecognitionPolicy',
                    value: event.detail.value
                }
            })
        );
    }

    handleSave(event) {
        const updates = event.detail.draftValues || [];
        const next = this.rules.map((row) => {
            const draft = updates.find((u) => u.id === row.id);
            return draft ? { ...row, ...draft } : row;
        });
        this.draftValues = [];
        this.dispatchRules(next);
    }

    handleCancel() {
        this.draftValues = [];
    }

    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;
        if (action === 'remove') {
            const next = this.rules.filter((r) => r.id !== row.id);
            this.dispatchRules(next);
        }
    }

    handleAddRule() {
        const id = `rule-${Date.now()}`;
        const next = [
            ...this.rules,
            {
                id,
                productType: 'New Product Type',
                recognitionRule: 'Recognize Immediately',
                frequency: 'On Sale',
                deferralAccount: 'N/A',
                recognitionAccount: 'Revenue'
            }
        ];
        this.dispatchRules(next);
    }

    dispatchRules(rules) {
        this.dispatchEvent(
            new CustomEvent('revrecruleschange', {
                bubbles: true,
                composed: true,
                detail: { rules }
            })
        );
    }
}
