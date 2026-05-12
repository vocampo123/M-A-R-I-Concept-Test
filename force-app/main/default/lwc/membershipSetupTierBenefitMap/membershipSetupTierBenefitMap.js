import { LightningElement, api } from 'lwc';

export default class MembershipSetupTierBenefitMap extends LightningElement {
    @api tiers = [];
    @api benefits = [];
    @api map = [];

    get hasData() {
        return this.tiers.length > 0 && this.benefits.length > 0;
    }

    get rows() {
        return this.benefits.map((benefit) => {
            const cells = this.tiers.map((tier) => {
                const entry = this.map.find(
                    (m) => m.tierId === tier.id && m.benefitId === benefit.id
                );
                const included = !!entry?.included;
                return {
                    key: `${benefit.id}__${tier.id}`,
                    tierId: tier.id,
                    benefitId: benefit.id,
                    included,
                    cellClass: included
                        ? 'msp-tbm__cell msp-tbm__cell_included'
                        : 'msp-tbm__cell'
                };
            });
            return {
                benefitId: benefit.id,
                benefitName: benefit.name,
                benefitType: benefit.type,
                cells
            };
        });
    }

    get headerCells() {
        return this.tiers.map((t) => ({
            id: t.id,
            name: t.name,
            type: t.type
        }));
    }

    handleToggle(event) {
        const tierId = event.target.dataset.tier;
        const benefitId = event.target.dataset.benefit;
        const checked = event.target.checked;
        if (!tierId || !benefitId) return;

        const exists = this.map.find(
            (m) => m.tierId === tierId && m.benefitId === benefitId
        );

        let next;
        if (exists) {
            next = this.map.map((m) =>
                m.tierId === tierId && m.benefitId === benefitId
                    ? { ...m, included: checked }
                    : m
            );
        } else {
            next = [
                ...this.map,
                { tierId, benefitId, included: checked, cap: null }
            ];
        }

        this.dispatchEvent(
            new CustomEvent('mapchange', {
                bubbles: true,
                composed: true,
                detail: { map: next }
            })
        );
    }
}
