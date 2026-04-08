# Testing

The framework includes [Playwright](https://playwright.dev) E2E testing setup,
located under the `/test` directory.

## Running Tests

```bash
pnpm test
```

To open the interactive UI mode:

```bash
pnpm test -- --ui
```

## E2E Package

The `@tailor-cms/cek-e2e` package provides shared testing utilities for content
elements. It includes Page Object Models (POMs) for the CEK preview panels and
an API client for interacting with the server runtime.

### Page Object Models

Import POMs via the `pom` namespace:

```ts
import { pom } from '@tailor-cms/cek-e2e';
```

| POM                    | Description                                           |
| ---------------------- | ----------------------------------------------------- |
| `EditPanel`            | Edit iframe — editor, toolbars, settings, theme dialog |
| `DisplayPanel`         | Display iframe — editor, state preset, theme dialog    |
| `BottomPanel`          | Bottom panel — authoring & user state history          |
| `ThemeDialog`          | Theme selector — select, add, edit, remove themes      |
| `EditQuestionForm`     | Edit question form — prompt, hint, feedback, save      |
| `DisplayQuestionForm`  | Display question form — hint, submit, retry, feedback  |

Extend the base POMs to add element-specific locators:

```ts
import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly incrementBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.incrementBtn = this.editor.getByRole('button', { name: 'Increment' });
  }
}

### Element Client

The `elementClient` is a pre-configured singleton for interacting with the
content element server runtime API:

```ts
import { elementClient } from '@tailor-cms/cek-e2e';

// Get element data
await elementClient.get(id);

// Update element data
await elementClient.update(id, { count: 5 });

// Reset element to initial state
await elementClient.reset(id);

// Set user state context by index
await elementClient.setState(id, 1);

// Reset user state context
await elementClient.resetState(id);
```

## Test Structure

A typical test directory looks like:

```
test/
├── playwright.config.ts
├── pom/
│   ├── index.ts
│   ├── Display.ts      # extends DisplayPanel
│   └── Edit.ts         # extends EditPanel
└── spec/
    ├── display.spec.ts
    └── edit.spec.ts
```

## Writing Tests

A basic test file:

```ts
import { elementClient } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-element-id';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Renders edit component', async ({ page }) => {
  const edit = new Edit(page);
  await expect(edit.editor).toBeVisible();
});
```
