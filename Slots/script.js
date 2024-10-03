const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-button');
const balanceDisplay = document.getElementById('balance');
const resultDisplay = document.getElementById('result');

let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 100;
let isSpinning = false; // Om ervoor te zorgen dat er minimaal 1s tussen spins zit

// Symbolen op de rollen
const symbols = ['🍒', '🍋', '🔔', '🍇', '💎', '❌', '❌']; // Voeg meer verliezen toe door '❌' toe te voegen

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
    if (balance <= 0 || isSpinning) return; // Stop als er wordt gesponnen of balans 0 is
    isSpinning = true; // Voorkom meer spins voordat de huidige is voltooid

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
        balance += 30; // Verlaag het winstbedrag
        resultDisplay.textContent = 'You Win 30 coins!';
    } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol || reel1Symbol === reel3Symbol) {
        balance += 10; // Verlaag het winstbedrag voor 2 overeenkomende symbolen
        resultDisplay.textContent = 'You Win 10 coins!';
    } else {
        balance -= 15; // Verhoog het verliesbedrag
        resultDisplay.textContent = 'You Lose 15 coins!';
    }

    updateBalance();

    // Wacht 1 seconde voordat er weer gesponnen kan worden
    setTimeout(() => {
        isSpinning = false; // Na 1 seconde kan de speler weer spinnen
    }, 1000);
}

// Event listener voor de spin-knop
spinButton.addEventListener('click', spinReels);

// Laad de balans en update de display
updateBalance();
