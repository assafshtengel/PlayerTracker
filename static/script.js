const ACCESS_CODE = "1976";

// משתנים גלובליים
let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let chosenCustom = [];
let notes = [];
let gameFinished = false;
let customActionsArr = [];

let analystPlayers = [];
let analystGameActions = [];
let analystStartTime = false;

let analystTeamAName = "";
let analystTeamBName = "";
let analystGameDate = "";
let analystTeamAColor = "שחור";
let analystTeamBColor = "שחור";

let coachTeamAName = "";
let coachTeamBName = "";
let coachGameDate = "";
let coachTeamAColor = "שחור";
let coachTeamBColor = "שחור";

const positionActions = { 
    "שוער": ["עצירת כדור קשה", "יציאה לאגרוף", "משחק רגל מדויק", "שליטה ברחבה", "תקשורת עם ההגנה", "יציאה לכדורי גובה", "מסירה ארוכה מדויקת", "סגירת זויות בעיטות", "תגובות מהירות", "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה"],
    "בלם": ["בלימת התקפה יריבה", "משחק ראש מוצלח", "סגירת תוקף", "חטיפת כדור", "הנעת כדור אחורה בבטחה", "משחק רוחב מדויק", "סגירת קווי מסירה", "הגנה על הרחבה", "הובלת הכדור קדימה", "החזרת כדור לשוער", "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה", "בעיטה לשער", "בעיטה למסגרת"],
    "מגן": ["הגבהה מדויקת לרחבה", "תמיכה בהתקפה באגף", "כיסוי הגנתי באגף", "תקשורת עם הקשר", "ריצה לאורך הקו", "קרוס מדויק", "חטיפת כדור באגף", "מעבר מהיר להתקפה", "משחק רוחב בטוח", "שמירה על חלוץ יריב", "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה", "בעיטה לשער", "בעיטה למסגרת"],
    "קשר": ["מסירה חכמה קדימה", "שמירה על קצב המשחק", "חטיפת כדור במרכז", "משחק קצר מדויק", "שליחת כדור לעומק", "שליטה בקישור", "החלפת אגף", "תמיכה בהגנה", "ארגון ההתקפה", "ראיית משחק רחבה", "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה", "בעיטה לשער", "בעיטה למסגרת"],
    "חלוץ": ["בעיטה למסגרת", "בעיטה לשער", "תנועה ללא כדור", "קבלת כדור תחת לחץ", "סיום מצבים", "נוכחות ברחבה", "ניצול הזדמנויות", "תקשורת עם הקשרים", "לחץ על ההגנה היריבה", "נגיחה למסגרת", "שמירה על הכדור מול הגנה", "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה", "משחק עם הגב לשער"],
    "כנף": ["עקיפת מגן באגף", "הגבהה איכותית", "ריצה מהירה בקו", "חדירה לרחבה מהאגף", "משחק עומק", "קידום הכדור קדימה", "יצירת יתרון מספרי", "משחק רוחב לשינוי אגף", "הפתעת ההגנה בתנועה", "השגת פינות", "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה", "בעיטה לשער", "בעיטה למסגרת"]
};

const mentalActions = ["מנטאלי"];
const colorMap = {
    "אדום": "red", "כחול": "blue", "ירוק": "green", "צהוב": "yellow", "שחור": "black", "לבן": "white",
    "כתום": "orange", "סגול": "purple", "ורוד": "pink", "חום": "brown", "אפור": "gray", "טורקיז": "turquoise"
};
const paletteColors = ["אדום", "כחול", "ירוק", "צהוב", "שחור", "לבן", "כתום", "סגול", "ורוד", "חום", "אפור", "טורקיז"];

let chosenKeeperGoals = [];
let chosenDefenseGoals = [];
let chosenMidfieldGoals = [];
let chosenAttackGoals = [];

let customKeeperGoals = [];
let customDefenseGoals = [];
let customMidfieldGoals = [];
let customAttackGoals = [];

const CUSTOM_GOAL_LIMIT = 30;

let personalPlayersGoals = [];

let coachLiveGameStarted = false;
let coachLiveGameInterval = null;
let coachLiveGameMinute = 0;
let coachMood = { mood: '', message: '' };
let quickNotes = [];
let tacticalPlanCaptured = null;
let secondHalfStarted = false;
let matchEnded = false;
let popupAutoCloseTimer = null;
const availableMoods = ["מורל גבוה", "חוסר ריכוז", "רוגע", "התלהבות", "לחץ", "דריכות"];

/**
 * פונקציות בסיסיות לבחירת תפקיד וכו'
 */

function selectRole(role) {
    const roleContainer = document.getElementById("role-selection-container");
    if (roleContainer) {
        roleContainer.classList.add("hidden");
    }

    if (role === 'player') {
        const loginContainer = document.getElementById("login-container");
        if (loginContainer) loginContainer.classList.remove("hidden");
    } else if (role === 'coach') {
        const coachContainer = document.getElementById("coach-game-info-container");
        if (coachContainer) coachContainer.classList.remove("hidden");

        createTeamColorPalette("coach-teamA-color-palette", c => {
            coachTeamAColor = c;
            finalizeTeamAColorChoice();
        });
        createTeamColorPalette("coach-teamB-color-palette", c => {
            coachTeamBColor = c;
            finalizeTeamBColorChoice();
        });

        const coachDateInput = document.getElementById("coach-game-date");
        const today = new Date().toISOString().split('T')[0];
        coachDateInput.value = today;

    } else if (role === 'analyst') {
        const analystContainer = document.getElementById("analyst-game-info-container");
        if (analystContainer) analystContainer.classList.remove("hidden");

        const today = new Date().toISOString().split('T')[0];
        const analystDateInput = document.getElementById("analyst-game-date");
        if (analystDateInput) analystDateInput.value = today;

        createTeamColorPalette("teamA-color-palette", c => {
            analystTeamAColor = c;
        });
        createTeamColorPalette("teamB-color-palette", c => {
            analystTeamBColor = c;
        });
    }
}

function createTeamColorPalette(paletteId, onColorSelect) {
    const paletteDiv = document.getElementById(paletteId);
    if (!paletteDiv) return;
    paletteDiv.innerHTML = "";
    paletteColors.forEach(c => {
        const colorDiv = document.createElement("div");
        colorDiv.style.backgroundColor = colorMap[c];
        colorDiv.title = c;
        colorDiv.onclick = () => {
            onColorSelect(c);
        };
        paletteDiv.appendChild(colorDiv);
    });
}

function finalizeTeamAColorChoice() {
    const paletteDiv = document.getElementById("coach-teamA-color-palette");
    if (paletteDiv) {
        [...paletteDiv.children].forEach(ch => {
            if (colorMap[ch.title] !== colorMap[coachTeamAColor]) {
                ch.remove();
            } else {
                ch.style.outline = "2px solid #000";
            }
        });
        document.getElementById("coach-teamA-change-color").classList.remove("hidden");
    }
}

function resetTeamAColor() {
    createTeamColorPalette("coach-teamA-color-palette", c => {
        coachTeamAColor = c;
        finalizeTeamAColorChoice();
    });
    document.getElementById("coach-teamA-change-color").classList.add("hidden");
}

function finalizeTeamBColorChoice() {
    const paletteDiv = document.getElementById("coach-teamB-color-palette");
    if (paletteDiv) {
        [...paletteDiv.children].forEach(ch => {
            if (colorMap[ch.title] !== colorMap[coachTeamBColor]) {
                ch.remove();
            } else {
                ch.style.outline = "2px solid #000";
            }
        });
        document.getElementById("coach-teamB-change-color").classList.remove("hidden");
    }
}

function resetTeamBColor() {
    createTeamColorPalette("coach-teamB-color-palette", c => {
        coachTeamBColor = c;
        finalizeTeamBColorChoice();
    });
    document.getElementById("coach-teamB-change-color").classList.add("hidden");
}

function checkAccessCode() {
    const code = document.getElementById("access-code").value.trim();
    if (code === ACCESS_CODE) {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("user-input-container").classList.remove("hidden");
    } else {
        alert("קוד שגוי, נסה שוב");
    }
}
function registerGoalAction(result, goalObj, personalPlayer, popup) {
    actions.push({action:goalObj.goal,result:result,minute:coachLiveGameMinute});
    showPopup(`"${goalObj.goal}" ${result} נרשם!`, result.includes("מוצלח")?"good":"bad",900); // 0.9 שניות
    closeGoalActionPopup(popup,900);
}


