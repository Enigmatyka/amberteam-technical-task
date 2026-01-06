import { test, expect } from '@playwright/test';

const urlToVisit = '/exercises/exercise2';
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

        const stepsToTake = trailToFollow.split('.');
        const buttonToPress = stepsToTake[1].toUpperCase(); // button label uses capitals
        const inputHandle = stepsToTake[0].split(':')[0];
        const inputValueToEnter = stepsToTake[0].split(':')[1] + '.'; // we need that dot back, split took it from us

        await page.locator(`[name=${inputHandle}]`).fill(inputValueToEnter);
        await page.getByRole('button', { name: buttonToPress }).click();
        await page.locator('#solution').click(); // let's check
        await expect(page.getByText(successMessage)).toBeVisible();
    });

    test('Unhappy path - we make sure the trail is wrong', {
        tag: '@unhappy'
    }, async ({ page }) => {
        await page.goto(urlToVisit);
        const trailToFollow = await page.getByText(trailToFollowLabel).locator('code').innerText();

        if (trailToFollow == null) { throw new Error("Failed to get step definitions!"); }

        const stepsToTake = trailToFollow.split('.');
        const buttonToPress = stepsToTake[1].toUpperCase(); // button label uses capitals
        const inputHandle = stepsToTake[0].split(':')[0];
        const inputValueToEnter = stepsToTake[0].split(':')[1]; // no dot should give us the bad input, if it doesn't use the super paranoia version below
        // await page.locator(`[name=${inputHandle}]`).fill(`${inputValueToEnter.repeat(3)}`);

        await page.locator(`[name=${inputHandle}]`).fill(`${inputValueToEnter}`);
        await page.getByRole('button', { name: buttonToPress }).click();
        await page.locator('#solution').click(); // let's check
        await expect(page.getByText(failureMessage)).toBeVisible();
    });
})
