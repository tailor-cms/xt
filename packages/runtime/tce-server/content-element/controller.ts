import { pick } from 'lodash-es';

import DisplayContextService from './DisplayContextService';
import { emitter } from '../common/emitter';
import { getTceConfig } from '../common/config';
import initHooks from './hooks';

export default ({ type, initState, hookMap }) => {
  const { applyFetchHooks, beforeDisplay, processInteraction } =
    initHooks(hookMap);

  async function get(req, res) {
    const { element } = req;
    const processedElement = await applyFetchHooks(
      element,
      getTceConfig(process.env),
      req.query?.runtime || 'authoring',
    );
    const userState = await beforeDisplay(processedElement);
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
    emitter.emit('userState:update', { entityId: element.uid, data });
    return res.json(data);
  }

  async function resetAuthoringState({ element }, res) {
    await element.update({ type, data: initState(), meta: {}, refs: {} });
    return res.status(200).end();
  }

  function resetUserStateContext({ element }, res) {
    DisplayContextService.resetContext(element.uid);
    const data = beforeDisplay(element);
    emitter.emit('userState:update', { entityId: element.uid, data });
    return res.status(200).end();
  }

  function getUserStateContexts({ element }, res) {
    const { uid } = element;
    res.json({
      contexts: DisplayContextService.getElementContexts(uid),
      currentContextIndex: DisplayContextService.getCurrentContextIndex(uid),
    });
  }

  function setUserStateContext(req, res) {
    const { element, body } = req;
    DisplayContextService.setCurrentContext(element.uid, body.index);
    emitter.emit('userContext:change', {
      entityId: element.uid,
      data: { index: body.index },
    });
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
