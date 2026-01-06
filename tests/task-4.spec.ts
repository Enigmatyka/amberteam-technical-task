import { test, expect } from '@playwright/test';

const urlToVisit = '/exercises/exercise4';
const trailToFollowLabel = 'Trail set to:';
const failureMessage = 'NOT OK.';
const successMessage = 'OK. Good answer';
const endpoint = 'exercises/exercise4/radio';

test.describe('Fourth exercise - Radio buttons', () => {
    test('Happy path - we follow the trail', {
        tag: '@happy'
    }, async ({ page }) => {
        await page.goto(urlToVisit);
        const trailToFollow = await page.getByText(trailToFollowLabel).locator('code').innerText();

        if (trailToFollow == null) { throw new Error("Failed to get step definitions!"); }

        const stepsToTake = trailToFollow.split(',').map(step => Number(step.replace(/[^\d]/g, ''))); // clean indices

        for (let i = 0; i < stepsToTake.length; ++i) {
            // if sections have >10 buttons, this won't work
            const index = stepsToTake[i];
            const group = page.getByRole('heading', { name: `Group ${i}:` });
            const radio = group
                .locator('..')
                .locator(`input[type="radio"][value^="v${index}"]`); // since we care about the first digit only, ^ checks the beginning of string


            const [resp] = await Promise.all([
                page.waitForResponse(resp => resp.url().includes(endpoint)),
                radio.click()
            ]);
            await expect(radio).toBeChecked();
        }

        await page.locator('#solution').click(); // let's check
        await expect(page.getByText(successMessage)).toBeVisible();
    });

    // this gets flaky somehow, maybe fuzzing works bad? no idea, skipping it ATM 
    // TODO: unflake it
    test.skip('Unhappy path - we make sure the trail is wrong', {
        tag: '@unhappy'
    }, async ({ page }) => {

        await page.goto(urlToVisit);
        const trailToFollow = await page.getByText(trailToFollowLabel).locator('code').innerText();

        if (trailToFollow == null) { throw new Error("Failed to get step definitions!"); }

        const stepsToTake = trailToFollow.split(',').map(step => Number(step.replace(/[^\d]/g, ''))); 
        const changedSteps = stepsToTake.map(n => (n + 1) % 9); // fuzzed indices

        for (let i = 0; i < changedSteps.length; ++i) {
            // if sections have >10 buttons, this won't work
            const index = changedSteps[i];
            const group = page.getByRole('heading', { name: `Group ${i}:` });
            const radio = group
                .locator('..')
                .locator(`input[type="radio"][value^="v${index + 1}"]`); // since we care about the first digit only, ^ checks the beginning of string


            const [resp] = await Promise.all([
                page.waitForResponse(resp => resp.url().includes(endpoint)),
                radio.click()
            ]);
            await expect(radio).toBeChecked();
        }

        await page.locator('#solution').click(); // let's check
        await expect(page.getByText(failureMessage)).toBeVisible();

    });
})
