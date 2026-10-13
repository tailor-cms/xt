import { expect, FrameLocator, Locator } from '@playwright/test';

/**
 * A TailorDialog rendered by an element, located by its title. Drives the
 * header close button and the actions row.
 */
export class TailorDialog {
  readonly el: Locator;
  readonly title: Locator;
  readonly body: Locator;
  readonly actions: Locator;
  readonly closeBtn: Locator;
  readonly cancelBtn: Locator;

  constructor(frame: FrameLocator, title: string | RegExp) {
    this.el = frame
      .locator('.v-dialog')
      .filter({ has: frame.locator('.dialog-title', { hasText: title }) });
    this.title = this.el.locator('.dialog-title');
    this.body = this.el.locator('.v-card-text');
    this.actions = this.el.locator('.v-card-actions');
    this.closeBtn = this.el.getByRole('button', { name: 'Close' });
    this.cancelBtn = this.actions.getByRole('button', { name: 'Cancel' });
  }

  action(name: string | RegExp): Locator {
    return this.actions.getByRole('button', { name, exact: true });
  }

  async waitForOpen(): Promise<void> {
    await expect(this.el).toBeVisible();
  }

  async waitForClose(): Promise<void> {
    await expect(this.el).not.toBeVisible();
  }

  async cancel(): Promise<void> {
    await this.cancelBtn.click();
    await this.waitForClose();
  }

  async close(): Promise<void> {
    await this.closeBtn.click();
    await this.waitForClose();
  }
}
