const reel1 = document.getElementById('reel1');
const reel2 = document.getElementById('reel2');
const reel3 = document.getElementById('reel3');
const spinButton = document.getElementById('spin-button');
const balanceDisplay = document.getElementById('balance');
const resultDisplay = document.getElementById('result');
const betInput = document.getElementById('bet'); // Inzetveld

let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 100;
let isSpinning = false;

// Symbolen op de rollen (meer verlieskansen door meer '❌')
const symbols = ['🍒', '🍋', '🔔', '🍇', '💎', '❌', '❌', '❌', '❌'];

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
    isSpinning = true;

    let bet = parseInt(betInput.value); // Verkrijg de inzet van de speler

    // Zorg ervoor dat de inzet geldig is
    if (isNaN(bet) || bet <= 0 || bet > balance) {
        alert("Ongeldige inzet! Zorg ervoor dat de inzet een positief getal is en je genoeg balans hebt.");
        isSpinning = false;
        return;
    }

    // Kies willekeurige symbolen voor elke rol
    const reel1Symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const reel2Symbol = symbols[Math.floor(Math.random() * symbols.length)];
    const reel3Symbol = symbols[Math.floor(Math.random() * symbols.length)];

    // Toon de symbolen op de rollen
    reel1.textContent = reel1Symbol;
    reel2.textContent = reel2Symbol;
    reel3.textContent = reel3Symbol;

    // Controleer of er een winnende combinatie is (alleen bij drie dezelfde symbolen)
    if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
        balance += bet * 2; // Verdubbel de inzet bij een volledige match
        resultDisplay.textContent = `You Win ${bet * 2} coins!`;
    } else {
        balance -= bet; // Verlies het ingezette bedrag
        resultDisplay.textContent = `You Lose ${bet} coins!`;
    }

    updateBalance();

    // Wacht 1 seconde voordat er weer gesponnen kan worden
    setTimeout(() => {
        isSpinning = false;
    }, 1000);
}

// Event listener voor de spin-knop
spinButton.addEventListener('click', spinReels);

// Laad de balans en update de display
updateBalance();
