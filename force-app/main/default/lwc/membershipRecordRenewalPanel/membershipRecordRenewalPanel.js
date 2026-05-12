import { api, LightningElement } from 'lwc';

export default class MembershipRecordRenewalPanel extends LightningElement {
    @api recordId;

    metrics = [
        { label: 'Renewal Status', value: 'Payment Failed', hint: 'Follow up before grace period ends' },
        { label: 'Renewal Date', value: 'May 14, 2026', hint: '30-day renewal window' },
        { label: 'Current Dues', value: '$1,200', hint: 'Platinum household tier' },
        { label: 'Auto-Renew', value: 'On', hint: 'Card update required' },
    ];
}
