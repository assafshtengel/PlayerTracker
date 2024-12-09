let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let chosenCustom = [];
let parentNotes = [];
let gameFinished = false;
let customActionsArr = []; // הגדרה של מערך הפעולות המותאמות אישית

const API_KEY = "63c5b5f5d363cf845ffcfa3a98f97fed"; // המפתח שסיפקת
const FORM_ID = "230789031560051"; // ה-ID שסיפקת

// הגדרת הפעולות בהתאם לתפקיד השחקן
const positionActions = {
    "שוער": [
        "עצירת כדור קשה","יציאה לאגרוף","משחק רגל מדויק","שליטה ברחבה","תקשורת עם ההגנה","יציאה לכדורי גובה","מסירה ארוכה מדויקת","סגירת זויות בעיטות","תגובות מהירות","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה"
    ],
    "בלם": [
        "בלימת התקפה יריבה","משחק ראש מוצלח","סגירת תוקף","חטיפת כדור","הנעת כדור אחורה בבטחה","משחק רוחב מדויק","סגירת קווי מסירה","הגנה על הרחבה","הובלת הכדור קדימה","החזרת כדור לשוער","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ],
    "מגן": [
        "הגבהה מדויקת לרחבה","תמיכה בהתקפה באגף","כיסוי הגנתי באגף","תקשורת עם הקשר","ריצה לאורך הקו","קרוס מדויק","חטיפת כדור באגף","מעבר מהיר להתקפה","משחק רוחב בטוח","שמירה על חלוץ יריב","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ],
    "קשר": [
        "מסירה חכמה קדימה","שמירה על קצב המשחק","חטיפת כדור במרכז","משחק קצר מדויק","שליחת כדור לעומק","שליטה בקישור","החלפת אגף","תמיכה בהגנה","ארגון ההתקפה","ראיית משחק רחבה","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ],
    "חלוץ": [
        "בעיטה למסגרת","בעיטה לשער","תנועה ללא כדור","קבלת כדור תחת לחץ","סיום מצבים","נוכחות ברחבה","ניצול הזדמנויות","תקשורת עם הקשרים","לחץ על ההגנה היריבה","נגיחה למסגרת","שמירה על הכדור מול הגנה","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה"
    ],
    "כנף": [
        "עקיפת מגן באגף","הגבהה איכותית","ריצה מהירה בקו","חדירה לרחבה מהאגף","משחק עומק","קידום הכדור קדימה","יצירת יתרון מספרי","משחק רוחב לשינוי אגף","הפתעת ההגנה בתנועה","השגת פינות","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ]
};

// פעולות מנטאליות:
const mentalActions = [
    "שמירה על ריכוז","התמודדות עם לחץ","תקשורת חיובית עם חברי הקבוצה","אמונה עצמית","ניהול רגשות","קבלת החלטות מהירה","התמדה במאמץ","מנהיגות חיובית","יצירת מוטיבציה","התמודדות עם טעויות","הורדת ראש","הרמת ראש"
];

// פונקציה לשליחת הנתונים ל-JotForm
function sendToJotForm(playerName, teamName, position, gameDate, actionsSummary, score, parentEmail, parentNotesArr) {
    let parentNotesStr = "";
    parentNotesArr.forEach(n => {
        parentNotesStr += `דקה ${n.minute}: ${n.text}\n`;
    });

    const formEncodedData = new URLSearchParams();
    formEncodedData.append("submission[nameplayer]", playerName);
    formEncodedData.append("submission[nameagainst]", teamName);
    formEncodedData.append("submission[tafkid]", position);
    formEncodedData.append("submission[date]", gameDate);
    formEncodedData.append("submission[sumall]", actionsSummary);
    formEncodedData.append("submission[price]", score.toString());
    formEncodedData.append("submission[emailField]", parentEmail);
    // אם תרצה לשלוח הערות הורה לשדה ייעודי נוסף:
    // formEncodedData.append("submission[sumdad]", parentNotesStr);

    fetch(`https://api.jotform.com/form/${FORM_ID}/submissions?apiKey=${API_KEY}`, {
        method: "POST",
        headers: {
            "Content-Type": "application/x-www-form-urlencoded"
        },
        body: formEncodedData
    })
    .then(response => response.json())
    .then(data => {
        console.log("Submission Created:", data);
    })
    .catch(err => console.error(err));
}

function trackAction(action, result) {
    if (!gameInterval || gameFinished) {
        alert("לא ניתן לרשום פעולה כאשר הסטופר לא פעיל או כשהמשחק הסתיים!");
        return;
    }
    actions.push({ action, result, minute: gameMinute });

    const type = classifyResult(result);
    let message = `הפעולה "${action}" (${result}) נרשמה!`;
    showPopup(message, type);
}

function showPopup(message, type="neutral") {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.classList.remove("hidden","popup-good","popup-bad","popup-neutral");

    if (type === "good") {
        popup.classList.add("popup-good");
    } else if (type === "bad") {
        popup.classList.add("popup-bad");
    } else {
        popup.classList.add("popup-neutral");
    }

    setTimeout(() => {
        popup.classList.add("hidden");
    }, 800);
}

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;
    const parentEmail = document.getElementById("parent-email").value.trim();

    if (!playerName || !teamName || !playerPosition || !parentEmail) {
        alert("אנא מלא את כל השדות (כולל תפקיד ומייל הורה)");
        return;
    }

    // הסתרת טופס הפרטים ועוברים ישירות לבחירת פעולות
    document.getElementById("user-input-container").classList.add("hidden");

    window.parentEmailGlobal = parentEmail;
    window.playerNameGlobal = playerName;
    window.teamNameGlobal = teamName;
    window.playerPositionGlobal = playerPosition;

    loadActionsSelection(playerPosition);
    document.getElementById("actions-selection-container").classList.remove("hidden");
}

function loadActionsSelection(position) {
    const professionalContainer = document.getElementById("professional-actions");
    const mentalContainer = document.getElementById("mental-actions");
    const customContainer = document.getElementById("custom-actions");

    professionalContainer.innerHTML = "";
    mentalContainer.innerHTML = "";
    customContainer.innerHTML = "";

    const actionsForPosition = positionActions[position] || [];

    actionsForPosition.forEach(action => {
        professionalContainer.appendChild(createActionCheckbox(action, "professional"));
    });

    mentalActions.forEach(action => {
        mentalContainer.appendChild(createActionCheckbox(action, "mental"));
    });

    customActionsArr.forEach(action => {
        customContainer.appendChild(createActionCheckbox(action, "custom"));
    });
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
        alert(`בחרת ${checkboxes.length} פעולות. אנא בחר בין 6 ל-10 פעולות.`);
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
    document.getElementById("start-game-container").classList.add("hidden");
    document.getElementById("game-timer").classList.remove("hidden");
    document.getElementById("actions-title").classList.remove("hidden");
    document.getElementById("notes-container").classList.remove("hidden");
    document.getElementById("game-actions-container").classList.remove("hidden");

    const profContainer = document.getElementById("prof-actions-chosen");
    const mentalContainer = document.getElementById("mental-actions-chosen");
    const customContainer = document.getElementById("custom-actions-chosen");

    profContainer.innerHTML = "";
    chosenProfessional.forEach(obj => {
        profContainer.appendChild(createActionRow(obj.action, "professional"));
    });

    mentalContainer.innerHTML = "";
    chosenMental.forEach(obj => {
        mentalContainer.appendChild(createActionRow(obj.action, "mental"));
    });

    customContainer.innerHTML = "";
    chosenCustom.forEach(obj => {
        customContainer.appendChild(createActionRow(obj.action, "custom"));
    });

    enableActions(true);

    gameMinute = 0;
    actions = [];
    parentNotes = [];
    gameFinished = false;

    document.getElementById("minute-counter").textContent = gameMinute;

    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    document.getElementById("end-buttons-container").classList.remove("hidden");
}

function createActionRow(action, category="") {
    const div = document.createElement("div");
    div.classList.add("action-group");
    if (category === "professional") div.classList.add("prof-bg");
    else if (category === "mental") div.classList.add("mental-bg");
    else if (category === "custom") div.classList.add("custom-bg");

    const badBtn = document.createElement("button");
    badBtn.textContent = "X";
    badBtn.style.backgroundColor = "#f44336";
    badBtn.style.width = "50px";
    badBtn.style.fontSize = "24px";
    badBtn.style.fontWeight = "bold";
    badBtn.onclick = () => trackAction(action, "לא מוצלח");

    const h2 = document.createElement("h2");
    h2.textContent = action;

    const goodBtn = document.createElement("button");
    goodBtn.textContent = "V";
    goodBtn.style.backgroundColor = "#4CAF50";
    goodBtn.style.width = "50px";
    goodBtn.style.fontSize = "24px";
    goodBtn.style.fontWeight = "bold";
    goodBtn.onclick = () => trackAction(action, "מוצלח");

    div.appendChild(badBtn);
    div.appendChild(h2);
    div.appendChild(goodBtn);

    return div;
}

function openGeneralNotePopup() {
    document.getElementById("general-note-text").value = "";
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
    const note = document.getElementById("general-note-text").value.trim();
    if(note) {
        parentNotes.push({text: note, minute: gameMinute});
        closeGeneralNotePopup();
        showPopup("הערה נשמרה!", "neutral");
        enableActions(true);
    } else {
        alert("לא הוזנה הערה");
    }
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
    const halfParentNotesList = document.getElementById("half-parent-notes-list");
    halfParentNotesList.innerHTML = "";
    if (parentNotes.length > 0) {
        parentNotes.forEach(n => {
            const li = document.createElement("li");
            li.textContent = `דקה ${n.minute}: ${n.text}`;
            halfParentNotesList.appendChild(li);
        });
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

    document.getElementById("end-half").style.display = 'none';

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

    const playerName = window.playerNameGlobal || "";
    const teamName = window.teamNameGlobal || "";
    const position = window.playerPositionGlobal || "";
    const today = new Date().toLocaleDateString("he-IL");
    const gameDate = today;

    let actionsSummary = "";
    actions.forEach(a => {
        actionsSummary += `דקה ${a.minute}: ${a.action} - ${a.result}\n`;
    });

    const parentEmail = window.parentEmailGlobal || "";

    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(getActionCounts(), "סיכום המשחק");
    summaryContent.innerHTML += `<h3 id="final-score">ציון סיום המשחק שלך: ${score}</h3>`;

    const generalNoteDisplay = document.getElementById("general-note-display");
    const parentNotesList = document.getElementById("parent-notes-list");
    parentNotesList.innerHTML = "";
    if (parentNotes.length > 0) {
        parentNotes.forEach(n => {
            const li = document.createElement("li");
            li.textContent = `דקה ${n.minute}: ${n.text}`;
            parentNotesList.appendChild(li);
        });
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

    document.getElementById("notes-container").style.display = 'none';
    document.getElementById("end-half").style.display = 'none';
    document.getElementById("end-game").style.display = 'none';

    document.getElementById("reopen-summary-container").classList.remove("hidden");

    // שליחה ל-JotForm
    sendToJotForm(playerName, teamName, position, gameDate, actionsSummary, score, parentEmail, parentNotes);
}

function makeActionsGreyAfterGame() {
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

function reopenSummary() {
    const popup = document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function showAllActions() {
    const allActionsList = document.getElementById("all-actions-list");
    allActionsList.innerHTML = "";

    actions.forEach(({action, result, minute}) => {
        let className = classifyResult(result);
        const p = document.createElement("p");
        p.className = className + " action-line";

        const minuteBadge = document.createElement("span");
        minuteBadge.className = "minute-badge";
        minuteBadge.textContent = "דקה " + minute;
        p.appendChild(minuteBadge);

        const textNode = document.createTextNode(" " + action + " - " + result);
        p.appendChild(textNode);

        allActionsList.appendChild(p);
    });

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
    let score = 50; 
    let successfulActions = 0;
    let badActions = 0;
    let negativeHoradaCount = 0;

    actions.forEach(({ action, result }) => {
        const resLower = result.toLowerCase();
        if (resLower.includes("מוצלח") || resLower.includes("טוב") || resLower.includes("חיובית")) {
            score += 3;
            successfulActions++;
        } else if (resLower.includes("רעה") || resLower.includes("לא מוצלח") || resLower.includes("לא טוב") || resLower.includes("שלילית")) {
            score -= 2;
            badActions++;
            if (action === "הורדת ראש") {
                negativeHoradaCount++;
            }
        } 
    });

    const chosenCount = chosenProfessional.length + chosenMental.length + chosenCustom.length;
    if (chosenCount < 6 || chosenCount > 10) {
        score -= 5;
    }

    if (negativeHoradaCount > 0) {
        score -= (negativeHoradaCount * 3);
    }

    if (score > 200) score = 200;
    return score; 
}

function showFeedback(score, minutesPlayed) {
    let feedback = "";
    let successfulActions = actions.filter(a =>
        a.result.includes("מוצלח") || a.result.includes("טוב") || a.result.includes("חיובית")
    ).length;

    if (score > 150) {
        feedback = "מעולה! נתת משחק יוצא דופן ומעל המצופה!";
    } else if (score > 85) {
        feedback = "מצוין! נתת משחק חזק. המשך לעבוד קשה!";
    } else if (score > 70) {
        feedback = "ביצוע טוב מאוד. שים לב לדייק יותר בחלק מהפעולות.";
    } else if (score > 55) {
        feedback = "עשית עבודה טובה, אך יש מקום לשיפור.";
    } else {
        feedback = "יש הרבה מקום לשיפור. אל תתייאש, למד ושפר!";
    }

    if (minutesPlayed < 30) {
        feedback += " שיחקת פחות מ-30 דקות, נסה להאריך את משך המשחק.";
    }

    if (actions.length >= 4) {
        feedback += " ביצעת מספר פעולות לא מבוטל - המשך להתמיד!";
    }

    if (successfulActions > 5) {
        feedback += " מעל 5 פעולות מוצלחות - יפה מאוד!";
    }

    if (score < 50 && successfulActions > 3) {
        feedback += " למרות הציון הנמוך, ראינו מספר פעולות מוצלחות.";
    }

    if (actions.length > 15) {
        feedback += " ביצעת הרבה פעולות - מראה על נחישות!";
    }

    let counts = getActionCounts();
    if ((counts['מנהיגות: חיובית'] || 0) > 3) {
        feedback += " כישורי המנהיגות שלך בולטים מאוד!";
    }

    document.getElementById("feedback-text").textContent = feedback;
    const feedbackPopup = document.getElementById("feedback-popup");
    feedbackPopup.classList.remove("hidden");
}

function closeFeedbackPopup() {
    document.getElementById("feedback-popup").classList.add("hidden");
}

function takeScreenshot() {
    const element = document.getElementById('game-summary-content');
    if (!element) {
        console.error("אלמנט 'game-summary-content' לא נמצא.");
        return;
    }

    html2canvas(element).then(canvas => {
        const link = document.createElement('a');
        link.href = canvas.toDataURL();
        link.download = 'game_summary_screenshot.png';
        link.click();
    });
}
