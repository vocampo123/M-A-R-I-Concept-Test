import { LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import { IsConsoleNavigation, openTab } from 'lightning/platformWorkspaceApi';

const OPEN_ALERTS = [
    {
        id: 'a1',
        title: 'Payment Failed',
        description: 'Miyazaki Household · Platinum · $1,200/yr',
        time: '2h ago',
        iconName: 'utility:warning',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_error',
    },
    {
        id: 'a2',
        title: 'High Churn Risk',
        description: 'Chen, Robert · Gold · No activity in 47 days',
        time: '4h ago',
        iconName: 'utility:warning',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_error',
    },
    {
        id: 'a3',
        title: 'Renewal in 7 Days',
        description: 'Anderson Family · Household · Expires May 14',
        time: '6h ago',
        iconName: 'utility:expired',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_warning',
    },
    {
        id: 'a4',
        title: 'Grace Period Ending',
        description: 'Williams, Susan · Individual · 3 days left',
        time: '8h ago',
        iconName: 'utility:expired',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_warning',
    },
    {
        id: 'a5',
        title: 'Payment Failed',
        description: 'Sunrise Corporate · Corporate · $4,800/yr',
        time: '1d ago',
        iconName: 'utility:warning',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_error',
    },
    {
        id: 'a6',
        title: 'Renewal in 14 Days',
        description: 'Kim, Jennifer · Student · Expires May 21',
        time: '1d ago',
        iconName: 'utility:clock',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_info',
    },
];

const SNOOZED_ALERTS = [
    {
        id: 's1',
        title: 'Renewal Reminder',
        description: 'Patel, Anita · Gold · Snoozed until May 10',
        time: '2d ago',
        iconName: 'utility:clock',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_warning',
    },
    {
        id: 's2',
        title: 'Re-engagement Needed',
        description: 'Torres Family · Household · Snoozed until May 12',
        time: '3d ago',
        iconName: 'utility:warning',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_warning',
    },
];

const HISTORY_ALERTS = [
    {
        id: 'h1',
        title: 'Renewal Completed',
        description: 'Thompson, Mark · Individual · Renewed May 3',
        time: '4d ago',
        iconName: 'utility:check',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_success',
    },
    {
        id: 'h2',
        title: 'Payment Recovered',
        description: 'Westbrook Corp · Corporate · Processed May 2',
        time: '5d ago',
        iconName: 'utility:check',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_success',
    },
    {
        id: 'h3',
        title: 'Member Re-engaged',
        description: 'Garcia, Maria · Platinum · Attended gala May 1',
        time: '6d ago',
        iconName: 'utility:check',
        iconContainerClass: 'mc-alert-icon mc-alert-icon_success',
    },
];

export default class MembershipCommandCenterAlerts extends NavigationMixin(LightningElement) {
    openAlerts = OPEN_ALERTS;
    snoozedAlerts = SNOOZED_ALERTS;
    historyAlerts = HISTORY_ALERTS;

    @wire(IsConsoleNavigation) isConsoleNavigation;

    get openTabLabel() {
        return `Open (${this.openAlerts.length})`;
    }

    handleAcknowledge(event) {
        event.stopPropagation();
        const alertId = event.currentTarget.dataset.id;
        this.openAlerts = this.openAlerts.filter((alert) => alert.id !== alertId);
    }

    handleNavigateToListView() {
        const pageReference = {
            type: 'standard__objectPage',
            attributes: {
                objectApiName: 'Membership__c',
                actionName: 'list'
            },
            state: {
                filterName: 'Members_Requiring_Attention'
            }
        };

        if (this.isConsoleNavigation) {
            openTab({ pageReference, focus: true }).catch(() => {
                this[NavigationMixin.Navigate](pageReference);
            });
        } else {
            this[NavigationMixin.Navigate](pageReference);
        }
    }
}
