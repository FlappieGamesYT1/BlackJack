const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-button');
const balanceDisplay = document.getElementById('balance');
const resultDisplay = document.getElementById('result');
const betInput = document.getElementById('bet');

let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 100;
let isSpinning = false;

// Symbolen op de rollen
const symbols = ['🍒', '🍋', '🔔', '🍇', '💎', '🍒', '🔔', '💎', '❌'];

// Functie voor het bijwerken van de balans
function updateBalance() {
    balanceDisplay.textContent = balance;
    localStorage.setItem('balance', balance);
    if (balance <= 0) {
        alert("Je hebt geen munten meer! Herlaad de pagina om opnieuw te spelen.");
        spinButton.disabled = true;
    }
}

// Functie om de rollen te draaien met animatie
function spinReels() {
    if (balance <= 0 || isSpinning) return;
    isSpinning = true;

    let bet = parseInt(betInput.value);

    if (isNaN(bet) || bet <= 0 || bet > balance) {
        alert("Ongeldige inzet! Zorg ervoor dat de inzet een positief getal is en je genoeg balans hebt.");
        isSpinning = false;
        return;
    }

    let reel1Interval, reel2Interval, reel3Interval;

    // Start de animatie voor elke rol
    function startReelAnimation(reel) {
        let index = 0;
        return setInterval(() => {
            reel.textContent = symbols[index];
            reel.style.transform = `rotate(${Math.random() * 20 - 10}deg)`; // Kleine rotatie voor leuk effect
            index = (index + 1) % symbols.length;
        }, 100); // Elke 100ms wisselen
    }

    reel1Interval = startReelAnimation(reel1);
    reel2Interval = startReelAnimation(reel2);
    reel3Interval = startReelAnimation(reel3);

    // Functie om de rollen één voor één te stoppen
    function stopReel(reel, interval, symbol, delay) {
        setTimeout(() => {
            clearInterval(interval);
            reel.textContent = symbol;
            reel.style.transform = `rotate(0deg)`; // Reset rotatie
        }, delay); // Stop na een bepaalde vertraging
    }

    // Willekeurige symbolen voor de uiteindelijke stoppositie
    const reel1Symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const reel2Symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const reel3Symbol = symbols[Math.floor(Math.random() * symbols.length)];

    // Stop de rollen één voor één met vertraging
    stopReel(reel1, reel1Interval, reel1Symbol, 1000);
    stopReel(reel2, reel2Interval, reel2Symbol, 1200);
    stopReel(reel3, reel3Interval, reel3Symbol, 1400);

    // Bereken resultaat en update balans
    setTimeout(() => {
        if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
            balance += bet * 3;
            resultDisplay.textContent = `Je wint ${bet * 3} munten!`;
        } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol || reel1Symbol === reel3Symbol) {
            balance += bet;
            resultDisplay.textContent = `Je wint ${bet} munten!`;
        } else {
            balance -= bet;
            resultDisplay.textContent = `Je verliest ${bet} munten!`;
        }

        updateBalance();
        isSpinning = false;
    }, 1500); // Resultaat na alle rollen gestopt zijn
}

// Event listener voor de spin-knop
spinButton.addEventListener('click', spinReels);

// Laad de balans en update de display
updateBalance();
