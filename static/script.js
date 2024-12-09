let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;

// הגדרת פעולות לפי תפקיד
const positionActions = {
    "שוער": [
        "שמירה על השער", "הפצצה", "תפיסה", "הפעלה מהשער", "תמרון", "התמודדות עם כדרור", "משחק רגל",
        "יציאה לשליפה", "שליטה בכדור", "חסימה", "הפניה", "שליחת כדור לעומק", "לחץ אחרי איבוד כדור",
        "הפסקת משחק", "הנעת הגנת הקבוצה"
    ],
    "בלם": [
        "כיבוש אזור הגנה", "חסימה", "הובלת ההגנה", "שינוי כיוון", "לחץ על התוקף", "התמודדות עם חבטות",
        "תפיסה במרחק", "הפנייה לצדדים", "משחק עם הכדור", "הובלת הכדור לאחור", "שליטה בכדור",
        "הפנייה למגן", "הפסקת מהירות", "מניעת מעברים", "הנעת ההגנה"
    ],
    "מגן": [
        "הפנייה קדימה", "משחק קשר", "שליטה בכדור", "הובלת הכדור", "יצירת קשרים", "לחץ על התוקפים",
        "התמודדות עם כדרור", "הפנייה לצדדים", "משחק רגל", "הפצצה", "חסימה", "שינוי כיוון",
        "הובלת הכדור קדימה", "משחק קצר", "הנעת הקבוצה"
    ],
    "קשר": [
        "יצירת קשרים", "הובלת הכדור", "שליטה בכדור", "הפנייה למתקפה", "משחק קצר", "הפצצה",
        "שליחת כדור לעומק", "לחץ על התוקפים", "התמודדות עם כדרור", "משחק רגל", "הובלת המשחק",
        "משחק מהיר", "הפנייה לצדדים", "משחק ריצה", "הנעת המתקפה"
    ],
    "חלוץ": [
        "גול", "חבטה בכיוון", "לחיצה על השוער", "קבלת כדור", "סיום מהירות", "משחק אוויר",
        "שליטה בכדור בסמוך לשער", "שינוי כיוון", "חסימה", "התמודדות עם הגנה", "משחק עם השוער",
        "שליחת כדור חזרה", "משחק רגל", "הפצנה מהירה", "הנעת ההתקפה"
    ]
};

// פעולות מנהיגות
const leadershipActions = [
    "הנעת הקבוצה", "תקשורת עם השחקנים", "הכוונת ההגנה", "מתן עצות", "שמירה על רוח גבוהה",
    "תיאום עם השופט", "ניהול זמן המשחק", "פתרון סכסוכים", "הובלת האימונים", "קבלת החלטות"
];

// פעולה נבחרת כרגע לבחירת תוצאה
let currentAction = null;

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;

    if (!playerName || !teamName || !playerPosition) {
        alert("אנא מלא את כל השדות");
        return;
    }

    document.getElementById("player-display").textContent = `שם: ${playerName}`;
    document.getElementById("team-display").textContent = `קבוצה: ${teamName}`;
    document.getElementById("player-position-display").textContent = playerPosition;

    const today = new Date().toLocaleDateString("he-IL");
    document.getElementById("game-date").textContent = `תאריך: ${today}`;

    document.getElementById("user-input-container").classList.add("hidden");
    document.getElementById("game-info").classList.remove("hidden");

    loadActionsSelection(playerPosition);
}

