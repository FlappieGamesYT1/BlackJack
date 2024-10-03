// Referenties naar DOM-elementen
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

const cardSound = document.getElementById('card-sound'); // Geluidsreferentie

// Spelvariabelen
let playerScore = 0;
let dealerScore = 0;
let playerCards = [];
let dealerCards = [];
let deck = [];
let betAmount = 10;
let timer;
let timeLeft = 60; // Timer op 60 seconden
let timerActive = false; // Houd bij of de timer actief is
let balance; // Gedeelde muntenbalans

// Laad munten uit localStorage
function loadCoins() {
    const savedBalance = localStorage.getItem('balance');
    balance = savedBalance ? parseInt(savedBalance) : 100;
}

// Sla munten op in localStorage
function saveCoins() {
    localStorage.setItem('balance', balance);
}

// Initialiseert het deck met kaarten
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

// Berekent de waarde van een kaart
function cardValue(card) {
    if (['J', 'Q', 'K'].includes(card.value)) return 10;
    if (card.value === 'A') return 11;
    return parseInt(card.value);
}

// Voegt een kaart toe aan de speler
function addCardToPlayer() {
    const card = deck.pop();
    playerCards.push(card);
    playerScore += cardValue(card);
    renderCard(card, playerCardsContainer);
    updateScores();
    checkPlayerBust();
}

// Voegt een kaart toe aan de dealer
function addCardToDealer() {
    const card = deck.pop();
    dealerCards.push(card);
    dealerScore += cardValue(card);
    renderCard(card, dealerCardsContainer);
    updateScores();
}

// Render een kaart in de opgegeven container
function renderCard(card, container) {
    const cardElement = document.createElement('div');
    cardElement.classList.add('card');
    cardElement.textContent = `${card.value}${card.suit}`;
    container.appendChild(cardElement);
    
    cardSound.play(); // Speel het geluid af bij het draaien van de kaart

    setTimeout(() => {
        cardElement.classList.add('flip'); // Voeg flip animatie toe
    }, 100);
}

// Update de scores van de speler en dealer
function updateScores() {
    playerScoreElement.textContent = `Score: ${playerScore}`;
    dealerScoreElement.textContent = `Score: ${dealerScore}`;
}

// Controleer of de speler bust is
function checkPlayerBust() {
    if (playerScore > 21) {
        gameMessage.textContent = "Player Busted! Dealer Wins!";
        balance -= betAmount;
        updateCoins();
        disableButtons();
    }
}

// Controleer of de dealer bust is
function checkDealerBust() {
    if (dealerScore > 21) {
        gameMessage.textContent = "Dealer Busted! Player Wins!";
        balance += betAmount * 2;
        updateCoins();
    }
}

// De beurt van de dealer
function dealerTurn() {
    while (dealerScore < 17) {
        addCardToDealer();
    }
    checkDealerBust();
    if (dealerScore <= 21) {
        if (dealerScore > playerScore) {
            gameMessage.textContent = "Dealer Wins!";
            balance -= betAmount;
        } else if (dealerScore === playerScore) {
            gameMessage.textContent = "It's a Tie!";
        } else {
            gameMessage.textContent = "Player Wins!";
            if (playerScore === 21) {
                balance += betAmount * 5; // Win met precies 21
                gameMessage.textContent = "Player Wins with 21! x5 your bet!";
            } else {
                balance += betAmount * 2; // Win met meer dan dealer
            }
        }
        updateCoins();
    }
    disableButtons();
}

// Update de weergave van munten
function updateCoins() {
    coinsElement.textContent = `Coins: ${balance}`;
    saveCoins();
    if (balance <= 0) {
        timerElement.style.display = 'block'; // Toon de timer wanneer munten op zijn
        if (!timerActive) {
            startTimer(); // Start de timer als munten op zijn
        }
    } else {
        timerElement.style.display = 'none'; // Verberg de timer als er munten zijn
        clearInterval(timer); // Stop de timer als de speler weer munten heeft
        timerActive = false;
        resetTimer(); // Reset de timerweergave
    }
}

// Start de timer
function startTimer() {
    timerActive = true; // Markeer timer als actief
    timeLeft = 60; // Reset tijd naar 60 seconden
    timerElement.textContent = `Timer: ${timeLeft} seconds`;
    
    timer = setInterval(() => {
        timeLeft--;
        timerElement.textContent = `Timer: ${timeLeft} seconds`;
        if (timeLeft <= 0) {
            clearInterval(timer);
            balance = 100; // Reset munten
            saveCoins();
            updateCoins();
            gameMessage.textContent = "You have been reset to 100 coins!";
        }
    }, 1000);
}

// Reset de timerweergave
function resetTimer() {
    timeLeft = 60; // Reset tijd naar 60 seconden
    timerElement.textContent = `Timer: ${timeLeft} seconds`;
    clearInterval(timer);
}

// Schakel knoppen uit
function disableButtons() {
    hitButton.disabled = true;
    standButton.disabled = true;
}

// Schakel knoppen in
function enableButtons() {
    hitButton.disabled = false;
    standButton.disabled = false;
}

// Reset het spel
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
    betInput.disabled = false; // Zet de inzetinvoer weer aan
}

// Update de inzet
function updateBet() {
    const newBet = parseInt(betInput.value);
    if (newBet > 0 && newBet <= balance) {
        betAmount = newBet;
        gameMessage.textContent = ""; // Reset message als de inzet geldig is
    } else {
        gameMessage.textContent = "Invalid bet amount!"; // Toon foutmelding voor ongeldige inzet
    }
}

// Event listeners
hitButton.addEventListener('click', () => {
    if (balance > 0 && betAmount <= balance) { // Check of de speler kan spelen
        addCardToPlayer();
        betInput.disabled = true; // Zet de inzetinvoer uit na het trekken van een kaart
    } else {
        gameMessage.textContent = "You don't have enough coins to play!";
    }
});

standButton.addEventListener('click', () => {
    if (balance > 0 && betAmount <= balance) { // Check of de speler kan spelen
        dealerTurn();
    } else {
        gameMessage.textContent = "You don't have enough coins to play!";
    }
});

resetButton.addEventListener('click', resetGame);
betInput.addEventListener('change', updateBet);

// Start het spel
loadCoins();
updateCoins();
resetGame();
resetTimer(); // Reset de timer bij het begin van het spel

// Reset de timer als de speler 0 coins heeft bij het herladen
if (balance <= 0) {
    startTimer(); // Start de timer opnieuw
} else {
    timerElement.style.display = 'none'; // Verberg de timer als er munten zijn
}

// Reset de timer wanneer de pagina wordt gesloten als de coins 0 zijn
window.onbeforeunload = function() {
    if (balance <= 0) {
        localStorage.setItem('timerReset', true); // Markeer dat de timer moet worden gereset
    }
};

// Reset de timer als de speler terugkomt en de timer was gemarkeerd om te resetten
if (localStorage.getItem('timerReset')) {
    localStorage.removeItem('timerReset'); // Verwijder de markering
    balance = 100; // Reset de munten
    saveCoins();
    updateCoins(); // Update de weergave van de munten
    gameMessage.textContent = "Timer has been reset to 100 coins!";
}
