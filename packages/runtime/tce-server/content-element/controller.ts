import pick from 'lodash/pick';

import ContentElement from './model';
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
    const element = await ContentElementService.getElement(
      req.cookies.cekSid,
      defaults,
    );
    PubSubService.subscribe(element.dataValues.id, req.cookies.cekSid);
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
    const data = beforeDisplay(req.element, contextExtensions);
    emitter.emit('userState:update', { entityId: req.element.id, data });
    return res.json(data);
  }

  async function resetAuthoringState(req, res) {
    const { element } = req;
    await element.update({ type, data: initState(), meta: {}, refs: {} });
    DisplayContextService.resetContext(element.id, 0);
    return get(req, res);
  }

  async function resetUserStateContext(req, res) {
    DisplayContextService.resetContext(req.element.id);
    const displayState = beforeDisplay(req.element);
    emitter.emit('userState:update', {
      entityId: req.element.id,
      data: displayState,
    });
    return get(req, res);
  }

  function getUserStateContexts(_req, res) {
    res.json(DisplayContextService.getContexts());
  }

  function setUserStateContext(req, res) {
    DisplayContextService.setCurrentContext(req.element.id, req.body.index);
    return get(req, res);
  }

  return {
    get,
    getUserStateContexts,
    create,
    patch,
    onUserInteraction,
    resetAuthoringState,
    resetUserStateContext,
    setUserStateContext,
  };
};
