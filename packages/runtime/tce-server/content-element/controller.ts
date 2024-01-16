import pick from 'lodash/pick';

import ContentElement from './model';
import { emitter } from '../common/emitter';
import { getTceConfig } from '../common/config';
import initHooks from './hooks';

export default ({ type, initState, hookMap, mocks }) => {
  const { applyFetchHooks, beforeDisplay, processInteraction } = initHooks(
    hookMap,
    mocks,
  );

  async function get(req, res) {
    const defaults = { type, data: initState() };
    // NOTE: findOrCreate has issues with SQLite (transactions)
    let element = await ContentElement.findOne({ where: { type } });
    if (!element) element = await ContentElement.create(defaults);
    const processedElement = await applyFetchHooks(
      element,
      getTceConfig(process.env),
      req.query?.runtime || 'authoring',
    );
    const userState = await beforeDisplay(element);
    res.json({ element: processedElement, userState });
  }

  async function create(req, res) {
    const element = await ContentElement.create(req.body);
    res.json(element);
  }

  async function patch(req, res) {
    const payload = pick(req.body, ['data', 'meta', 'refs']);
    const element = await req.element.update(payload);
    res.json(element);
  }

  async function onUserInteraction(req, res) {
    const result = await processInteraction(req.element, req.body);
    if (!result?.updateDisplayState) return res.status(204).end();
    const contextExtensions = result.transientState
      ? { transientState: result.transientState }
      : {};
    const displayState = beforeDisplay(req.element, contextExtensions);
    emitter.emit('userState:update', displayState);
    return res.json(displayState);
  }

  return { get, create, patch, onUserInteraction };
};
