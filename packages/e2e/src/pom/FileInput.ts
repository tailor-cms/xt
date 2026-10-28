import { expect, FrameLocator, Locator } from '@playwright/test';

import { AssetPicker } from './AssetPicker';

/**
 * TailorFileInput in either mode. Field mode: a click-to-add text field
 * that turns into a file card. Dropzone mode: a placeholder-style zone
 * (Upload / From URL) that turns into the element's media with a file row
 * (name, Replace, Remove) beneath it while the element is focused.
 */
export class FileInput {
  // Field mode
  readonly field: Locator;
  readonly previewBtn: Locator;
  readonly removeBtn: Locator;
  readonly previewOverlay: Locator;
  readonly closePreviewBtn: Locator;

  // Dropzone mode
  readonly dropzone: Locator;
  readonly dropzoneUploadBtn: Locator;
  readonly dropzoneUrlBtn: Locator;
  readonly dropzoneFileInput: Locator;
  readonly fileRow: Locator;
  readonly replaceBtn: Locator;
  readonly fileRowRemoveBtn: Locator;

  // Picker dialog (both modes); the fields below are shortcuts into it
  readonly picker: AssetPicker;
  readonly dialog: Locator;
  readonly uploadTab: Locator;
  readonly urlTab: Locator;
  readonly fileInput: Locator;
  readonly urlInput: Locator;
  readonly urlTitleInput: Locator;
  readonly importBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(frame: FrameLocator) {
    this.field = frame.locator('.file-input');
    this.previewBtn = this.field.getByRole('button', { name: 'Preview image' });
    this.removeBtn = this.field.getByRole('button', {
      name: 'Remove file',
      exact: true,
    });
    this.previewOverlay = frame.locator('.file-preview');
    this.closePreviewBtn = this.previewOverlay.getByRole('button', {
      name: 'Close preview',
    });

    this.dropzone = frame.locator('.file-dropzone-upload');
    this.dropzoneUploadBtn = this.dropzone.getByRole('button', {
      name: 'Upload',
    });
    this.dropzoneUrlBtn = this.dropzone.getByRole('button', {
      name: 'From URL',
    });
    this.dropzoneFileInput = this.dropzone.locator('input[type="file"]');
    this.fileRow = frame.locator('.file-input-media .position-sticky');
    this.replaceBtn = this.fileRow.getByRole('button', { name: 'Replace' });
    this.fileRowRemoveBtn = this.fileRow.getByRole('button', {
      name: 'Remove',
    });

    this.picker = new AssetPicker(frame);
    this.dialog = this.picker.el;
    this.uploadTab = this.picker.uploadTab;
    this.urlTab = this.picker.urlTab;
    this.fileInput = this.picker.fileInput;
    this.urlInput = this.picker.urlInput;
    this.urlTitleInput = this.picker.urlTitleInput;
    this.importBtn = this.picker.importBtn;
    this.cancelBtn = this.picker.cancelBtn;
  }

  // Field mode

  async open(): Promise<void> {
    await this.field.click();
    await expect(this.dialog).toBeVisible();
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

  // Dropzone mode

  // Uploads straight from the zone, without the dialog
  async dropzoneUpload(files: string | string[]): Promise<void> {
    await this.dropzoneFileInput.setInputFiles(files);
  }

  async openUrlFromDropzone(): Promise<void> {
    await this.dropzoneUrlBtn.click();
    await expect(this.dialog).toBeVisible();
  }

  // The row only renders while the element is focused
  async expectFile(name: string): Promise<void> {
    await expect(this.replaceBtn).toBeVisible();
    await expect(this.fileRow).toContainText(name);
  }

  async replace(): Promise<void> {
    await this.replaceBtn.click();
    await expect(this.dialog).toBeVisible();
  }

  async removeFromRow(): Promise<void> {
    await this.fileRowRemoveBtn.click();
  }

  // Picker dialog

  async cancel(): Promise<void> {
    await this.picker.cancel();
  }

  async upload(files: string | string[]): Promise<void> {
    await this.picker.upload(files);
  }

  async importUrl(url: string, title?: string): Promise<void> {
    await this.picker.importUrl(url, title);
  }
}
