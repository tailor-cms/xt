import { cloneDeep } from 'lodash-es';

const DEFAULT_CONTEXTS = [{ name: 'Default context', data: {} }];

class DisplayContextService {
  private initContextValue = [];
  // Keyed by content element uid
  // One content element can have multiple display contexts for experiencing
  // different end-user states
  private contextsByElementUid = {};
  // Current display context index for particular content element
  // Keyed by content element uid
  private selectedIndexByElementUid = {};

  initialize(displayContextSeed = []) {
    this.initContextValue = displayContextSeed?.length
      ? displayContextSeed
      : DEFAULT_CONTEXTS;
    // Reset runtime context store
    this.contextsByElementUid = {};
  }

  getElementContexts(elementUid: string) {
    if (!this.isElementContextInitialized(elementUid))
      this.initializeElementContext(elementUid);
    return this.contextsByElementUid[elementUid];
  }

  initializeElementContext(elementUid: string) {
    this.contextsByElementUid[elementUid] = cloneDeep(this.initContextValue);
    this.selectedIndexByElementUid[elementUid] = 0;
  }

  isElementContextInitialized(elementUid: string) {
    const currentContextIndex = this.selectedIndexByElementUid[elementUid];
    return typeof currentContextIndex === 'number';
  }

  getCurrentContextIndex(elementUid: string) {
    if (!this.isElementContextInitialized(elementUid))
      this.initializeElementContext(elementUid);
    return this.selectedIndexByElementUid[elementUid];
  }

  getCurrentContext(elementUid: string) {
    const currentContextIndex = this.getCurrentContextIndex(elementUid);
    return this.contextsByElementUid[elementUid][currentContextIndex];
  }

  getCurrentContextData(elementUid: string) {
    return this.getCurrentContext(elementUid)?.data || {};
  }

  setCurrentContext(elementUid: string, contextIndex: number) {
    if (!this.isElementContextInitialized(elementUid))
      this.initializeElementContext(elementUid);
    this.selectedIndexByElementUid[elementUid] = contextIndex;
  }

  resetContext(elementUid: string, index: number = null) {
    if (!this.isElementContextInitialized(elementUid)) {
      this.initializeElementContext(elementUid);
      return;
    }
    if (index === null) index = this.selectedIndexByElementUid[elementUid];
    this.contextsByElementUid[elementUid][index] = cloneDeep(
      this.initContextValue[index],
    );
  }
}

export default new DisplayContextService();
