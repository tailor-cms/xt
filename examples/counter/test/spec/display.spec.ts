import { elementClient, pom } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';
import type { Page } from '@playwright/test';

import { Display } from '../pom';

const ELEMENT_ID = 'test-display-element';

const seedElement = async (page: Page, data: Record<string, unknown> = {}) => {
  await elementClient.update(ELEMENT_ID, {
    count: 0,
    description: 'Test counter',
    ...data,
  });
  await page.reload({ waitUntil: 'networkidle' });
};

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Renders placeholder while the element is empty', async ({ page }) => {
  const display = new Display(page);
  await expect(display.placeholder).toBeVisible();
  await expect(display.editor).toBeHidden();
});

test('Renders display component with description and initial count', async ({
  page,
}) => {
  await seedElement(page);
  const display = new Display(page);
  await expect(display.editor).toBeVisible();
  await expect(display.description).toContainText('Test counter');
  await expect(display.counter).toContainText('0');
});

test('Can submit interaction', async ({ page }) => {
  await seedElement(page);
  const display = new Display(page);
  await display.submitBtn.click();
  const bottomPanel = new pom.BottomPanel(page);
  await bottomPanel.openUserStateTab();
  await expect(
    bottomPanel.userStateWindow.getByText('interactionTimestamp').first(),
  ).toBeVisible();
});

test('Can switch state preset', async ({ page }) => {
  await seedElement(page);
  const display = new Display(page);
  await display.selectStatePreset('Test preset 2');
  await expect(
    display.editor.getByText('I have a different value'),
  ).toBeVisible();
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
