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

test('Renders question form with answer options', async ({ page }) => {
  const display = new Display(page);
  await expect(display.form).toBeVisible();
  await expect(display.answerRadios).toHaveCount(4);
  for (const label of ANSWERS) {
    await expect(display.form.getByText(label)).toBeVisible();
  }
  await expect(display.submitBtn).toBeVisible();
  await expect(display.submitBtn).toBeDisabled();
});

test('Can select an answer and submit', async ({ page }) => {
  const display = new Display(page);
  await display.selectAnswer(0);
  await expect(display.submitBtn).toBeEnabled();
  await display.submit();
  await expect(display.feedback).toContainText(/Correct/i);
  await expect(display.retryBtn).toBeVisible();
});

test('Correct-answer state preset shows submitted Correct feedback', async ({
  page,
}) => {
  const display = new Display(page);
  await display.selectStatePreset('Correct answer');
  await expect(display.feedback).toContainText(/Correct/i);
  await expect(display.retryBtn).toBeVisible();
});

test('Wrong-answer state preset shows Incorrect feedback', async ({ page }) => {
  const display = new Display(page);
  await display.selectStatePreset('Wrong answer');
  await expect(display.feedback).toContainText(/Incorrect/i);
  await expect(display.retryBtn).toBeVisible();
});

test('Retry clears submitted state', async ({ page }) => {
  const display = new Display(page);
  await display.selectStatePreset('Correct answer');
  await expect(display.retryBtn).toBeVisible();
  await display.retry();
  await expect(display.submitBtn).toBeVisible();
  await expect(display.feedback).not.toBeVisible();
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
