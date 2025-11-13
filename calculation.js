// Timer System für Kostenberechnung
// Einstellbare Minuten pro Ingame-Stunde

let timerInterval = null;
let startTime = 0;
let elapsedTime = 0;
let isRunning = false;
let currentRate = 0;
let minutesPerGameHour = 10; // Standard: 10 Minuten = 1 Stunde
let sessionHistory = JSON.parse(localStorage.getItem('sessionHistory') || '[]');

// Timer-Funktionen
function startTimer() {
    if (!currentRate) {
        alert('⚠️ Bitte wählen Sie zuerst ein Rechtsgebiet aus!');
        return;
    }

    if (!isRunning) {
        startTime = Date.now() - elapsedTime;
        timerInterval = setInterval(updateDisplay, 100);
        isRunning = true;
        
        // Button states
        document.getElementById('startBtn').disabled = true;
        document.getElementById('pauseBtn').disabled = false;
        
        console.log('⏰ Timer gestartet für:', getSelectedServiceName());
    }
}

function pauseTimer() {
    if (isRunning) {
        clearInterval(timerInterval);
        isRunning = false;
        
        // Button states
        document.getElementById('startBtn').disabled = false;
        document.getElementById('pauseBtn').disabled = true;
        
        console.log('⏸️ Timer pausiert');
    }
}

function resetTimer() {
    // Speichere Session vor Reset wenn Zeit vorhanden
    if (elapsedTime > 0) {
        saveCurrentSession();
    }
    
    clearInterval(timerInterval);
    startTime = 0;
    elapsedTime = 0;
    isRunning = false;
    
    // Reset display
    updateDisplay();
    updateCostDisplay();
    
    // Button states
    document.getElementById('startBtn').disabled = false;
    document.getElementById('pauseBtn').disabled = true;
    
    console.log('🔄 Timer zurückgesetzt');
}

