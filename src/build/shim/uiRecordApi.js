/**
 * Local Vite shim for `lightning/uiRecordApi`. In an org runtime this module
 * provides record-data wire adapters and helpers. Locally we expose no-ops
 * so components that import it can compile and render placeholder content.
 */
import { createNoopWireAdapter } from './lwcWireNoop.js';

export const getRecord = createNoopWireAdapter();
export const getRecordCreateDefaults = createNoopWireAdapter();
export const getRecordUi = createNoopWireAdapter();

export function getFieldValue(_record, _field) {
    return undefined;
}

export function getFieldDisplayValue(_record, _field) {
    return undefined;
}

export function getRecordNotifyChange(_recordIds) {
    // local no-op
}

export function createRecord(_recordInput) {
    return Promise.resolve({ id: null, fields: {} });
}

export function updateRecord(_recordInput) {
    return Promise.resolve({ id: null, fields: {} });
}

export function deleteRecord(_recordId) {
    return Promise.resolve();
}
