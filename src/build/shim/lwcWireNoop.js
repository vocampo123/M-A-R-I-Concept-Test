/**
 * Local Vite shim helper. Returns a no-op wire adapter class that satisfies
 * the LWC `@wire` contract without ever emitting data. Components decorated
 * with `@wire(...)` will run their callback once with `{ data: undefined,
 * error: undefined }` so they fall back to whatever placeholder/default
 * state they already render when the org wire returns nothing.
 */
export function createNoopWireAdapter() {
    return class NoopWireAdapter {
        constructor(dataCallback) {
            this._cb = dataCallback;
        }
        connect() {
            try {
                this._cb({ data: undefined, error: undefined });
            } catch (e) {
                // swallow — local-only shim, never crash the component
            }
        }
        update() {}
        disconnect() {}
    };
}
