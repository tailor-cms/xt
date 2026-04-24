import { ApiClient, type EndpointResponse, formatResponse } from './ApiClient';

export interface InitConfig {
  isGradable?: boolean;
  [key: string]: unknown;
}

class ElementClient extends ApiClient {
  constructor() {
    super('/content-element/');
  }

  async reset(id: string, config?: InitConfig): Promise<EndpointResponse> {
    const request = await this.getClient();
    const res = await request.post(this.getUrl(`${id}/reset-element`), {
      data: config,
    });
    return formatResponse(res);
  }

  async setState(id: string, index: number): Promise<EndpointResponse> {
    const request = await this.getClient();
    const res = await request.post(this.getUrl(`${id}/set-state`), {
      data: { index },
    });
    return formatResponse(res);
  }

  async resetState(id: string): Promise<EndpointResponse> {
    const request = await this.getClient();
    const res = await request.post(this.getUrl(`${id}/reset-state`));
    return formatResponse(res);
  }
}

export const elementClient: ElementClient = new ElementClient();
