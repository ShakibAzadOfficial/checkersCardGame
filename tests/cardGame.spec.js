const { test, expect } = require('@playwright/test');
const DeckOfCardsPage = require('../pages/cardGamePage');

test('Deck of Cards API Tests', async ({}) => {
  const deckPage = new DeckOfCardsPage();

  // Step 1: Confirm the site is up
  const siteResponse = await deckPage.confirmSiteIsUp();
  expect(siteResponse.status).toBe(200);
  expect(siteResponse.data).toContain('Deck of Cards API');

  // Step 2: Get a new deck
  const newDeckResponse = await deckPage.getNewDeck();
  expect(newDeckResponse.status).toBe(200);
  expect(newDeckResponse.data.success).toBe(true);

  // Step 3: Shuffle the deck
  const shuffleResponse = await deckPage.shuffleDeck(newDeckResponse.data.deck_id);
  expect(shuffleResponse.status).toBe(200);
  expect(shuffleResponse.data.success).toBe(true);

  // Step 4: Deal three cards to each of two players
  const dealResponse = await deckPage.dealCardsToPlayers(newDeckResponse.data.deck_id);
  expect(dealResponse.status).toBe(200);
  expect(dealResponse.data.success).toBe(true);
  expect(dealResponse.data.cards).toHaveLength(6);

  // Step 5: Check whether either has blackjack
  const cards = dealResponse.data.cards.map(card => card.value);
  const hasBlackjack = cards.includes('ACE') && (cards.includes('KING') || cards.includes('QUEEN') || cards.includes('JACK') || cards.includes('10'));
  expect(hasBlackjack).toBe(true);
});