function updateDisplay() {
    if (isRunning) {
        elapsedTime = Date.now() - startTime;
    }
    
    // Formatiere Zeit (HH:MM:SS)
    const totalSeconds = Math.floor(elapsedTime / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    const timeString = 
        `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
    
    document.getElementById('timeDisplay').textContent = timeString;
    
    // Berechne Beratungsstunden basierend auf eingestellten Minuten
    const gameHours = (elapsedTime / 1000 / 60) / minutesPerGameHour;
    document.getElementById('gameHours').textContent = gameHours.toFixed(2);
    
    // Update cost
    updateCostDisplay();
}

function updateCostDisplay() {
    const gameHours = (elapsedTime / 1000 / 60) / minutesPerGameHour;
    const totalCost = gameHours * currentRate;
    
    document.getElementById('totalHours').textContent = gameHours.toFixed(2);
    document.getElementById('displayRate').textContent = `${currentRate}€`;
    document.getElementById('totalCost').textContent = `${totalCost.toFixed(2)}€`;
}

// Service Selection
function updateServiceDetails() {
    const select = document.getElementById('serviceType');
    const selectedOption = select.options[select.selectedIndex];
    
    if (selectedOption.value) {
        currentRate = parseInt(selectedOption.dataset.rate);
        document.getElementById('hourlyRate').textContent = `${currentRate}€`;
        
        // Update cost display
        updateCostDisplay();
        
        console.log(`💼 Service gewählt: ${selectedOption.text} - ${currentRate}€/Stunde`);
    } else {
        currentRate = 0;
        document.getElementById('hourlyRate').textContent = '0€';
        updateCostDisplay();
    }
}

function getSelectedServiceName() {
    const select = document.getElementById('serviceType');
    return select.options[select.selectedIndex].text || 'Unbekannt';
}

// Time Settings Management
function updateTimeSettings() {
    const input = document.getElementById('minutesPerHour');
    let newMinutes = parseInt(input.value);
    
    // Validierung
    if (newMinutes < 1 || newMinutes > 60 || isNaN(newMinutes)) {
        newMinutes = 10;
        input.value = 10;
        alert('⚠️ Bitte geben Sie eine Zahl zwischen 1 und 60 ein!');
    }
    
    minutesPerGameHour = newMinutes;
    
    // Update display text
    document.getElementById('intervalDisplay').textContent = 
        `${minutesPerGameHour} Min Realzeit = 1 Stunde Beratung`;
    
    // Save settings
    localStorage.setItem('minutesPerGameHour', minutesPerGameHour);
    
    // Update cost display if timer is running
    updateCostDisplay();
    
    console.log(`⚙️ Zeiteinstellung geändert: ${minutesPerGameHour} Min = 1 Stunde`);
}

function loadTimeSettings() {
    const savedMinutes = localStorage.getItem('minutesPerGameHour');
    if (savedMinutes) {
        minutesPerGameHour = parseInt(savedMinutes);
        document.getElementById('minutesPerHour').value = minutesPerGameHour;
        document.getElementById('intervalDisplay').textContent = 
            `${minutesPerGameHour} Min Realzeit = 1 Stunde Beratung`;
    }
}

// Session Management
function saveCurrentSession() {
    if (elapsedTime === 0) return;
    
    const gameHours = (elapsedTime / 1000 / 60) / minutesPerGameHour;
    const totalCost = gameHours * currentRate;
    
    const session = {
        id: Date.now(),
        date: new Date().toLocaleString('de-DE'),
        service: getSelectedServiceName(),
        realTime: formatElapsedTime(elapsedTime),
        gameHours: gameHours.toFixed(2),
        rate: currentRate,
        totalCost: totalCost.toFixed(2),
        minutesSetting: minutesPerGameHour
    };
    
    sessionHistory.unshift(session); // Add to beginning
    
    // Keep only last 20 sessions
    if (sessionHistory.length > 20) {
        sessionHistory = sessionHistory.slice(0, 20);
    }
    
    localStorage.setItem('sessionHistory', JSON.stringify(sessionHistory));
    updateHistoryDisplay();
    
    console.log('💾 Session gespeichert:', session);
}

function saveCalculation() {
    if (elapsedTime === 0) {
        alert('⚠️ Keine Zeit zum Speichern vorhanden!');
        return;
    }
    
    saveCurrentSession();
    alert('✅ Berechnung erfolgreich gespeichert!');
}

function printCalculation() {
    if (elapsedTime === 0) {
        alert('⚠️ Keine Berechnung zum Drucken vorhanden!');
        return;
    }
    
    const gameHours = (elapsedTime / 1000 / 60) / minutesPerGameHour;
    const totalCost = gameHours * currentRate;
    const serviceName = getSelectedServiceName();
    const currentDate = new Date().toLocaleString('de-DE');
    
    const printContent = `
        <!DOCTYPE html>
        <html>
        <head>
            <title>Rechnung - Kanzlei James Spader</title>
            <style>
                body { font-family: Arial, sans-serif; margin: 20px; }
                .header { text-align: center; border-bottom: 2px solid #d4af37; padding-bottom: 20px; }
                .invoice-details { margin: 30px 0; }
                .cost-table { width: 100%; border-collapse: collapse; margin: 20px 0; }
                .cost-table th, .cost-table td { border: 1px solid #ddd; padding: 12px; text-align: left; }
                .cost-table th { background-color: #f5f5f5; }
                .total-row { font-weight: bold; background-color: #f9f9f9; }
            </style>
        </head>
        <body>
            <div class="header">
                <h1>Kanzlei James Spader</h1>
                <h2>Rechnung</h2>
                <p>San Andreas Avenue 8061, Los Santos</p>
            </div>
            <div class="invoice-details">
                <p><strong>Datum:</strong> ${currentDate}</p>
                <p><strong>Rechtsgebiet:</strong> ${serviceName}</p>
                <p><strong>Beratungszeit:</strong> ${formatElapsedTime(elapsedTime)} (Realzeit)</p>
            </div>
            <table class="cost-table">
                <thead>
                    <tr>
                        <th>Leistung</th>
                        <th>Stunden</th>
                        <th>Stundensatz</th>
                        <th>Betrag</th>
                    </tr>
                </thead>
                <tbody>
                    <tr>
                        <td>${serviceName}</td>
                        <td>${gameHours.toFixed(2)}</td>
                        <td>${currentRate}€</td>
                        <td>${totalCost.toFixed(2)}€</td>
                    </tr>
                    <tr class="total-row">
                        <td colspan="3"><strong>Gesamtbetrag:</strong></td>
                        <td><strong>${totalCost.toFixed(2)}€</strong></td>
                    </tr>
                </tbody>
            </table>
            <p><em>Vielen Dank für das Vertrauen in unsere Kanzlei!</em></p>
        </body>
        </html>
    `;
    
    const printWindow = window.open('', '_blank');
    printWindow.document.write(printContent);
    printWindow.document.close();
    printWindow.print();
}

// History Display
function updateHistoryDisplay() {
    const historyContainer = document.getElementById('sessionHistory');
    
    if (sessionHistory.length === 0) {
        historyContainer.innerHTML = '<p class="no-sessions">Noch keine Sitzungen aufgezeichnet</p>';
        return;
    }
    
    const historyHTML = sessionHistory.map(session => `
        <div class="session-item">
            <div class="session-header">
                <span class="session-service">${session.service}</span>
                <span class="session-date">${session.date}</span>
            </div>
            <div class="session-details">
                <span class="session-time">⏱️ ${session.realTime} (${session.gameHours}h Beratung)</span>
                <span class="session-cost">💰 ${session.totalCost}€</span>
            </div>
            <div class="session-settings">
                <small>⚙️ ${session.minutesSetting || 10} Min/Std</small>
            </div>
        </div>
    `).join('');
    
    historyContainer.innerHTML = historyHTML;
}

// Utility Functions
function formatElapsedTime(milliseconds) {
    const totalSeconds = Math.floor(milliseconds / 1000);
    const hours = Math.floor(totalSeconds / 3600);
    const minutes = Math.floor((totalSeconds % 3600) / 60);
    const seconds = totalSeconds % 60;
    
    return `${hours.toString().padStart(2, '0')}:${minutes.toString().padStart(2, '0')}:${seconds.toString().padStart(2, '0')}`;
}

// Auto-save bei Page Unload
window.addEventListener('beforeunload', function() {
    if (elapsedTime > 0 && isRunning) {
        saveCurrentSession();
    }
});

// Initialize on page load
document.addEventListener('DOMContentLoaded', function() {
    loadTimeSettings();
    updateHistoryDisplay();
    updateDisplay();
    updateCostDisplay();
    
    // Mobile Navigation (from main script)
    const hamburger = document.querySelector('.hamburger');
    const navMenu = document.querySelector('.nav-menu');
    
    if (hamburger && navMenu) {
        hamburger.addEventListener('click', function() {
            hamburger.classList.toggle('active');
            navMenu.classList.toggle('active');
        });
    }
    
    console.log('🏛️ Kostenberechnung System geladen');
    console.log(`💡 ${minutesPerGameHour} Minuten Realzeit = 1 Stunde Beratung`);
});

// Keyboard shortcuts
document.addEventListener('keydown', function(e) {
    if (e.altKey) {
        switch(e.key) {
            case 's':
                e.preventDefault();
                if (!isRunning) startTimer();
                break;
            case 'p':
                e.preventDefault();
                if (isRunning) pauseTimer();
                break;
            case 'r':
                e.preventDefault();
                resetTimer();
                break;
        }
    }
});