import { LightningElement, api } from 'lwc';

const TRANSITION_OPTIONS = [
    { label: 'After grace period ends', value: 'afterGrace' },
    { label: 'After final payment retry fails', value: 'afterRetries' },
    { label: 'Manual transition only', value: 'manual' }
];

export default class MembershipSetupGraceAutomation extends LightningElement {
    @api billing = {};

    transitionOptions = TRANSITION_OPTIONS;

    get defaultGraceDays() {
        return this.billing.defaultGraceDays ?? 30;
    }
    get maxFailedPaymentRetries() {
        return this.billing.maxFailedPaymentRetries ?? 3;
    }
    get retryIntervalDays() {
        return this.billing.retryIntervalDays ?? 7;
    }
    get autoCancelAfterLapsedDays() {
        return this.billing.autoCancelAfterLapsedDays ?? 365;
    }
    get transitionToLapsed() {
        return this.billing.transitionToLapsed || 'afterGrace';
    }
    get autoTransitions() {
        return this.billing.autoTransitions !== false;
    }
    get autoPaymentRetry() {
        return this.billing.autoPaymentRetry !== false;
    }
    get emailOnGrace() {
        return this.billing.emailOnGrace !== false;
    }
    get emailOnLapsed() {
        return this.billing.emailOnLapsed !== false;
    }
    get revokeOnLapse() {
        return Boolean(this.billing.revokeOnLapse);
    }

    handleGraceDays(event) {
        this.dispatch('defaultGraceDays', event.target.value);
    }
    handleMaxRetries(event) {
        this.dispatch('maxFailedPaymentRetries', event.target.value);
    }
    handleRetryInterval(event) {
        this.dispatch('retryIntervalDays', event.target.value);
    }
    handleTransition(event) {
        this.dispatch('transitionToLapsed', event.detail.value);
    }
    handleAutoCancel(event) {
        this.dispatch('autoCancelAfterLapsedDays', event.target.value);
    }
    handleAutoTransitions(event) {
        this.dispatch('autoTransitions', event.target.checked);
    }
    handleEmailGrace(event) {
        this.dispatch('emailOnGrace', event.target.checked);
    }
    handleEmailLapsed(event) {
        this.dispatch('emailOnLapsed', event.target.checked);
    }
    handleRevoke(event) {
        this.dispatch('revokeOnLapse', event.target.checked);
    }

    dispatch(field, value) {
        this.dispatchEvent(
            new CustomEvent('fieldchange', {
                bubbles: true,
                composed: true,
                detail: { field, value }
            })
        );
    }
}
