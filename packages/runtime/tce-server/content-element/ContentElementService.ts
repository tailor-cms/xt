import ContentElement from './model';

class ContentElementService {
  // Stores content element used for particular user session
  // Keyed by sessionId
  private entityBySessionId = {};

  async findOrCreate(sessionId, defaults) {
    if (this.entityBySessionId[sessionId]) {
      const entity = await this.entityBySessionId[sessionId];
      await entity.reload();
      return entity;
    }
    this.entityBySessionId[sessionId] = await ContentElement.create(defaults);
    return this.entityBySessionId[sessionId];
  }
}

export default new ContentElementService();
