import { elementClient } from '@tailor-cms/cek-e2e';
import { expect, test } from '@playwright/test';

import { Edit } from '../pom';

const ELEMENT_ID = 'test-edit-element';

test.beforeEach(async ({ page }) => {
  await elementClient.reset(ELEMENT_ID);
  await page.goto(`/?id=${ELEMENT_ID}`);
  await page.waitForLoadState('networkidle');
});

test('Renders edit component with increment button and counter', async ({ page }) => {
  const edit = new Edit(page);
  await expect(edit.editor).toBeVisible();
  await expect(edit.incrementBtn).toBeVisible();
  await expect(edit.counter).toContainText('0');
});

test('Can increment counter', async ({ page }) => {
  const edit = new Edit(page);
  await edit.incrementBtn.click();
  await expect(edit.counter).toContainText('1');
});

test('Can decrement counter via top toolbar', async ({ page }) => {
  const edit = new Edit(page);
  await edit.persistFocus();
  await edit.incrementBtn.click();
  await expect(edit.counter).toContainText('1');
  await edit.topToolbar.getByRole('button', { name: 'Decrement' }).click();
  await expect(edit.counter).toContainText('0');
});

test('Can update description', async ({ page }) => {
  const edit = new Edit(page);
  await edit.descriptionInput.fill('My counter');
  await page.reload({ waitUntil: 'networkidle' });
  await expect(edit.descriptionInput).toHaveValue('My counter');
});

test('Can upload and remove background image', async ({ page }) => {
  const edit = new Edit(page);
  await edit.fileInput.setInputFiles('test/fixtures/avatar.jpg');
  await expect(edit.uploadDetails).toBeVisible();
  await expect(edit.uploadDetails.getByText('Storage key:')).toBeVisible();
  // Remove image
  await edit.removeImageBtn.click();
  await expect(edit.uploadDetails).not.toBeVisible();
});

test('beforeSave hook resets count at threshold', async ({ page }) => {
  const edit = new Edit(page);
  await elementClient.update(ELEMENT_ID, { count: 10, description: '' });
  await page.reload({ waitUntil: 'networkidle' });
  await expect(edit.counter).toContainText('0');
});

test.afterAll(async () => {
  await elementClient.reset(ELEMENT_ID);
});
