/**
 * Local Vite shim for `force/navigation`. Salesforce's `lightning/navigation`
 * LBC re-exports these symbols from this internal module. The org runtime
 * provides them; locally we expose no-op equivalents so components that mix
 * in `NavigationMixin` or wire `CurrentPageReference` can compile and render.
 */
import { createNoopWireAdapter } from './lwcWireNoop.js';

export const CurrentPageReference = createNoopWireAdapter();

const NAVIGATE = Symbol('Navigate');
const GENERATE_URL = Symbol('GenerateUrl');

export function NavigationMixin(Base) {
    return class NavigationMixinExtended extends Base {
        [NAVIGATE](_pageReference, _replace) {
            // local no-op
        }
        [GENERATE_URL](_pageReference) {
            return Promise.resolve('#');
        }
    };
}
NavigationMixin.Navigate = NAVIGATE;
NavigationMixin.GenerateUrl = GENERATE_URL;