function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;

    if (!playerName || !teamName || !playerPosition) {
        alert("אנא מלא את כל השדות (כולל תפקיד)");
        return;
    }

    window.playerNameGlobal = playerName;
    window.teamNameGlobal = teamName;
    window.playerPositionGlobal = playerPosition;

    document.getElementById("user-input-container").classList.add("hidden");
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

    if (actionsForPosition.length === 0 && mentalActions.length === 0 && customActionsArr.length === 0) {
        const actionsContainer = document.getElementById("actions-selection-container");
        actionsContainer.innerHTML = "<h3>לא נמצאו פעולות לתפקיד זה, אנא בחר תפקיד אחר.</h3>";
        return;
    }

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
    const div = document.createElement("div");
    div.classList.add("action-item");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "selected-actions";
    checkbox.value = action;
    checkbox.dataset.category = category;
    checkbox.style.display = 'none';
    div.appendChild(checkbox);

    const label = document.createElement("label");
    label.textContent = action;
    label.onclick = () => {
        if (checkbox.checked) {
            checkbox.checked = false;
            label.classList.remove("selected");
        } else {
            checkbox.checked = true;
            label.classList.add("selected");
        }
    };
    div.appendChild(label);
    return div;
}

function confirmActions() {
    const checkboxes = document.querySelectorAll('#actions-selection-container input[name="selected-actions"]:checked');
    if (checkboxes.length < 6 || checkboxes.length > 10) {
        alert(`בחרת ${checkboxes.length} פעולות. אנא בחר בין 6 ל-10 פעולות.`);
        return;
    }

    selectedActions = Array.from(checkboxes).map(cb => ({ action: cb.value, category: cb.dataset.category }));

    chosenProfessional = selectedActions.filter(a => a.category === 'professional');
    chosenMental = selectedActions.filter(a => a.category === 'mental');
    chosenCustom = selectedActions.filter(a => a.category === 'custom');

    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
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
    const div = document.createElement("div");
    div.classList.add("action-item");

    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = val;
    checkbox.name = "selected-actions";
    checkbox.dataset.category = "custom";
    checkbox.style.display = 'none';
    div.appendChild(checkbox);

    const label = document.createElement("label");
    label.textContent = val;
    label.onclick = () => {
        if (checkbox.checked) {
            checkbox.checked = false;
            label.classList.remove("selected");
        } else {
            checkbox.checked = true;
            label.classList.add("selected");
        }
    };
    div.appendChild(label);
    container.appendChild(div);
    input.value = "";
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
    notes = [];
    gameFinished = false;

    document.getElementById("minute-counter").textContent = gameMinute;

    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    document.getElementById("end-buttons-container").classList.remove("hidden");
}

function createActionRow(action, category = "") {
    const div = document.createElement("div");
    div.classList.add("action-group");
    if (category === "professional") div.classList.add("prof-bg");
    else if (category === "mental") div.classList.add("mental-bg");
    else if (category === "custom") div.classList.add("custom-bg");

    const badBtn = document.createElement("button");
    badBtn.textContent = "X";
    badBtn.style.backgroundColor = "#f44336";
    badBtn.onclick = () => trackAction(action, "לא מוצלח");

    const h2 = document.createElement("h2");
    h2.textContent = action;

    const goodBtn = document.createElement("button");
    goodBtn.textContent = "V";
    goodBtn.style.backgroundColor = "#4CAF50";
    goodBtn.onclick = () => trackAction(action, "מוצלח");

    div.appendChild(badBtn);
    div.appendChild(h2);
    div.appendChild(goodBtn);

    return div;
}

function trackAction(action, result) {
    if (!gameInterval || gameFinished) {
        alert("לא ניתן לרשום פעולה כשהסטופר לא פעיל או כשהמשחק הסתיים!");
        return;
    }
    actions.push({ action, result, minute: gameMinute });

    const type = classifyResult(result);
    let message = `הפעולה "${action}" (${result}) נרשמה!`;
    showPopup(message, type);
}

