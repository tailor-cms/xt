# Theme Testing

The edit package targets Tailor CMS and inherits its Vuetify theme, while the
display package runs inside the target LMS with its own theme. The **Theme
selector** (palette icon in the toolbar) lets you preview how your element looks
under different themes during development.

## Built-in Themes

| Runtime    | Default themes              |
| ---------- | --------------------------- |
| Authoring  | Tailor (Tailor CMS palette) |
| Display    | Light, Dark                 |

## Custom Themes

To test against a specific LMS or Tailor CMS theme, click the palette icon and
select **Add custom theme**. Provide a name and paste a Vuetify
[ThemeDefinition](https://vuetifyjs.com/en/features/theme/#theme-object-structure):

```js
{
  dark: true,
  colors: {
    primary: '#9BCBFB',
    secondary: '#83D5C6',
    background: '#0D1B2A',
    surface: '#1B2838',
    error: '#FFB4AB',
    success: '#6EE7B7',
    warning: '#FCD34D',
    info: '#7DD3FC',
  },
}
```

The input supports JSON5 — unquoted keys, single quotes, trailing commas, and
comments are all accepted. This makes it easy to paste theme definitions directly
from your LMS or Tailor CMS codebase.

## Color Preview

When a theme is selected, the dialog displays all available color names
(e.g. `primary`, `surface`, `error`). These are the values you can pass to
Vuetify component `color` props. Use this to discover which theme variables are
available and verify they look correct before using them in your element.

::: tip
Custom themes persist in `localStorage` across sessions and can be edited or
removed from the theme selector dialog.
:::
