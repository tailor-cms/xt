import pick from 'lodash/pick';

import ContentElementService from './ContentElementService';
import DisplayContextService from './DisplayContextService';
import { emitter } from '../common/emitter';
import { getTceConfig } from '../common/config';
import initHooks from './hooks';
import PubSubService from '../PubSubService';

export default ({ type, initState, hookMap }) => {
  const { applyFetchHooks, beforeDisplay, processInteraction } =
    initHooks(hookMap);

  async function get(req, res) {
    const defaults = { type, data: initState() };
    // Find or create session content element
    const element = await ContentElementService.findOrCreate(
      req.cookies.cekSid,
      defaults,
    );
    // Subscribe to content element and user state updates
    // Session id is used to identify proper ws connections
    PubSubService.subscribe(element.dataValues.id, req.cookies.cekSid);
    const processedElement = await applyFetchHooks(
      element,
      getTceConfig(process.env),
      req.query?.runtime || 'authoring',
    );
    const userState = await beforeDisplay(element);
    res.json({ element: processedElement, userState });
  }

  async function patch({ element, body }, res) {
    const inputData = pick(body, ['data', 'meta', 'refs']);
    const outputData = await element.update(inputData);
    res.json(outputData);
  }

  async function onUserInteraction({ element, body }, res) {
    const result = await processInteraction(element, body);
    if (!result?.updateDisplayState) return res.status(204).end();
    const contextExtensions = result.transientState
      ? { transientState: result.transientState }
      : {};
    const data = beforeDisplay(element, contextExtensions);
    emitter.emit('userState:update', { entityId: element.id, data });
    return res.json(data);
  }

  async function resetAuthoringState({ element }, res) {
    await element.update({ type, data: initState(), meta: {}, refs: {} });
    return res.status(200).end();
  }

  function resetUserStateContext({ element }, res) {
    DisplayContextService.resetContext(element.id);
    const data = beforeDisplay(element);
    emitter.emit('userState:update', { entityId: element.id, data });
    return res.status(200).end();
  }

  function getUserStateContexts({ element }, res) {
    res.json(DisplayContextService.getElementContexts(element.id));
  }

  function setUserStateContext(req, res) {
    const { element, body } = req;
    DisplayContextService.setCurrentContext(element.id, body.index);
    return get(req, res);
  }

  return {
    get,
    getUserStateContexts,
    patch,
    onUserInteraction,
    resetAuthoringState,
    resetUserStateContext,
    setUserStateContext,
  };
};
