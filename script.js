const playerCardsContainer = document.getElementById('player-cards');
const dealerCardsContainer = document.getElementById('dealer-cards');
const playerScoreElement = document.getElementById('player-score');
const dealerScoreElement = document.getElementById('dealer-score');
const gameMessage = document.getElementById('game-message');
const coinsElement = document.getElementById('coins');
const timerElement = document.getElementById('timer');
const betInput = document.getElementById('bet-input');

const hitButton = document.getElementById('hit-button');
const standButton = document.getElementById('stand-button');
const resetButton = document.getElementById('reset-button');

const cardSound = document.getElementById('card-sound'); // Referentie naar het geluidselement

let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let deck = [];
let coins = 100;
let betAmount = 10;
let timer;
let timeLeft = 60; // 60 seconds
let timerActive = false; // Track if the timer is active

function loadCoins() {
    const savedCoins = localStorage.getItem('coins');
    coins = savedCoins ? parseInt(savedCoins) : 100;
}

function saveCoins() {
    localStorage.setItem('coins', coins);
}

function initializeDeck() {
    const suits = ['♠', '♥', '♦', '♣'];
    const values = ['2', '3', '4', '5', '6', '7', '8', '9', '10', 'J', 'Q', 'K', 'A'];
    deck = [];

    suits.forEach(suit => {
        values.forEach(value => {
            deck.push({ value, suit });
        });
    });

    deck = deck.sort(() => 0.5 - Math.random());
}

function cardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

function addCardToPlayer() {
    const card = deck.pop();
    playerCards.push(card);
    playerScore += cardValue(card);
    renderCard(card, playerCardsContainer);
    updateScores();
    checkPlayerBust();
}

function addCardToDealer() {
    const card = deck.pop();
    dealerCards.push(card);
    dealerScore += cardValue(card);
    renderCard(card, dealerCardsContainer);
    updateScores();
}

function renderCard(card, container) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = `${card.value}${card.suit}`;
    container.appendChild(cardElement);
    
    // Speel het geluid af bij het draaien van de kaart
    cardSound.play(); 

    // Voeg de flip animatie toe
    setTimeout(() => {
        cardElement.classList.add('flip');
    }, 100);
}

function updateScores() {
    playerScoreElement.textContent = `Score: ${playerScore}`;
    dealerScoreElement.textContent = `Score: ${dealerScore}`;
}

function checkPlayerBust() {
    if (playerScore > 21) {
        gameMessage.textContent = "Player Busted! Dealer Wins!";
        coins -= betAmount;
        updateCoins();
        disableButtons();
    }
}

function checkDealerBust() {
    if (dealerScore > 21) {
        gameMessage.textContent = "Dealer Busted! Player Wins!";
        coins += betAmount * 2;
        updateCoins();
    }
}

function dealerTurn() {
    while (dealerScore < 17) {
        addCardToDealer();
    }
    checkDealerBust();
    if (dealerScore <= 21) {
        if (dealerScore > playerScore) {
            gameMessage.textContent = "Dealer Wins!";
            coins -= betAmount;
        } else if (dealerScore === playerScore) {
            gameMessage.textContent = "It's a Tie!";
        } else {
            gameMessage.textContent = "Player Wins!";
            if (playerScore === 21) {
                coins += betAmount * 5; // Win met precies 21
                gameMessage.textContent = "Player Wins with 21! x5 your bet!";
            } else {
                coins += betAmount * 2; // Win met meer dan dealer
            }
        }
        updateCoins();
    }
    disableButtons();
}

function updateCoins() {
    coinsElement.textContent = `Coins: ${coins}`;
    saveCoins();
    if (coins <= 0) {
        timerElement.style.display = 'block'; // Toon de timer wanneer coins op 0 zijn
        if (!timerActive) {
            startTimer(); // Start de timer wanneer coins 0 zijn
        }
    } else {
        timerElement.style.display = 'none'; // Verberg de timer als er munten zijn
        clearInterval(timer); // Stop de timer als de speler weer munten heeft
        timerActive = false; // Markeer timer als niet actief
        resetTimer(); // Reset de timerweergave
    }
}

function startTimer() {
    timerActive = true; // Markeer timer als actief
    timeLeft = 60; // Reset tijd naar 60 seconden
    timerElement.textContent = `Timer: ${timeLeft} seconds`;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Timer: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            coins = 100; // Reset munten
            saveCoins();
            updateCoins();
            gameMessage.textContent = "You have been reset to 100 coins!";
        }
    }, 1000);
}

function resetTimer() {
    timeLeft = 60; // Reset tijd naar 60 seconden
    timerElement.textContent = `Timer: ${timeLeft} seconds`;
    clearInterval(timer);
}

function disableButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

function enableButtons() {
    hitButton.disabled = false;
    standButton.disabled = false;
}

function resetGame() {
    playerScore = 0;
    dealerScore = 0;
    playerCards = [];
    dealerCards = [];
    playerCardsContainer.innerHTML = '';
    dealerCardsContainer.innerHTML = '';
    gameMessage.textContent = '';
    updateScores();
    initializeDeck();
    enableButtons();
}

function updateBet() {
    const newBet = parseInt(betInput.value);
    if (newBet > 0 && newBet <= coins) {
        betAmount = newBet;
        gameMessage.textContent = ""; // Reset message if bet is valid
    } else {
        gameMessage.textContent = "Invalid bet amount!"; // Show error for invalid bet
    }
}

// Event listeners
hitButton.addEventListener('click', () => {
    if (coins > 0 && betAmount <= coins) { // Check if player can gamble
        addCardToPlayer();
    } else {
        gameMessage.textContent = "You don't have enough coins to play!";
    }
});
standButton.addEventListener('click', () => {
    if (coins > 0 && betAmount <= coins) { // Check if player can gamble
        dealerTurn();
    } else {
        gameMessage.textContent = "You don't have enough coins to play!";
    }
});
resetButton.addEventListener('click', resetGame);
betInput.addEventListener('change', updateBet);

// Start the game
loadCoins();
updateCoins();
resetGame();
resetTimer(); // Reset de timer wanneer het spel begint

// Reset de timer en munten als de speler 0 coins heeft bij het herladen
if (coins <= 0) {
    startTimer(); // Start de timer opnieuw
} else {
    timerElement.style.display = 'none'; // Verberg de timer als er munten zijn
}

// Reset de timer wanneer de pagina wordt gesloten als de coins 0 zijn
window.onbeforeunload = function() {
    if (coins <= 0) {
        localStorage.setItem('timerReset', true); // Markeer dat de timer moet worden gereset
    }
};

// Reset de timer als de speler terugkomt en de timer was gemarkeerd om te resetten
if (localStorage.getItem('timerReset')) {
    localStorage.removeItem('timerReset'); // Verwijder de markering
    coins = 100; // Reset de munten
    saveCoins();
    updateCoins(); // Update de weergave van de munten
    gameMessage.textContent = "Timer has been reset to 100 coins!";
}
