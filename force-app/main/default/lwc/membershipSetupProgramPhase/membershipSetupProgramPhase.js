import { LightningElement, api } from 'lwc';

export default class MembershipSetupProgramPhase extends LightningElement {
    @api program = {};

    get programName() {
        return this.program.name || '';
    }
    get programDescription() {
        return this.program.description || '';
    }

    handleNameChange(event) {
        this.dispatch('name', event.target.value);
    }
    handleDescriptionChange(event) {
        this.dispatch('description', event.target.value);
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
