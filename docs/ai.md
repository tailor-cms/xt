# Artificial intelligence

Tailor enables content generation using artificial intelligence. To leverage AI
for a specific content element type, its package must define an AI configuration
in the manifest. This configuration specifies the schema, prompt, and response
processor for the AI model.

## Configuration

AI configuration is defined by the following:

- `Schema`: Defines the expected structure of the AI-generated content using
  JSON Schema. This ensures the AI output matches the required format.
- `getPrompt`: Provides a prompt template that guides the AI in generating the
  desired content.
- `processResponse`: Handles the AI response, allowing for custom
  post-processing if needed.

Here is an example configuration for a counter element:

```ts
import { OpenAISchema } from '@tailor-cms/cek-common';

export const Schema: OpenAISchema = {
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
};

export const getPrompt = () => `
  Generate a counter content element as an object with the following properties:
  {
    "description": "",
    "count": 0
  },
  where:
  - 'description' is the counter description
  - 'count' is the number representing the counter value
`;

const ai = {
  getPrompt,
  Schema,
  processResponse: (val: any) => val,
};
```

## CEK Content Generation

The framework also provides an option to preview AI functionality inside the
content element kit by setting the `AI_UI_ENABLED`, `AI_MODEL_ID`, and
`AI_SECRET_KEY` environment variables.

When these variables are set, a `Do the Magic` button will be available for
content generation. In the CEK settings, users can also set additional context
for AI generation.
