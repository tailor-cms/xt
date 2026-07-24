import { expect, FrameLocator, Locator, Page } from '@playwright/test';

import { ThemeDialog } from './ThemeDialog';

export class EditPanel {
  readonly el: FrameLocator;
  readonly main: Locator;
  readonly editor: Locator;
  readonly topToolbar: Locator;
  readonly sideToolbar: Locator;
  readonly resetBtn: Locator;
  readonly generateBtn: Locator;
  readonly aiMenu: Locator;
  readonly aiContextInput: Locator;
  readonly aiSubmitBtn: Locator;
  readonly generationProgress: Locator;
  readonly settingsBtn: Locator;
  readonly settingsMenu: Locator;
  readonly confirmationDialog: Locator;
  readonly linkDialog: Locator;
  readonly linkDialogCloseBtn: Locator;
  readonly themeDialog: ThemeDialog;

  constructor(page: Page) {
    this.el = page.frameLocator('#editPanel>iframe');
    this.main = this.el.locator('.v-main');
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
    this.resetBtn = this.editor.getByRole('button', { name: 'Reset element' });
    this.generateBtn = this.main.getByRole('button', { name: 'Generate' });
    this.aiMenu = this.el.locator('.v-menu').filter({ hasText: 'AI Context' });
    this.aiContextInput = this.aiMenu.getByRole('textbox');
    this.aiSubmitBtn = this.aiMenu.getByRole('button', { name: 'Generate' });
    this.generationProgress = this.main.getByText(
      'Content generation in progress',
    );
    this.settingsBtn = this.main.getByRole('button', { name: 'Settings' });
    this.settingsMenu = this.el
      .locator('.v-menu')
      .filter({ hasText: 'Element Props' });
    this.confirmationDialog = this.el.locator('.v-dialog').filter({
      hasText: 'Are you sure',
    });
    this.linkDialog = this.el.locator('.v-dialog').filter({
      hasText: 'Link element dialog',
    });
    this.linkDialogCloseBtn = this.linkDialog.getByRole('button', {
      name: 'Close',
    });
    this.themeDialog = new ThemeDialog(this.el);
  }

  async openSettings(): Promise<void> {
    await expect(this.settingsMenu).not.toBeVisible();
    await this.settingsBtn.click();
    await expect(this.settingsMenu).toBeVisible();
  }

  async closeSettings(): Promise<void> {
    await expect(this.settingsMenu).toBeVisible();
    await this.settingsMenu.press('Escape');
    await expect(this.settingsMenu).not.toBeVisible();
  }

  async focus(): Promise<void> {
    await this.editor.click();
  }

  async setReadonly(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Readonly' }).click();
    await this.closeSettings();
  }

  async setDragged(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Dragged' }).click();
    await this.closeSettings();
  }

  async setGradable(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Gradable' }).click();
    await this.closeSettings();
  }

  async setAutosave(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Autosave' }).click();
    await this.closeSettings();
  }

  async setHalfWidth(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu
      .getByRole('checkbox', { name: 'Half width' })
      .click();
    await this.closeSettings();
  }

  async persistFocus(): Promise<void> {
    await this.openSettings();
    await this.settingsMenu.getByRole('checkbox', { name: 'Focused' }).click();
    await this.closeSettings();
  }

  async reset(): Promise<void> {
    await this.resetBtn.click();
    await this.confirmDialog();
  }

  async openAiMenu(): Promise<void> {
    await expect(this.aiMenu).not.toBeVisible();
    await this.generateBtn.click();
    await expect(this.aiMenu).toBeVisible();
  }

  async closeAiMenu(): Promise<void> {
    await expect(this.aiMenu).toBeVisible();
    await this.aiMenu.press('Escape');
    await expect(this.aiMenu).not.toBeVisible();
  }

  async generate(context?: string): Promise<void> {
    await this.openAiMenu();
    if (context) await this.aiContextInput.fill(context);
    await this.aiSubmitBtn.click();
    await expect(this.aiMenu).not.toBeVisible();
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
