import { LightningElement, api } from 'lwc';

const PAYMENT_METHOD_OPTIONS = [
    { label: 'Credit / Debit Card', value: 'creditCard' },
    { label: 'ACH / Bank Transfer', value: 'ach' },
    { label: 'PayPal', value: 'paypal' },
    { label: 'Apple Pay', value: 'applePay' },
    { label: 'Google Pay', value: 'googlePay' },
    { label: 'Check (Offline)', value: 'check' }
];

export default class MembershipSetupPaymentMethods extends LightningElement {
    @api billing = {};

    paymentMethodOptions = PAYMENT_METHOD_OPTIONS;

    get paymentMethods() {
        return this.billing.paymentMethods || [];
    }
    get mixedCart() {
        return Boolean(this.billing.mixedCart);
    }
    get zeroCheckout() {
        return Boolean(this.billing.zeroCheckout);
    }
    get installments() {
        return Boolean(this.billing.installments);
    }

    handleMethodsChange(event) {
        this.dispatch('paymentMethods', event.detail.value);
    }
    handleMixedCart(event) {
        this.dispatch('mixedCart', event.target.checked);
    }
    handleZeroCheckout(event) {
        this.dispatch('zeroCheckout', event.target.checked);
    }
    handleInstallments(event) {
        this.dispatch('installments', event.target.checked);
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
