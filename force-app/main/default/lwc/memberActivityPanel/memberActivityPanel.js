import { LightningElement, api } from 'lwc';

const TYPE_TO_ICON = {
    joined: 'standard:contract',
    renewed: 'standard:contract_payment',
    upgrade: 'standard:trending',
    downgrade: 'standard:trending',
    lapsed: 'standard:cancel_checkout',
    reactivated: 'standard:contract_payment',
    payment: 'standard:billing',
    event: 'standard:event',
    email: 'standard:email',
    call: 'standard:log_a_call',
    task: 'standard:task',
    note: 'standard:note',
    general: 'standard:event',
};

export default class MemberActivityPanel extends LightningElement {
    @api title = 'Activity';
    @api iconName = 'standard:event';
    @api emptyMessage = 'No activity recorded.';
    @api events = [];

    get hasEvents() {
        return Array.isArray(this.events) && this.events.length > 0;
    }

    get displayEvents() {
        if (!this.hasEvents) {
            return [];
        }
        const list = this.events;
        return list.map((event, index) => {
            const type = String(event.type ?? 'general').toLowerCase();
            const itemClass = `mlap-item${index === list.length - 1 ? ' mlap-item--last' : ''}`;
            return {
                ...event,
                title: event.title ?? event.label ?? '—',
                resolvedIcon: event.iconName ?? TYPE_TO_ICON[type] ?? TYPE_TO_ICON.general,
                itemClass,
                hasDescription: Boolean(event.description),
                hasDate: Boolean(event.date),
            };
        });
    }
}
