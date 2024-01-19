import ContentElement from './model';

class ContentElementService {
  // Stores content element used for particular user session
  // Keyed by sessionId
  private sessionEntity;

  constructor() {
    this.sessionEntity = {};
  }

  async getElement(sid, defaults) {
    if (this.sessionEntity[sid]) {
      const entity = await this.sessionEntity[sid];
      await entity.reload();
      return entity;
    }
    this.sessionEntity[sid] = await ContentElement.create(defaults);
    return this.sessionEntity[sid];
  }
}

export default new ContentElementService();
