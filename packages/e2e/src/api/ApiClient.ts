import {
  type APIRequestContext,
  type APIResponse,
  request,
} from '@playwright/test';

const BASE_URL = process.env.SERVER_RUNTIME_URL || 'http://localhost:8030';

export interface EndpointResponse {
  status: number;
  data?: any;
}

export const formatResponse = async (
  res: APIResponse,
): Promise<EndpointResponse> => {
  const body = (await res.text()) ? await res.json() : null;
  return { status: res.status(), data: body?.data || body };
};

export class ApiClient {
  private static request: APIRequestContext;
  private static initialize: Promise<void> | null = null;
  private endpointURL: URL;

  constructor(endpointPath: string) {
    this.endpointURL = new URL(endpointPath, BASE_URL);
    if (ApiClient.initialize === null) ApiClient.initialize = this.init();
  }

  private async init() {
    ApiClient.request = await request.newContext({ baseURL: BASE_URL });
  }

  protected async getClient() {
    await ApiClient.initialize;
    return ApiClient.request;
  }

  protected getUrl = (path = '') => new URL(path, this.endpointURL).toString();

  async get(id: string) {
    const request = await this.getClient();
    const res = await request.get(this.getUrl(id));
    return formatResponse(res);
  }

  async update(id: string, data: Record<string, unknown>) {
    const request = await this.getClient();
    const res = await request.patch(this.getUrl(id), { data: { data } });
    return formatResponse(res);
  }
}
