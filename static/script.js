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

const ACCESS_CODE = "1976"; // לשחקן
const ANALYST_CODE = "2012"; // לאנליסט

function selectRole(role) {
    document.getElementById("role-selection-container").classList.add("hidden");
    if (role === 'player') {
        document.getElementById("login-container").classList.remove("hidden");
    } else if (role === 'coach') {
        document.getElementById("coach-analyst-container").classList.remove("hidden");
    } else if (role === 'analyst') {
        document.getElementById("analyst-setup-container").classList.remove("hidden");
        window.analystPlayers = [];
    }
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
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = val;
    cb.name = "selected-actions";
    cb.dataset.category = "custom";
    div.appendChild(cb);
    const label = document.createElement("label");
    label.textContent = val;
    div.appendChild(label);
    container.appendChild(div);
    input.value = "";
}

function confirmActions() {
    const checkboxes = document.querySelectorAll('#actions-selection-container input[name="selected-actions"]:checked');
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
    notes = [];
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
    actions.push({action, result, minute: gameMinute});

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

    document.getElementById("notes-container").style.display = 'none';
    document.getElementById("end-half").style.display = 'none';
    document.getElementById("end-game").style.display = 'none';

    document.getElementById("reopen-summary-container").classList.remove("hidden");

    saveGameDataToServer(playerName, teamName, position, gameDate, score, actions, notes);
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

function saveGeneralNote() {
    const note = document.getElementById("general-note-text").value.trim();
    if(note) {
        notes.push({text: note, minute: gameMinute});
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
}

function closeGeneralNotePopup() {
    const popup = document.getElementById("general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
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

// הרשימת פעולות לפי תפקיד
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
    "מנטאלי"
];

// אנליסט
window.analystPlayers = [];

function addAnalystPlayer() {
    if (analystPlayers.length >= 10) {
        alert("לא ניתן להוסיף יותר מ-10 שחקנים");
        return;
    }

    const name = document.getElementById("analyst-player-name").value.trim();
    const number = document.getElementById("analyst-player-number").value.trim();
    const team = document.getElementById("analyst-player-team").value.trim();
    const position = document.getElementById("analyst-player-position").value;

    // הוסף שחקן למערך
    analystPlayers.push({name, number, team, position});
    updateAnalystPlayersList();

    // אפס שדות
    document.getElementById("analyst-player-name").value = "";
    document.getElementById("analyst-player-number").value = "";
    document.getElementById("analyst-player-team").value = "";
    document.getElementById("analyst-player-position").value = "";
}

function updateAnalystPlayersList() {
    const list = document.getElementById("analyst-players-list");
    list.innerHTML = "";
    analystPlayers.forEach((player, i) => {
        const card = document.createElement("div");
        card.classList.add("player-card");
        const title = document.createElement("h4");
        title.textContent = player.name || "שחקן ללא שם";
        card.appendChild(title);

        if (player.number) {
            const pNumber = document.createElement("p");
            pNumber.textContent = `מס' חולצה: ${player.number}`;
            card.appendChild(pNumber);
        }

        if (player.team) {
            const pTeam = document.createElement("p");
            pTeam.textContent = `קבוצה: ${player.team}`;
            card.appendChild(pTeam);
        }

        if (player.position) {
            const pPos = document.createElement("p");
            pPos.textContent = `תפקיד: ${player.position}`;
            card.appendChild(pPos);
        }

        list.appendChild(card);
    });
}

function submitAnalystSetup() {
    const code = document.getElementById("analyst-access-code").value.trim();
    if (code !== ANALYST_CODE) {
        alert("קוד שגוי, נסה שוב");
        return;
    }

    document.getElementById("analyst-setup-container").classList.add("hidden");
    loadAnalystActions();
    document.getElementById("analyst-actions-container").classList.remove("hidden");
}

function loadAnalystActions() {
    const container = document.getElementById("analyst-players-actions");
    container.innerHTML = "";

    analystPlayers.forEach((player, index) => {
        const playerDiv = document.createElement("div");
        playerDiv.style.borderBottom = "1px solid #ddd";
        playerDiv.style.marginBottom = "20px";
        const title = document.createElement("h3");
        title.textContent = `${player.name || 'שחקן'} (#${player.number || '?'}) - ${player.position || 'ללא תפקיד'}`;
        playerDiv.appendChild(title);

        const actionsForPosition = positionActions[player.position] || [];
        const profTitle = document.createElement("h4");
        profTitle.textContent = "פעולות מקצועיות:";
        playerDiv.appendChild(profTitle);
        const profActionsDiv = document.createElement("div");
        profActionsDiv.classList.add("actions-grid");
        actionsForPosition.forEach(action => {
            profActionsDiv.appendChild(createActionCheckboxForAnalyst(action, `analyst-player${index}-professional`));
        });
        playerDiv.appendChild(profActionsDiv);

        const mentalTitle = document.createElement("h4");
        mentalTitle.textContent = "פעולה מנטאלית:";
        playerDiv.appendChild(mentalTitle);
        const mentalActionsDiv = document.createElement("div");
        mentalActionsDiv.classList.add("actions-grid");
        mentalActions.forEach(action => {
            mentalActionsDiv.appendChild(createActionCheckboxForAnalyst(action, `analyst-player${index}-mental`));
        });
        playerDiv.appendChild(mentalActionsDiv);

        const customTitle = document.createElement("h4");
        customTitle.textContent = "פעולות מותאמות אישית:";
        playerDiv.appendChild(customTitle);

        const customActionsDiv = document.createElement("div");
        customActionsDiv.classList.add("actions-grid");
        customActionsDiv.id = `analyst-player${index}-custom-actions-div`;

        const customGroup = document.createElement("div");
        customGroup.classList.add("input-group");
        const customInput = document.createElement("input");
        customInput.type = "text";
        customInput.placeholder = "הכנס פעולה מותאמת";
        customInput.id = `analyst-player${index}-custom-input`;

        const addButton = document.createElement("button");
        addButton.textContent = "הוסף";
        addButton.onclick = () => {
            const val = customInput.value.trim();
            if (!val) {
                alert("אנא כתוב שם פעולה לפני ההוספה");
                return;
            }
            customActionsDiv.appendChild(createActionCheckboxForAnalyst(val, `analyst-player${index}-custom`));
            customInput.value = "";
        };

        customGroup.appendChild(customInput);
        customGroup.appendChild(addButton);

        playerDiv.appendChild(customTitle);
        playerDiv.appendChild(customActionsDiv);
        playerDiv.appendChild(customGroup);

        container.appendChild(playerDiv);
    });
}

function createActionCheckboxForAnalyst(action, name) {
    const div = document.createElement("div");
    div.classList.add("action-item");
    const cb = document.createElement("input");
    cb.type = "checkbox";
    cb.value = action;
    cb.name = name;
    div.appendChild(cb);
    const label = document.createElement("label");
    label.textContent = action;
    div.appendChild(label);
    return div;
}

function submitAnalystActions() {
    alert("הבחירות נשמרו! (כאן ניתן בהמשך ליישם לוגיקה משלימה)");
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
