let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let chosenCustom = [];
let parentNotes = [];
let gameFinished = false;
let customActionsArr = [];

// רשימות הפעולות (עודכנו עם הפעולה הנוספת לחלוץ)
const positionActions = {
    "שוער": [
        "עצירת כדור קשה","יציאה לאגרוף","משחק רגל מדויק","שליטה ברחבה","תקשורת עם ההגנה","יציאה לכדורי גובה",
        "מסירה ארוכה מדויקת","סגירת זויות בעיטות","תגובות מהירות","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה"
    ],
    "בלם": [
        "בלימת התקפה יריבה","משחק ראש מוצלח","סגירת תוקף","חטיפת כדור","הנעת כדור אחורה בבטחה","משחק רוחב מדויק",
        "סגירת קווי מסירה","הגנה על הרחבה","הובלת הכדור קדימה","החזרת כדור לשוער","ביצוע 1 על 1","מסירת מפתח",
        "הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ],
    "מגן": [
        "הגבהה מדויקת לרחבה","תמיכה בהתקפה באגף","כיסוי הגנתי באגף","תקשורת עם הקשר","ריצה לאורך הקו",
        "קרוס מדויק","חטיפת כדור באגף","מעבר מהיר להתקפה","משחק רוחב בטוח","שמירה על חלוץ יריב",
        "ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ],
    "קשר": [
        "מסירה חכמה קדימה","שמירה על קצב המשחק","חטיפת כדור במרכז","משחק קצר מדויק","שליחת כדור לעומק","שליטה בקישור",
        "החלפת אגף","תמיכה בהגנה","ארגון ההתקפה","ראיית משחק רחבה","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ],
    "חלוץ": [
        "בעיטה למסגרת","בעיטה לשער","תנועה ללא כדור","קבלת כדור תחת לחץ","סיום מצבים","נוכחות ברחבה","ניצול הזדמנויות",
        "תקשורת עם הקשרים","לחץ על ההגנה היריבה","נגיחה למסגרת","שמירה על הכדור מול הגנה","ביצוע 1 על 1",
        "מסירת מפתח","הגבהה לרחבה","משחק עם הגב לשער"
    ],
    "כנף": [
        "עקיפת מגן באגף","הגבהה איכותית","ריצה מהירה בקו","חדירה לרחבה מהאגף","משחק עומק","קידום הכדור קדימה",
        "יצירת יתרון מספרי","משחק רוחב לשינוי אגף","הפתעת ההגנה בתנועה","השגת פינות","ביצוע 1 על 1",
        "מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"
    ]
};

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
    "הרמת ראש",
    "התמודדות עם החמצות (שמירה על ביטחון אחרי החמצה)",
    "ניהול רגשות תחת לחץ תקשורתי",
    "קבלת החלטות מהירה במצבי לחץ",
    "שימור מוטיבציה וחיוביות",
    "אמונה עצמית בזמן קושי"
];

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;
    const parentEmail = document.getElementById("parent-email").value.trim();

    if (!playerName || !teamName || !playerPosition || !parentEmail) {
        alert("אנא מלא את כל השדות (כולל תפקיד ומייל הורה)");
        return;
    }

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

    let selected = Array.from(checkboxes).map(cb => ({action: cb.value, category: cb.dataset.category}));
    // נשמור אולי לשימוש עתידי
    // actions לבחירה בעתיד
    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
}

function startGame() {
    document.getElementById("start-game-container").classList.add("hidden");
    document.getElementById("game-timer").classList.remove("hidden");
    document.getElementById("actions-title").classList.remove("hidden");
    document.getElementById("notes-container").classList.remove("hidden");
    document.getElementById("game-actions-container").classList.remove("hidden");

    // כאן תציג פעולות שנבחרו וכו' 
    // לצורך הפשטות, נשאיר כעת כמו שהוא
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

function trackAction(action, result) {
    if (!gameInterval || gameFinished) {
        alert("לא ניתן לרשום פעולה כאשר הסטופר לא פעיל או כשהמשחק הסתיים!");
        return;
    }
    actions.push({ action: action, result: result, minute: gameMinute });

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

function classifyResult(result) {
    let lowerResult = result.toLowerCase();
    if (lowerResult.includes("מוצלח") || lowerResult.includes("טוב") || lowerResult.includes("חיובית")) {
        return "good";
    }
    if (lowerResult.includes("רעה") || lowerResult.includes("לא מוצלח") || lowerResult.includes("לא טוב") || lowerResult.includes("שלילית")) {
        return "bad";
    }
    return "neutral";
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

    const counts = getActionCounts();
    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(counts, "סיכום המשחק");
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

    // שמירה בשרת
    saveGameDataToServer(playerName, teamName, position, gameDate, score, actions, parentNotes);
}

function saveGameDataToServer(playerName, teamName, position, gameDate, score, actions, parentNotes) {
    fetch('/save_data', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
            playerName: playerName,
            teamName: teamName,
            position: position,
            gameDate: gameDate,
            score: score,
            actions: actions,
            parentNotes: parentNotes
        })
    })
    .then(res => res.json())
    .then(data => {
        console.log("Data saved to server:", data);
    })
    .catch(err => console.error(err));
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
    let lowerKey = key.toLowerCase();
    if (lowerKey.includes("לא מוצלח") || lowerKey.includes("רעה") || lowerKey.includes("לא טוב") || lowerKey.includes("שלילית")) {
        return "bad";
    }
    if (lowerKey.includes("מוצלח") || lowerKey.includes("טוב") || lowerKey.includes("חיובית")) {
        return "good";
    }
    return "neutral";
}

