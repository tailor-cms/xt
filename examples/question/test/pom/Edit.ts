import type { Locator, Page } from '@playwright/test';
import { pom } from '@tailor-cms/cek-e2e';

export class Edit extends pom.EditPanel {
  readonly form: Locator;
  readonly answerInputs: Locator;
  readonly correctRadios: Locator;
  readonly hintInput: Locator;
  readonly feedbackSection: Locator;
  readonly feedbackToggleBtn: Locator;
  readonly saveBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(page: Page) {
    super(page);
    this.form = this.editor.locator('.question-form');
    this.answerInputs = this.form.locator(
      'input[placeholder="Answer..."], input[placeholder="Option..."]',
    );
    this.correctRadios = this.form.getByRole('radio');
    this.hintInput = this.form.locator('.question-hint').getByRole('textbox');
    this.feedbackSection = this.form.locator('.question-feedback');
    this.feedbackToggleBtn = this.feedbackSection.getByRole('button', {
      name: /show|hide/i,
    });
    this.saveBtn = this.form.getByRole('button', { name: 'Save' });
    this.cancelBtn = this.form.getByRole('button', { name: 'Cancel' });
  }

  async fillAnswer(index: number, value: string): Promise<void> {
    await this.answerInputs.nth(index).fill(value);
  }

  async selectCorrect(index: number): Promise<void> {
    await this.correctRadios.nth(index).click();
  }

  async save(): Promise<void> {
    await this.saveBtn.click();
  }
}
