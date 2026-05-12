/**
 * Local Vite shim for `lightning/platformShowToastEvent`.
 * In an org runtime, ShowToastEvent surfaces a toast in the global notification region.
 * In the local prototype there is no notification region, so this dispatches a
 * standard CustomEvent that bubbles to window for visibility, and logs to console
 * so designers can confirm wizard actions fired.
 */
export class ShowToastEvent extends CustomEvent {
    constructor(detail = {}) {
        super('lightning__showtoast', {
            bubbles: true,
            composed: true,
            cancelable: false,
            detail
        });
        if (typeof console !== 'undefined') {
            const { title, message, variant } = detail;
            console.info(
                `[toast:${variant ?? 'info'}] ${title ?? ''}${
                    message ? ' — ' + message : ''
                }`
            );
        }
    }
}
