import ky from 'ky';
import mitt from 'mitt';

const endpoint = {
  elementBase: 'content-element',
  element: (id: string) => `${endpoint.elementBase}/${id}`,
  resetElement: (id: string) => `${endpoint.element(id)}/reset-element`,
  setState: (id: string) => `${endpoint.element(id)}/set-state`,
  resetState: (id: string) => `${endpoint.element(id)}/reset-state`,
  getContexts: (id: string) => `${endpoint.element(id)}/state-contexts`,
  reportActivity: (id: string) => `${endpoint.element(id)}/activity`,
  generateContent: 'ai/generate',
};

export const getApiClient = (
  url: string,
  runtime: 'authoring' | 'delivery' = 'authoring',
) => {
  const api = ky.create({ prefixUrl: url, timeout: false });
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

  const generateContent = (context: string): Promise<any> =>
    api.post(endpoint.generateContent, { json: { context } }).json();

  return {
    getElement,
    updateElement,
    resetElement,
    setState,
    resetState,
    getContexts,
    reportUserActivity,
    generateContent,
  };
};

interface ServerEvent {
  type: string;
  entityId: string;
  payload: any;
}

const serverEventBus = mitt();
const getWsRoute = (serverRuntimeUrl: URL, elementId: string) => {
  const wsProtocol = serverRuntimeUrl.protocol === 'http:' ? 'ws:' : 'wss:';
  return `${wsProtocol}//${serverRuntimeUrl.host}?id=${elementId}`;
};

export const initWebSocket = (serverRuntimeUrl: URL, elementId: string) => {
  const ws = new WebSocket(getWsRoute(serverRuntimeUrl, elementId));
  ws.onmessage = (e) => {
    const { entityId, type, payload } = JSON.parse(e?.data) as ServerEvent;
    if (entityId !== elementId) return;
    serverEventBus.emit(type, payload);
  };
  ws.onclose = (e) => {
    const retryInterval = 3000; // 3 seconds
    const msg = `Connection closed. Retry in ${retryInterval / 1000}s...`;
    console.log(msg, e?.reason);
    setTimeout(() => initWebSocket(serverRuntimeUrl, elementId), retryInterval);
  };
  ws.onerror = () => {
    console.error('Socket encountered error, closing socket...');
    ws.close();
  };
  return serverEventBus;
};
