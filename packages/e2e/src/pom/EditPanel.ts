import { expect, FrameLocator, Locator, Page } from '@playwright/test';

export class EditPanel {
  readonly el: FrameLocator;
  readonly editor: Locator;
  readonly topToolbar: Locator;
  readonly sideToolbar: Locator;
  readonly resetBtn: Locator;
  readonly generateBtn: Locator;
  readonly settingsBtn: Locator;
  readonly settingsMenu: Locator;
  readonly confirmationDialog: Locator;
  readonly linkDialog: Locator;

  constructor(page: Page) {
    this.el = page.frameLocator('#editPanel>iframe');
    this.editor = this.el
      .locator('.v-row')
      .filter({ hasText: 'Authoring component' })
      .locator('.edit-frame');
    this.topToolbar = this.el
      .locator('.v-row')
      .filter({ hasText: 'Top toolbar' })
      .locator('.top-toolbar');
    this.sideToolbar = this.el
      .locator('.v-row')
      .filter({ hasText: 'Side toolbar' })
      .locator('.side-toolbar');
    this.resetBtn = this.el.getByRole('button', { name: 'Reset' });
    this.generateBtn = this.el.getByRole('button', { name: 'Generate' });
    this.settingsBtn = this.el.getByRole('button', { name: 'Settings' });
    this.settingsMenu = this.el.locator('.v-menu');
    this.confirmationDialog = this.el.locator('.v-dialog');
    this.linkDialog = this.el.locator('.v-dialog').filter({
      hasText: 'Link element dialog',
    });
  }

  async openSettings(): Promise<void> {
    await this.settingsBtn.click();
    await expect(this.settingsMenu).toBeVisible();
  }

  async setReadonly(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Readonly' }).click();
  }

  async setDragged(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Dragged' }).click();
  }

  async setGradable(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Gradable' }).click();
  }

  async setAutosave(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Autosave' }).click();
  }

  async setHalfWidth(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu
      .getByRole('checkbox', { name: 'Half width' })
      .click();
  }

  async persistFocus(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Focused' }).click();
  }

  async reset(): Promise<void> {
    await this.resetBtn.click();
  }

  async generate(): Promise<void> {
    await this.generateBtn.click();
  }

  async confirmDialog(): Promise<void> {
    await this.confirmationDialog
      .getByRole('button', { name: 'Confirm' })
      .click();
  }

  async cancelDialog(): Promise<void> {
    await this.confirmationDialog
      .getByRole('button', { name: 'Cancel' })
      .click();
  }
}
