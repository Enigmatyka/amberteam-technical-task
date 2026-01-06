import { test, expect } from '@playwright/test';

const urlToVisit = '/exercises/exercise3';
const trailToFollowLabel = 'Trail set to:';
const failureMessage = 'NOT OK.';
const successMessage = 'OK. Good answer';

test.describe('Second exercise - Editbox', () => {
    test('Happy path - we follow the trail', {
        tag: '@happy'
    }, async ({ page }) => {
        await page.goto(urlToVisit);
        const trailToFollow = await page.getByText(trailToFollowLabel).locator('code').innerText();

        if (trailToFollow == null) { throw new Error("Failed to get step definitions!"); }

        const stepsToTake = trailToFollow.split(':');
        const dropdownHandle = stepsToTake[0];
        const elementToChooseFrom = stepsToTake[1]; 

        const dropdown = await page.locator(`[name=${dropdownHandle}]`);
        await dropdown.selectOption(elementToChooseFrom);

        await expect(page.locator('.wrap')).toContainText(trailToFollow); // we need that to avoid race condition and remove flakiness
        await page.locator('#solution').click(); // let's check
        await expect(page.getByText(successMessage)).toBeVisible();
    });

    test('Unhappy path - we make sure the trail is wrong', {
        tag: '@unhappy'
    }, async ({ page }) => {
        await page.goto(urlToVisit);
        const trailToFollow = await page.getByText(trailToFollowLabel).locator('code').innerText();

        if (trailToFollow == null) { throw new Error("Failed to get step definitions!"); }

        const stepsToTake = trailToFollow.split(':');
        const dropdownHandle = stepsToTake[0];
        const correctIndice = Number(stepsToTake[1][1]) + 1;
        const elementToChooseFrom = `v${correctIndice % 13}`;

        const dropdown = await page.locator(`[name=${dropdownHandle}]`);
        await dropdown.selectOption(elementToChooseFrom);
        await expect(page.locator('.wrap')).not.toContainText(trailToFollow); // we need that to avoid race condition and remove flakiness
        await page.locator('#solution').click(); // let's check
        await expect(page.getByText(failureMessage)).toBeVisible();
    });
})
