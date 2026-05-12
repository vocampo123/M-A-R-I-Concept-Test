import { LightningElement } from 'lwc';

const MEMBERS = [
    { id: 'm001', memberId: 'MBR-00491', name: 'Miyazaki, Eriko', tier: 'Diamond', tierType: 'Household', status: 'Active', memberSince: '2018-03-12', renewalDate: '2026-05-14', paymentStatus: 'Failed', lastActivity: '2026-04-28' },
    { id: 'm002', memberId: 'MBR-00312', name: 'Chen, Robert', tier: 'Gold', tierType: 'Individual', status: 'Active', memberSince: '2021-07-04', renewalDate: '2026-06-03', paymentStatus: 'Current', lastActivity: '2026-03-20' },
    { id: 'm003', memberId: 'MBR-00178', name: 'Anderson Family', tier: 'Gold', tierType: 'Household', status: 'Active', memberSince: '2019-05-14', renewalDate: '2026-05-14', paymentStatus: 'Current', lastActivity: '2026-04-10' },
    { id: 'm004', memberId: 'MBR-00089', name: 'Williams, Susan', tier: 'Silver', tierType: 'Individual', status: 'Grace Period', memberSince: '2020-02-01', renewalDate: '2026-05-04', paymentStatus: 'Overdue', lastActivity: '2026-02-28' },
    { id: 'm005', memberId: 'MBR-00521', name: 'Sunrise Corporate', tier: 'Diamond', tierType: 'Corporate', status: 'Active', memberSince: '2022-01-15', renewalDate: '2026-06-21', paymentStatus: 'Failed', lastActivity: '2026-04-22' },
    { id: 'm006', memberId: 'MBR-00644', name: 'Kim, Jennifer', tier: 'Silver', tierType: 'Individual', status: 'Active', memberSince: '2025-05-21', renewalDate: '2026-05-21', paymentStatus: 'Current', lastActivity: '2026-04-28' },
    { id: 'm007', memberId: 'MBR-00398', name: 'Nguyen, David', tier: 'Gold', tierType: 'Individual', status: 'Active', memberSince: '2020-11-30', renewalDate: '2026-06-10', paymentStatus: 'Current', lastActivity: '2026-03-05' },
    { id: 'm008', memberId: 'MBR-00255', name: 'Patel, Raj', tier: 'Silver', tierType: 'Individual', status: 'Active', memberSince: '2023-04-15', renewalDate: '2026-05-28', paymentStatus: 'Current', lastActivity: '2026-04-15' },
    { id: 'm009', memberId: 'MBR-00133', name: 'Garcia, Maria', tier: 'Diamond', tierType: 'Individual', status: 'Active', memberSince: '2016-09-01', renewalDate: '2026-08-01', paymentStatus: 'Current', lastActivity: '2026-05-01' },
    { id: 'm010', memberId: 'MBR-00067', name: 'Thompson, Mark', tier: 'Gold', tierType: 'Individual', status: 'Lapsed', memberSince: '2019-06-20', renewalDate: '2026-04-20', paymentStatus: 'Lapsed', lastActivity: '2026-01-15' },
];

const COLUMNS = [
    { label: 'Member ID', fieldName: 'memberId', type: 'text', sortable: true, initialWidth: 120 },
    { label: 'Name', fieldName: 'name', type: 'text', sortable: true },
    { label: 'Tier', fieldName: 'tier', type: 'text', sortable: true, initialWidth: 110 },
    { label: 'Type', fieldName: 'tierType', type: 'text', sortable: true, initialWidth: 120 },
    { label: 'Status', fieldName: 'status', type: 'text', sortable: true, initialWidth: 120 },
    { label: 'Member Since', fieldName: 'memberSince', type: 'date', sortable: true, typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
    { label: 'Renewal Date', fieldName: 'renewalDate', type: 'date', sortable: true, typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
    { label: 'Payment Status', fieldName: 'paymentStatus', type: 'text', sortable: true, initialWidth: 140 },
    { label: 'Last Activity', fieldName: 'lastActivity', type: 'date', sortable: true, typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
    {
        type: 'action',
        typeAttributes: {
            rowActions: [
                { label: 'View Member', name: 'view' },
                { label: 'Send Renewal', name: 'send_renewal' },
                { label: 'Intervene', name: 'intervene' },
            ],
        },
    },
];

export default class MembershipMemberListTable extends LightningElement {
    columns = COLUMNS;
    searchTerm = '';
    tierFilter = '';
    statusFilter = '';
    sortedBy = 'name';
    sortedDirection = 'asc';

    tierOptions = [
        { label: 'All Tiers', value: '' },
        { label: 'Silver', value: 'Silver' },
        { label: 'Gold', value: 'Gold' },
        { label: 'Diamond', value: 'Diamond' },
    ];

    statusOptions = [
        { label: 'All Statuses', value: '' },
        { label: 'Active', value: 'Active' },
        { label: 'Grace Period', value: 'Grace Period' },
        { label: 'Lapsed', value: 'Lapsed' },
        { label: 'Suspended', value: 'Suspended' },
    ];

    get filteredData() {
        let data = [...MEMBERS];
        const term = this.searchTerm.toLowerCase();

        if (term) {
            data = data.filter((member) => member.name.toLowerCase().includes(term) || member.memberId.toLowerCase().includes(term));
        }
        if (this.tierFilter) {
            data = data.filter((member) => member.tier === this.tierFilter);
        }
        if (this.statusFilter) {
            data = data.filter((member) => member.status === this.statusFilter);
        }

        data.sort((a, b) => {
            let valA = a[this.sortedBy] ?? '';
            let valB = b[this.sortedBy] ?? '';
            if (typeof valA === 'string') valA = valA.toLowerCase();
            if (typeof valB === 'string') valB = valB.toLowerCase();
            const comparison = valA < valB ? -1 : valA > valB ? 1 : 0;
            return this.sortedDirection === 'asc' ? comparison : -comparison;
        });

        return data;
    }

    handleSearch(event) {
        this.searchTerm = event.target.value;
    }

    handleTierFilter(event) {
        this.tierFilter = event.detail.value;
    }

    handleStatusFilter(event) {
        this.statusFilter = event.detail.value;
    }

    handleSort(event) {
        this.sortedBy = event.detail.fieldName;
        this.sortedDirection = event.detail.sortDirection;
    }

    handleRowAction(event) {
        this.dispatchEvent(new CustomEvent('memberrowaction', { detail: event.detail }));
    }
}
