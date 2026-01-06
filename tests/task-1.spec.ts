import { test, expect } from '@playwright/test';

const urlToVisit = '/exercises/exercise1';
const trailToFollowLabel = 'Trail set to:';
const failureMessage = 'NOT OK.';
const successMessage = 'OK. Good answer';

test.describe('First exercise - three buttons', () => {
  test('Happy path - we follow the trail', {
    tag: '@happy'
  }, async ({ page }) => {
    await page.goto(urlToVisit);
    const trailToFollow = (await page.getByText(trailToFollowLabel).locator('..').locator('code').innerText()).toUpperCase(); // labels are in capitals

    // we check if string has 3 step definitions
    if (trailToFollow.length != 6) { throw new Error("Step definitions don't match test definition!"); }

    const buttonsToClickLabels = trailToFollow.match(/.{1,2}/g);

    if (buttonsToClickLabels == null) { throw new Error("Failed to extract steps - please check their syntax!"); }

    for (let label of buttonsToClickLabels) {
      const buttonToClick = page.locator('button').filter({ hasText: label });
      await expect(buttonToClick).toBeVisible();
      await buttonToClick.click();
    }

    await page.locator('#solution').click(); // let's check
    await expect(page.getByText(successMessage)).toBeVisible();
  });

  test('Unhappy path - we make sure the trail is wrong', {
    tag: '@unhappy'
  }, async ({ page }) => {
    await page.goto(urlToVisit);

    const buttonsToPressNames = ["btnButton1", "btnButton2"] // we click them more times than asked for to guarantee a fault
    const clickCount = 5;

    for (let i = 0; i < clickCount; ++i) {
      await page.locator(`[name=${buttonsToPressNames[0]}]`).click();
      await page.locator(`[name=${buttonsToPressNames[1]}]`).click();
    }

    await page.locator('#solution').click(); // let's check
    await expect(page.getByText(failureMessage)).toBeVisible();
  });
})
