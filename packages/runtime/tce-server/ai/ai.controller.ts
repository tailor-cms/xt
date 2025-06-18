import AIService from './ai.service';

export default ({ aiSchema }) => {
  async function generate(req, res) {
    const data = await AIService?.generate(req.body.context, aiSchema);
    res.json({ data });
  }

  return {
    generate,
  };
};
