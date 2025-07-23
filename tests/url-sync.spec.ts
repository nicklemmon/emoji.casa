import { test, expect } from '@playwright/test';
import { EmojiPage } from './page-objects/EmojiPage';

test.describe('URL Parameter Synchronization', () => {
  let emojiPage: EmojiPage;

  test.beforeEach(async ({ page }) => {
    emojiPage = new EmojiPage(page);
  });

  test('should update URL when searching', async ({ page }) => {
    await emojiPage.goto();
    
    // Search for something
    await emojiPage.search('heart');
    await page.waitForTimeout(500);
    
    // URL should contain the search query
    await emojiPage.expectSearchInUrl('heart');
  });

  test('should load with search query from URL', async ({ page }) => {
    // Navigate directly to URL with search parameter
    await page.goto('/?search=smile');
    
    // Search input should be populated
    await expect(emojiPage.searchInput).toHaveValue('smile');
    
    // Results should be filtered
    const emojiCount = await emojiPage.getEmojiCount();
    expect(emojiCount).toBeGreaterThan(0);
    expect(emojiCount).toBeLessThan(50);
  });

  test('should clear URL when search is cleared', async ({ page }) => {
    // Start with a search
    await page.goto('/?search=cat');
    await expect(emojiPage.searchInput).toHaveValue('cat');
    
    // Clear the search
    await emojiPage.clearSearch();
    await page.waitForTimeout(500);
    
    // URL should be clean
    await emojiPage.expectEmptySearch();
  });

  test('should handle URL encoding properly', async ({ page }) => {
    await emojiPage.goto();
    
    // Search with special characters
    const searchTerm = 'hearts & flowers';
    await emojiPage.search(searchTerm);
    await page.waitForTimeout(500);
    
    // URL should be properly encoded
    await expect(page).toHaveURL(/search=hearts%20%26%20flowers/);
  });

  test('should maintain search state on page refresh', async ({ page }) => {
    await emojiPage.goto();
    
    // Search for something
    await emojiPage.search('fire');
    await page.waitForTimeout(500);
    
    // Refresh the page
    await page.reload();
    
    // Search should still be active
    await expect(emojiPage.searchInput).toHaveValue('fire');
    
    // Results should still be filtered
    const emojiCount = await emojiPage.getEmojiCount();
    expect(emojiCount).toBeGreaterThan(0);
    expect(emojiCount).toBeLessThan(50);
  });

  test('should handle browser back/forward navigation', async ({ page }) => {
    await emojiPage.goto();
    
    // Perform multiple searches
    await emojiPage.search('smile');
    await page.waitForTimeout(500);
    
    await emojiPage.search('heart');
    await page.waitForTimeout(500);
    
    // Navigate back
    await page.goBack();
    
    // Should restore previous search
    await expect(emojiPage.searchInput).toHaveValue('smile');
    
    // Navigate forward
    await page.goForward();
    
    // Should restore forward search
    await expect(emojiPage.searchInput).toHaveValue('heart');
  });
});