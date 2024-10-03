const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-button');
const balanceDisplay = document.getElementById('balance');
const resultDisplay = document.getElementById('result');

let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 100;

// Symbolen op de rollen
const symbols = ['🍒', '🍋', '🔔', '🍇', '💎'];

// Functie voor het bijwerken van de balans
function updateBalance() {
    balanceDisplay.textContent = balance;
    localStorage.setItem('balance', balance); // Sla de balans op in localStorage
    if (balance <= 0) {
        alert("Je hebt geen munten meer! Herlaad de pagina om opnieuw te spelen.");
        spinButton.disabled = true; // Schakel de knop uit als de balans op is
    }
}

// Functie voor het draaien van de rollen
function spinReels() {
    if (balance <= 0) return;

    // Kies willekeurige symbolen voor elke rol
    const reel1Symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const reel2Symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const reel3Symbol = symbols[Math.floor(Math.random() * symbols.length)];

    // Toon de symbolen op de rollen
    reel1.textContent = reel1Symbol;
    reel2.textContent = reel2Symbol;
    reel3.textContent = reel3Symbol;

    // Controleer of er een winnende combinatie is
    if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
        balance += 50; // Winstbedrag
        resultDisplay.textContent = 'You Win 50 coins!';
    } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol || reel1Symbol === reel3Symbol) {
        balance += 20; // Winstbedrag voor 2 overeenkomende symbolen
        resultDisplay.textContent = 'You Win 20 coins!';
    } else {
        balance -= 10; // Verlies
        resultDisplay.textContent = 'You Lose 10 coins!';
    }

    updateBalance();
}

// Event listener voor de spin-knop
spinButton.addEventListener('click', spinReels);

// Laad de balans en update de display
updateBalance();
