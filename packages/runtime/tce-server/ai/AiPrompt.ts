import type { OpenAI } from 'openai';

import { ai as aiConfig } from '../config';

const systemPrompt = `
  Assistant is a bot desinged to help authors to create content elements
  Rules:
  - Use the User rules to generate the content
  - Generated content should have a friendly tone and be easy to understand
  - Generated content should not include any offensive language`;

export class AiPrompt {
  private client: OpenAI;
  private context: string;
  private response: any;
  private format: OpenAI.Responses.ResponseFormatTextConfig;
  private schemaDescription: string;
  private responseProcessor: (val: string) => any;

  constructor(client: OpenAI, context: string, aiSchema: any) {
    this.client = client;
    this.context = context;
    this.format = aiSchema?.Schema;
    this.schemaDescription = aiSchema?.getPrompt();
    this.responseProcessor = aiSchema?.processResponse;
  }

  async execute() {
    try {
      const response = await this.client.responses.create({
        model: aiConfig.modelId,
        input: this.toOpenAiInput(),
        text: { format: this.format },
      } as OpenAI.Responses.ResponseCreateParamsNonStreaming);
      this.response = this.responseProcessor(JSON.parse(response.output_text));
      return this.response;
    } catch {}
  }

  toOpenAiInput(): OpenAI.Responses.ResponseInputItem[] {
    const userInput = `The user asked to create the data for the content
      element. ${this.schemaDescription}`;
    return [
      { role: 'developer', content: systemPrompt },
      { role: 'developer', content: this.context },
      { role: 'user', content: userInput },
    ];
  }
}
