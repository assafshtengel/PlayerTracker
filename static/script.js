let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let currentNoteAction = null;
let parentNotes = {}; // key: action name, value: note text

// פעולות מקצועיות (כוללות 1על1, מסירת מפתח, הגבהה לרחבה)
const positionActions = {
    "שוער": [
        "עצירת כדור קשה",
        "יציאה לאגרוף",
        "משחק רגל מדויק",
        "שליטה ברחבה",
        "תקשורת עם ההגנה",
        "יציאה לכדורי גובה",
        "מסירה ארוכה מדויקת",
        "סגירת זויות בעיטות",
        "תגובות מהירות",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "בלם": [
        "בלימת התקפה יריבה",
        "משחק ראש מוצלח",
        "סגירת תוקף",
        "חטיפת כדור",
        "הנעת כדור אחורה בבטחה",
        "משחק רוחב מדויק",
        "סגירת קווי מסירה",
        "הגנה על הרחבה",
        "הובלת הכדור קדימה",
        "החזרת כדור לשוער",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "מגן": [
        "הגבהה מדויקת לרחבה",
        "תמיכה בהתקפה באגף",
        "כיסוי הגנתי באגף",
        "תקשורת עם הקשר",
        "ריצה לאורך הקו",
        "קרוס מדויק",
        "חטיפת כדור באגף",
        "מעבר מהיר להתקפה",
        "משחק רוחב בטוח",
        "שמירה על חלוץ יריב",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "קשר": [
        "מסירה חכמה קדימה",
        "שמירה על קצב המשחק",
        "חטיפת כדור במרכז",
        "משחק קצר מדויק",
        "שליחת כדור לעומק",
        "שליטה בקישור",
        "החלפת אגף",
        "תמיכה בהגנה",
        "ארגון ההתקפה",
        "ראיית משחק רחבה",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "חלוץ": [
        "בעיטה למסגרת",
        "תנועה ללא כדור",
        "קבלת כדור תחת לחץ",
        "סיום מצבים",
        "נוכחות ברחבה",
        "ניצול הזדמנויות",
        "תקשורת עם הקשרים",
        "לחץ על ההגנה היריבה",
        "נגיחה למסגרת",
        "שמירה על הכדור מול הגנה",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "כנף": [
        "עקיפת מגן באגף",
        "הגבהה איכותית",
        "ריצה מהירה בקו",
        "חדירה לרחבה מהאגף",
        "משחק עומק",
        "קידום הכדור קדימה",
        "יצירת יתרון מספרי",
        "משחק רוחב לשינוי אגף",
        "הפתעת ההגנה בתנועה",
        "השגת פינות",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ]
};

// פעולות מנטאליות (כוללות הורדת ראש, הרמת ראש)
const mentalActions = [
    "שמירה על ריכוז",
    "התמודדות עם לחץ",
    "תקשורת חיובית עם חברי הקבוצה",
    "אמונה עצמית",
    "ניהול רגשות",
    "קבלת החלטות מהירה",
    "התמדה במאמץ",
    "מנהיגות חיובית",
    "יצירת מוטיבציה",
    "התמודדות עם טעויות",
    "הורדת ראש",
    "הרמת ראש"
];

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

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;

    if (!playerName || !teamName || !playerPosition) {
        alert("אנא מלא את כל השדות (כולל תפקיד)");
        return;
    }

    document.getElementById("player-display").textContent = playerName;
    document.getElementById("team-display").textContent = teamName;

    const today = new Date().toLocaleDateString("he-IL");
    document.getElementById("game-date").textContent = today;
    document.getElementById("player-position-display").textContent = playerPosition;

    document.getElementById("user-input-container").classList.add("hidden");
    document.getElementById("game-info").classList.remove("hidden");

    loadActionsSelection(playerPosition);
}

function loadActionsSelection(position) {
    const actionsContainer = document.getElementById("actions-selection-container");
    const professionalContainer = document.getElementById("professional-actions");
    const mentalContainer = document.getElementById("mental-actions");

    professionalContainer.innerHTML = "";
    mentalContainer.innerHTML = "";

    const actionsForPosition = positionActions[position] || [];

    // יצירת רשימת פעולות מקצועיות
    actionsForPosition.forEach((action, index) => {
        const actionId = `prof-action-${index}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = actionId;
        checkbox.value = action;
        checkbox.name = "selected-actions";
        checkbox.dataset.category = "professional";

        const label = document.createElement("label");
        label.htmlFor = actionId;
        label.textContent = action;

        const div = document.createElement("div");
        div.classList.add("action-item");
        div.appendChild(checkbox);
        div.appendChild(label);

        professionalContainer.appendChild(div);
    });

    // יצירת רשימת פעולות מנטאליות
    mentalActions.forEach((action, index) => {
        const actionId = `mental-action-${index}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = actionId;
        checkbox.value = action;
        checkbox.name = "selected-actions";
        checkbox.dataset.category = "mental";

        const label = document.createElement("label");
        label.htmlFor = actionId;
        label.textContent = action;

        const div = document.createElement("div");
        div.classList.add("action-item");
        div.appendChild(checkbox);
        div.appendChild(label);

        mentalContainer.appendChild(div);
    });

    actionsContainer.classList.remove("hidden");
}

function confirmActions() {
    const checkboxes = document.querySelectorAll('input[name="selected-actions"]:checked');
    if (checkboxes.length < 6 || checkboxes.length > 10) {
        alert("אנא בחר בין 6 ל-10 פעולות.");
        return;
    }

    selectedActions = Array.from(checkboxes).map(cb => ({action: cb.value, category: cb.dataset.category}));

    chosenProfessional = selectedActions.filter(a => a.category === 'professional');
    chosenMental = selectedActions.filter(a => a.category === 'mental');

    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
}

function startGame() {
    const startGameButton = document.getElementById("start-game-container");
    startGameButton.classList.add("hidden");

    const timer = document.getElementById("game-timer");
    timer.classList.remove("hidden");

    const actionsTitle = document.getElementById("actions-title");
    actionsTitle.classList.remove("hidden");

    const gameActionsContainer = document.getElementById("game-actions-container");
    gameActionsContainer.classList.remove("hidden");

    const profContainer = document.getElementById("prof-actions-chosen");
    const mentalContainer = document.getElementById("mental-actions-chosen");

    profContainer.innerHTML = "";
    chosenProfessional.forEach(obj => {
        profContainer.appendChild(createActionRow(obj.action));
    });

    mentalContainer.innerHTML = "";
    chosenMental.forEach(obj => {
        mentalContainer.appendChild(createActionRow(obj.action, true));
    });

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

function createActionRow(action, isMental=false) {
    const div = document.createElement("div");
    div.classList.add("action-group");
    div.classList.add(isMental ? "mental-bg" : "prof-bg");

    const goodBtn = document.createElement("button");
    goodBtn.textContent = "V";
    goodBtn.style.backgroundColor = "#4CAF50";
    goodBtn.style.width = "50px";
    goodBtn.style.fontSize = "24px";
    goodBtn.style.fontWeight = "bold";
    goodBtn.onclick = () => trackAction(action, "מוצלח");

    const badBtn = document.createElement("button");
    badBtn.textContent = "X";
    badBtn.style.backgroundColor = "#f44336";
    badBtn.style.width = "50px";
    badBtn.style.fontSize = "24px";
    badBtn.style.fontWeight = "bold";
    badBtn.onclick = () => trackAction(action, "לא מוצלח");

    const noteBtn = document.createElement("button");
    noteBtn.textContent = "🖉"; // אייקון עט
    noteBtn.style.backgroundColor = "#9E9E9E";
    noteBtn.style.width = "50px";
    noteBtn.style.fontSize = "24px";
    noteBtn.style.fontWeight = "bold";
    noteBtn.onclick = () => openParentNotePopup(action);

    const h2 = document.createElement("h2");
    h2.textContent = action;

    div.appendChild(badBtn);
    div.appendChild(h2);
    div.appendChild(goodBtn);
    div.appendChild(noteBtn);

    return div;
}

function openParentNotePopup(action) {
    currentNoteAction = action;
    document.getElementById("parent-note-text").value = parentNotes[action] || "";
    const popup = document.getElementById("parent-note-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeParentNotePopup() {
    const popup = document.getElementById("parent-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    currentNoteAction = null;
}

function saveParentNote() {
    const text = document.getElementById("parent-note-text").value.trim();
    if (currentNoteAction) {
        parentNotes[currentNoteAction] = text;
    }
    closeParentNotePopup();
    showPopup("הערה נשמרה!");
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

    const minutesPlayed = parseInt(prompt("כמה דקות שיחקת?", "60")) || 0;
    const score = calculateScore(minutesPlayed);

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
        let noteText = parentNotes[action] ? `<br><small>הערת הורה: ${parentNotes[action]}</small>` : "";
        return `<p class="${className}">דקה ${minute}: ${action} - ${result}${noteText}</p>`;
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

function classifyKey(key) {
    let lowerKey = key.toLowerCase();
    if (lowerKey.includes("לא מוצלח") || lowerKey.includes("רעה") || lowerKey.includes("לא טוב") || lowerKey.includes("שלילית")) {
        return "bad";
    }
    if (lowerKey.includes("מוצלח") || lowerKey.includes("טוב") || lowerKey.includes("חיובית")) {
        return "good";
    }
    return "neutral";
}

function classifyResult(result) {
    let lowerResult = result.toLowerCase();
    if (lowerResult.includes("לא מוצלח") || lowerResult.includes("רעה") || lowerResult.includes("לא טוב") || lowerResult.includes("שלילית")) {
        return "bad";
    }
    if (lowerResult.includes("מוצלח") || lowerResult.includes("טוב") || lowerResult.includes("חיובית")) {
        return "good";
    }
    return "neutral";
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

function enableActions(enable) {
    const buttons = document.querySelectorAll('#prof-actions-chosen button, #mental-actions-chosen button');
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
