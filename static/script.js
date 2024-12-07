let actions = [];
let gameInterval = null;
let gameMinute = 0;

function trackAction(action, result) {
    if (!gameInterval) {
        alert("לא ניתן לרשום פעולה כאשר הסטופר לא פעיל!");
        return;
    }
    actions.push({ action, result, minute: gameMinute });
    showPopup(`הפעולה "${action} - ${result}" נרשמה!`);
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.classList.remove("hidden");
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 1000);
}

function startGame() {
    const startGameButton = document.getElementById("start-game-container");
    startGameButton.classList.add("hidden");

    const timer = document.getElementById("game-timer");
    timer.classList.remove("hidden");

    const actionsTitle = document.getElementById("actions-title");
    const actionsContainer = document.getElementById("actions-container");
    actionsTitle.classList.remove("hidden");
    actionsContainer.classList.remove("hidden");

    enableActions(true);

    gameMinute = 0;
    actions = [];
    document.getElementById("minute-counter").textContent = gameMinute;

    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    const endButtons = document.getElementById("end-buttons-container");
    endButtons.classList.remove("hidden");
}

function endHalfTime() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    enableActions(false);

    const counts = getActionCounts();
    const halfSummaryContent = document.getElementById("half-summary-content");
    halfSummaryContent.innerHTML = getSummaryHTML(counts, "סיכום המחצית");

    const halfPopup = document.getElementById("half-time-summary-popup");
    halfPopup.classList.remove("hidden");
    halfPopup.classList.add("active");
}

function resumeHalf() {
    const halfPopup = document.getElementById("half-time-summary-popup");
    halfPopup.classList.remove("active");
    halfPopup.classList.add("hidden");

    // ממשיכים מהנקודה שעצרנו, בלי איפוס זמן
    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    enableActions(true);
}

function endGame() {
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    enableActions(false);

    const counts = getActionCounts();
    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(counts, "סיכום המשחק");

    const popup = document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closePopup() {
    const popup = document.getElementById("game-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function showAllActions() {
    const allActionsList = document.getElementById("all-actions-list");
    allActionsList.innerHTML = "";

    const allActionsHTML = actions.map(({ action, result, minute }) => {
        let className = classifyResult(result);
        return `<p class="${className}">דקה ${minute}: ${action} - ${result}</p>`;
    }).join("");

    allActionsList.innerHTML = allActionsHTML;

    const actionsDetailPopup = document.getElementById("actions-detail-popup");
    actionsDetailPopup.classList.remove("hidden");
    actionsDetailPopup.classList.add("active");
}

function closeAllActionsPopup() {
    const actionsDetailPopup = document.getElementById("actions-detail-popup");
    actionsDetailPopup.classList.remove("active");
    actionsDetailPopup.classList.add("hidden");
}

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value;
    const teamName = document.getElementById("team-name").value;

    if (!playerName || !teamName) {
        alert("אנא מלא את כל השדות");
        return;
    }

    document.getElementById("player-display").textContent = playerName;
    document.getElementById("team-display").textContent = teamName;

    const today = new Date().toLocaleDateString("he-IL");
    document.getElementById("game-date").textContent = today;

    document.getElementById("user-input-container").classList.add("hidden");
    document.getElementById("game-info").classList.remove("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
}

function getActionCounts() {
    return actions.reduce((acc, { action, result }) => {
        const key = `${action}: ${result}`;
        acc[key] = (acc[key] || 0) + 1;
        return acc;
    }, {});
}

function getSummaryHTML(counts, title) {
    const summaryHTML = Object.entries(counts)
        .map(([key, count]) => {
            const className = classifyKey(key);
            return `<p class="${className}">${key}: ${count} פעמים</p>`;
        })
        .join("");
    return `<h3>${title}:</h3>${summaryHTML}`;
}

function classifyKey(key) {
    if (key.includes("מוצלח") || key.includes("טוב") || key.includes("חיובית")) return "good";
    if (key.includes("רעה") || key.includes("לא מוצלח") || key.includes("לא טוב") || key.includes("שלילית")) return "bad";
    return "neutral";
}

function classifyResult(result) {
    if (result.includes("מוצלח") || result.includes("טוב") || result.includes("חיובית")) return "good";
    if (result.includes("רעה") || result.includes("לא מוצלח") || result.includes("לא טוב") || result.includes("שלילית")) return "bad";
    return "neutral";
}

function enableActions(enable) {
    const buttons = document.querySelectorAll('.good-action, .bad-action, .neutral-action');
    buttons.forEach(button => {
        if (enable) {
            button.removeAttribute('disabled');
        } else {
            button.setAttribute('disabled', 'disabled');
        }
    });
}

// פונקציית הורדת CSV חדשה:
function downloadCSV() {
    let csvContent = "data:text/csv;charset=utf-8,action,result,minute\n";
    actions.forEach(a => {
        csvContent += `${a.action},${a.result},${a.minute}\n`;
    });

    const encodedUri = encodeURI(csvContent);
    const link = document.createElement("a");
    link.setAttribute("href", encodedUri);
    link.setAttribute("download", "game_summary.csv");
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
}
