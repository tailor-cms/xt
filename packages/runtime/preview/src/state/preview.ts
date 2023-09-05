import { createGlobalState, useToggle } from '@vueuse/core';
import { ref } from 'vue';

export const PANELS = {
  EDIT: 'editPanel',
  DISPLAY: 'displayPanel',
  STATE: 'statePanel',
};

export const useGlobalState = createGlobalState(() => {
  // Control color scheme
  const isDark = ref(true);
  const toggleDark = useToggle(isDark);

  // Control panels
  const visiblePanels = ref(['EDIT', 'DISPLAY', 'STATE']);
  const splitJs = ref();
  const showEdit = () => {
    visiblePanels.value = [PANELS.EDIT];
    if (splitJs.value) splitJs.value?.setSizes([100, 0]);
  };
  const showDisplay = () => {
    visiblePanels.value = [PANELS.DISPLAY];
    if (splitJs.value) splitJs.value?.setSizes([0, 100]);
  };
  const showBothComponents = () => {
    visiblePanels.value = [PANELS.EDIT, PANELS.DISPLAY];
    if (splitJs.value) splitJs.value?.setSizes([50, 50]);
  };

  return {
    isDark,
    toggleDark,
    visiblePanels,
    splitJs,
    showEdit,
    showDisplay,
    showBothComponents,
  };
});
