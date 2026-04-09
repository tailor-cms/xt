import { elementClient, pom } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Display } from '../pom';

const ELEMENT_ID = 'test-display-element';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Renders display component with default description and initial count', async ({ page }) => {
  const display = new Display(page);
  await expect(display.editor).toBeVisible();
  await expect(display.description).toContainText('Author click count');
  await expect(display.counter).toContainText('0');
});

test('Shows description when set', async ({ page }) => {
  await elementClient.update(ELEMENT_ID, {
    count: 0,
    description: 'Test counter',
  });
  await page.reload({ waitUntil: 'networkidle' });
  const display = new Display(page);
  await expect(display.description).toContainText('Test counter');
});

test('Can submit interaction', async ({ page }) => {
  const display = new Display(page);
  await display.submitBtn.click();
  const bottomPanel = new pom.BottomPanel(page);
  await bottomPanel.openUserStateTab();
  await expect(
    bottomPanel.userStateWindow.getByText('interactionTimestamp').first(),
  ).toBeVisible();
});

test('Can switch state preset', async ({ page }) => {
  const display = new Display(page);
  await display.selectStatePreset('Test preset 2');
  await expect(
    display.editor.getByText('I have a different value'),
  ).toBeVisible();
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
