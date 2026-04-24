import { elementClient } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-edit-element';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Saves answers and correct choice; persists across reload', async ({
  page,
}) => {
  const edit = new Edit(page);
  await edit.fillAnswer(0, 'Four');
  await edit.fillAnswer(1, 'Five');
  await edit.fillAnswer(2, 'Six');
  await edit.fillAnswer(3, 'Seven');
  await edit.selectCorrect(1);
  await edit.save();
  await page.reload({ waitUntil: 'networkidle' });
  await expect(edit.answerInputs.nth(0)).toHaveValue('Four');
  await expect(edit.answerInputs.nth(3)).toHaveValue('Seven');
  await expect(edit.correctRadios.nth(1)).toBeChecked();
  await expect(edit.correctRadios.nth(0)).not.toBeChecked();
});

test('Saves per-answer feedback; persists across reload', async ({ page }) => {
  const edit = new Edit(page);
  await edit.fillAnswer(0, 'Option A');
  await edit.feedbackToggleBtn.click();
  const feedbackInput = edit.feedbackSection
    .getByPlaceholder('Add feedback...')
    .first();
  await expect(feedbackInput).toBeVisible();
  await feedbackInput.fill('Nice try');
  await edit.save();
  // After reload the feedback panel auto-expands because `isExpanded =
  // some(feedback)` in QuestionFeedback.vue — no second toggle needed.
  await page.reload({ waitUntil: 'networkidle' });
  await expect(
    edit.feedbackSection.getByPlaceholder('Add feedback...').first(),
  ).toHaveValue('Nice try');
});

test('Non-gradable init removes the correct-answer radios', async ({
  page,
}) => {
  await elementClient.reset(ELEMENT_ID, { isGradable: false });
  await page.reload({ waitUntil: 'networkidle' });
  const edit = new Edit(page);
  await expect(edit.form).toBeVisible();
  await expect(edit.answerInputs).toHaveCount(4);
  await expect(edit.correctRadios).toHaveCount(0);
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
