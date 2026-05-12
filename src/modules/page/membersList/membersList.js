import { LightningElement } from 'lwc';
import { navigate } from '../../../router';

export default class MembersList extends LightningElement {
    handleMemberRowAction(event) {
        const { name } = event.detail.action;
        const { id } = event.detail.row;
        if (name === 'view') {
            navigate(`/members/${id}`);
        }
    }
}
