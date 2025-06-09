export const Schema = {
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
  Response should be a JSON object with the following properties:
  {
    "description": "",
    "count": 0
  },
  where:
  - 'description' is the counter description
  - 'count' is the number representing counter value
`;

export default {
  getPrompt,
  Schema,
  processResponse: (val: any) => val,
};
