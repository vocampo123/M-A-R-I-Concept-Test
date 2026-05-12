import { LightningElement, api } from 'lwc';

export default class MemberProfileSummary extends LightningElement {
    @api name = '';
    @api subtitle = '';
    @api avatarUrl = '';
    @api avatarFallbackIcon = 'standard:person_account';
    @api fields = [];

    get hasFields() {
        return Array.isArray(this.fields) && this.fields.length > 0;
    }

    get initials() {
        if (!this.name) {
            return '';
        }
        return String(this.name)
            .split(/\s+/)
            .filter(Boolean)
            .slice(0, 2)
            .map((part) => part.charAt(0).toUpperCase())
            .join('');
    }

    get displayFields() {
        if (!this.hasFields) {
            return [];
        }
        return this.fields.map((field, index) => ({
            ...field,
            id: field.id ?? `mps-field-${index}`,
            hasIcon: Boolean(field.icon),
        }));
    }
}
