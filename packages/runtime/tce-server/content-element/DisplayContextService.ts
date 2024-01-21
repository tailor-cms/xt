import cloneDeep from 'lodash/cloneDeep';

const DEFAULT_CONTEXTS = [{ name: 'Default context', data: {} }];

class DisplayContextService {
  private initContextValue = [];
  // Keyed by content element id
  // One content element can have multiple display contexts for experiencing
  // differend end-user states
  private contextsByElementId = {};
  // Current display context index for particular content element
  // Keyed by content element id
  private selectedIndexByElementId = {};

  initialize(displayContextSeed = []) {
    this.initContextValue = displayContextSeed?.length
      ? displayContextSeed
      : DEFAULT_CONTEXTS;
    // Reset runtime context store
    this.contextsByElementId = {};
  }

  getDefaultContexts() {
    return cloneDeep(this.initContextValue);
  }

  initializeElementContext(elementId: number) {
    this.contextsByElementId[elementId] = cloneDeep(this.initContextValue);
    this.selectedIndexByElementId[elementId] = 0;
  }

  isElementContextInitialized(elementId: number) {
    const currentContextIndex = this.selectedIndexByElementId[elementId];
    return typeof currentContextIndex === 'number';
  }

  getCurrentContext(elementId: number) {
    if (!this.isElementContextInitialized(elementId))
      this.initializeElementContext(elementId);
    const currentContextIndex = this.selectedIndexByElementId[elementId];
    return this.contextsByElementId[elementId][currentContextIndex];
  }

  getCurrentContextData(elementId: number) {
    return this.getCurrentContext(elementId)?.data || {};
  }

  setCurrentContext(elementId: number, contextIndex: number) {
    if (!this.isElementContextInitialized(elementId))
      this.initializeElementContext(elementId);
    this.selectedIndexByElementId[elementId] = contextIndex;
  }

  resetContext(elementId: number, index: number = null) {
    if (!this.isElementContextInitialized(elementId)) {
      this.initializeElementContext(elementId);
      return;
    }
    if (index === null) index = this.selectedIndexByElementId[elementId];
    this.contextsByElementId[elementId][index] = cloneDeep(
      this.initContextValue[index],
    );
  }
}

export default new DisplayContextService();
