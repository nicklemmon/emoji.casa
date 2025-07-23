import { test, expect } from '@playwright/test';
import { EmojiPage } from './page-objects/EmojiPage';

test.describe('Emoji Search', () => {
  let emojiPage: EmojiPage;

  test.beforeEach(async ({ page }) => {
    emojiPage = new EmojiPage(page);
    await emojiPage.goto();
  });

  test('should load the page with initial emoji grid', async () => {
    await expect(emojiPage.heading).toBeVisible();
    await expect(emojiPage.searchInput).toBeVisible();
    
    // Should show no emojis initially (only shows after search)
    const initialCount = await emojiPage.getEmojiCount();
    expect(initialCount).toBe(0);
  });

  test('should filter emojis when searching', async ({ page }) => {
    // Search for a specific emoji
    await emojiPage.search('smile');
    
    // Wait for debounced search
    await page.waitForTimeout(500);
    
    const filteredCount = await emojiPage.getEmojiCount();
    expect(filteredCount).toBeGreaterThan(0);
    expect(filteredCount).toBeLessThan(50);
    
    // Verify relevant emojis are shown
    await emojiPage.expectEmojiVisible('😀');
  });

  test('should show no results for invalid search', async ({ page }) => {
    await emojiPage.search('xyzzzzz');
    
    // Wait for debounced search
    await page.waitForTimeout(500);
    
    await emojiPage.expectNoResults();
  });

  test('should clear search when clear button is clicked', async ({ page }) => {
    // First search for something
    await emojiPage.search('heart');
    await page.waitForTimeout(500);
    
    const filteredCount = await emojiPage.getEmojiCount();
    expect(filteredCount).toBeGreaterThan(0);
    
    // Clear the search
    await emojiPage.clearSearch();
    await page.waitForTimeout(500);
    
    // Should show no emojis after clearing (back to initial state)
    const clearedCount = await emojiPage.getEmojiCount();
    expect(clearedCount).toBe(0);
  });

  test('should search across different emoji properties', async ({ page }) => {
    // Test searching by group
    await emojiPage.search('animals');
    await page.waitForTimeout(500);
    
    let animalCount = await emojiPage.getEmojiCount();
    expect(animalCount).toBeGreaterThan(0);
    
    // Test searching by name
    await emojiPage.search('cat');
    await page.waitForTimeout(500);
    
    let catCount = await emojiPage.getEmojiCount();
    expect(catCount).toBeGreaterThan(0);
    await emojiPage.expectEmojiVisible('🐱');
  });
});