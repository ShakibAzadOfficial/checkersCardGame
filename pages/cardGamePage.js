const axios = require('axios');

class DeckOfCardsPage {
    async confirmSiteIsUp() {
        try {
            const siteResponse = await axios.get('https://deckofcardsapi.com/');
            return {
                status: siteResponse.status,
                data: siteResponse.data,
            };
        } catch (error) {
            throw new Error('Error confirming the site is up: ' + error);
        }
    }

    async getNewDeck() {
        try {
            const newDeckResponse = await axios.get('https://deckofcardsapi.com/api/deck/new/');
            return {
                status: newDeckResponse.status,
                data: newDeckResponse.data,
            };
        } catch (error) {
            throw new Error('Error getting a new deck: ' + error);
        }
    }

    async shuffleDeck(deckId) {
        try {
            const shuffleResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/shuffle/`);
            return {
                status: shuffleResponse.status,
                data: shuffleResponse.data,
            };
        } catch (error) {
            throw new Error('Error shuffling the deck: ' + error);
        }
    }

    async dealCardsToPlayers(deckId) {
        try {
            const dealResponse = await axios.get(`https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=6`);
            return {
                status: dealResponse.status,
                data: dealResponse.data,
            };
        } catch (error) {
            throw new Error('Error dealing cards to players: ' + error);
        }
    }

}

module.exports = DeckOfCardsPage;

