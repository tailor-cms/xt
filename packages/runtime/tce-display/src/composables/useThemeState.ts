import { computed, watch } from 'vue';
import { find, kebabCase, reject } from 'lodash-es';
import JSON5 from 'json5';
import { useLocalStorage } from '@vueuse/core';
import { useTheme } from 'vuetify';

interface CustomTheme {
  name: string;
  key: string;
  definition: {
    dark?: boolean;
    colors?: Record<string, string>;
    variables?: Record<string, string | number>;
  };
}

export function useThemeState() {
  const { change, computedThemes, themes } = useTheme();
  const activeTheme = useLocalStorage('cek-display-theme-active', 'default');
  const customThemes = useLocalStorage<CustomTheme[]>(
    'cek-display-custom-themes',
    [],
  );

  customThemes.value.forEach((t) => registerTheme(t));

  const setTheme = (key: string) => (activeTheme.value = key);

  function registerTheme({ key, definition }: CustomTheme) {
    themes.value[key] = {
      dark: definition.dark ?? false,
      colors: { ...definition.colors },
      variables: { ...definition.variables },
    };
  }

  const removeCustomTheme = (name: string) => {
    const key = kebabCase(name);
    customThemes.value = reject(customThemes.value, { key });
    if (activeTheme.value === key) setTheme('default');
  };

  const addCustomTheme = (name: string, input: string) => {
    removeCustomTheme(name);
    const key = kebabCase(name);
    const theme: CustomTheme = {
      name,
      key,
      definition: JSON5.parse(input),
    };
    customThemes.value.push(theme);
    registerTheme(theme);
    setTheme(key);
  };

  const getCustomTheme = (name: string) =>
    find(customThemes.value, { key: kebabCase(name) });

  const themeItems = computed(() => [
    { value: 'default', title: 'Light', removable: false },
    { value: 'default-dark', title: 'Dark', removable: false },
    ...customThemes.value.map((t) => ({
      value: t.key,
      title: t.name,
      removable: true,
    })),
  ]);

  const getThemeColors = (key: string) => {
    const theme = computedThemes.value[key];
    if (!theme?.colors) return [];
    return Object.keys(theme.colors).filter(
      (color) => !color.startsWith('on-'),
    );
  };

  watch(activeTheme, (key) => change(key), { immediate: true });

  return {
    activeTheme,
    addCustomTheme,
    getCustomTheme,
    getThemeColors,
    removeCustomTheme,
    setTheme,
    themeItems,
  };
}
