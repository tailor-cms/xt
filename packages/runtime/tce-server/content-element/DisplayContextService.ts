import cloneDeep from 'lodash/cloneDeep';

const DEFAULT_CONTEXTS = [{ name: 'Default context', data: {} }];

class DisplayContextService {
  private initContextValue = DEFAULT_CONTEXTS;
  private displayContexts = DEFAULT_CONTEXTS;
  private currentContextIndex = 0;

  initialize(displayContexts: any[]) {
    this.initContextValue = cloneDeep(displayContexts);
    this.displayContexts = cloneDeep(displayContexts);
  }

  getContexts() {
    return this.displayContexts;
  }

  getCurrentContext() {
    return this.displayContexts[this.currentContextIndex];
  }

  getCurrentContextData() {
    return this.getCurrentContext()?.data || {};
  }

  setCurrentContext(index: number) {
    this.currentContextIndex = index;
  }

  resetContext(index = null) {
    if (index === null) index = this.currentContextIndex;
    this.displayContexts[index] = cloneDeep(this.initContextValue[index]);
  }
}

export default new DisplayContextService();
