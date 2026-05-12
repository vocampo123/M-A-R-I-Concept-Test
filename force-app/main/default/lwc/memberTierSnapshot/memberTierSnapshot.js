import { api, LightningElement, wire } from 'lwc';
import { NavigationMixin } from 'lightning/navigation';
import getSnapshotForMembership from '@salesforce/apex/MemberTierController.getSnapshotForMembership';

const LIFECYCLE_STAGES = ['Draft', 'Active', 'Sunset', 'Archived'];

export default class MemberTierSnapshot extends NavigationMixin(LightningElement) {
    @api recordId;
    snapshot;
    error;

    @wire(getSnapshotForMembership, { membershipId: '$recordId' })
    wired({ data, error }) {
        if (data !== undefined) {
            this.snapshot = data;
            this.error = undefined;
        } else if (error) {
            this.error = error;
            this.snapshot = undefined;
        }
    }

    get hasSnapshot() {
        return !!this.snapshot;
    }

    get hasNoSnapshot() {
        return this.snapshot === null;
    }

    get tierName() {
        return this.snapshot ? this.snapshot.tierName : '';
    }

    get tierType() {
        return this.snapshot ? this.snapshot.tierType : '';
    }

    get visibility() {
        return this.snapshot ? this.snapshot.visibility : '';
    }

    get programName() {
        return this.snapshot ? this.snapshot.programName : '';
    }

    get tierGroupName() {
        return this.snapshot ? this.snapshot.tierGroupName : '';
    }

    get annualDues() {
        return this.snapshot ? this.snapshot.annualDues : 0;
    }

    get fairMarketValue() {
        return this.snapshot ? this.snapshot.fairMarketValue : 0;
    }

    get hasFmv() {
        return this.fairMarketValue != null && this.fairMarketValue > 0;
    }

    get renewalWindow() {
        const v = this.snapshot && this.snapshot.renewalWindowDays;
        return v != null ? `${v} days` : '—';
    }

    get gracePeriod() {
        const v = this.snapshot && this.snapshot.gracePeriodDays;
        return v != null ? `${v} days` : '—';
    }

    get lifecycleSteps() {
        const current = this.snapshot ? this.snapshot.lifecycleStatus : '';
        const currentIndex = LIFECYCLE_STAGES.indexOf(current);
        return LIFECYCLE_STAGES.map((stage, index) => {
            const isCurrent = stage === current;
            const isComplete = currentIndex >= 0 && index < currentIndex;
            let className = 'tier-snapshot__step';
            if (isCurrent) {
                className += ' tier-snapshot__step_current';
            } else if (isComplete) {
                className += ' tier-snapshot__step_complete';
            }
            return {
                label: stage,
                value: stage,
                isCurrent,
                className
            };
        });
    }

    handleViewTier() {
        if (!this.snapshot || !this.snapshot.tierId) {
            return;
        }
        this[NavigationMixin.Navigate]({
            type: 'standard__recordPage',
            attributes: {
                recordId: this.snapshot.tierId,
                objectApiName: 'LoyaltyTier',
                actionName: 'view'
            }
        });
    }
}
