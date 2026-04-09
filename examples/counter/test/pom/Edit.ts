import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly descriptionInput: Locator;
  readonly incrementBtn: Locator;
  readonly counter: Locator;
  readonly fileInput: Locator;
  readonly uploadDetails: Locator;
  readonly removeImageBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.descriptionInput = this.editor.getByLabel('Description');
    this.incrementBtn = this.editor.getByRole('button', { name: 'Increment' });
    this.counter = this.editor.getByText('Times clicked:');
    this.fileInput = this.editor.locator('input[type="file"]');
    this.uploadDetails = this.editor.locator('.upload-details');
    this.removeImageBtn = this.uploadDetails.getByRole('button');
  }
}
