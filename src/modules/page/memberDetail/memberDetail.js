import { LightningElement } from 'lwc';
import { getCurrentRoute } from '../../../router';
import { getMemberById, MEMBERS } from 'data/members';

export default class MemberDetail extends LightningElement {
    get member() {
        const route = getCurrentRoute();
        return getMemberById(route?.params?.id) ?? MEMBERS[0];
    }
}
