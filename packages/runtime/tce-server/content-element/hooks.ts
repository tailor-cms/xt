import { processAssets, resolveAssets } from './processors.js';
import config from '../storage/config.js';
import { create as createFilesystemStorage } from '../storage/providers/filesystem';
import ELEMENT_HOOKS from './hook-type.js';
import { emitter } from '../common/emitter.js';

const Storage = createFilesystemStorage(config);

function prepareHookServices(tce) {
  return {
    config: { tce },
    storage: Storage,
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

    // Register default save hooks
    ['beforeCreate', 'beforeUpdate'].forEach((hookName) => {
      elementModel.addHook(hookName, (element) => {
        return processAssets(hookName, element);
      });
    });
    ['afterCreate', 'afterUpdate'].forEach((hookName) => {
      elementModel.addHook(hookName, async (element) => {
        return resolveAssets(element);
      });
    });
    elementModel.addHook('afterCreate', registerSocketUpdate);
    elementModel.addHook('afterUpdate', registerSocketUpdate);
  }

  async function applyFetchHooks(element, tceConfig) {
    const services = prepareHookServices(tceConfig);
    let elementAfterHook = await resolveAssets(element);

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
