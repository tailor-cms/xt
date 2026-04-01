import { expect, FrameLocator, Locator } from '@playwright/test';

export class DisplayQuestionForm {
  readonly el: Locator;
  readonly hintBtn: Locator;
  readonly submitBtn: Locator;
  readonly retryBtn: Locator;
  readonly feedback: Locator;

  constructor(frame: FrameLocator) {
    this.el = frame.locator('.question-form');
    this.hintBtn = this.el.getByRole('button', { name: 'Hint' });
    this.submitBtn = this.el.getByRole('button', { name: 'Submit' });
    this.retryBtn = this.el.getByRole('button', { name: 'Retry' });
    this.feedback = this.el.locator('.question-feedback');
  }

  async showHint(): Promise<void> {
    await this.hintBtn.click();
    await expect(this.el.locator('.v-tooltip')).toBeVisible();
  }

  async submit(): Promise<void> {
    await this.submitBtn.click();
  }

  async retry(): Promise<void> {
    await this.retryBtn.click();
  }
}
