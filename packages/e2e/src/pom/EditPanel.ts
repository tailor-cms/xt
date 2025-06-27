import { expect, FrameLocator, Locator, Page } from '@playwright/test';

export class EditPanel {
  readonly el: FrameLocator;
  readonly editor: Locator;
  readonly topToolbar: Locator;
  readonly sideToolbar: Locator;
  readonly settingsBtn: Locator;
  readonly settingsMenu: Locator;

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
    this.settingsBtn = this.el.getByRole('button', { name: 'Settings' });
    this.settingsMenu = this.el.locator('.v-menu');
  }

  async openSettings() {
    await this.settingsBtn.click();
    await expect(this.settingsMenu).toBeVisible();
  }

  async setDisabled() {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Disabled' }).click();
  }

  async setDragged() {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Dragged' }).click();
  }

  async setGradable() {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Gradable' }).click();
  }

  async persistFocus() {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Focused' }).click();
  }
}
