import type { OpenAISchema } from '@tailor-cms/cek-common';

import type {
  DataInitializer,
  ElementData,
  ElementManifest,
} from './interfaces';

// Element unique id within the target system (e.g. Tailor)
export const type = 'ACME_TCE_COUNTER';

// Display name (e.g. shown to the author)
export const name = 'Simple Counter';

// Function which inits element state (data property on the Content Element
// entity)
export const initState: DataInitializer = (): ElementData => ({
  count: 0,
  description: '',
});

// Can be loaded from package.json
export const version = '1.0';

// UI configuration for Tailor CMS
const ui = {
  // Display icon, https://pictogrammers.com/library/mdi/
  icon: 'mdi-cube',
  // Does element support only full width or can be used within layouts
  // (e.g. 50/50 layout)
  forceFullWidth: true,
};

export const mocks = {
  displayContexts: [
    { name: 'Test preset 1', data: { state: 'I have a value' } },
    { name: 'Test preset 2', data: { state: 'I have a different value' } },
  ],
};

export const ai = {
  Schema: {
    type: 'json_schema',
    name: 'ce_counter',
    schema: {
      type: 'object',
      properties: {
        count: { type: 'number' },
        description: { type: 'string' },
      },
      required: ['count', 'description'],
      additionalProperties: false,
    },
  } as OpenAISchema,
  getPrompt: () => `
    Generate counter content element as an object with the following
    properties: { "description": "", "count": 0 }.
    Where:
    - 'description' is the counter description
    - 'count' is the number representing counter value
  `,
  processResponse: (val: any) => val,
};

const manifest: ElementManifest = {
  type,
  version: '1.0',
  name,
  initState,
  ui,
  mocks,
  ai,
};

export default manifest;
export * from './interfaces';
