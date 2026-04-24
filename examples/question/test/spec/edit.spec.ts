import { elementClient } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-edit-element';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Renders question form with 4 answer inputs and correct radios', async ({
  page,
}) => {
  const edit = new Edit(page);
  await expect(edit.form).toBeVisible();
  await expect(edit.answerInputs).toHaveCount(4);
  await expect(edit.correctRadios).toHaveCount(4);
  await expect(edit.hintInput).toBeVisible();
  await expect(edit.feedbackSection).toBeVisible();
});

test('Can fill answers and save', async ({ page }) => {
  const edit = new Edit(page);
  await edit.fillAnswer(0, 'Four');
  await edit.fillAnswer(1, 'Five');
  await edit.fillAnswer(2, 'Six');
  await edit.fillAnswer(3, 'Seven');
  await edit.selectCorrect(0);
  await edit.save();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(edit.answerInputs.nth(0)).toHaveValue('Four');
  await expect(edit.answerInputs.nth(3)).toHaveValue('Seven');
});

test('Can pick a different correct answer', async ({ page }) => {
  const edit = new Edit(page);
  await edit.fillAnswer(0, 'A');
  await edit.fillAnswer(1, 'B');
  await edit.selectCorrect(1);
  await edit.save();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(edit.correctRadios.nth(1)).toBeChecked();
  await expect(edit.correctRadios.nth(0)).not.toBeChecked();
});

test('Can expand and edit feedback', async ({ page }) => {
  const edit = new Edit(page);
  await edit.fillAnswer(0, 'Option A');
  await edit.feedbackToggleBtn.click();
  const feedbackInput = edit.feedbackSection
    .getByPlaceholder('Add feedback...')
    .first();
  await expect(feedbackInput).toBeVisible();
  await feedbackInput.fill('Nice try');
  await edit.save();
  await page.reload({ waitUntil: 'networkidle' });
  await edit.feedbackToggleBtn.click();
  await expect(
    edit.feedbackSection.getByPlaceholder('Add feedback...').first(),
  ).toHaveValue('Nice try');
});

test('Non-gradable mode replaces correct radios with numbered avatars', async ({
  page,
}) => {
  await elementClient.reset(ELEMENT_ID, { isGradable: false });
  await page.reload({ waitUntil: 'networkidle' });
  const edit = new Edit(page);
  await expect(edit.correctRadios).toHaveCount(0);
  await expect(edit.answerInputs).toHaveCount(4);
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
