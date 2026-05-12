import { LightningElement, api } from 'lwc';

const TYPE_OPTIONS = [
    { label: 'Individual', value: 'Individual' },
    { label: 'Family', value: 'Family' },
    { label: 'Corporate', value: 'Corporate' }
];

const TERM_OPTIONS = [
    { label: 'Anniversary', value: 'Anniversary' },
    { label: 'Calendar', value: 'Calendar' }
];

const VISIBILITY_OPTIONS = [
    { label: 'Public', value: 'Public' },
    { label: 'Invite-only', value: 'Invite-only' },
    { label: 'Internal', value: 'Internal' }
];

const LIFECYCLE_OPTIONS = [
    { label: 'Active', value: 'Active' },
    { label: 'Draft', value: 'Draft' },
    { label: 'Retired', value: 'Retired' }
];

const COLUMNS = [
    { label: 'Tier Name', fieldName: 'name', editable: true, wrapText: false },
    {
        label: 'Type',
        fieldName: 'type',
        type: 'text',
        editable: true,
        typeAttributes: {},
        wrapText: false
    },
    { label: 'Term', fieldName: 'term', editable: true },
    {
        label: 'Seats',
        fieldName: 'seats',
        type: 'number',
        editable: true,
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Annual Dues',
        fieldName: 'dues',
        type: 'currency',
        editable: true,
        typeAttributes: { currencyCode: 'USD' },
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Grace (days)',
        fieldName: 'graceDays',
        type: 'number',
        editable: true,
        cellAttributes: { alignment: 'left' }
    },
    {
        label: 'Renewal Window (days)',
        fieldName: 'renewalWindow',
        type: 'number',
        editable: true,
        cellAttributes: { alignment: 'left' }
    },
    { label: 'Visibility', fieldName: 'visibility', editable: true },
    { label: 'Eligibility', fieldName: 'eligibility', editable: true, wrapText: true },
    { label: 'Lifecycle Status', fieldName: 'lifecycleStatus', editable: true },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [{ label: 'Remove tier', name: 'remove' }]
        }
    }
];

export default class MembershipSetupTiersList extends LightningElement {
    @api tiers = [];

    columns = COLUMNS;
    draftValues = [];

    typeOptions = TYPE_OPTIONS;
    termOptions = TERM_OPTIONS;
    visibilityOptions = VISIBILITY_OPTIONS;
    lifecycleOptions = LIFECYCLE_OPTIONS;

    get tierCount() {
        return this.tiers.length;
    }

    get hasTiers() {
        return this.tiers.length > 0;
    }

    handleSave(event) {
        const updates = event.detail.draftValues || [];
        const next = this.tiers.map((row) => {
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
            const next = this.tiers.filter((t) => t.id !== row.id);
            this.dispatch(next);
        }
    }

    handleAddTier() {
        const id = `tier-${Date.now()}`;
        const next = [
            ...this.tiers,
            {
                id,
                name: 'New Tier',
                type: 'Individual',
                term: 'Anniversary',
                seats: 1,
                dues: 0,
                graceDays: 30,
                renewalWindow: 60,
                visibility: 'Public',
                eligibility: 'Open enrollment',
                lifecycleStatus: 'Draft'
            }
        ];
        this.dispatch(next);
    }

    dispatch(tiers) {
        this.dispatchEvent(
            new CustomEvent('tierschange', {
                bubbles: true,
                composed: true,
                detail: { tiers }
            })
        );
    }
}
