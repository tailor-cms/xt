import { emitter } from './common/emitter';

class PubSubService {
  // websocket connections
  private connections = {};

  constructor() {
    const events = ['element:update', 'userState:update', 'userContext:change'];
    events.forEach((type) => {
      emitter.on(type, ({ entityId, data: payload }) => {
        const connections = this.connections[entityId] || [];
        connections.forEach((conn) =>
          conn.send(JSON.stringify({ type, entityId, payload })),
        );
      });
    });
  }

  subscribe(entityId, client) {
    if (!this.connections[entityId]) this.connections[entityId] = [];
    this.connections[entityId].push(client);
    // Remove on close
    client.on('close', () => {
      const connections = this.connections[entityId];
      this.connections[entityId] = connections.filter(
        (it) => it.id !== client.id,
      );
    });
  }
}

export default new PubSubService();
