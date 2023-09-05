const { test } = require('@playwright/test');
const CheckersPage = require('../pages/CheckersPage');

test('verify user can play and reset the game', async ({ page }) => {
    const checkersPage = new CheckersPage(page);

    await checkersPage.navigate();
    await checkersPage.verifyCheckersPageDisplays();
    await checkersPage.waitForMessageToContain("Select an orange piece to move.");

    await checkersPage.verifyBlueCheckerCount(12);

    for (let i = 1; i <= 5; i++) {
        await checkersPage.makeMove(i);
        await checkersPage.waitForMessageToContain("Make a move.");
    }

    await checkersPage.verifyBlueCheckerCount(11);
    await checkersPage.resetGame();
    await checkersPage.verifyBlueCheckerCount(12);
});
