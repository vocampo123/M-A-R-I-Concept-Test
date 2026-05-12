import { api, LightningElement } from 'lwc';

export default class MembershipRecordRelatedLists extends LightningElement {
    @api recordId;

    engagementColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Activity', fieldName: 'activity', type: 'text' },
        { label: 'Type', fieldName: 'type', type: 'text' },
        { label: 'Description', fieldName: 'description', type: 'text' },
    ];

    billingColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Description', fieldName: 'description', type: 'text' },
        { label: 'Amount', fieldName: 'amount', type: 'currency', typeAttributes: { currencyCode: 'USD', minimumFractionDigits: 0 } },
        { label: 'Status', fieldName: 'status', type: 'text' },
    ];

    benefitColumns = [
        { label: 'Benefit', fieldName: 'benefit', type: 'text' },
        { label: 'Available', fieldName: 'available', type: 'number' },
        { label: 'Used', fieldName: 'used', type: 'number' },
        { label: 'Remaining', fieldName: 'remaining', type: 'number' },
    ];

    engagementHistory = [
        { id: 'visit', date: '2026-04-10', activity: 'Family Visit', type: 'Visit', description: 'Full family admission used. Cafe discount applied.' },
        { id: 'event', date: '2026-03-22', activity: 'Kids Science Day', type: 'Event', description: 'Attended members-only Kids Science Day.' },
        { id: 'email', date: '2026-02-15', activity: 'Upgrade Offer Sent', type: 'Email', description: 'Targeted Gold Household upgrade offer delivered.' },
    ];

    billingHistory = [
        { id: 'renewal-2026', date: '2026-05-01', description: 'Annual Renewal - Platinum Household', amount: 1200, status: 'Failed' },
        { id: 'renewal-2025', date: '2025-05-14', description: 'Annual Renewal - Platinum Household', amount: 1200, status: 'Paid' },
        { id: 'renewal-2024', date: '2024-05-14', description: 'Annual Renewal - Platinum Household', amount: 1200, status: 'Paid' },
    ];

    benefits = [
        { id: 'admission', benefit: 'Free Admission', available: 4, used: 3, remaining: 1 },
        { id: 'guest-passes', benefit: 'Guest Passes', available: 2, used: 2, remaining: 0 },
        { id: 'discount', benefit: 'Exhibit Discount', available: null, used: 4, remaining: null },
        { id: 'events', benefit: 'Members-Only Events', available: 2, used: 0, remaining: 2 },
    ];
}
