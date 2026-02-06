import { test, expect } from '@playwright/test';

// This test suite validates that the main navbar links navigate to the correct pages
// and that active state and page content are correct after navigation.

const NAV_ITEMS = [
  { label: 'Home', path: '/', expectedHeading: /home/i },
  { label: 'About', path: '/about', expectedHeading: /about/i },
  { label: 'Contact', path: '/contact', expectedHeading: /contact/i },
];

test.describe('Main navbar navigation', () => {
  test.beforeEach(async ({ page }) => {
    await page.goto('/');
  });

  for (const item of NAV_ITEMS) {
    test(`navigates to ${item.label} via navbar`, async ({ page }) => {
      const navBar = page.getByRole('navigation');
      await expect(navBar, 'Navbar should be visible').toBeVisible();

      const link = navBar.getByRole('link', { name: item.label, exact: true });
      await expect(link, `Navbar should contain link "${item.label}"`).toBeVisible();

      await Promise.all([
        page.waitForURL((url) => url.pathname === item.path),
        link.click(),
      ]);

      await expect(page.getByRole('heading', { level: 1 })).toHaveText(item.expectedHeading);

      const activeLink = navBar.getByRole('link', { name: item.label, exact: true });
      await expect(activeLink, 'Active navbar item should have aria-current="page"').toHaveAttribute('aria-current', 'page');
    });
  }

  test('logo click navigates back to home', async ({ page }) => {
    const navBar = page.getByRole('navigation');

    const aboutLink = navBar.getByRole('link', { name: 'About', exact: true });
    await Promise.all([
      page.waitForURL((url) => url.pathname === '/about'),
      aboutLink.click(),
    ]);

    const logoLink = navBar.getByRole('link', { name: /home|logo/i });
    await Promise.all([
      page.waitForURL((url) => url.pathname === '/'),
      logoLink.click(),
    ]);

    await expect(page.getByRole('heading', { level: 1 })).toHaveText(/home/i);
  });
});
