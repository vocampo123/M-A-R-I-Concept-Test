import { LightningElement } from 'lwc';

export default class MembershipCommandCenterPrimary extends LightningElement {
    kpis = [
        {
            id: 'k1',
            label: 'Active Members',
            value: '2,847',
            trend: '+4.2%',
            trendLabel: 'vs last month',
            trendIcon: 'utility:arrowup',
            trendClass: 'mc-kpi__trend mc-kpi__trend_positive',
            iconName: 'standard:groups',
        },
        {
            id: 'k2',
            label: 'Renewing This Month',
            value: '312',
            trend: '+8.1%',
            trendLabel: 'vs last month',
            trendIcon: 'utility:arrowup',
            trendClass: 'mc-kpi__trend mc-kpi__trend_positive',
            iconName: 'standard:loop',
        },
        {
            id: 'k3',
            label: 'Avg Engagement Score',
            value: '78',
            trend: '+3 pts',
            trendLabel: 'vs last month',
            trendIcon: 'utility:arrowup',
            trendClass: 'mc-kpi__trend mc-kpi__trend_positive',
            iconName: 'standard:opportunity',
        },
        {
            id: 'k4',
            label: 'Payment Failures',
            value: '23',
            trend: '+5',
            trendLabel: 'from yesterday',
            trendIcon: 'utility:arrowup',
            trendClass: 'mc-kpi__trend mc-kpi__trend_negative',
            iconName: 'standard:billing',
        },
    ];

    tierDistribution = [
        { tier: 'Gold', count: 427, percent: 15 },
        { tier: 'Silver', count: 995, percent: 35 },
        { tier: 'Bronze', count: 1425, percent: 50 },
    ];

    benefitUtilization = [
        { id: 'b1', label: 'Free Admission', pct: 72 },
        { id: 'b2', label: 'Guest Passes', pct: 45 },
        { id: 'b3', label: 'Event Invitations', pct: 61 },
        { id: 'b4', label: 'Discounts', pct: 38 },
        { id: 'b5', label: 'Content Access', pct: 29 },
    ];

    riskTiles = [
        { label: 'Payment Failed', count: 23, className: 'mc-risk-tile mc-risk-tile_critical' },
        { label: 'Grace Period', count: 47, className: 'mc-risk-tile mc-risk-tile_high' },
        { label: 'No Activity 45d', count: 34, className: 'mc-risk-tile mc-risk-tile_medium' },
        { label: 'Due in 30 Days', count: 91, className: 'mc-risk-tile mc-risk-tile_low' },
    ];
}
