import { test, expect } from '@playwright/test';

/**
 * Authentication Smoke Test
 * This is the project's 'Happy Path' verification.
 * It ensures the Login flow is functional before any deployment.
 */
test.describe('Authentication', () => {
  test('should redirect unauthenticated users to login', async ({ page }) => {
    // Navigate to a protected route, which should redirect to /auth/login
    await page.goto('/dashboard');
    
    // Check if we are on the login page
    await expect(page).toHaveURL(/\/auth\/login/);
    
    // Check for login heading or button
    await expect(page.getByText(/Welcome back/i)).toBeVisible();
  });

  test('should show validation errors for invalid login', async ({ page }) => {
    await page.goto('/auth/login');
    
    // Fill in invalid credentials
    await page.fill('input[type="email"]', 'invalid@example.com');
    await page.fill('input[type="password"]', 'wrongpassword');
    
    // Click submit
    await page.click('button[type="submit"]');
    
    // Check for the error alert that appears when login fails
    await expect(page.getByRole('alert')).toBeVisible();
  });
});
