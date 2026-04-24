import { expect, FrameLocator, Locator } from '@playwright/test';

export class FileInput {
  readonly field: Locator;
  readonly previewBtn: Locator;
  readonly downloadBtn: Locator;
  readonly removeBtn: Locator;
  readonly dialog: Locator;
  readonly uploadTab: Locator;
  readonly urlTab: Locator;
  readonly fileInput: Locator;
  readonly urlInput: Locator;
  readonly urlTitleInput: Locator;
  readonly importBtn: Locator;
  readonly cancelBtn: Locator;
  readonly previewOverlay: Locator;
  readonly closePreviewBtn: Locator;

  constructor(frame: FrameLocator) {
    this.field = frame.locator('.file-input');
    this.previewBtn = this.field.getByRole('button', { name: 'Preview image' });
    this.downloadBtn = this.field.getByRole('button', {
      name: 'Download file',
    });
    this.removeBtn = this.field.getByRole('button', { name: 'Remove file' });

    this.dialog = frame
      .locator('.v-dialog')
      .filter({ has: frame.getByRole('tab', { name: 'Upload' }) });
    this.uploadTab = this.dialog.getByRole('tab', { name: 'Upload' });
    this.urlTab = this.dialog.getByRole('tab', { name: 'URL' });
    this.fileInput = this.dialog.locator('input[type="file"]');
    this.urlInput = this.dialog.getByLabel('File URL');
    this.urlTitleInput = this.dialog.getByLabel('Title');
    this.importBtn = this.dialog.getByRole('button', { name: 'Import' });
    this.cancelBtn = this.dialog.getByRole('button', { name: 'Cancel' });

    this.previewOverlay = frame.locator('.file-preview');
    this.closePreviewBtn = this.previewOverlay.getByRole('button', {
      name: 'Close preview',
    });
  }

  async open(): Promise<void> {
    await this.field.click();
    await expect(this.dialog).toBeVisible();
  }

  async cancel(): Promise<void> {
    await this.cancelBtn.click();
  }

  async upload(files: string | string[]): Promise<void> {
    await this.uploadTab.click();
    await this.fileInput.setInputFiles(files);
  }

  async importUrl(url: string, title?: string): Promise<void> {
    await this.urlTab.click();
    await this.urlInput.fill(url);
    if (title) await this.urlTitleInput.fill(title);
    await this.importBtn.click();
  }

  async download(): Promise<void> {
    await this.downloadBtn.click();
  }

  async remove(): Promise<void> {
    await this.removeBtn.click();
  }

  async openPreview(): Promise<void> {
    await this.previewBtn.click();
    await expect(this.previewOverlay).toBeVisible();
  }

  async closePreview(): Promise<void> {
    await this.closePreviewBtn.click();
  }
}
