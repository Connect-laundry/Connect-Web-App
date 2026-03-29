import { test, expect } from '@playwright/test';

/**
 * Authentication Smoke Test
 * This is the project's 'Happy Path' verification.
 * It ensures the Login flow is functional before any deployment.
 */
test.describe('Authentication', () => {
  test('should show login page by default', async ({ page }) => {
    // Navigate to the root, which should redirect to /auth/login via middleware
    await page.goto('/');
    
    // Check if we are on the login page
    await expect(page).toHaveURL(/\/auth\/login/);
    
    // Check for login heading or button
    await expect(page.getByText(/Login to your account/i)).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Click submit
    await page.click('button[type="submit"]');
    
    // Check for error toast or message (adjust selector based on UI)
    // Assuming 'sonner' toast or similar is used based on package.json
    await expect(page.getByText(/Invalid/i)).toBeVisible();
  });
});
