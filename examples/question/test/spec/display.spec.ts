import { elementClient } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Display } from '../pom';

const ELEMENT_ID = 'test-display-element';
const ANSWERS = ['Zeus', 'Hera', 'Apollo', 'Athena'];

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await elementClient.update(ELEMENT_ID, { answers: ANSWERS, correct: 0 });
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Submitting the correct answer shows Correct feedback', async ({
  page,
}) => {
  const display = new Display(page);
  await expect(display.submitBtn).toBeDisabled();
  await display.selectAnswer(0);
  await expect(display.submitBtn).toBeEnabled();
  await display.submit();
  await expect(display.feedback).toContainText(/Correct/i);
  await expect(display.retryBtn).toBeVisible();
});

test('Submitting a wrong answer shows Incorrect feedback', async ({ page }) => {
  const display = new Display(page);
  await display.selectAnswer(1);
  await display.submit();
  await expect(display.feedback).toContainText(/Incorrect/i);
  await expect(display.retryBtn).toBeVisible();
});

test('Retry clears submitted state', async ({ page }) => {
  const display = new Display(page);
  await display.selectAnswer(0);
  await display.submit();
  await expect(display.retryBtn).toBeVisible();
  await display.retry();
  await expect(display.submitBtn).toBeVisible();
  await expect(display.feedback).not.toBeVisible();
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
