import { FrameLocator, Locator, Page } from '@playwright/test';

export class DisplayPanel {
  readonly el: FrameLocator;
  readonly editor: Locator;
  readonly statePresetPicker: Locator;

  constructor(page: Page) {
    this.el = page.frameLocator('#displayPanel>iframe');
    this.editor = this.el
      .locator('.v-row')
      .filter({ hasText: 'End-user component' })
      .locator('.display-frame');
    this.statePresetPicker = this.el.getByRole('combobox');
  }

  async selectStatePreset(preset: string) {
    await this.statePresetPicker.click();
    const option = this.el.locator('.v-list-item').filter({ hasText: preset });
    await option.click();
  }
}
