<!DOCTYPE html>
<html lang="en">
<head>
    <meta charset="UTF-8">
    <meta name="viewport" content="width=device-width, initial-scale=1.0">
    <title>Slot Machine</title>
    <style>
        /* Basisstijl voor de rollen en het spel */
        #reel1, #reel2, #reel3 {
            display: inline-block;
            font-size: 48px;
            width: 50px;
            height: 50px;
            border: 2px solid black;
            margin: 10px;
            text-align: center;
            vertical-align: middle;
            line-height: 50px;
            transition: transform 0.3s ease-out; /* Voor een smooth animatie */
        }
        /* Stijl voor de spin-knop */
        #spin-button {
            display: block;
            margin-top: 20px;
            padding: 10px 20px;
            font-size: 20px;
            cursor: pointer;
        }
    </style>
</head>
<body>
    <div id="reel1">🍒</div>
    <div id="reel2">🍋</div>
    <div id="reel3">🔔</div>
    <div>
        <input id="bet" type="number" placeholder="Bet amount" />
        <button id="spin-button">Spin</button>
    </div>
    <p>Balance: <span id="balance"></span></p>
    <p id="result"></p>

    <script>
        const reel1 = document.getElementById('reel1');
        const reel2 = document.getElementById('reel2');
        const reel3 = document.getElementById('reel3');
        const spinButton = document.getElementById('spin-button');
        const balanceDisplay = document.getElementById('balance');
        const resultDisplay = document.getElementById('result');
        const betInput = document.getElementById('bet');

        let balance = localStorage.getItem('balance') ? parseInt(localStorage.getItem('balance')) : 100;
        let isSpinning = false;

        // Symbolen op de rollen (meer winnende symbolen, minder verlieskansen)
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
            function startReelAnimation(reel, delay) {
                let index = 0;
                return setInterval(() => {
                    reel.textContent = symbols[index];
                    reel.style.transform = `rotate(${Math.random() * 20 - 10}deg)`; // Kleine rotatie voor leuk effect
                    index = (index + 1) % symbols.length;
                }, 100); // Elke 100ms wisselen
            }

            reel1Interval = startReelAnimation(reel1, 0);
            reel2Interval = startReelAnimation(reel2, 200);
            reel3Interval = startReelAnimation(reel3, 400);

            // Functie om de rollen één voor één te stoppen
            function stopReel(reel, interval, symbol) {
                setTimeout(() => {
                    clearInterval(interval);
                    reel.textContent = symbol;
                    reel.style.transform = `rotate(0deg)`; // Reset rotatie
                }, 1000); // Stop na 1 seconde
            }

            // Willekeurige symbolen voor de uiteindelijke stoppositie
            const reel1Symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const reel2Symbol = symbols[Math.floor(Math.random() * symbols.length)];
            const reel3Symbol = symbols[Math.floor(Math.random() * symbols.length)];

            // Stop de rollen één voor één
            setTimeout(() => stopReel(reel1, reel1Interval, reel1Symbol), 1000);
            setTimeout(() => stopReel(reel2, reel2Interval, reel2Symbol), 1200);
            setTimeout(() => stopReel(reel3, reel3Interval, reel3Symbol), 1400);

            // Bereken resultaat en update balans
            setTimeout(() => {
                if (reel1Symbol === reel2Symbol && reel2Symbol === reel3Symbol) {
                    balance += bet * 3;
                    resultDisplay.textContent = `You Win ${bet * 3} coins!`;
                } else if (reel1Symbol === reel2Symbol || reel2Symbol === reel3Symbol || reel1Symbol === reel3Symbol) {
                    balance += bet;
                    resultDisplay.textContent = `You Win ${bet} coins!`;
                } else {
                    balance -= bet;
                    resultDisplay.textContent = `You Lose ${bet} coins!`;
                }

                updateBalance();
                isSpinning = false;
            }, 1500); // Resultaat na alle rollen gestopt zijn
        }

        // Event listener voor de spin-knop
        spinButton.addEventListener('click', spinReels);

        // Laad de balans en update de display
        updateBalance();
    </script>
</body>
</html>
