import { api, LightningElement } from 'lwc';

export default class MembershipCommandCenterWatchlist extends LightningElement {
    @api topOffsetRem;

    renewalPipeline = [
        { id: 'r1', name: 'Anderson Family', tier: 'Household', date: 'May 14', amount: '$240' },
        { id: 'r2', name: 'Kim, Jennifer', tier: 'Student', date: 'May 21', amount: '$50' },
        { id: 'r3', name: 'Nguyen, David', tier: 'Gold', date: 'May 25', amount: '$180' },
        { id: 'r4', name: 'Patel, Raj', tier: 'Individual', date: 'May 28', amount: '$120' },
        { id: 'r5', name: 'Westbrook Corp', tier: 'Corporate', date: 'May 31', amount: '$1,800' },
    ];

    upcomingEvents = [
        { id: 'e1', name: 'Members-Only Spring Preview', type: 'Members-Only Preview', date: 'May 16', rsvps: '124 RSVPs' },
        { id: 'e2', name: 'Behind-the-Scenes Conservation Tour', type: 'Members-Only Tour', date: 'May 20', rsvps: '38 of 40 spots filled' },
        { id: 'e3', name: 'Annual Members Gala', type: 'Signature Event', date: 'Jun 5', rsvps: '286 RSVPs' },
        { id: 'e4', name: 'Family Science Day', type: 'Family Event', date: 'Jun 13', rsvps: '92 RSVPs' },
        { id: 'e5', name: "Curator's Lecture: Modern Art", type: 'Lecture Series', date: 'Jun 18', rsvps: '54 RSVPs' },
    ];
}
