import { FrameLocator, Locator, Page } from '@playwright/test';

import { ThemeDialog } from './ThemeDialog';

export class DisplayPanel {
  readonly el: FrameLocator;
  readonly editor: Locator;
  readonly statePresetPicker: Locator;
  readonly themeDialog: ThemeDialog;

  constructor(page: Page) {
    this.el = page.frameLocator('#displayPanel>iframe');
    this.editor = this.el
      .locator('.v-row')
      .filter({ hasText: 'End-user component' })
      .locator('.display-frame');
    this.statePresetPicker = this.el.locator('[role="combobox"]', {
      hasText: 'State preset',
    });
    this.themeDialog = new ThemeDialog(this.el);
  }

  async selectStatePreset(preset: string): Promise<void> {
    await this.statePresetPicker.click();
    const option = this.el.locator('.v-list-item').filter({ hasText: preset });
    await option.click();
  }
}
