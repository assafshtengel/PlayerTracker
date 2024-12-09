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

    // כל 60 שניות מוסיף דקה
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

    // שאל המשתמש כמה דקות שיחק
    const minutesPlayed = parseInt(prompt("כמה דקות שיחקת?", "60")) || 0;
    const score = calculateScore(minutesPlayed);

    // עדכון פרטי השחקן בסיכום המשחק
    document.getElementById("player-display-summary").textContent = document.getElementById("player-display").textContent;
    document.getElementById("game-date-summary").textContent = document.getElementById("game-date").textContent;
    document.getElementById("team-display-summary").textContent = document.getElementById("team-display").textContent;

    const counts = getActionCounts();
    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(counts, "סיכום המשחק");
    summaryContent.innerHTML += `<h3>ציון סיום המשחק שלך: ${score}</h3>`;

    const popup = document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    setTimeout(() => {
        showFeedback(score, minutesPlayed);
    }, 500);
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
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();

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

function calculateScore(minutesPlayed) {
    let score = 40;
    let successfulActions = 0;
    let totalActions = actions.length;

    actions.forEach(({ result }) => {
        if (result.includes("מוצלח") || result.includes("טוב") || result.includes("חיובית")) {
            score += 3;
            successfulActions++;
        } else if (result.includes("רעה") || result.includes("לא מוצלח") || result.includes("לא טוב") || result.includes("שלילית")) {
            score += 1;
        }
    });

    if (totalActions >= 10) {
        score += 5;
    } else if (totalActions >= 5) {
        score += 2;
    }

    if (minutesPlayed > 0) {
        let minuteFactor = (60 - minutesPlayed) / 60;
        score = score + Math.floor((successfulActions / minutesPlayed) * 10 * minuteFactor);
        score = Math.min(96 - Math.floor(minuteFactor * 10), score);
    }

    return Math.min(96, score);
}

function showFeedback(score, minutesPlayed) {
    let feedback = "";
    let successfulActions = actions.filter(a => 
        a.result.includes("מוצלח") || a.result.includes("טוב") || a.result.includes("חיובית")
    ).length;

    if (score > 85) {
        feedback = "מצוין! נתת משחק יוצא דופן. המשך להתאמן ולהיות ממוקד!";
    } else if (score > 70) {
        feedback = "ביצוע טוב מאוד, רואים שהשקעת מאמץ רב. שים לב לדייק יותר בפעולות מסוימות.";
    } else if (score > 55) {
        feedback = "עשית עבודה טובה, אך יש מקום לשיפור. נסה לשפר את הדיוק והקבלת החלטות.";
    } else {
        feedback = "יש הרבה מקום לשיפור. אל תתייאש, למד מהטעויות ושפר את המיומנויות שלך.";
    }

    if (minutesPlayed < 30) {
        feedback += " שיחקת פחות מ-30 דקות, נסה להעלות את הכושר.";
    }

    if (actions.length >= 4) {
        feedback += " ביצעת יותר מ-4 פעולות מוצלחות - יפה!";
    }

    if (successfulActions > 5) {
        feedback += " יש לך מעל 5 פעולות מוצלחות, המשך כך!";
    }

    if (score < 50 && successfulActions > 3) {
        feedback += " למרות הציון הנמוך, יש פעולות מוצלחות. המשך לעבוד!";
    }

    if (actions.length > 15) {
        feedback += " ביצעת הרבה פעולות - נחישות יפה!";
    }

    // נבדוק מנהיגות: חיובית ולא רק מנהיגות
    let counts = getActionCounts();
    if ((counts['מנהיגות: חיובית'] || 0) > 3) {
        feedback += " אתה מראה כישורי מנהיגות מרשימים!";
    }

    document.getElementById("feedback-text").textContent = feedback;
    const feedbackPopup = document.getElementById("feedback-popup");
    feedbackPopup.classList.remove("hidden");
}

function closeFeedbackPopup() {
    document.getElementById("feedback-popup").classList.add("hidden");
}
