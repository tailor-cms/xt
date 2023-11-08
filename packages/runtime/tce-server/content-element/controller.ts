import ContentElement from './model';
import { getTceConfig } from '../common/config';
import initHooks from './hooks';

export default ({ type, initState, hookMap, mocks }) => {
  const { applyFetchHooks, processInteraction } = initHooks(hookMap, mocks);

  async function get(req, res) {
    const defaults = { type, data: initState() };
    // NOTE: findOrCreate has issues with SQLite (transactions)
    let element = await ContentElement.findOne({ where: { type } });
    if (!element) element = await ContentElement.create(defaults);
    res.json(
      await applyFetchHooks(
        element,
        getTceConfig(process.env),
        req.query?.runtime || 'authoring',
      ),
    );
  }

  async function create(req, res) {
    const element = await ContentElement.create(req.body);
    res.json(element);
  }

  async function patch(req, res) {
    const element = await req.element.update({ data: req.body.data });
    res.json(element);
  }

  async function onUserInteraction(req, res) {
    const result = await processInteraction(req.element, req.body);
    if (!result?.updateDisplayState) return res.status(204).end();
    const displayState = await applyFetchHooks(
      req.element,
      getTceConfig(process.env),
      'delivery',
    );
    return res.json(displayState);
  }

  return { get, create, patch, onUserInteraction };
};
