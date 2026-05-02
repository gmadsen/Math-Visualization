// AJV-2020 instance factory — used by validate-schema, validate-widget-params,
// and test-widget-renderers. Three callers each duplicated the import + setup;
// consolidating here keeps `addFormats` defensiveness and option defaults in
// one place.

import Ajv2020 from 'ajv/dist/2020.js';
import addFormats from 'ajv-formats';

// Returns a fresh AJV-2020 instance with `ajv-formats` registered. Default
// options match `validate-schema.mjs`'s historical configuration
// (`allErrors: true, strict: true`); override per-caller as needed.
//
// `addFormats` ships as either a default export or a namespace depending on
// node + bundler interop; handle both. Pinning the import shape here means
// callers don't repeat the dance.
export function makeAjv(opts = {}) {
  const ajv = new Ajv2020({ allErrors: true, strict: true, ...opts });
  const af = addFormats.default || addFormats;
  af(ajv);
  return ajv;
}
