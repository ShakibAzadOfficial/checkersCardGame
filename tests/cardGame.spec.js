const { test, expect } = require('@playwright/test');
const axios = require('axios');

test('Deck of Cards API Tests', async ({}) => {
  let deckId;

  // Step 1: Confirm the site is up
  const siteResponse = await axios.get('https://deckofcardsapi.com/');
  expect(siteResponse.status).toBe(200);
  expect(siteResponse.data).toContain('Deck of Cards API');

  // Step 2: Get a new deck
  const newDeckResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/');
  expect(newDeckResponse.status).toBe(200);
  expect(newDeckResponse.data.success).toBe(true);
  deckId = newDeckResponse.data.deck_id;

  // Step 3: Shuffle the deck
  const shuffleResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
  expect(shuffleResponse.status).toBe(200);
  expect(shuffleResponse.data.success).toBe(true);

  // Step 4: Deal three cards to each of two players
  const dealResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`);
  expect(dealResponse.status).toBe(200);
  expect(dealResponse.data.success).toBe(true);
  expect(dealResponse.data.cards).toHaveLength(6);

  // Step 5: Check whether either has blackjack
  const cards = dealResponse.data.cards.map(card => card.value);
  console.log(cards)
  const hasBlackjack = cards.includes('ACE') && (cards.includes('KING') || cards.includes('QUEEN') || cards.includes('JACK') || cards.includes('10'));
  expect(hasBlackjack).toBe(true);
});

