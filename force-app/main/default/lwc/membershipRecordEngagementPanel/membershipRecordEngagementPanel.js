import { api, LightningElement } from 'lwc';

export default class MembershipRecordEngagementPanel extends LightningElement {
    @api recordId;

    signals = [
        { label: 'Engagement Score', value: '72' },
        { label: 'Sentiment', value: 'Neutral' },
        { label: 'Loyalty Points', value: '4,800' },
        { label: 'Risk Level', value: 'High' },
    ];

    activityColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Activity', fieldName: 'activity', type: 'text' },
        { label: 'Channel', fieldName: 'channel', type: 'text' },
        { label: 'Notes', fieldName: 'notes', type: 'text' },
    ];

    householdColumns = [
        { label: 'Member', fieldName: 'name', type: 'text' },
        { label: 'Role', fieldName: 'role', type: 'text' },
        { label: 'Status', fieldName: 'status', type: 'text' },
        { label: 'Benefits Used', fieldName: 'benefitsUsed', type: 'number' },
    ];

    supporterColumns = [
        { label: 'Date', fieldName: 'date', type: 'date', typeAttributes: { year: 'numeric', month: 'short', day: '2-digit' } },
        { label: 'Type', fieldName: 'type', type: 'text' },
        { label: 'Summary', fieldName: 'summary', type: 'text' },
        { label: 'Value', fieldName: 'value', type: 'text' },
    ];

    activity = [
        { id: 'payment', date: '2026-05-01', activity: 'Payment Failed', channel: 'Billing', notes: 'Annual renewal charge was declined.' },
        { id: 'email', date: '2026-04-28', activity: 'Renewal Reminder Sent', channel: 'Email', notes: 'Two-week renewal reminder delivered.' },
        { id: 'event', date: '2026-04-10', activity: 'Attended Spring Gala', channel: 'Event', notes: 'Checked in at members-only event.' },
    ];

    household = [
        { id: 'primary', name: 'Primary Member', role: 'Purchaser', status: 'Active', benefitsUsed: 3 },
        { id: 'adult-guest', name: 'Named Adult', role: 'Household Member', status: 'Active', benefitsUsed: 1 },
        { id: 'child-guest', name: 'Youth Member', role: 'Household Member', status: 'Active', benefitsUsed: 1 },
    ];

    supporterHistory = [
        { id: 'gift', date: '2026-03-15', type: 'Donation', summary: 'Spring campaign gift', value: '$250' },
        { id: 'volunteer', date: '2026-02-10', type: 'Volunteer', summary: 'Education program volunteer shift', value: '4 hours' },
        { id: 'credential', date: '2026-01-20', type: 'Credential', summary: 'Continuing education credits earned', value: '6 CE' },
    ];
}
