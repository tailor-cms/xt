import ELEMENT_HOOKS from './hook-type.js';
import { emitter } from '../common/emitter.js';

function prepareHookServices(tce) {
  return {
    config: { tce },
  };
}

export default function initHooks(hooks) {
  // If plain object, convert to map
  const hooksMap = hooks?.has ? hooks : new Map(hooks);

  function registerHook(element, hookName, tceConfig) {
    const hook = hooksMap.get(hookName);
    return hook(element, prepareHookServices(tceConfig));
  }

  function registerSocketUpdate(element) {
    emitter.emit('element:update', element);
    return element;
  }

  function registerSaveHooks(elementModel, tceConfig) {
    function register(hookName) {
      return (element) => registerHook(element, hookName, tceConfig);
    }

    if (hooksMap.has(ELEMENT_HOOKS.BEFORE_SAVE)) {
      elementModel.addHook('beforeCreate', register(ELEMENT_HOOKS.BEFORE_SAVE));
      elementModel.addHook('beforeUpdate', register(ELEMENT_HOOKS.BEFORE_SAVE));
    }

    if (hooksMap.has(ELEMENT_HOOKS.AFTER_SAVE)) {
      elementModel.addHook('afterCreate', register(ELEMENT_HOOKS.AFTER_SAVE));
      elementModel.addHook('afterUpdate', register(ELEMENT_HOOKS.AFTER_SAVE));
    }

    if (hooksMap.has(ELEMENT_HOOKS.AFTER_LOADED)) {
      elementModel.addHook('afterCreate', register(ELEMENT_HOOKS.AFTER_LOADED));
      elementModel.addHook('afterUpdate', register(ELEMENT_HOOKS.AFTER_LOADED));
    }

    elementModel.addHook('afterUpdate', registerSocketUpdate);
  }

  async function applyFetchHooks(element, tceConfig) {
    const services = prepareHookServices(tceConfig);
    let elementAfterHook = element;

    if (hooksMap.has(ELEMENT_HOOKS.AFTER_RETRIEVE)) {
      const hook = hooksMap.get(ELEMENT_HOOKS.AFTER_RETRIEVE);
      elementAfterHook = await hook(elementAfterHook, services);
    }

    if (hooksMap.has(ELEMENT_HOOKS.AFTER_LOADED)) {
      const hook = hooksMap.get(ELEMENT_HOOKS.AFTER_LOADED);
      elementAfterHook = await hook(elementAfterHook, services);
    }

    return elementAfterHook;
  }

  return {
    applyFetchHooks,
    registerSaveHooks,
  };
}
