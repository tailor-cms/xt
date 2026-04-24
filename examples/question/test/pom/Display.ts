import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Display extends pom.DisplayPanel {
  readonly form: Locator;
  readonly answerRadios: Locator;
  readonly submitBtn: Locator;
  readonly retryBtn: Locator;
  readonly feedback: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.editor.locator('.question-form');
    this.answerRadios = this.form.getByRole('radio');
    this.submitBtn = this.form.getByRole('button', { name: 'Submit' });
    this.retryBtn = this.form.getByRole('button', { name: 'Retry' });
    this.feedback = this.form.locator('.question-feedback');
  }

  async selectAnswer(index: number): Promise<void> {
    await this.answerRadios.nth(index).click();
  }

  async submit(): Promise<void> {
    await this.submitBtn.click();
  }

  async retry(): Promise<void> {
    await this.retryBtn.click();
  }
}
