import { expect, Locator, Page } from '@playwright/test';

export class EmojiPage {
  readonly page: Page;
  readonly searchInput: Locator;
  readonly emojiResults: Locator;
  readonly emojiButtons: Locator;
  readonly clearButton: Locator;
  readonly heading: Locator;

  constructor(page: Page) {
    this.page = page;
    this.searchInput = page.getByPlaceholder('e.g., \'smile\', \'cry\', \'hands\'');
    this.emojiResults = page.getByTestId('emoji-results');
    this.emojiButtons = page.locator('[data-testid^="emoji-button-"]');
    this.clearButton = page.getByRole('button', { name: 'Clear' });
    this.heading = page.getByRole('heading', { name: 'emoji.casa' });
  }

  async goto() {
    await this.page.goto('/');
  }

  async search(query: string) {
    await this.searchInput.fill(query);
  }

  async clearSearch() {
    await this.clearButton.click();
  }

  async clickEmoji(emojiText: string) {
    await this.page.locator(`[data-testid="emoji-button-${emojiText}"]`).click();
  }

  async getEmojiCount() {
    return await this.emojiButtons.count();
  }

  async getFirstEmojiText() {
    return await this.emojiButtons.first().textContent();
  }

  async expectSearchInUrl(query: string) {
    await expect(this.page).toHaveURL(new RegExp(`[?&]search=${encodeURIComponent(query)}`));
  }

  async expectEmptySearch() {
    await expect(this.page).toHaveURL('/');
  }

  async expectEmojiVisible(emojiText: string) {
    await expect(this.page.locator(`[data-testid="emoji-button-${emojiText}"]`)).toBeVisible();
  }

  async expectNoResults() {
    await expect(this.emojiButtons).toHaveCount(0);
  }
}