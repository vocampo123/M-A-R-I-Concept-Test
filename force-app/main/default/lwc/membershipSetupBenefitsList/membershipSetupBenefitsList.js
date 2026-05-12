import { LightningElement, api } from 'lwc';

const COLUMNS = [
    { label: 'Benefit Name', fieldName: 'name', editable: true },
    { label: 'Type', fieldName: 'type', editable: true },
    { label: 'Value', fieldName: 'valueDescription', editable: true, wrapText: true },
    { label: 'Cap', fieldName: 'cap', editable: true },
    { label: 'Redemption Window', fieldName: 'redemptionWindow', editable: true, wrapText: true },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [{ label: 'Remove benefit', name: 'remove' }]
        }
    }
];

export default class MembershipSetupBenefitsList extends LightningElement {
    @api benefits = [];

    columns = COLUMNS;
    draftValues = [];

    get hasBenefits() {
        return this.benefits.length > 0;
    }

    handleSave(event) {
        const updates = event.detail.draftValues || [];
        const next = this.benefits.map((row) => {
            const draft = updates.find((u) => u.id === row.id);
            return draft ? { ...row, ...draft } : row;
        });
        this.draftValues = [];
        this.dispatch(next);
    }

    handleCancel() {
        this.draftValues = [];
    }

    handleRowAction(event) {
        const action = event.detail.action.name;
        const row = event.detail.row;
        if (action === 'remove') {
            const next = this.benefits.filter((b) => b.id !== row.id);
            this.dispatch(next);
        }
    }

    handleAddBenefit() {
        const id = `ben-${Date.now()}`;
        const next = [
            ...this.benefits,
            {
                id,
                name: 'New Benefit',
                type: 'Access',
                valueDescription: '',
                cap: 'Per-tier allotment',
                redemptionWindow: 'Anytime during term'
            }
        ];
        this.dispatch(next);
    }

    dispatch(benefits) {
        this.dispatchEvent(
            new CustomEvent('benefitschange', {
                bubbles: true,
                composed: true,
                detail: { benefits }
            })
        );
    }
}
