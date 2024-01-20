import cloneDeep from 'lodash/cloneDeep';

const DEFAULT_CONTEXTS = [{ name: 'Default context', data: {} }];

class DisplayContextService {
  private initContextValue = DEFAULT_CONTEXTS;
  // Keyed by content element id
  private displayContexts = {};
  // Keyed by content element id
  private selectedContextByElementId = {};

  initialize(displayContextSeed: any[]) {
    this.initContextValue = cloneDeep(displayContextSeed);
    this.displayContexts = {};
  }

  getContexts() {
    return cloneDeep(this.initContextValue);
  }

  initializeElementContext(id: number) {
    this.displayContexts[id] = cloneDeep(this.initContextValue);
    this.selectedContextByElementId[id] = 0;
  }

  isElementContextInitialized(id: number) {
    const currentContextIndex = this.selectedContextByElementId[id];
    return typeof currentContextIndex === 'number';
  }

  getCurrentContext(elementId: number) {
    if (!this.isElementContextInitialized(elementId))
      this.initializeElementContext(elementId);
    const currentContextIndex = this.selectedContextByElementId[elementId];
    return this.displayContexts[elementId][currentContextIndex];
  }

  getCurrentContextData(elementId: number) {
    return this.getCurrentContext(elementId)?.data || {};
  }

  setCurrentContext(elementId: number, contextIndex: number) {
    if (!this.isElementContextInitialized(elementId))
      this.initializeElementContext(elementId);
    this.selectedContextByElementId[elementId] = contextIndex;
  }

  resetContext(elementId: number, index: number = null) {
    if (!this.isElementContextInitialized(elementId)) {
      this.initializeElementContext(elementId);
      this.setCurrentContext(elementId, index || 0);
      return;
    }
    if (index === null) index = this.selectedContextByElementId[elementId];
    this.displayContexts[elementId][index] = cloneDeep(
      this.initContextValue[index],
    );
  }
}

export default new DisplayContextService();
