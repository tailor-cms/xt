import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly counter: Locator;
  readonly description: Locator;
  readonly submitBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.counter = this.editor.locator('.counter');
    this.description = this.editor.locator('.description');
    this.submitBtn = this.editor.getByRole('button', {
      name: 'Submit interaction',
    });
  }
}
