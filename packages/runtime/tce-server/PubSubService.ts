import { emitter } from './common/emitter';

class PubSubService {
  // ws connections
  private clients = {};
  private subscriptions = {};

  constructor() {
    const events = ['element:update', 'userState:update'];
    events.forEach((type) => {
      emitter.on(type, ({ entityId, data: payload }) => {
        const clients = this.getElementSubscriptions(entityId);
        console.log('Event:', type);
        console.log('Number of clients:', clients.length);
        console.log('Updated entity:', entityId);
        clients.forEach((conn) =>
          conn.send(JSON.stringify({ type, entityId, payload })),
        );
      });
    });
  }

  registerClient(sessionId, client) {
    if (!this.clients[sessionId]) this.clients[sessionId] = [];
    this.clients[sessionId].push(client);
    // Remove on close
    client.on('close', () => {
      const clients = this.clients[sessionId];
      this.clients[sessionId] = clients.filter((it) => it.id !== client.id);
    });
  }

  subscribe(elementId, sessionId) {
    if (!this.subscriptions[elementId]) this.subscriptions[elementId] = [];
    if (this.subscriptions[elementId].includes(sessionId)) return;
    this.subscriptions[elementId].push(sessionId);
  }

  getElementSubscriptions(elementId) {
    const sessionIds = this.subscriptions[elementId] || [];
    return sessionIds.reduce((acc, sessionId) => {
      console.log('Resolving client for sessionId:', sessionId);
      const clients = this.clients[sessionId] || [];
      return [...acc, ...clients];
    }, []);
  }
}

export default new PubSubService();
