import OpenAI from 'openai';

import { ai as aiConfig } from '../config';
import { AiPrompt } from './AiPrompt';

class AiService {
  #openai;

  constructor() {
    this.#openai = new OpenAI({ apiKey: aiConfig.secretKey });
  }

  generate(context: string, aiSchema: any) {
    const prompt = new AiPrompt(this.#openai, context, aiSchema);
    return prompt.execute();
  }
}

export default aiConfig.secretKey ? new AiService() : undefined;
