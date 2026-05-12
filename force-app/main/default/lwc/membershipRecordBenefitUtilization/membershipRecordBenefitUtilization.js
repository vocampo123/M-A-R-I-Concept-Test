import { api, LightningElement } from 'lwc';

export default class MembershipRecordBenefitUtilization extends LightningElement {
    @api recordId;

    summary = [
        { label: 'Total Available', value: '8' },
        { label: 'Redeemed', value: '5' },
        { label: 'Remaining', value: '3' },
    ];

    columns = [
        { label: 'Benefit', fieldName: 'name', type: 'text' },
        { label: 'Usage Window', fieldName: 'window', type: 'text' },
        { label: 'Available', fieldName: 'available', type: 'number' },
        { label: 'Used', fieldName: 'used', type: 'number' },
        { label: 'Remaining', fieldName: 'remaining', type: 'number' },
    ];

    benefits = [
        { id: 'admission', name: 'Free Admission', window: 'Membership term', available: 4, used: 3, remaining: 1 },
        { id: 'guest-passes', name: 'Guest Passes', window: 'Annual reset', available: 2, used: 2, remaining: 0 },
        { id: 'discount', name: 'Exhibit Discount', window: 'Always available', available: null, used: 4, remaining: null },
        { id: 'events', name: 'Members-Only Events', window: 'Membership term', available: 2, used: 0, remaining: 2 },
    ];
}
