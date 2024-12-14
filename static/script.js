let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let chosenCustom = [];
let generalNote = ""; // הערה כללית אחת להורה
let gameFinished = false;

// פעולות מקצועיות (מוסיפים "בעיטה לשער" ו"בעיטה למסגרת" לכל תפקיד מלבד שוער)
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
        "הגבהה לרחבה",
        "בעיטה לשער",
        "בעיטה למסגרת"
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
        "הגבהה לרחבה",
        "בעיטה לשער",
        "בעיטה למסגרת"
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
        "הגבהה לרחבה",
        "בעיטה לשער",
        "בעיטה למסגרת"
    ],
    "חלוץ": [
        "בעיטה למסגרת",
        "בעיטה לשער",
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
        "הגבהה לרחבה",
        "בעיטה לשער",
        "בעיטה למסגרת"
    ]
};

// פעולות מנטאליות
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

let customActionsArr = [];

function trackAction(action, result) {
    if (!gameInterval || gameFinished) {
        alert("לא ניתן לרשום פעולה כאשר הסטופר לא פעיל או כאשר המשחק הסתיים!");
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
    const customContainer = document.getElementById("custom-actions");

    professionalContainer.innerHTML = "";
    mentalContainer.innerHTML = "";
    customContainer.innerHTML = "";

    const actionsForPosition = positionActions[position] || [];

    // פעולות מקצועיות
    actionsForPosition.forEach((action, index) => {
        professionalContainer.appendChild(createActionCheckbox(action, "professional"));
    });

    // פעולות מנטאליות
    mentalActions.forEach((action, index) => {
        mentalContainer.appendChild(createActionCheckbox(action, "mental"));
    });

    // פעולות מותאמות אישית - בתחילה אין, רק המשתמש יוסיף
    customActionsArr.forEach((action, index) => {
        customContainer.appendChild(createActionCheckbox(action, "custom"));
    });

    actionsContainer.classList.remove("hidden");
}

function createActionCheckbox(action, category) {
    const actionId = `action-${category}-${Math.random()}`;
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.id = actionId;
    checkbox.value = action;
    checkbox.name = "selected-actions";
    checkbox.dataset.category = category;

    const label = document.createElement("label");
    label.htmlFor = actionId;
    label.textContent = action;

    const div = document.createElement("div");
    div.classList.add("action-item");
    div.appendChild(checkbox);
    div.appendChild(label);

    return div;
}

function addCustomAction() {
    const input = document.getElementById("custom-action-input");
    const val = input.value.trim();
    if (!val) {
        alert("אנא כתוב שם פעולה לפני ההוספה");
        return;
    }
    customActionsArr.push(val);
    const container = document.getElementById("custom-actions");
    container.appendChild(createActionCheckbox(val, "custom"));
    input.value = "";
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
    chosenCustom = selectedActions.filter(a => a.category === 'custom');

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

    const notesContainer = document.getElementById("notes-container");
    notesContainer.classList.remove("hidden");

    const gameActionsContainer = document.getElementById("game-actions-container");
    gameActionsContainer.classList.remove("hidden");

    const profContainer = document.getElementById("prof-actions-chosen");
    const mentalContainer = document.getElementById("mental-actions-chosen");
    const customContainer = document.getElementById("custom-actions-chosen");

    profContainer.innerHTML = "";
    chosenProfessional.forEach(obj => {
        profContainer.appendChild(createActionRow(obj.action, false, "professional"));
    });

    mentalContainer.innerHTML = "";
    chosenMental.forEach(obj => {
        mentalContainer.appendChild(createActionRow(obj.action, false, "mental"));
    });

    customContainer.innerHTML = "";
    chosenCustom.forEach(obj => {
        customContainer.appendChild(createActionRow(obj.action, false, "custom"));
    });

    enableActions(true);

    gameMinute = 0;
    actions = [];
    generalNote = "";
    document.getElementById("minute-counter").textContent = gameMinute;
    gameFinished = false;

    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    const endButtons = document.getElementById("end-buttons-container");
    endButtons.classList.remove("hidden");
}

function createActionRow(action, isMental=false, category="") {
    const div = document.createElement("div");
    div.classList.add("action-group");
    if (category === "professional") div.classList.add("prof-bg");
    else if (category === "mental") div.classList.add("mental-bg");
    else if (category === "custom") div.classList.add("custom-bg");

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

    const h2 = document.createElement("h2");
    h2.textContent = action;

    div.appendChild(badBtn);
    div.appendChild(h2);
    div.appendChild(goodBtn);

    return div;
}

function openGeneralNotePopup() {
    const popup = document.getElementById("general-note-popup");
    document.getElementById("general-note-text").value = generalNote;
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeGeneralNotePopup() {
    const popup = document.getElementById("general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function saveGeneralNote() {
    generalNote = document.getElementById("general-note-text").value.trim();
    closeGeneralNotePopup();
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

    const halfGeneralNoteDisplay = document.getElementById("half-general-note-display");
    const halfGeneralNoteTextDisplay = document.getElementById("half-general-note-text-display");
    if (generalNote) {
        halfGeneralNoteTextDisplay.textContent = generalNote;
        halfGeneralNoteDisplay.classList.remove("hidden");
    } else {
        halfGeneralNoteDisplay.classList.add("hidden");
    }

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
    gameFinished = true;

    const minutesPlayed = parseInt(prompt("כמה דקות שיחקת?", "60")) || 0;
    const score = calculateScore(minutesPlayed);

    document.getElementById("player-display-summary").textContent = document.getElementById("player-display").textContent;
    document.getElementById("game-date-summary").textContent = document.getElementById("game-date").textContent;
    document.getElementById("team-display-summary").textContent = document.getElementById("team-display").textContent;

    const counts = getActionCounts();
    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(counts, "סיכום המשחק");
    summaryContent.innerHTML += `<h3>ציון סיום המשחק שלך: ${score}</h3>`;

    const generalNoteDisplay = document.getElementById("general-note-display");
    const generalNoteTextDisplay = document.getElementById("general-note-text-display");
    if (generalNote) {
        generalNoteTextDisplay.textContent = generalNote;
        generalNoteDisplay.classList.remove("hidden");
    } else {
        generalNoteDisplay.classList.add("hidden");
    }

    const popup = document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    setTimeout(() => {
        showFeedback(score, minutesPlayed);
    }, 500);

    // לאחר סיום המשחק וחזרה למסך הראשי, כל הפעולות אפורות ולא לחיצות
    // נמתין שהמשתמש יסגור את הסיכום, לאחר מכן נהפוך את הכול לאפור.
    popup.addEventListener("transitionend", makeActionsGreyAfterGame, {once:true});
}

function makeActionsGreyAfterGame() {
    // כל הכפתורים יעברו למצב אפור ולא לחיץ
    const allButtons = document.querySelectorAll('#prof-actions-chosen button, #mental-actions-chosen button, #custom-actions-chosen button');
    allButtons.forEach(btn => {
        btn.disabled = true;
        btn.classList.add("finished");
    });
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
    const allButtons = document.querySelectorAll('#prof-actions-chosen button, #mental-actions-chosen button, #custom-actions-chosen button');
    allButtons.forEach(button => {
        if (enable) {
            button.removeAttribute('disabled');
            button.classList.remove("finished");
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

function openGeneralNotePopup() {
    document.getElementById("general-note-text").value = generalNote;
    const popup = document.getElementById("general-note-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeGeneralNotePopup() {
    const popup = document.getElementById("general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function saveGeneralNote() {
    generalNote = document.getElementById("general-note-text").value.trim();
    closeGeneralNotePopup();
    showPopup("הערה נשמרה!");
}