function showPopup(message, type = "neutral") {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.classList.remove("hidden", "popup-good", "popup-bad", "popup-neutral");

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
    if (notes.length > 0) {
        notes.forEach(n => {
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

    document.getElementById("end-half").style.display = "none";

    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);

    enableActions(true);
}

function showHalfAllActionsPopup() {
    const halfAllActionsList = document.getElementById("half-all-actions-list");
    halfAllActionsList.innerHTML = "";
    actions.forEach(({ action, result, minute }) => {
        const p = document.createElement("p");
        p.textContent = `דקה ${minute}: ${action} - ${result}`;
        halfAllActionsList.appendChild(p);
    });

    const popup = document.getElementById("half-all-actions-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeHalfAllActionsPopup() {
    const popup = document.getElementById("half-all-actions-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
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

    const summaryContent = document.getElementById("summary-content");
    summaryContent.innerHTML = getSummaryHTML(getActionCounts(), "סיכום המשחק");
    summaryContent.innerHTML += `<h3 id="final-score">ציון סיום המשחק שלך: ${score}</h3>`;

    const generalNoteDisplay = document.getElementById("general-note-display");
    const parentNotesList = document.getElementById("parent-notes-list");
    parentNotesList.innerHTML = "";
    if (notes.length > 0) {
        notes.forEach(n => {
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

    document.getElementById("notes-container").style.display = "none";
    document.getElementById("end-half").style.display = "none";
    document.getElementById("end-game").style.display = "none";

    document.getElementById("reopen-summary-container").classList.remove("hidden");

    saveGameDataToServer(playerName, teamName, position, gameDate, score, actions, notes);
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

    actions.forEach(({ action, result, minute }) => {
        let className = classifyResult(result);
        const p = document.createElement("p");
        p.className = className + " action-line";
        p.textContent = `דקה ${minute}: ${action} - ${result}`;
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

function saveGeneralNote() {
    const note = document.getElementById("general-note-text").value.trim();
    if (note) {
        notes.push({ text: note, minute: gameMinute });
        closeGeneralNotePopup();
        showPopup("הערה נשמרה!", "neutral");
        enableActions(true);
    } else {
        alert("לא הוזנה הערה");
    }
}

function openGeneralNotePopup() {
    document.getElementById("general-note-text").value = "";
    const popup = document.getElementById("general-note-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
    enableActions(false);
}

function closeGeneralNotePopup() {
    const popup = document.getElementById("general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    enableActions(true);
}

function calculateScore(minutesPlayed) {
    let score = 0;
    let goodCount = 0;
    let badCount = 0;
    let simplePosCount = {};

    const importantPosActions = ["בעיטה למסגרת", "בעיטה לשער", "מסירת מפתח", "ניצול הזדמנות", "נגיחה למסגרת"];
    const criticalNegActions = ["החמצת מצב ודאי", "איבוד כדור מסוכן", "אי שמירה על שחקן מפתח"];

    function determineCategory(action, result) {
        let resLower = result.toLowerCase();
        let actLower = action.toLowerCase();
        let isGood = resLower.includes("מוצלח") || resLower.includes("טוב") || resLower.includes("חיובית");
        let isBad = resLower.includes("רעה") || resLower.includes("לא מוצלח") || resLower.includes("לא טוב") || resLower.includes("שלילית");

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

    actions.forEach(({ action, result, minute }) => {
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
                let base = 5;
                if (minute > 70) base += 1;
                score += base;
            }
        } else if (category.startsWith("bad")) {
            badCount++;
            if (category === "bad_easy") {
                score -= 1;
            } else {
                let base = -3;
                if (minute > 70) base -= 1;
                score += base;
            }
        }
    });

    let ratio = goodCount / (badCount + 1);
    if (ratio < 1) {
        score *= 0.9;
    } else if (ratio > 2) {
        score *= 1.05;
    }

    if (score < 0) score = 0;
    if (score > 100) score = 100;

    return Math.round(score);
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

function downloadPDF() {
    const elem = document.getElementById("game-summary-popup");
    html2canvas(elem).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save("game-summary.pdf");
    });
}

function goToCoachGoals() {
    const teamA = document.getElementById("coach-teamA").value.trim();
    const teamB = document.getElementById("coach-teamB").value.trim();
    const date = document.getElementById("coach-game-date").value;

    if (!teamA || !teamB) {
        alert("אנא מלא את שם הקבוצות");
        return;
    }

    coachTeamAName = teamA;
    coachTeamBName = teamB;
    coachGameDate = date;

    document.getElementById("coach-game-info-container").classList.add("hidden");

    loadCoachGoalsPage();
    document.getElementById("coach-goals-container").classList.remove("hidden");
}

function loadCoachGoalsPage() {
    loadGoalsForLine("coach-goals-keeper", "שוער");
    loadGoalsForLine("coach-goals-defense", "בלם", "מגן");
    loadGoalsForLine("coach-goals-midfield", "קשר");
    loadGoalsForLine("coach-goals-attack", "חלוץ", "כנף");
}

function loadGoalsForLine(containerId, ...positions) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    let lineGoals = [];
    positions.forEach(pos => {
        if (positionActions[pos]) {
            lineGoals = lineGoals.concat(positionActions[pos]);
        }
    });
    lineGoals = [...new Set(lineGoals)];
    lineGoals.forEach(g => {
        container.appendChild(createGoalCheckbox(g));
    });
}

function createGoalCheckbox(goal) {
    const div = document.createElement("div");
    div.classList.add("action-item");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.name = "coach-goals";
    checkbox.value = goal;
    checkbox.style.display = 'none';
    div.appendChild(checkbox);

    const label = document.createElement("label");
    label.textContent = goal;
    label.onclick = () => {
        if (checkbox.checked) {
            checkbox.checked = false;
            label.classList.remove("selected");
        } else {
            checkbox.checked = true;
            label.classList.add("selected");
        }
    };
    div.appendChild(label);
    return div;
}

function addCoachCustomGoal() {
    const line = document.getElementById("coach-custom-goal-line").value;
    const val = document.getElementById("coach-custom-goal-input").value.trim();
    if (!val) {
        alert("אנא הכנס מטרה לפני ההוספה");
        return;
    }
    let arr;
    if (line === "שוער") arr = customKeeperGoals;
    else if (line === "הגנה") arr = customDefenseGoals;
    else if (line === "קישור") arr = customMidfieldGoals;
    else if (line === "התקפה") arr = customAttackGoals;

    if (arr.length >= CUSTOM_GOAL_LIMIT) {
        const popup = document.getElementById("coach-goal-limit-popup");
        popup.classList.add("active");
        popup.classList.remove("hidden");
        return;
    }

    arr.push(val);
    document.getElementById("coach-custom-goal-input").value = "";

    const popup = document.getElementById("coach-custom-goal-popup");
    const content = document.getElementById("coach-custom-goal-popup-content");
    content.innerHTML = `<p>המטרה "<strong>${val}</strong>" נוספה לחוליית ${line} בהצלחה!</p>`;
    popup.classList.remove("hidden");
    popup.classList.add("active");

    setTimeout(() => {
        closeCoachCustomGoalPopup();
    }, 800);
}

function closeCoachCustomGoalPopup() {
    const popup = document.getElementById("coach-custom-goal-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function closeCoachGoalLimitPopup() {
    const popup = document.getElementById("coach-goal-limit-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function finishCoachSetup() {
    const personalCheck = document.getElementById("coach-ask-personal-goals").checked;

    chosenKeeperGoals = getSelectedGoalsFrom("coach-goals-keeper");
    chosenDefenseGoals = getSelectedGoalsFrom("coach-goals-defense");
    chosenMidfieldGoals = getSelectedGoalsFrom("coach-goals-midfield");
    chosenAttackGoals = getSelectedGoalsFrom("coach-goals-attack");

    if (personalCheck) {
        openPersonalGoalsPopup();
    } else {
        goToFinalSummary();
    }
}

function getSelectedGoalsFrom(containerId) {
    const container = document.getElementById(containerId);
    const checks = container.querySelectorAll('input[type="checkbox"][name="coach-goals"]:checked');
    return Array.from(checks).map(c => c.value);
}

function openPersonalGoalsPopup() {
    const popup = document.getElementById("personal-goals-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closePersonalGoalsPopup() {
    const popup = document.getElementById("personal-goals-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function confirmPersonalPlayerInfo() {
    currentPersonalPlayerName = document.getElementById("personal-player-name").value.trim();
    currentPersonalPlayerPositions = [...document.querySelectorAll('input[name="personal-player-roles"]:checked')].map(cb => cb.value);

    if (!currentPersonalPlayerName || currentPersonalPlayerPositions.length === 0) {
        alert("אנא מלא שם שחקן ובחר לפחות תפקיד אחד");
        return;
    }

    closePersonalGoalsPopup();
    openPersonalGoalsSelectionPopup();
}

function openPersonalGoalsSelectionPopup() {
    const popup = document.getElementById("personal-goals-selection-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    const listDiv = document.getElementById("personal-goals-selection-list");
    listDiv.innerHTML = "";

    currentAllGoalsForPositions = [];
    currentPersonalPlayerPositions.forEach(pos => {
        let acts = positionActions[pos] || [];
        currentAllGoalsForPositions = currentAllGoalsForPositions.concat(acts);
    });

    currentAllGoalsForPositions = [...new Set(currentAllGoalsForPositions)];

    currentAllGoalsForPositions.forEach(g => {
        listDiv.appendChild(createActionCheckboxPersonalSelection(g));
    });
}

function createActionCheckboxPersonalSelection(goal) {
    const div = document.createElement("div");
    div.classList.add("action-item");
    const checkbox = document.createElement("input");
    checkbox.type = "checkbox";
    checkbox.value = goal;
    checkbox.name = "personal-player-goals-selection";
    checkbox.style.display = 'none';
    div.appendChild(checkbox);

    const label = document.createElement("label");
    label.textContent = goal;
    label.onclick = () => {
        if (checkbox.checked) {
            checkbox.checked = false;
            label.classList.remove("selected");
        } else {
            checkbox.checked = true;
            label.classList.add("selected");
        }
    };
    div.appendChild(label);
    return div;
}

function closePersonalGoalsSelectionPopup() {
    const popup = document.getElementById("personal-goals-selection-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function addPersonalPlayerCustomGoal() {
    const input = document.getElementById("personal-player-custom-goal-input");
    const val = input.value.trim();
    if (!val) {
        alert("אנא הכנס מטרה לפני ההוספה");
        return;
    }
    const listDiv = document.getElementById("personal-goals-selection-list");
    listDiv.appendChild(createActionCheckboxPersonalSelection(val));
    input.value = "";
}

function finishPersonalPlayerGoalsSelection() {
    const checks = document.querySelectorAll('input[name="personal-player-goals-selection"]:checked');
    if (checks.length === 0) {
        alert("אנא בחר לפחות מטרה אחת לשחקן");
        return;
    }

    currentPersonalPlayerGoals = Array.from(checks).map(c => ({goal:c.value}));
    closePersonalGoalsSelectionPopup();
    openPersonalGoalsNumericPopup(currentPersonalPlayerGoals, currentPersonalPlayerName, currentPersonalPlayerPositions);
}

function openPersonalGoalsNumericPopup(goals, playerName, positions) {
    currentPersonalPlayerGoals = goals; 
    currentPersonalPlayerName = playerName;
    currentPersonalPlayerPositions = positions; 

    const popup = document.getElementById("personal-goals-numeric-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    const table = document.getElementById("personal-goals-numeric-table");
    table.innerHTML = "";

    goals.forEach(g => {
        const row = document.createElement("div");
        row.classList.add("numeric-row");
        row.style.display = "flex";
        row.style.alignItems = "center";
        row.style.justifyContent = "space-between";
        row.style.gap = "10px";
        row.style.marginBottom = "10px";

        const labelContainer = document.createElement("div");
        labelContainer.style.flex = "1";
        const label = document.createElement("span");
        label.textContent = g.goal;
        label.style.fontWeight = "bold";
        labelContainer.appendChild(label);

        const inputContainer = document.createElement("div");
        inputContainer.style.flex = "1";
        const input = document.createElement("input");
        input.type = "number";
        input.min = "0";
        input.value = "0";
        input.style.width = "100px";
        input.style.fontSize = "18px";
        input.style.padding = "5px";
        input.style.borderRadius = "5px";
        input.style.border = "1px solid #ccc";
        inputContainer.appendChild(input);

        row.appendChild(labelContainer);
        row.appendChild(inputContainer);

        g.input = input;
        table.appendChild(row);
    });
}

function closePersonalGoalsNumericPopup() {
    const popup = document.getElementById("personal-goals-numeric-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function finishPersonalGoalsNumeric() {
    currentPersonalPlayerGoals.forEach(g => {
        g.numeric = parseInt(g.input.value) || 0;
    });

    closePersonalGoalsNumericPopup();

    personalPlayersGoals.push({
        playerName: currentPersonalPlayerName,
        positions: currentPersonalPlayerPositions, 
        goals: currentPersonalPlayerGoals
    });

    openPersonalGoalsAnotherPlayerPopup();
}

function openPersonalGoalsAnotherPlayerPopup() {
    const popup = document.getElementById("personal-goals-another-player-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closePersonalGoalsAnotherPlayerPopup() {
    const popup = document.getElementById("personal-goals-another-player-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function addAnotherPersonalPlayer(yes) {
    closePersonalGoalsAnotherPlayerPopup();
    if (yes) {
        resetPersonalGoalsPopup();
        openPersonalGoalsPopup();
    } else {
        showPersonalGoalsNotes();
        const personalCheck = document.getElementById("coach-ask-personal-goals");
        personalCheck.checked = false;
    }
}

function resetPersonalGoalsPopup() {
    document.getElementById("personal-player-name").value = "";
    document.querySelectorAll('input[name="personal-player-roles"]').forEach(cb => cb.checked = false);
    currentPersonalPlayerGoals = [];
    currentPersonalPlayerName = "";
    currentPersonalPlayerPositions = [];
    currentAllGoalsForPositions = [];
}

function showPersonalGoalsNotes() {
    const container = document.getElementById("coach-personal-goals-notes");
    container.innerHTML = "";
    personalPlayersGoals.forEach(playerObj => {
        const note = document.createElement("div");
        note.classList.add("note");
        note.style.background = "yellow";
        note.style.padding = "10px";
        note.style.borderRadius = "5px";
        note.style.boxShadow = "0 1px 3px rgba(0,0,0,0.2)";
        note.style.maxWidth = "200px";
        note.style.wordWrap = "break-word";
        let posStr = playerObj.positions.join(", ");
        note.innerHTML = `<strong>${playerObj.playerName} (${posStr}):</strong><br>`;
        playerObj.goals.forEach(g => {
            note.innerHTML += `- ${g.goal} (יעד מספרי: ${g.numeric})<br>`;
        });
        container.appendChild(note);
    });
}

function goToFinalSummary() {
    document.getElementById("coach-goals-container").classList.add("hidden");
    const finalContainer = document.getElementById("final-summary-container");
    finalContainer.classList.remove("hidden");

    const summaryDiv = document.getElementById("final-summary-content");
    const gameInfoP = document.getElementById("final-summary-game-info");
    gameInfoP.textContent = `משחק בין ${coachTeamAName} ל-${coachTeamBName}, תאריך: ${coachGameDate}`;

    summaryDiv.innerHTML = "<h3>מטרות לחוליות:</h3>";

    if (chosenKeeperGoals.length > 0 || customKeeperGoals.length > 0) {
        summaryDiv.innerHTML += "<strong>שוער:</strong><br>";
        chosenKeeperGoals.forEach(g => summaryDiv.innerHTML += `- ${g}<br>`);
        customKeeperGoals.forEach(g => summaryDiv.innerHTML += `- ${g} (מותאם)<br>`);
        summaryDiv.innerHTML += "<br>";
    }

    if (chosenDefenseGoals.length > 0 || customDefenseGoals.length > 0) {
        summaryDiv.innerHTML += "<strong>הגנה:</strong><br>";
        chosenDefenseGoals.forEach(g => summaryDiv.innerHTML += `- ${g}<br>`);
        customDefenseGoals.forEach(g => summaryDiv.innerHTML += `- ${g} (מותאם)<br>`);
        summaryDiv.innerHTML += "<br>";
    }

    if (chosenMidfieldGoals.length > 0 || customMidfieldGoals.length > 0) {
        summaryDiv.innerHTML += "<strong>קישור:</strong><br>";
        chosenMidfieldGoals.forEach(g => summaryDiv.innerHTML += `- ${g}<br>`);
        customMidfieldGoals.forEach(g => summaryDiv.innerHTML += `- ${g} (מותאם)<br>`);
        summaryDiv.innerHTML += "<br>";
    }

    if (chosenAttackGoals.length > 0 || customAttackGoals.length > 0) {
        summaryDiv.innerHTML += "<strong>התקפה:</strong><br>";
        chosenAttackGoals.forEach(g => summaryDiv.innerHTML += `- ${g}<br>`);
        customAttackGoals.forEach(g => summaryDiv.innerHTML += `- ${g} (מותאם)<br>`);
        summaryDiv.innerHTML += "<br>";
    }

    if (personalPlayersGoals.length > 0) {
        summaryDiv.innerHTML += "<h3>מטרות אישיות לשחקנים:</h3>";
        personalPlayersGoals.forEach(playerObj => {
            let posStr = playerObj.positions.join(", ");
            summaryDiv.innerHTML += `<strong>${playerObj.playerName} (${posStr}):</strong><br>`;
            playerObj.goals.forEach(g => {
                summaryDiv.innerHTML += `- ${g.goal} (יעד מספרי: ${g.numeric})<br>`;
            });
            summaryDiv.innerHTML += "<br>";
        });
    }
}

function downloadFinalSummaryPDF() {
    const pdfBtn = document.getElementById("download-pdf-btn");
    const contBtn = document.getElementById("continue-to-live-btn");
    pdfBtn.style.display = "none";
    contBtn.style.display = "none";

    const elem = document.getElementById("final-summary-container");
    html2canvas(elem).then((canvas) => {
        const imgData = canvas.toDataURL('image/png');
        const pdf = new jsPDF();
        pdf.addImage(imgData, 'PNG', 10, 10);
        pdf.save("final-summary.pdf");

        pdfBtn.style.display = "inline-block";
        contBtn.style.display = "inline-block";
    });
}

function goToCoachLiveGame() {
    document.getElementById("final-summary-container").classList.add("hidden");
    document.getElementById("coach-live-game-container").classList.remove("hidden");
}

function startCoachLiveGame() {
    document.getElementById("coach-live-game-container").classList.add("hidden");
    document.getElementById("coach-live-update-container").classList.remove("hidden");
    coachLiveGameStarted = true;

    coachLiveGameMinute = secondHalfStarted ? 45 : 0;
    updateCoachLiveGameTimer();
    if (coachLiveGameInterval) clearInterval(coachLiveGameInterval);
    coachLiveGameInterval = setInterval(() => {
        coachLiveGameMinute++;
        updateCoachLiveGameTimer();
    }, 60000);

    buildCoachLiveInterface();
}

function updateCoachLiveGameTimer() {
    const timerElem = document.getElementById("coach-live-minute-counter");
    if (!timerElem) return;
    timerElem.textContent = coachLiveGameMinute;
}

function buildCoachLiveInterface() {
    const liveContent = document.getElementById("live-update-content");
    liveContent.innerHTML = "";

    // מצב רוח הקבוצה
    const sidePanel = document.createElement("div");
    sidePanel.style.display = "flex";
    sidePanel.style.flexDirection = "column";
    sidePanel.style.gap = "15px";
    sidePanel.style.marginBottom = "20px";

    const moodSection = document.createElement("div");
    moodSection.style.border = "1px solid #ddd";
    moodSection.style.borderRadius = "8px";
    moodSection.style.padding = "10px";
    moodSection.style.background = "#f0f0f0";

    const moodTitle = document.createElement("h4");
    moodTitle.textContent = "מצב רוח הקבוצה";
    moodSection.appendChild(moodTitle);

    const moodSelect = document.createElement("select");
    availableMoods.forEach(m => {
        const opt = document.createElement("option");
        opt.value = m;
        opt.textContent = m;
        moodSelect.appendChild(opt);
    });
    moodSelect.onchange = () => {
        coachMood.mood = moodSelect.value;
        coachMoodTimeStamp();
        renderCoachMood(sidePanel);
    };
    moodSection.appendChild(moodSelect);

    const moodInput = document.createElement("textarea");
    moodInput.placeholder = "הוסף מסר לשחקנים...";
    moodInput.style.width = "100%";
    moodInput.style.height = "60px";
    moodInput.oninput = () => {
        coachMood.message = moodInput.value.trim();
        coachMoodTimeStamp();
        renderCoachMood(sidePanel);
    };
    moodSection.appendChild(moodInput);

    // כפתור אישור מצב רוח
    const moodSaveBtn = document.createElement("button");
    moodSaveBtn.textContent = "אישור";
    moodSaveBtn.classList.add("blue-btn");
    moodSaveBtn.onclick = () => {
        coachMoodTimeStamp();
        alert("מצב רוח נשמר עם הדקה.");
    };
    moodSection.appendChild(moodSaveBtn);

    sidePanel.appendChild(moodSection);

    // פתקים מהירים
    const notesSection = document.createElement("div");
    notesSection.style.border = "1px solid #ddd";
    notesSection.style.borderRadius = "8px";
    notesSection.style.padding = "10px";
    notesSection.style.background = "#f0f0f0";
    const notesTitle = document.createElement("h4");
    notesTitle.textContent = "הערות מהירות (פתקים צהובים)";
    notesSection.appendChild(notesTitle);

    const noteInput = document.createElement("input");
    noteInput.type = "text";
    noteInput.placeholder = "כתוב פתק...";
    notesSection.appendChild(noteInput);

    const addNoteBtn = document.createElement("button");
    addNoteBtn.textContent = "הוסף פתק";
    addNoteBtn.classList.add("blue-btn");
    addNoteBtn.style.marginRight = "10px";
    addNoteBtn.onclick = () => {
        const val = noteInput.value.trim();
        if (!val) return;
        quickNotes.push({text:val, minute:coachLiveGameMinute});
        noteInput.value = "";
        renderQuickNotes(sidePanel);
    };
    notesSection.appendChild(addNoteBtn);
    sidePanel.appendChild(notesSection);

    // לוח טקטי
    const tacticalSection = document.createElement("div");
    tacticalSection.style.border = "1px solid #ddd";
    tacticalSection.style.borderRadius = "8px";
    tacticalSection.style.padding = "10px";
    tacticalSection.style.background = "#f0f0f0";

    const tacticalTitle = document.createElement("h4");
    tacticalTitle.textContent = "לוח טקטי אינטראקטיבי";
    tacticalSection.appendChild(tacticalTitle);

    const openTacticalBtn = document.createElement("button");
    openTacticalBtn.textContent = "פתח לוח טקטי";
    openTacticalBtn.classList.add("blue-btn");
    openTacticalBtn.onclick = openTacticalBoardPopup;
    tacticalSection.appendChild(openTacticalBtn);

    sidePanel.appendChild(tacticalSection);

    liveContent.appendChild(sidePanel);

    // במקום להציג פעולות מיידית, נציג כפתורים לפי חוליה ושחקנים:
    // חוליות:
    const hulyaSection = document.createElement("div");
    hulyaSection.classList.add("live-section");
    const hulyaTitle = document.createElement("h3");
    hulyaTitle.textContent = "חוליות";
    hulyaSection.appendChild(hulyaTitle);

    ["שוער","הגנה","קישור","התקפה"].forEach(h => {
        const btn = document.createElement("button");
        btn.classList.add("blue-btn");
        btn.textContent = h;
        btn.style.margin = "5px";
        btn.onclick = () => openHulyaActionsPopup(h);
        hulyaSection.appendChild(btn);
    });
    liveContent.appendChild(hulyaSection);

    // מטרות אישיות לשחקנים:
    if (personalPlayersGoals.length > 0) {
        const sec = document.createElement("div");
        sec.classList.add("live-section");
        const h3 = document.createElement("h3");
        h3.textContent = "שחקנים (מטרות אישיות)";
        sec.appendChild(h3);

        personalPlayersGoals.forEach(p => {
            const btn = document.createElement("button");
            btn.classList.add("blue-btn");
            btn.textContent = p.playerName+" ("+p.positions.join(", ")+")";
            btn.style.margin="5px";
            btn.onclick=()=>openPlayerActionsPopup(p);
            sec.appendChild(btn);
        });
        liveContent.appendChild(sec);
    }

    // כפתורים: סיים מחצית, הצג פעולות, סיים משחק כבר קיימים
    renderQuickNotes(sidePanel);
    renderCoachMood(sidePanel);
}

function coachMoodTimeStamp() {
    coachMood.minute = coachLiveGameMinute;
}

function renderCoachMood(sidePanel) {
    let moodDisplay = sidePanel.querySelector(".mood-display");
    if (!moodDisplay) {
        moodDisplay = document.createElement("div");
        moodDisplay.classList.add("mood-display");
        moodDisplay.style.background = "#ffe";
        moodDisplay.style.padding = "10px";
        moodDisplay.style.borderRadius = "8px";
        moodDisplay.style.marginTop = "10px";
        sidePanel.appendChild(moodDisplay);
    }
    moodDisplay.innerHTML = "";
    if (coachMood.mood) {
        const mP = document.createElement("p");
        mP.innerHTML = `<strong>מצב רוח:</strong> ${coachMood.mood} (דקה: ${coachMood.minute || 0})`;
        moodDisplay.appendChild(mP);
    }
    if (coachMood.message) {
        const msgP = document.createElement("p");
        msgP.innerHTML = `<strong>מסר לשחקנים:</strong> ${coachMood.message} (דקה: ${coachMood.minute || 0})`;
        moodDisplay.appendChild(msgP);
    }
    if (!coachMood.mood && !coachMood.message) {
        moodDisplay.innerHTML = "<em>לא נקבע מצב רוח או מסר</em>";
    }
}

function renderQuickNotes(sidePanel) {
    let notesDisplay = sidePanel.querySelector(".notes-display");
    if (!notesDisplay) {
        notesDisplay = document.createElement("div");
        notesDisplay.classList.add("notes-display");
        notesDisplay.style.marginTop = "10px";
        sidePanel.appendChild(notesDisplay);
    }
    notesDisplay.innerHTML = "";
    if (quickNotes.length === 0) {
        notesDisplay.innerHTML = "<em>אין פתקים</em>";
    } else {
        quickNotes.forEach(n => {
            const noteDiv = document.createElement("div");
            noteDiv.classList.add("note");
            noteDiv.textContent = `${n.text} (דקה: ${n.minute})`;
            noteDiv.style.marginBottom="5px";
            notesDisplay.appendChild(noteDiv);
        });
    }
}

function openHulyaActionsPopup(hulyaName) {
    // פופאפ לבחירת פעולה מחוליה
    const popup = document.createElement("div");
    popup.classList.add("popup","active");
    const closeBtn=document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent="X";
    closeBtn.onclick=()=>document.body.removeChild(popup);

    // בפונקציה openHulyaActionsPopup לפני סגירת popup.appendChild(content):

const noteLabel = document.createElement("h4");
noteLabel.textContent="הוסף הערה לפעולה (אופציונלי):";
content.appendChild(noteLabel);

const noteArea=document.createElement("textarea");
noteArea.placeholder="הערה...";
content.appendChild(noteArea);

const saveNoteBtn=document.createElement("button");
saveNoteBtn.textContent="שמור הערה";
saveNoteBtn.classList.add("blue-btn");
saveNoteBtn.onclick=()=>{
  const val=noteArea.value.trim();
  if(val){
    actions.push({action:"הערה",result:"הערה",minute:coachLiveGameMinute,text:val});
    alert("הערה נשמרה!");
  } else {
    alert("לא הוזנה הערה");
  }
};
content.appendChild(saveNoteBtn);

const closeBtnBottom=document.createElement("button");
closeBtnBottom.textContent="סגור";
closeBtnBottom.classList.add("blue-btn");
closeBtnBottom.style.marginTop="20px";
closeBtnBottom.onclick=()=>document.body.removeChild(popup);
content.appendChild(closeBtnBottom);

    popup.appendChild(closeBtn);
    const content=document.createElement("div");
    content.classList.add("popup-content");
    const title=document.createElement("h3");
    title.textContent=`פעולות לחוליית ${hulyaName}`;
    content.appendChild(title);

    let relevantGoals=[];
    if(hulyaName==="שוער") relevantGoals=chosenKeeperGoals.concat(customKeeperGoals);
    else if(hulyaName==="הגנה") relevantGoals=chosenDefenseGoals.concat(customDefenseGoals);
    else if(hulyaName==="קישור") relevantGoals=chosenMidfieldGoals.concat(customMidfieldGoals);
    else if(hulyaName==="התקפה") relevantGoals=chosenAttackGoals.concat(customAttackGoals);

    if(relevantGoals.length===0) {
        content.innerHTML+="<p>לא הוגדרו מטרות לחולייה זו.</p>";
    } else {
        relevantGoals.forEach(g=>{
            const row=document.createElement("div");
            row.style.display="flex";
            row.style.justifyContent="space-between";
            row.style.alignItems="center";
            row.style.marginBottom="10px";

            const name=document.createElement("span");
            name.textContent=g;
            row.appendChild(name);

            const successBtn=document.createElement("button");
            successBtn.textContent="V";
            successBtn.style.backgroundColor="#4CAF50";
            successBtn.style.color="white";
            successBtn.onclick=()=>{ actions.push({action:g,result:"מוצלח",minute:coachLiveGameMinute}); alert("נרשם מוצלח!"); };
            row.appendChild(successBtn);

            const failBtn=document.createElement("button");
            failBtn.textContent="X";
            failBtn.style.backgroundColor="#f44336";
            failBtn.style.color="white";
            failBtn.onclick=()=>{ actions.push({action:g,result:"לא מוצלח",minute:coachLiveGameMinute}); alert("נרשם לא מוצלח!"); };
            row.appendChild(failBtn);

            content.appendChild(row);
        });
    }

    popup.appendChild(content);
    document.body.appendChild(popup);
}

function openPlayerActionsPopup(playerObj) {
    // פופאפ לבחירת פעולה לשחקן אישי
    const popup = document.createElement("div");
    popup.classList.add("popup","active");
    const closeBtn=document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent="X";
    closeBtn.onclick=()=>document.body.removeChild(popup);

    popup.appendChild(closeBtn);
    const content=document.createElement("div");
    content.classList.add("popup-content");
    const title=document.createElement("h3");
    title.textContent=`פעולות לשחקן ${playerObj.playerName} (${playerObj.positions.join(", ")})`;
    content.appendChild(title);

    if(playerObj.goals.length===0) {
        content.innerHTML+="<p>לא הוגדרו מטרות אישיות.</p>";
    } else {
        playerObj.goals.forEach(g=>{
            const row=document.createElement("div");
            row.style.display="flex";
            row.style.justifyContent="space-between";
            row.style.alignItems="center";
            row.style.marginBottom="10px";

            const name=document.createElement("span");
            name.textContent=g.goal+" (יעד:"+g.numeric+")";
            row.appendChild(name);

            const successBtn=document.createElement("button");
            successBtn.textContent="V";
            successBtn.style.backgroundColor="#4CAF50";
            successBtn.style.color="white";
            successBtn.onclick=()=>{ actions.push({action:g.goal,result:"מוצלח",minute:coachLiveGameMinute}); alert("נרשם מוצלח!"); };
            row.appendChild(successBtn);

            const failBtn=document.createElement("button");
            failBtn.textContent="X";
            failBtn.style.backgroundColor="#f44336";
            failBtn.style.color="white";
            failBtn.onclick=()=>{ actions.push({action:g.goal,result:"לא מוצלח",minute:coachLiveGameMinute}); alert("נרשם לא מוצלח!"); };
            row.appendChild(failBtn);

            content.appendChild(row);
        });
    }

    popup.appendChild(content);
    document.body.appendChild(popup);
}

function showAllActionsDuringMatch() {
    // פופאפ עם כל הפעולות עד כה
    const allActionsList=document.createElement("div");
    actions.forEach(({action,result,minute})=>{
        const p=document.createElement("p");
        p.textContent=`דקה ${minute}: ${action} - ${result}`;
        allActionsList.appendChild(p);
    });

    const popup=document.createElement("div");
    popup.classList.add("popup","active");
    const closeBtn=document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent="X";
    closeBtn.onclick=()=>document.body.removeChild(popup);
    popup.appendChild(closeBtn);

    const content=document.createElement("div");
    content.classList.add("popup-content");
    const title=document.createElement("h3");
    title.textContent="כל הפעולות עד כה";
    content.appendChild(title);
    content.appendChild(allActionsList);
    popup.appendChild(content);
    document.body.appendChild(popup);
}

// פונקציות לוח טקטי
async function openTacticalBoardPopup() {
    const popup = document.createElement("div");
    popup.classList.add("popup", "active");
    popup.style.width = "85%";
    popup.style.height = "85%";

    const closeBtn = document.createElement("span");
    closeBtn.classList.add("close-btn");
    closeBtn.textContent = "X";
    closeBtn.onclick = () => document.body.removeChild(popup);
    popup.appendChild(closeBtn);

    const content = document.createElement("div");
    content.classList.add("popup-content");
    content.style.position = "relative";
    content.style.width="100%";
    content.style.height="100%";
    content.style.overflow="hidden";

    const title = document.createElement("h3");
    title.textContent = "לוח טקטי אינטראקטיבי";
    content.appendChild(title);

    const pitch = document.createElement("div");
    pitch.style.width = "100%";
    pitch.style.height = "calc(85% - 100px)";
    pitch.style.background = "url('static/pitch.png') no-repeat center center";
    pitch.style.backgroundSize = "contain";
    pitch.style.position = "relative";
    pitch.style.overflow = "hidden";
    content.appendChild(pitch);

    // יצירת מערך 4-4-2 לשתי קבוצות
    // קבוצה א' (אדום) בצד שמאל
    // קבוצה ב' (כחול) בצד ימין

    // מערך קבוצה א' (אדום):
    // נניח גודל המגרש height:500px width:auto
    // פשוט נמקם יחסית:
    const redPositions=[
        // 4-4-2: שוער
        {x:10,y:50},
        // הגנה (4)
        {x:20,y:20},{x:20,y:40},{x:20,y:60},{x:20,y:80},
        // קישור(4)
        {x:35,y:25},{x:35,y:45},{x:35,y:65},{x:35,y:85},
        // התקפה(2)
        {x:50,y:30},{x:50,y:70}
    ];

    // קבוצה ב' (כחול), מראה בצד ימין
    const bluePositions=[
        {x:90,y:50},
        {x:80,y:20},{x:80,y:40},{x:80,y:60},{x:80,y:80},
        {x:65,y:25},{x:65,y:45},{x:65,y:65},{x:65,y:85},
        {x:55,y:30},{x:55,y:70}
    ];

    function createPlayerDot(color,xPerc,yPerc) {
        const playerDot=document.createElement("div");
        playerDot.style.width="20px";
        playerDot.style.height="20px";
        playerDot.style.borderRadius="50%";
        playerDot.style.background=color;
        playerDot.style.position="absolute";
        playerDot.style.cursor="grab";

        function setPosition() {
            const rect=pitch.getBoundingClientRect();
            playerDot.style.left=(rect.width*(xPerc/100)-10)+"px";
            playerDot.style.top=(rect.height*(yPerc/100)-10)+"px";
        }
        setPosition();

        let dragging=false;
        let offsetX=0,offsetY=0;

        playerDot.onmousedown=(e)=>{
            dragging=true;
            offsetX=e.offsetX;
            offsetY=e.offsetY;
            playerDot.style.cursor="grabbing";
        };
        playerDot.ontouchstart=(e)=>{
            dragging=true;
            offsetX=10; offsetY=10; 
            playerDot.style.cursor="grabbing";
        };
        document.onmouseup=()=>{dragging=false;playerDot.style.cursor="grab";};
        document.ontouchend=()=>{dragging=false;playerDot.style.cursor="grab";};
        document.onmousemove=(e)=>{
            if(dragging){
                const rect=pitch.getBoundingClientRect();
                let nx=e.clientX-rect.left-offsetX;
                let ny=e.clientY-rect.top-offsetY;
                if(nx<0)nx=0;if(ny<0)ny=0;
                if(nx>rect.width-20)nx=rect.width-20;
                if(ny>rect.height-20)ny=rect.height-20;
                playerDot.style.left=nx+"px";
                playerDot.style.top=ny+"px";
            }
        };
        document.ontouchmove=(e)=>{
            if(dragging && e.touches.length>0){
                const rect=pitch.getBoundingClientRect();
                let nx=e.touches[0].clientX-rect.left-10;
                let ny=e.touches[0].clientY-rect.top-10;
                if(nx<0)nx=0;if(ny<0)ny=0;
                if(nx>rect.width-20)nx=rect.width-20;
                if(ny>rect.height-20)ny=rect.height-20;
                playerDot.style.left=nx+"px";
                playerDot.style.top=ny+"px";
            }
        };

        window.addEventListener('resize',setPosition);
        pitch.appendChild(playerDot);
    }

    redPositions.forEach(pos=>{createPlayerDot("red",pos.x,pos.y)});
    bluePositions.forEach(pos=>{createPlayerDot("blue",pos.x,pos.y)});

    const captureBtn=document.createElement("button");
    captureBtn.textContent="צלם תכנית";
    captureBtn.classList.add("blue-btn");
    captureBtn.style.marginTop="20px";
    captureBtn.onclick=async()=>{
        const rect=pitch.getBoundingClientRect();
        const canvas=await html2canvas(pitch);
        tacticalPlanCaptured=canvas.toDataURL('image/png');
        alert("התכנית צולמה בהצלחה!");
    };
    content.appendChild(captureBtn);

    popup.appendChild(content);
    document.body.appendChild(popup);
}

function submitAnalystGameInfo() {
    const teamA = document.getElementById("analyst-teamA").value.trim();
    const teamB = document.getElementById("analyst-teamB").value.trim();
    const date = document.getElementById("analyst-game-date").value;

    if (!teamA || !teamB || !date) {
        alert("אנא מלא את שם הקבוצות והתאריך");
        return;
    }

    analystTeamAName = teamA;
    analystTeamBName = teamB;
    analystGameDate = date;

    document.getElementById("analyst-game-info-container").classList.add("hidden");

    const teamSelect = document.getElementById("analyst-player-team-select");
    teamSelect.innerHTML = "";
    let optA = document.createElement("option");
    optA.value = "A";
    optA.textContent = analystTeamAName;
    let optB = document.createElement("option");
    optB.value = "B";
    optB.textContent = analystTeamBName;
    teamSelect.appendChild(optA);
    teamSelect.appendChild(optB);

    const nameInput = document.getElementById("analyst-player-name");
    const addBtn = document.getElementById("add-player-btn");
    nameInput.oninput = () => {
        addBtn.disabled = !nameInput.value.trim();
    };

    document.getElementById("analyst-setup-container").classList.remove("hidden");
}

function addAnalystPlayer() {
    const name = document.getElementById("analyst-player-name").value.trim();
    if (!name) return;

    const teamSide = document.getElementById("analyst-player-team-select").value; 
    const number = document.getElementById("analyst-player-number").value.trim();
    const position = document.getElementById("analyst-player-position").value;

    let playerColor = (teamSide === 'A') ? analystTeamAColor : analystTeamBColor;
    if (!playerColor) playerColor = "שחור";

    analystPlayers.push({ name, number, position, teamSide, color: playerColor, notes: [] });
    updateAnalystPlayersList();

    document.getElementById("analyst-player-name").value = "";
    document.getElementById("analyst-player-number").value = "";
    document.getElementById("analyst-player-position").value = "";
    document.getElementById("add-player-btn").disabled = true;
}

function updateAnalystPlayersList() {
    const list = document.getElementById("analyst-players-list");
    list.innerHTML = "";
    analystPlayers.forEach((player, i) => {
        const card = document.createElement("div");
        card.classList.add("player-card");

        const delBtn = document.createElement("div");
        delBtn.classList.add("delete-player-btn");
        delBtn.textContent = "X";
        delBtn.onclick = () => {
            analystPlayers.splice(i, 1);
            updateAnalystPlayersList();
        };
        card.appendChild(delBtn);

        const title = document.createElement("h4");
        let titleText = player.name || "שחקן ללא שם";
        title.textContent = titleText;
        title.style.color = colorMap[player.color] || "black";
        card.appendChild(title);

        if (player.number) {
            const shirtIcon = document.createElement("div");
            shirtIcon.classList.add("shirt-icon");
            shirtIcon.textContent = player.number;
            shirtIcon.style.backgroundColor = colorMap[player.color] || "black";
            if (['yellow', 'white', 'pink'].includes((colorMap[player.color] || "black"))) {
                shirtIcon.style.color = "black";
            } else {
                shirtIcon.style.color = "white";
            }
            card.appendChild(shirtIcon);
        }

        let teamNameDisplayed = player.teamSide === 'A' ? analystTeamAName : analystTeamBName;
        const pTeamSide = document.createElement("p");
        pTeamSide.textContent = `משחק ב: ${teamNameDisplayed}`;
        card.appendChild(pTeamSide);

        if (player.position) {
            const pPos = document.createElement("p");
            pPos.textContent = `תפקיד: ${player.position}`;
            card.appendChild(pPos);
        }

        list.appendChild(card);
    });
}

function submitAnalystSetup() {
    document.getElementById("analyst-setup-container").classList.add("hidden");
    loadAnalystActions();
    document.getElementById("analyst-actions-container").classList.remove("hidden");
}

function loadAnalystActions() {
    const container = document.getElementById("analyst-players-actions");
    container.innerHTML = "";

    if (analystPlayers.length === 0) {
        const p = document.createElement("p");
        p.textContent = "לא נוספו שחקנים. הוסף שחקן ולאחר מכן בחר פעולות.";
        container.appendChild(p);
        return;
    }

    analystPlayers.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.style.borderBottom = "1px solid #ddd";
        playerDiv.style.marginBottom = "20px";
        const title = document.createElement("h3");
        let teamNameDisplayed = player.teamSide === 'A' ? analystTeamAName : analystTeamBName;
        title.textContent = `${player.name || 'שחקן'} (${player.number ? '#' + player.number : ''}) - ${player.position || 'ללא תפקיד'} [${teamNameDisplayed}]`;
        title.style.color = colorMap[player.color] || "black";
        playerDiv.appendChild(title);

        const actionsForPosition = positionActions[player.position] || [];

        const profTitle = document.createElement("h4");
        profTitle.textContent = "פעולות מקצועיות:";
        playerDiv.appendChild(profTitle);

        const profActionsDiv = document.createElement("div");
        profActionsDiv.classList.add("actions-grid");
        actionsForPosition.forEach(action => {
            profActionsDiv.appendChild(createAnalystSelectableAction(action));
        });
        playerDiv.appendChild(profActionsDiv);

        const mentalTitle = document.createElement("h4");
        mentalTitle.textContent = "פעולות מנטאליות:";
        playerDiv.appendChild(mentalTitle);

        const mentalActionsDiv = document.createElement("div");
        mentalActionsDiv.classList.add("actions-grid");
        mentalActions.forEach(action => {
            mentalActionsDiv.appendChild(createAnalystSelectableAction(action));
        });
        playerDiv.appendChild(mentalActionsDiv);

        const customTitle = document.createElement("h4");
        customTitle.textContent = "פעולות מותאמות אישית:";
        playerDiv.appendChild(customTitle);

        const customActionsDiv = document.createElement("div");
        customActionsDiv.classList.add("actions-grid");
        playerDiv.appendChild(customActionsDiv);

        const customGroup = document.createElement("div");
        customGroup.classList.add("input-group");
        const customInput = document.createElement("input");
        customInput.type = "text";
        customInput.placeholder = "הכנס פעולה מותאמת";

        const addButton = document.createElement("button");
        addButton.textContent = "הוסף";
        addButton.classList.add("blue-btn");
        addButton.onclick = () => {
            const val = customInput.value.trim();
            if (!val) {
                alert("אנא כתוב שם פעולה לפני ההוספה");
                return;
            }
            customActionsDiv.appendChild(createAnalystSelectableAction(val));
            customInput.value = "";
        };

        customGroup.appendChild(customInput);
        customGroup.appendChild(addButton);
        playerDiv.appendChild(customGroup);

        container.appendChild(playerDiv);
    });
}

function createAnalystSelectableAction(action) {
    const div = document.createElement("div");
    div.classList.add("action-item");
    const label = document.createElement("label");
    label.textContent = action;
    label.onclick = () => {
        if (label.classList.contains("selected")) {
            label.classList.remove("selected");
        } else {
            label.classList.add("selected");
        }
    };
    div.appendChild(label);
    return div;
}

function submitAnalystActions() {
    const containers = document.querySelectorAll('#analyst-players-actions > div[style]');
    analystPlayers.forEach((player, index) => {
        let chosenActions = [];
        const lbls = containers[index].querySelectorAll("label.selected");
        lbls.forEach(l => chosenActions.push(l.textContent));
        player.finalActions = chosenActions;
    });

    document.getElementById("analyst-actions-container").classList.add("hidden");
    loadAnalystMarking();
    document.getElementById("analyst-marking-container").classList.remove("hidden");
    startAnalystTimer();
}

function startAnalystTimer() {
    document.getElementById("game-timer").classList.remove("hidden");
    gameMinute = 0;
    document.getElementById("minute-counter").textContent = gameMinute;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval = setInterval(() => {
        gameMinute++;
        document.getElementById("minute-counter").textContent = gameMinute;
    }, 60000);
    analystStartTime = true;
}

function loadAnalystMarking() {
    const container = document.getElementById("analyst-marking-players");
    container.innerHTML = "";

    if (analystPlayers.length === 0) {
        const p = document.createElement("p");
        p.textContent = "לא נוספו שחקנים.";
        container.appendChild(p);
        return;
    }

    analystPlayers.forEach((player, index) => {
        if (!player.notes) player.notes = [];
        const playerWrapper = document.createElement("div");
        playerWrapper.style.borderBottom = "1px solid #ddd";
        playerWrapper.style.marginBottom = "20px";

        const header = document.createElement("div");
        header.classList.add("marking-player-header");
        let teamNameDisplayed = player.teamSide === 'A' ? analystTeamAName : analystTeamBName;
        let numHTML = player.number ? `<span class="shirt-number" style="background:${colorMap[player.color] || 'black'};padding:2px 5px;border-radius:5px;font-weight:bold;color:${(['yellow', 'white', 'pink'].includes((colorMap[player.color] || "black")) ? 'black' : 'white')}">${player.number}</span>` : '';
        header.innerHTML = `${numHTML} ${player.name || 'שחקן'} - ${player.position || 'ללא תפקיד'} [${teamNameDisplayed}]`;
        header.style.color = colorMap[player.color] || "black";

        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("marking-player-actions");

        const notesContainer = document.createElement("div");
        notesContainer.style.marginBottom = "10px";

        const addNoteBtn = document.createElement("button");
        addNoteBtn.textContent = "הוסף הערה";
        addNoteBtn.classList.add("blue-btn");
        addNoteBtn.style.marginBottom = "10px";
        addNoteBtn.onclick = () => {
            const noteDiv = document.createElement("div");
            noteDiv.style.marginBottom = "5px";

            const ta = document.createElement("textarea");
            ta.placeholder = "הערה לשחקן זה (אופציונלי)";
            ta.style.display = "block";
            ta.style.marginBottom = "5px";

            const btnSave = document.createElement("button");
            btnSave.textContent = "שמור הערה";
            btnSave.classList.add("blue-btn");
            btnSave.style.marginRight = "5px";
            const btnCancel = document.createElement("button");
            btnCancel.textContent = "בטל";
            btnCancel.classList.add("blue-btn");

            btnSave.onclick = () => {
                const val = ta.value.trim();
                if (!val) {
                    alert("אין טקסט בהערה");
                    return;
                }
                player.notes.push({ text: val });
                noteDiv.innerHTML = `<p style="font-style:italic;">- ${val}</p>`;
            };

            btnCancel.onclick = () => {
                noteDiv.remove();
            };

            noteDiv.appendChild(ta);
            noteDiv.appendChild(btnSave);
            noteDiv.appendChild(btnCancel);
            notesContainer.appendChild(noteDiv);
        };

        notesContainer.appendChild(addNoteBtn);
        actionsDiv.appendChild(notesContainer);

        header.onclick = () => {
            actionsDiv.classList.toggle("visible");
        };

        playerWrapper.appendChild(header);

        if (player.finalActions && player.finalActions.length > 0) {
            player.finalActions.forEach(action => {
                const row = document.createElement("div");
                row.classList.add("action-group");

                const badBtn = document.createElement("button");
                badBtn.textContent = "X";
                badBtn.style.backgroundColor = "#f44336";
                badBtn.onclick = () => markAnalystAction(index, action, "לא מוצלח");

                const h2 = document.createElement("h2");
                h2.textContent = action;

                const goodBtn = document.createElement("button");
                goodBtn.textContent = "V";
                goodBtn.style.backgroundColor = "#4CAF50";
                goodBtn.onclick = () => markAnalystAction(index, action, "מוצלח");

                row.appendChild(badBtn);
                row.appendChild(h2);
                row.appendChild(goodBtn);
                actionsDiv.appendChild(row);
            });
        } else {
            const p = document.createElement("p");
            p.textContent = "לא נבחרו פעולות.";
            actionsDiv.appendChild(p);
        }

        playerWrapper.appendChild(actionsDiv);
        container.appendChild(playerWrapper);
    });
}

function markAnalystAction(playerIndex, action, result) {
    analystGameActions.push({ playerIndex, action, result, minute: gameMinute });
    showPopup(`פעולה "${action}" (${result}) נרשמה!`, result.includes("מוצלח") ? "good" : "bad");
}

function finishAnalystGame() {
    const generalNote = document.getElementById("analyst-general-note").value.trim();
    document.getElementById("analyst-marking-container").classList.add("hidden");
    showFinalSummary(generalNote);
}

function showFinalSummary(generalNote) {
    const finalContainer = document.getElementById("analyst-final-summary-container");
    finalContainer.classList.remove("hidden");

    const finalDataDiv = document.getElementById("analyst-final-data");
    finalDataDiv.innerHTML = "";

    const title = document.createElement("h3");
    title.textContent = `משחק בין ${analystTeamAName} ל-${analystTeamBName} בתאריך: ${analystGameDate}`;
    finalDataDiv.appendChild(title);

    const playersTitle = document.createElement("h3");
    playersTitle.textContent = "נתוני השחקנים:";
    finalDataDiv.appendChild(playersTitle);

    analystPlayers.forEach((player, index) => {
        const card = document.createElement("div");
        card.style.border = "1px solid #ccc";
        card.style.borderRadius = "5px";
        card.style.padding = "10px";
        card.style.marginBottom = "10px";

        let teamNameDisplayed = player.teamSide === 'A' ? analystTeamAName : analystTeamBName;
        let info = `${player.name || 'שחקן'} ${player.number ? ('#' + player.number) : ''} - ${player.position || 'ללא תפקיד'} [${teamNameDisplayed}]<br>`;
        const pInfo = document.createElement("p");
        pInfo.innerHTML = info;
        pInfo.style.color = colorMap[player.color] || "black";
        card.appendChild(pInfo);

        const filteredActions = analystGameActions.filter(a => a.playerIndex === index);
        if (player.finalActions && player.finalActions.length > 0 && filteredActions.length > 0) {
            const ul = document.createElement("ul");
            filteredActions.forEach(a => {
                const li = document.createElement("li");
                li.textContent = `${a.action}: ${a.result} (דקה ${a.minute})`;
                ul.appendChild(li);
            });
            card.appendChild(ul);
        } else {
            const pNo = document.createElement("p");
            pNo.textContent = "לא נבחרו פעולות או לא בוצעו.";
            card.appendChild(pNo);
        }

        if (player.notes && player.notes.length > 0) {
            const notesTitle = document.createElement("p");
            notesTitle.style.fontWeight = "bold";
            notesTitle.textContent = "הערות על השחקן:";
            card.appendChild(notesTitle);

            player.notes.forEach(n => {
                if (n.text && n.text.trim()) {
                    const noteP = document.createElement("p");
                    noteP.style.fontStyle = "italic";
                    noteP.textContent = "- " + n.text;
                    card.appendChild(noteP);
                }
            });
        }

        finalDataDiv.appendChild(card);
    });

    if (generalNote) {
        const gNoteP = document.createElement("p");
        gNoteP.style.fontWeight = "bold";
        gNoteP.textContent = "הערה כללית: " + generalNote;
        finalDataDiv.appendChild(gNoteP);
    }
}

async function downloadPDFAnalyst() {
    const elem = document.getElementById("analyst-final-summary-container");
    const canvas = await html2canvas(elem);
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps = pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("summary.pdf");
}
