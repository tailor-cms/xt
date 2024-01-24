import ContentElement from './model';

class ContentElementService {
  async findOrCreate(uid, defaults) {
    // Due to issue with hooks, we need to use findOne instead of findOrCreate
    const element = await ContentElement.findOne({ where: { uid } });
    if (element) return element;
    return ContentElement.create({ uid, ...defaults });
  }
}

export default new ContentElementService();
