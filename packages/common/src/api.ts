import ky from 'ky';

const endpoint = {
  base: 'content-element',
  element: (id: string) => `${endpoint.base}/${id}`,
  resetElement: (id: string) => `${endpoint.element(id)}/reset-element`,
  setState: (id: string) => `${endpoint.element(id)}/set-state`,
  resetState: (id: string) => `${endpoint.element(id)}/reset-state`,
  getContexts: (id: string) => `${endpoint.element(id)}/state-contexts`,
  reportActivity: (id: string) => `${endpoint.element(id)}/activity`,
};

export const getApiClient = (
  url: string,
  runtime: 'authoring' | 'delivery' = 'authoring',
) => {
  const api = ky.create({ prefixUrl: url });
  const opts = { searchParams: { runtime } };

  const getElement = (id: string): Promise<any> =>
    api(endpoint.element(id), opts).json();

  const updateElement = (id: string, data: any): Promise<any> =>
    api.patch(endpoint.element(id), { json: data }).json();

  const setState = (id: string, index: number): Promise<any> =>
    api.post(endpoint.setState(id), { json: { index } });

  const resetState = (id: string): Promise<any> =>
    api.post(endpoint.resetState(id));

  const resetElement = (id: string): Promise<any> =>
    api.post(endpoint.resetElement(id));

  const getContexts = (id: string): Promise<any> =>
    api(endpoint.getContexts(id)).json();

  const reportUserActivity = (id: string, data: any): Promise<any> =>
    api.post(endpoint.reportActivity(id), { json: data });

  return {
    getElement,
    updateElement,
    resetElement,
    setState,
    resetState,
    getContexts,
    reportUserActivity,
  };
};

export const getWsRoute = (serverRuntimeUrl: URL, elementId: string) => {
  const wsProtocol = serverRuntimeUrl.protocol === 'http:' ? 'ws:' : 'wss:';
  return `${wsProtocol}//${serverRuntimeUrl.host}?id=${elementId}`;
};

export const initWebSocket = (serverRuntimeUrl: URL, elementId: string) => {
  return new WebSocket(getWsRoute(serverRuntimeUrl, elementId));
};
