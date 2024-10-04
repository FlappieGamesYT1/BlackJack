let currentBalance = 100; // Startbalans
let horsePositions = [0, 0, 0, 0, 0]; // Posities van de vijf paarden

// Laad de balans uit localStorage bij het laden van de pagina
window.onload = loadCoins;

document.getElementById("bet-button").onclick = function() {
    const betInput = document.getElementById("bet-input").value;
    const horseInput = document.getElementById("horse-input").value; // Correcte input voor paardnummer
    const betAmount = parseInt(betInput);
    const horseNumber = parseInt(horseInput) - 1; // Paardnummer (0-indexed)

    // Validatie van invoer
    if (isNaN(betAmount) || betAmount <= 0 || horseNumber < 0 || horseNumber > 4) {
        alert("Kies een geldig paard (1-5) en een inzet (1-100).");
        return;
    }

    if (currentBalance < betAmount) {
        alert("Niet genoeg munten!");
        return;
    }

    // Inzet en paardkeuze blokkeren
    document.getElementById("bet-input").disabled = true;
    document.getElementById("horse-input").disabled = true;
    document.getElementById("bet-button").disabled = true;

    // Start de race
    startRace(horseNumber, betAmount);
};

function startRace(selectedHorse, betAmount) {
    // Reset posities van de paarden
    horsePositions = [0, 0, 0, 0, 0];
    document.getElementById("result-message").innerText = "";
    
    // Update huidige balans
    document.getElementById("current-balance").innerText = currentBalance;

    // Race simuleren
    const raceInterval = setInterval(() => {
        for (let i = 0; i < horsePositions.length; i++) {
            // Beweeg het paard
            horsePositions[i] += Math.random() * 10; // Beweeg elke keer een beetje
            document.getElementById(`horse${i + 1}`).style.left = horsePositions[i] + 'px';
        }

        // Controleer op een winnaar
        const winner = horsePositions.findIndex(pos => pos >= 320); // 320px is de finishlijn
        if (winner !== -1) {
            clearInterval(raceInterval); // Stop de race
            handleResult(winner, selectedHorse, betAmount);
        }
    }, 100);
}

function handleResult(winner, selectedHorse, betAmount) {
    const resultMessage = document.getElementById("result-message");
    if (winner === selectedHorse) {
        resultMessage.innerText = `Paard ${winner + 1} heeft gewonnen! Je hebt gewonnen!`;
        currentBalance += betAmount * 5; // Win 5x het ingezette bedrag
    } else {
        resultMessage.innerText = `Paard ${winner + 1} heeft gewonnen! Je hebt verloren!`;
        currentBalance -= betAmount; // Verlies het ingezette bedrag
    }
    document.getElementById("current-balance").innerText = currentBalance;

    // Sla de nieuwe balans op in localStorage
    saveCoins();

    // Reset de inzet en paardkeuze na de race
    resetGame();
}

function resetGame() {
    // Schakel de invoervelden weer in voor de volgende ronde
    document.getElementById("bet-input").disabled = false;
    document.getElementById("horse-input").disabled = false;
    document.getElementById("bet-button").disabled = false;

    // Reset de posities van de paarden voor de volgende race
    horsePositions = [0, 0, 0, 0, 0];
    for (let i = 0; i < 5; i++) {
        document.getElementById(`horse${i + 1}`).style.left = '0px';
    }
}

// Laad munten uit localStorage
function loadCoins() {
    const savedBalance = localStorage.getItem('balance');
    currentBalance = savedBalance ? parseInt(savedBalance) : 100; // Huidige balans
    document.getElementById("current-balance").innerText = currentBalance; // Update de weergegeven balans
}

// Sla munten op in localStorage
function saveCoins() {
    localStorage.setItem('balance', currentBalance);
}
