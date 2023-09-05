const { expect } = require('@playwright/test');
const locators = require('./CheckersPageLocators');

class CheckersPage {
    constructor(page) {
        this.page = page;
    }

    async navigate() {
        await this.page.goto('https://www.gamesforthebrain.com/game/checkers/');
    }

    async verifyCheckersPageDisplays() {
        await this.page.locator(locators.BOARD).isVisible();
        console.log("Board displayed on the page");

        expect(await this.page.locator(locators.BOARD).isVisible()).toBe(true);
    }

    async waitForMessageToContain(expectedMessage, checkInterval = 5000, timeout = 60000) {
        let startTime = Date.now();

        while (true) {
            try {
                // await this.page.waitForTimeout(1000);
                await this.page.waitForSelector(locators.MESSAGE);

                await this.page.waitForFunction(
                    (expectedMessage) => {
                        const actualMessage = document.querySelector(locators.MESSAGE).innerText;
                        return actualMessage.includes(expectedMessage);
                    },
                    expectedMessage,
                    { timeout: checkInterval }
                );

                expect(await this.page.innerText(locators.MESSAGE)).toContain(expectedMessage);
                console.log(`"${locators.MESSAGE}" element contains "${expectedMessage}"`);
                break;
            } catch (error) {
                if (Date.now() - startTime > timeout) {
                    console.log(`Timeout while waiting for "${locators.MESSAGE}" to contain "${expectedMessage}": `, error);
                    break;
                }
                await this.page.waitForTimeout(checkInterval);
            }
        }
    }

    async makeMove(moveNumber) {
        const currentLocator = locators[`MOVE_${moveNumber}_CURRENT`];
        const targetLocator = locators[`MOVE_${moveNumber}_TARGET`];

        await this.page.waitForSelector(currentLocator);
        await this.testMove(currentLocator, targetLocator);
    }

    async testMove(currentLocator, targetLocator) {
        const checker1 = 'CHECKER_YOU1';
        const checker2 = 'CHECKER_YOU2';
        const checkerGray = 'CHECKER_GRAY';

        await expect.poll(async () => {
            return await this.page.locator(currentLocator).getAttribute("src");
        }, { timeout: 60000 }).toContain(locators[checker1]);

        await this.page.locator(currentLocator).click();
        await this.page.waitForTimeout(1000);

        await expect.poll(async () => {
            return await this.page.locator(currentLocator).getAttribute("src");
        }, { timeout: 60000 }).toContain(locators[checker2]);

        await expect.poll(async () => {
            return await this.page.locator(targetLocator).getAttribute("src");
        }, { timeout: 60000 }).toContain(locators[checkerGray]);

        await this.page.locator(targetLocator).click();

        await expect.poll(async () => {
            return await this.page.locator(targetLocator).getAttribute("src");
        }, { timeout: 60000 }).toContain(locators[checker1]);
    }

    async verifyBlueCheckerCount(expectedCount) {
        const elements = await this.page.locator(locators.BLUE_CHECKER).count();
        expect(elements).toBe(expectedCount);
    }

    async resetGame() {
        await this.page.click(locators.RESTART_BUTTON);
    }
}

module.exports = CheckersPage;
