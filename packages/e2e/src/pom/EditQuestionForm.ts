import { FrameLocator, Locator } from '@playwright/test';

export class EditQuestionForm {
  readonly el: Locator;
  readonly promptArea: Locator;
  readonly addPromptElementBtn: Locator;
  readonly hintInput: Locator;
  readonly feedbackSection: Locator;
  readonly feedbackToggleBtn: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(frame: FrameLocator) {
    this.el = frame.locator('.question-form');
    this.promptArea = this.el.locator('.question-prompt');
    this.addPromptElementBtn = this.promptArea.getByRole('button', {
      name: 'Add question element',
    });
    this.hintInput = this.el.locator('.question-hint').getByRole('textbox');
    this.feedbackSection = this.el.locator('.question-feedback');
    this.feedbackToggleBtn = this.feedbackSection.getByRole('button', {
      name: /show|hide/i,
    });
    this.saveBtn = this.el.getByRole('button', { name: 'Save' });
    this.cancelBtn = this.el.getByRole('button', { name: 'Cancel' });
  }

  async toggleFeedback(): Promise<void> {
    await this.feedbackToggleBtn.click();
  }
}
