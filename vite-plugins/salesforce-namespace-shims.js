/**
 * Vite plugin for resolving `@salesforce/*` namespace imports during local
 * development. The Salesforce platform exposes these as virtual modules:
 *
 *   `@salesforce/schema/Object.Field`  → string identifier passed to wire adapters
 *   `@salesforce/apex/ClassName.method` → wire adapter that invokes the Apex method
 *
 * Locally there is no platform, so we synthesize equivalents that allow the
 * components to compile and render placeholder UI without crashing.
 */

const SCHEMA_PREFIX = '@salesforce/schema/';
const APEX_PREFIX = '@salesforce/apex/';
const VIRTUAL_PREFIX = '\0sf-shim:';

export function resolveSalesforceNamespaceShimsPlugin() {
    return {
        name: 'resolve-salesforce-namespace-shims',
        resolveId(source) {
            if (
                source.startsWith(SCHEMA_PREFIX) ||
                source.startsWith(APEX_PREFIX)
            ) {
                return VIRTUAL_PREFIX + source;
            }
            return null;
        },
        load(id) {
            if (!id.startsWith(VIRTUAL_PREFIX)) return null;
            const original = id.slice(VIRTUAL_PREFIX.length);

            if (original.startsWith(SCHEMA_PREFIX)) {
                const fieldPath = original.slice(SCHEMA_PREFIX.length);
                return `export default ${JSON.stringify(fieldPath)};\n`;
            }

            if (original.startsWith(APEX_PREFIX)) {
                // Apex methods imported via `@salesforce/apex/X.y` can be
                // used as wire adapters or called imperatively. Locally we
                // export a no-op wire adapter class; imperative call sites
                // that use Apex (none today in this repo) would need to be
                // handled separately.
                return [
                    `class NoopApexAdapter {`,
                    `  constructor(cb) { this._cb = cb; }`,
                    `  connect() { try { this._cb({ data: undefined, error: undefined }); } catch (e) {} }`,
                    `  update() {}`,
                    `  disconnect() {}`,
                    `}`,
                    `export default NoopApexAdapter;`
                ].join('\n');
            }

            return null;
        }
    };
}
