import pick from 'lodash/pick';

import ContentElement from './model';
import DisplayContextService from './DisplayContextService';
import { emitter } from '../common/emitter';
import { getTceConfig } from '../common/config';
import initHooks from './hooks';

export default ({ type, initState, hookMap }) => {
  const { applyFetchHooks, beforeDisplay, processInteraction } =
    initHooks(hookMap);

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

  async function resetAuthoringState(req, res) {
    const { element } = req;
    await element.update({ type, data: initState(), meta: {}, refs: {} });
    DisplayContextService.resetContext();
    return get(req, res);
  }

  async function resetUserStateContext(req, res) {
    DisplayContextService.resetContext();
    return get(req, res);
  }

  async function setUserStateContext(req, res) {
    DisplayContextService.setCurrentContext(req.body.index);
    return get(req, res);
  }

  return {
    get,
    create,
    patch,
    onUserInteraction,
    resetAuthoringState,
    resetUserStateContext,
    setUserStateContext,
  };
};
