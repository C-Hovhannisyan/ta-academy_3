import type { Options } from '@Test';
import { test, expect } from '@Test';

test.describe('UHC-1', () => {
    test('Registration new customer with valid data and checking user data reset after logout', async ({
        page,
        baseURL,
    }: Options) => {
        //for the first - to start the test /step1/
        await page.goto(baseURL, { waitUntil: 'domcontentloaded' });

        await page.locator('//div[contains(@class, "myAccount__myAccountMenu___2mbVE")]').hover();
        await page
            .locator(
                '//div[contains(@class, "topStripMenuDropdown__dropdownContent___3xHDa")]/ul/li[1]/button'
            )
            .click();

        await expect(
            page.locator('//h2[text()="Access your vision benefits"]/../../..')
        ).toBeVisible();

        // second part - to open create account window /step2/
        await page.locator('//button[@value ="create"]').click();
        await expect(
            page.locator('//h2[text()="No vision insurance? We got you!"]/../../..')
        ).toBeVisible();

        //third one - to fill  /step3/
        const fname = 'Jane';
        const myEmail = `test${+Math.random() + '@test.com'}`;
        await page.getByPlaceholder('First Name').fill(fname);
        await page.getByPlaceholder('Last Name').fill('Smith');
        await page.getByPlaceholder('Email').fill(myEmail);
        await page.getByPlaceholder('Password').fill('Test1234');
        await page.locator('//button[@aria-label="Create new account"]').click();

        await expect(
            page.locator('//h2[text()="No vision insurance? We got you!"]/../../..')
        ).toBeHidden();

        await expect(
            page.locator('//div[contains(@class, "welcomePopup__wrapper")]')
        ).toBeVisible();
        // expect(page.locator('//h2[contains(text(),"Welcome,")]'));

        await expect(async () => {
            const titleLocator = page.locator('//h2[contains(text(),"Welcome,")]');
            const titleResult = await titleLocator.textContent();
            expect(titleResult).toStrictEqual(`Welcome, ${fname}`);
        }).toPass();

        const subtitleLocator = page.locator(
            '//p[text()="You can start enjoying everything we have to offer"]'
        );
        const subtitleResult = await subtitleLocator.textContent();

        expect(subtitleResult).toStrictEqual('You can start enjoying everything we have to offer');

        //fourth one - to close /step4/
        await page.locator('//button[@aria-label="Close"]').click();

        await expect(
            page.locator('//div[contains(@class, "rc-dialog welcomePopup")]')
        ).toBeHidden();

        const helloLocator = page.locator('//div[contains(@class, "myAccount__title___3VN4o")]');
        const helloResult = await helloLocator.textContent();
        expect(helloResult).toStrictEqual(`Hello, ${fname}`);

        const snackBarLocator = page.locator(
            '//header[contains(@class, "eligibilityWidget__header___2B89B")]/p'
        );
        const snackBarResult = await snackBarLocator.textContent();
        expect(snackBarResult).toStrictEqual(`Hi ${fname}`);

        //fifth one - to sign out /step5/
        await page.locator('//div[contains(@class, "myAccount__myAccountMenu___2mbVE")]').hover();
        await page
            .locator(
                '//div[contains(@class, "topStripMenuDropdown__dropdownContent___3xHDa")]/ul/li[4]/button'
            )
            .click();

        const signOutLocator = page.locator('//div[contains(@class, "myAccount__title___3VN4o")]');
        const signOutResult = await signOutLocator.textContent();
        expect(signOutResult).toStrictEqual('My Account');

        await expect(
            page.locator('//article[contains(@class, "eligibilityWidget__wrap___-14Is")]')
        ).toBeHidden();
    });
});
