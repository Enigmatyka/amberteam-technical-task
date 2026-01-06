import { test as base } from '@playwright/test';

// helper class to grab the seed value once per the whole test suite
// wait, I actually don't need it at all LMAO

type SeedFixture = {
  hash: string;
};

// we assume the hash is the same on all buttons and just grab value from the first one
const buttonLabel = 'Exercise 1 - Three buttons';

export const test = base.extend<SeedFixture>({
  hash: [
    async ({ browser }, use) => {
      const context = await browser.newContext();
      const page = await context.newPage();

      await page.goto('/general_exercises/');
      const element = await page.getByRole('link', { name: buttonLabel });
      const link = await element.getAttribute('href'); 
      const url = new URL(link, 'http://localhost'); 
      const hash = url.searchParams.get('seed');

      if (!hash) { throw new Error('Href with hash value not found, halt and catch fire!'); }

        console.log('Hash value is:', hash);
        await context.close();
        await use(hash);
    },
    { scope: 'worker' } // default object that executes test cases, this should handle it globally
  ]
});

export { expect } from '@playwright/test';
