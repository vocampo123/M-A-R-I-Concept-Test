/**
 * Local Vite shim for `lightning/platformWorkspaceApi`. In an org runtime this
 * module provides console/workspace APIs (subtab management, console nav).
 * The local prototype isn't a console runtime, so we expose no-ops.
 */
import { createNoopWireAdapter } from './lwcWireNoop.js';

export const IsConsoleNavigation = createNoopWireAdapter();
export const EnclosingTabId = createNoopWireAdapter();

export function openTab(_options) {
    return Promise.resolve(null);
}
export function openSubtab(_options) {
    return Promise.resolve(null);
}
export function closeTab(_tabId) {
    return Promise.resolve();
}
export function focusTab(_tabId) {
    return Promise.resolve();
}
export function getTabInfo(_tabId) {
    return Promise.resolve(null);
}
export function getAllTabInfo() {
    return Promise.resolve([]);
}
export function getFocusedTabInfo() {
    return Promise.resolve(null);
}
export function refreshTab(_tabId) {
    return Promise.resolve();
}