function loadActionsSelection(position) {
    const actionsContainer = document.getElementById("actions-selection-container");
    const actionsList = document.getElementById("actions-list");
    actionsList.innerHTML = "";

    const actionsForPosition = positionActions[position] || [];
    const allActions = [...actionsForPosition, ...leadershipActions];

    allActions.forEach((action, index) => {
        const actionId = `action-${index}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = actionId;
        checkbox.value = action;
        checkbox.name = "selected-actions";

        const label = document.createElement("label");
        label.htmlFor = actionId;
        label.textContent = action;

        const div = document.createElement("div");
        div.classList.add("action-item");
        div.appendChild(checkbox);
        div.appendChild(label);

        actionsList.appendChild(div);
    });

    actionsContainer.classList.remove("hidden");
}

function confirmActions() {
    const checkboxes = document.querySelectorAll('input[name="selected-actions"]:checked');
    if (checkboxes.length < 7 || checkboxes.length > 9) {
        alert("אנא בחר בין 7 ל-9 פעולות.");
        return;
    }

    selectedActions = Array.from(checkboxes).map(cb => cb.value);

    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
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

    actionsContainer.innerHTML = "";
    selectedActions.forEach(action => {
        const button = document.createElement("button");
        button.textContent = action;
        button.classList.add("action-button");
        button.onclick = () => openResultSelection(action);
        actionsContainer.appendChild(button);
    });

    enableActions(true);

    gameMinute = 0;
    actions = [];

    document.getElementById("minute-counter").textContent = gameMinute;

    // סטופר - כל דקה מעלה את הדקה
    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    const endButtons = document.getElementById("end-buttons-container");
    endButtons.classList.remove("hidden");
}

function openResultSelection(action) {
    currentAction = action;
    const resultPopup = document.getElementById("result-selection-popup");
    resultPopup.classList.remove("hidden");
    resultPopup.classList.add("active");
}

function selectResult(result) {
    if (!currentAction) {
        alert("פעולה לא מוגדרת!");
        return;
    }
    trackAction(currentAction, result);
    currentAction = null;
    closeResultSelection();
}

function closeResultSelection() {
    const resultPopup = document.getElementById("result-selection-popup");
    resultPopup.classList.add("hidden");
    resultPopup.classList.remove("active");
}

function trackAction(action, result) {
    if (!gameInterval) {
        alert("לא ניתן לרשום פעולה כאשר הסטופר לא פעיל!");
        return;
    }
    actions.push({ action, result, minute: gameMinute });
    showPopup(`הפעולה "${action} - ${result}" נרשמה!`);
}

function showPopup(message) {
    const popup = document.getElementById("popup-message");
    popup.textContent = message;
    popup.classList.remove("hidden");
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 2000);
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
    console.log("endGame called"); // בדיקה האם הפונקציה רצה
    if (gameInterval) {
        clearInterval(gameInterval);
        gameInterval = null;
    }

    enableActions(false);

    const counts = getActionCounts();
    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(counts, "סיכום המשחק");

    // עדכון פרטי השחקן בסיכום המשחק
    document.getElementById("player-display-summary").textContent = document.getElementById("player-display").textContent;
    document.getElementById("game-date-summary").textContent = document.getElementById("game-date").textContent;
    document.getElementById("team-display-summary").textContent = document.getElementById("team-display").textContent;

    const minutesPlayed = gameMinute;
    const score = calculateScore(minutesPlayed);
    summaryContent.innerHTML += `<h3>ציון סיום המשחק שלך: ${score}</h3>`;

    const popup = document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    // הצגת פידבק אישי
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
    if (["מוצלח", "טוב", "חיובית"].includes(result)) return "good";
    if (["רעה", "לא מוצלח", "לא טוב", "שלילית"].includes(result)) return "bad";
    return "neutral";
}

function enableActions(enable) {
    const buttons = document.querySelectorAll('#actions-container .action-button');
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

    actions.forEach(({ action, result }) => {
        if (["מוצלח", "טוב", "חיובית"].includes(result)) {
            score += 3;
            successfulActions++;
        } else if (["רעה", "לא מוצלח", "לא טוב", "שלילית"].includes(result)) {
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
    if (score > 85) {
        feedback = "מצוין! נתת משחק יוצא דופן. המשך להתאמן ולהיות ממוקד!";
    } else if (score > 70) {
        feedback = "ביצוע טוב מאוד, רואים שהשקעת מאמץ רב. שים לב לדייק יותר בפעולות מסוימות.";
    } else if (score > 55) {
        feedback = "עשית עבודה טובה, אך יש מקום לשיפור.";
    } else {
        feedback = "יש הרבה מקום לשיפור. אל תתייאש, התמקד בלמידה מהטעויות ושיפור המיומנויות שלך.";
    }

    if (minutesPlayed < 30) {
        feedback += " שיחקת פחות מ-30 דקות, נסה לשפר את הכושר ולשחק יותר זמן.";
    }

    let successfulActions = actions.filter(a => ["מוצלח", "טוב", "חיובית"].includes(a.result)).length;

    if (actions.length >= 4) {
        feedback += " ביצעת יותר מ-4 פעולות מוצלחות - כל הכבוד!";
    }

    if (successfulActions > 5) {
        feedback += " מעל 5 פעולות מוצלחות, המשך כך!";
    }

    if (score < 50 && successfulActions > 3) {
        feedback += " למרות הציון הנמוך, רואים שיש לך פעולות מוצלחות - המשך לעבוד!";
    }

    if (actions.length > 15) {
        feedback += " ביצעת הרבה פעולות - נחישות ופעילות גבוהה!";
    }

    if (getActionCounts()['מנהיגות: חיובית'] > 3) {
        feedback += " אתה מראה מנהיגות חזקה, כל הכבוד!";
    }

    document.getElementById("feedback-text").textContent = feedback;
    const feedbackPopup = document.getElementById("feedback-popup");
    feedbackPopup.classList.remove("hidden");
}

function closeFeedbackPopup() {
    const feedbackPopup = document.getElementById("feedback-popup");
    feedbackPopup.classList.add("hidden");
}
