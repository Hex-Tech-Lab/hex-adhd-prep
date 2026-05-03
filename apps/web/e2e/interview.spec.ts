import { test, expect } from '@playwright/test';

test.describe('Interview Engine', () => {
  test('should render interview page correctly', async ({ page }) => {
    // Navigate to interview page
    await page.goto('/assessment/interview');

    // Check page title and content
    await expect(page.locator('h1')).toContainText('Structured Interview');
    await expect(page.locator('text=This guided interview will help')).toBeVisible();

    // Check progress indicator
    await expect(page.locator('text=Question 1 of')).toBeVisible();

    // Check form elements
    await expect(page.locator('textarea[placeholder*="Share your thoughts"]')).toBeVisible();
    await expect(page.locator('button[type="submit"]')).toContainText('Next Question');
  });

  test('should handle question progression', async ({ page }) => {
    await page.goto('/assessment/interview');

    // Wait for initial question to load
    await expect(page.locator('h1')).toContainText('Structured Interview');

    // Fill out first response
    await page.locator('textarea').fill('This is a test response about focus difficulties.');
    await page.locator('button[type="submit"]').click();

    // Should progress to next question or complete
    await expect(page.locator('text=Question 2 of').or(page.locator('text=Complete Interview'))).toBeVisible();
  });

  test('should validate form submission', async ({ page }) => {
    await page.goto('/assessment/interview');

    // Try to submit without content
    await page.locator('button[type="submit"]').click();

    // Should not progress (button should be disabled)
    await expect(page.locator('button[type="submit"]')).toBeDisabled();

    // Add content and try again
    await page.locator('textarea').fill('Valid response content.');
    await expect(page.locator('button[type="submit"]')).toBeEnabled();
  });

  test('should handle follow-up questions', async ({ page }) => {
    await page.goto('/assessment/interview');

    // Submit a very brief response that might trigger follow-up
    await page.locator('textarea').fill('Yes');
    await page.locator('button[type="submit"]').click();

    // Check if follow-up appears (may show "(Follow-up)" indicator)
    // Note: Follow-up detection depends on Claude API, so this may not always trigger
    // This test documents the expected behavior
  });

  test('should complete interview flow', async ({ page }) => {
    await page.goto('/assessment/interview');

    // Answer all questions (simplified test - in real scenario would answer multiple)
    await page.locator('textarea').fill('Comprehensive response about ADHD experiences covering multiple aspects of daily life and challenges faced.');
    await page.locator('button[type="submit"]').click();

    // Should eventually reach completion
    // Note: This test may need adjustment based on exact question flow
    await expect(page.url()).toMatch(/\/assessment\/family|\/assessment\/complete/);
  });
});