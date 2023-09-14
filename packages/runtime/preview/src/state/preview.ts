import { createGlobalState, useToggle } from '@vueuse/core';
import { ref } from 'vue';

export const PANELS = {
  EDIT: 'editPanel',
  DISPLAY: 'displayPanel',
  STATE: 'statePanel',
};

export const useGlobalState = createGlobalState(() => {
  // Control color scheme
  const isDark = ref(false);
  const toggleDark = useToggle(isDark);

  // Control panels
  const visiblePanels = ref(['EDIT', 'DISPLAY', 'STATE']);
  const previewPanelSplit = ref();
  const showEdit = () => {
    visiblePanels.value = [PANELS.EDIT];
    if (previewPanelSplit.value) previewPanelSplit.value?.setSizes([100, 0]);
  };
  const showDisplay = () => {
    visiblePanels.value = [PANELS.DISPLAY];
    if (previewPanelSplit.value) previewPanelSplit.value?.setSizes([0, 100]);
  };
  const showBothComponents = () => {
    visiblePanels.value = [PANELS.EDIT, PANELS.DISPLAY];
    if (previewPanelSplit.value) previewPanelSplit.value?.setSizes([50, 50]);
  };

  return {
    isDark,
    toggleDark,
    visiblePanels,
    previewPanelSplit,
    showEdit,
    showDisplay,
    showBothComponents,
  };
});
