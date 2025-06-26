import { expect, Locator, Page } from '@playwright/test';

export class BottomPanel {
  readonly el: Locator;
  readonly authoringTab: Locator;
  readonly userStateTab: Locator;
  readonly authoringWindow: Locator;
  readonly userStateWindow: Locator;

  constructor(page: Page) {
    this.el = page.locator('#panelBottom');
    this.authoringTab = page.locator('#panelBottom').getByRole('tab', {
      name: 'Authoring history',
    });
    this.userStateTab = page.locator('#panelBottom').getByRole('tab', {
      name: 'End-user state history',
    });
    this.authoringWindow = page.locator('.authoring-window');
    this.userStateWindow = page.locator('.user-state-window').nth(0);
  }

  async openAuthoringTab() {
    await this.authoringTab.click();
    await expect(this.authoringWindow).toBeVisible();
  }

  async openUserStateTab() {
    await this.userStateTab.click();
    await expect(this.userStateWindow).toBeVisible();
  }
}