function showFeedback(score, minutesPlayed) {
    let feedback = "";
    let successfulActions = actions.filter(a =>
        a.result.includes("מוצלח") || a.result.includes("טוב") || a.result.includes("חיובית")
    ).length;

    if (score > 92) {
        feedback = "מעולה פלוס! משחק יוצא דופן!";
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

// האלגוריתם החדש לחישוב הציון
function calculateScore(minutesPlayed) {
    // נעזר ברעיונות שהגדרנו קודם

    // התחלת הציון לפי דקות
    let score = (minutesPlayed < 42) ? 45 : 0;

    let goodCount = 0;
    let badCount = 0;
    let simplePosCount = {};

    const importantPosActions = ["בעיטה למסגרת","בעיטה לשער","מסירת מפתח","ניצול הזדמנויות","נגיחה למסגרת"];
    const criticalNegActions = ["החמצת מצב ודאי","איבוד כדור מסוכן","אי שמירה על שחקן מפתח","טעות חמורה בהגנה"];

    function determineCategory(action, result) {
        let resLower = result.toLowerCase();
        let actLower = action.toLowerCase();
        let isGood = (resLower.includes("מוצלח") || resLower.includes("טוב") || resLower.includes("חיובית"));
        let isBad = (resLower.includes("לא מוצלח") || resLower.includes("רעה") || resLower.includes("לא טוב") || resLower.includes("שלילית"));

        if (isGood) {
            let isImportant = importantPosActions.some(a => actLower.includes(a.toLowerCase()));
            return isImportant ? "good_important" : "good_simple";
        } else if (isBad) {
            let isCritical = criticalNegActions.some(a => actLower.includes(a.toLowerCase()));
            return isCritical ? "bad_critical" : "bad_easy";
        } else {
            return "neutral";
        }
    }

    for (let {action, result, minute} of actions) {
        let category = determineCategory(action, result);
        if (category.startsWith("good")) {
            goodCount++;
            if (category === "good_simple") {
                simplePosCount[action] = (simplePosCount[action] || 0) + 1;
                if (simplePosCount[action] > 10) {
                    score += 1;
                } else {
                    score += 2;
                }
            } else {
                // good_important
                let base = 5;
                if (minute > 70) {
                    base += 1;
                }
                score += base;
            }
        } else if (category.startsWith("bad")) {
            badCount++;
            if (category === "bad_easy") {
                score -= 1;
            } else {
                let base = -3;
                if (minute > 70) {
                    base -= 1;
                }
                score += base;
            }
        }
    }

    // יחס טוב/רע
    let ratio = goodCount / (badCount + 1);
    if (ratio < 1) {
        score *= 0.9; // הורדה של 10%
    } else if (ratio > 2) {
        score *= 1.05; // עלייה של 5%
    }

    // אם שיחק פחות מ-42 דקות:
    if (minutesPlayed < 42) {
        if (score > 85) {
            score *= 0.94; 
        } else if (score < 50) {
            score *= 1.15;
        }
    }

    // הגבלת ציון ל-0-100
    if (score < 0) score = 0;
    if (score > 100) score = 100;

    // לא פחות מ-46 ולא יותר מ-97
    if (score < 46) score = 46;
    if (score > 97) score = 97;

    return Math.round(score);
}

function closeAllActionsPopup() {
    const actionsDetailPopup = document.getElementById("actions-detail-popup");
    actionsDetailPopup.classList.remove("active");
    actionsDetailPopup.classList.add("hidden");
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
