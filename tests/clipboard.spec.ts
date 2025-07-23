import { test, expect } from '@playwright/test';
import { EmojiPage } from './page-objects/EmojiPage';

test.describe('Clipboard Functionality', () => {
  let emojiPage: EmojiPage;

  test.beforeEach(async ({ page }) => {
    emojiPage = new EmojiPage(page);
    await emojiPage.goto();
  });

  test('should copy emoji to clipboard when clicked', async ({ page, context }) => {
    // Grant clipboard permissions
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Search for a specific emoji to make it easier to find
    await emojiPage.search('smile');
    await page.waitForTimeout(500);
    
    // Click on the first emoji
    const firstEmoji = emojiPage.emojiButtons.first();
    const emojiText = await firstEmoji.textContent();
    await firstEmoji.click();
    
    // Verify the emoji was copied to clipboard
    const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
    expect(clipboardText).toBe(emojiText);
  });

  test('should show visual feedback when emoji is copied', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Search for heart emoji
    await emojiPage.search('heart');
    await page.waitForTimeout(500);
    
    const firstEmoji = emojiPage.emojiButtons.first();
    
    // Click the emoji
    await firstEmoji.click();
    
    // Look for "Copied!" text feedback
    await expect(firstEmoji).toContainText('Copied!');
  });

  test('should copy different emojis correctly', async ({ page, context }) => {
    await context.grantPermissions(['clipboard-read', 'clipboard-write']);
    
    // Test copying multiple different emojis
    const testEmojis = ['😀', '❤️', '🎉'];
    
    for (const emoji of testEmojis) {
      // Search to find the specific emoji
      await emojiPage.search(emoji);
      await page.waitForTimeout(300);
      
      // Click the emoji
      await emojiPage.clickEmoji(emoji);
      
      // Verify it was copied
      const clipboardText = await page.evaluate(() => navigator.clipboard.readText());
      expect(clipboardText).toBe(emoji);
      
      // Clear search for next iteration
      await emojiPage.clearSearch();
      await page.waitForTimeout(300);
    }
  });
});