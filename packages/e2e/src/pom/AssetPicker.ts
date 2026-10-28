import { expect, FrameLocator, Locator } from '@playwright/test';

type Files = Parameters<Locator['setInputFiles']>[0];

/**
 * TailorAssetPicker: the Upload / URL dialog, on its own or opened by
 * TailorFileInput. Pass the heading to tell apart several pickers.
 */
export class AssetPicker {
  readonly el: Locator;
  readonly uploadTab: Locator;
  readonly urlTab: Locator;
  readonly fileInput: Locator;
  readonly urlInput: Locator;
  readonly urlTitleInput: Locator;
  readonly importBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(frame: FrameLocator, heading?: string | RegExp) {
    const pickers = frame
      .locator('.v-dialog')
      .filter({ has: frame.getByRole('tab', { name: 'Upload' }) });
    this.el = heading ? pickers.filter({ hasText: heading }) : pickers;
    this.uploadTab = this.el.getByRole('tab', { name: 'Upload' });
    this.urlTab = this.el.getByRole('tab', { name: 'URL' });
    this.fileInput = this.el.locator('input[type="file"]');
    this.urlInput = this.el.getByLabel('File URL');
    this.urlTitleInput = this.el.getByLabel('Title');
    this.importBtn = this.el.getByRole('button', { name: 'Import' });
    this.cancelBtn = this.el.getByRole('button', { name: 'Cancel' });
  }

  async waitForOpen(): Promise<void> {
    await expect(this.el).toBeVisible();
  }

  async waitForClose(): Promise<void> {
    await expect(this.el).not.toBeVisible();
  }

  async cancel(): Promise<void> {
    await this.cancelBtn.click();
  }

  // Accepts paths or in-memory files ({ name, mimeType, buffer })
  async upload(files: Files): Promise<void> {
    await this.uploadTab.click();
    await this.fileInput.setInputFiles(files);
  }

  async importUrl(url: string, title?: string): Promise<void> {
    await this.urlTab.click();
    await this.urlInput.fill(url);
    if (title) await this.urlTitleInput.fill(title);
    await this.importBtn.click();
  }
}
