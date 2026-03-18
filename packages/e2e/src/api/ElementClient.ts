import { ApiClient, formatResponse } from './ApiClient';

class ElementClient extends ApiClient {
  constructor() {
    super('/content-element/');
  }

  async reset(id: string) {
    const request = await this.getClient();
    const res = await request.post(this.getUrl(`${id}/reset-element`));
    return formatResponse(res);
  }
}

export default new ElementClient();
