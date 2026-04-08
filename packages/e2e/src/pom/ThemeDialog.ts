import { expect, FrameLocator, Locator } from '@playwright/test';

export class ThemeDialog {
  readonly activatorBtn: Locator;
  readonly dialog: Locator;
  readonly closeBtn: Locator;
  readonly themeRadioGroup: Locator;
  readonly addThemeBtn: Locator;
  readonly colorPreview: Locator;
  // Theme form (nested dialog)
  readonly themeFormDialog: Locator;
  readonly themeNameInput: Locator;
  readonly themeDefinitionInput: Locator;
  readonly themeFormSubmitBtn: Locator;
  readonly themeFormCancelBtn: Locator;

  constructor(frame: FrameLocator) {
    this.activatorBtn = frame.getByRole('button', { name: 'Theme selector' });
    this.dialog = frame
      .locator('.v-dialog')
      .filter({ hasText: 'Theme selector' });
    this.closeBtn = this.dialog.getByRole('button', { name: 'Close' });
    this.themeRadioGroup = this.dialog.locator('.v-radio-group');
    this.addThemeBtn = this.dialog.getByRole('button', {
      name: 'Add custom theme',
    });
    this.colorPreview = this.dialog.locator('.v-card-text .v-sheet');
    this.themeFormDialog = frame
      .locator('.v-dialog')
      .filter({ hasText: 'custom theme' });
    this.themeNameInput = this.themeFormDialog.getByLabel('Theme name');
    this.themeDefinitionInput =
      this.themeFormDialog.getByLabel('Theme definition');
    this.themeFormSubmitBtn = this.themeFormDialog.getByRole('button', {
      name: /Add theme|Save/,
    });
    this.themeFormCancelBtn = this.themeFormDialog.getByRole('button', {
      name: 'Cancel',
    });
  }

  async open(): Promise<void> {
    await this.activatorBtn.click();
    await expect(this.dialog).toBeVisible();
  }

  async close(): Promise<void> {
    await this.closeBtn.click();
  }

  async selectTheme(name: string): Promise<void> {
    await this.themeRadioGroup
      .locator('.v-radio')
      .filter({ hasText: name })
      .click();
  }

  async editTheme(name: string): Promise<void> {
    const row = this.dialog.locator('div').filter({ hasText: name });
    await row.getByRole('button', { name: 'Edit theme' }).click();
    await expect(this.themeFormDialog).toBeVisible();
  }

  async removeTheme(name: string): Promise<void> {
    const row = this.dialog.locator('div').filter({ hasText: name });
    await row.getByRole('button', { name: 'Remove theme' }).click();
  }

  async openAddThemeForm(): Promise<void> {
    await this.addThemeBtn.click();
    await expect(this.themeFormDialog).toBeVisible();
  }

  async submitThemeForm(): Promise<void> {
    await this.themeFormSubmitBtn.click();
  }

  async cancelThemeForm(): Promise<void> {
    await this.themeFormCancelBtn.click();
  }
}
