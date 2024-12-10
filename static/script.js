// script.js

// קודי גישה לדוגמה
const ACCESS_CODE = "1976"; 
const ANALYST_CODE = "2012"; 

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

// פונקציה בחירת תפקיד בתחילת הדרך
function selectRole(role) {
    document.getElementById("role-selection-container").classList.add("hidden");
    if (role === 'player') {
        document.getElementById("login-container").classList.remove("hidden");
    } else if (role === 'coach') {
        document.getElementById("coach-analyst-container").classList.remove("hidden");
    } else if (role === 'analyst') {
        document.getElementById("analyst-setup-container").classList.remove("hidden");
        analystPlayers = [];
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
    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.value=val;
    checkbox.name="selected-actions";
    checkbox.dataset.category="custom";
    checkbox.style.display='none';
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
    }
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

    if (gameInterval) clearInterval(gameInterval);
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
    const div = document.createElement("div");
    div.classList.add("action-item");
    const checkbox = document.createElement("input");
    checkbox.type="checkbox";
    checkbox.name="selected-actions";
    checkbox.value=action;
    checkbox.dataset.category=category;
    checkbox.style.display='none';
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
    }
    div.appendChild(label);
    return div;
}

const positionActions = {
    "שוער": ["עצירת כדור קשה","יציאה לאגרוף","משחק רגל מדויק","שליטה ברחבה","תקשורת עם ההגנה","יציאה לכדורי גובה","מסירה ארוכה מדויקת","סגירת זויות בעיטות","תגובות מהירות","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה"],
    "בלם": ["בלימת התקפה יריבה","משחק ראש מוצלח","סגירת תוקף","חטיפת כדור","הנעת כדור אחורה בבטחה","משחק רוחב מדויק","סגירת קווי מסירה","הגנה על הרחבה","הובלת הכדור קדימה","החזרת כדור לשוער","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"],
    "מגן": ["הגבהה מדויקת לרחבה","תמיכה בהתקפה באגף","כיסוי הגנתי באגף","תקשורת עם הקשר","ריצה לאורך הקו","קרוס מדויק","חטיפת כדור באגף","מעבר מהיר להתקפה","משחק רוחב בטוח","שמירה על חלוץ יריב","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"],
    "קשר": ["מסירה חכמה קדימה","שמירה על קצב המשחק","חטיפת כדור במרכז","משחק קצר מדויק","שליחת כדור לעומק","שליטה בקישור","החלפת אגף","תמיכה בהגנה","ארגון ההתקפה","ראיית משחק רחבה","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"],
    "חלוץ": ["בעיטה למסגרת","בעיטה לשער","תנועה ללא כדור","קבלת כדור תחת לחץ","סיום מצבים","נוכחות ברחבה","ניצול הזדמנויות","תקשורת עם הקשרים","לחץ על ההגנה היריבה","נגיחה למסגרת","שמירה על הכדור מול הגנה","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","משחק עם הגב לשער"],
    "כנף": ["עקיפת מגן באגף","הגבהה איכותית","ריצה מהירה בקו","חדירה לרחבה מהאגף","משחק עומק","קידום הכדור קדימה","יצירת יתרון מספרי","משחק רוחב לשינוי אגף","הפתעת ההגנה בתנועה","השגת פינות","ביצוע 1 על 1","מסירת מפתח","הגבהה לרחבה","בעיטה לשער","בעיטה למסגרת"]
};

const mentalActions = ["מנטאלי"];

// פונקציות לאנליסט
function addAnalystPlayer() {
    if (analystPlayers.length >= 10) {
        alert("לא ניתן להוסיף יותר מ-10 שחקנים");
        return;
    }

    const name = document.getElementById("analyst-player-name").value.trim();
    const number = document.getElementById("analyst-player-number").value.trim();
    const team = document.getElementById("analyst-player-team").value.trim();
    const position = document.getElementById("analyst-player-position").value;

    analystPlayers.push({name, number, team, position});
    updateAnalystPlayersList();

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

        const delBtn = document.createElement("div");
        delBtn.classList.add("delete-player-btn");
        delBtn.textContent = "X";
        delBtn.onclick = () => {
            analystPlayers.splice(i,1);
            updateAnalystPlayersList();
        };
        card.appendChild(delBtn);

        const title = document.createElement("h4");
        let titleText = player.name || "שחקן ללא שם";
        title.textContent = titleText;
        card.appendChild(title);

        if (player.number) {
            const shirtIcon = document.createElement("div");
            shirtIcon.classList.add("shirt-icon");
            shirtIcon.textContent = player.number;
            card.appendChild(shirtIcon);
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
        title.textContent = `${player.name || 'שחקן'} (${player.number ? '#'+player.number:''}) - ${player.position || 'ללא תפקיד'}`;
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
        mentalTitle.textContent = "פעולה מנטאלית:";
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
    }
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
        if(!player.note) player.note = ""; 
        const playerWrapper = document.createElement("div");
        playerWrapper.style.borderBottom = "1px solid #ddd";
        playerWrapper.style.marginBottom = "20px";

        const header = document.createElement("div");
        header.classList.add("marking-player-header");
        const shirtNum = player.number ? `<span class="shirt-number">${player.number}</span>` : '';
        header.innerHTML = `${shirtNum}${player.name || 'שחקן'} - ${player.position || 'ללא תפקיד'}`;
        const actionsDiv = document.createElement("div");
        actionsDiv.classList.add("marking-player-actions");

        header.onclick = () => {
            actionsDiv.classList.toggle("visible");
        }

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

        // הערה לכל שחקן
        const noteArea = document.createElement("textarea");
        noteArea.placeholder = "הערה לשחקן זה (אופציונלי)";
        noteArea.value = player.note;
        noteArea.oninput = () => {
            player.note = noteArea.value;
        };
        actionsDiv.appendChild(noteArea);

        playerWrapper.appendChild(actionsDiv);
        container.appendChild(playerWrapper);
    });
}

function markAnalystAction(playerIndex, action, result) {
    analystGameActions.push({playerIndex, action, result, minute: gameMinute});
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
    title.textContent = "נתוני השחקנים:";
    finalDataDiv.appendChild(title);

    analystPlayers.forEach((player, index) => {
        const card = document.createElement("div");
        card.style.border="1px solid #ccc";
        card.style.borderRadius="5px";
        card.style.padding="10px";
        card.style.marginBottom="10px";
        let info = `${player.name||'שחקן'} ${player.number?('#'+player.number):''} - ${player.position||'ללא תפקיד'}<br>`;
        if (player.team) info += `קבוצה: ${player.team}<br>`;
        const pInfo = document.createElement("p");
        pInfo.innerHTML = info;
        card.appendChild(pInfo);

        if (player.finalActions && player.finalActions.length>0) {
            const ul = document.createElement("ul");
            analystGameActions
              .filter(a=>a.playerIndex===index)
              .forEach(a=>{
                const li = document.createElement("li");
                li.textContent = `${a.action}: ${a.result} (דקה ${a.minute})`;
                ul.appendChild(li);
              });
            card.appendChild(ul);
        } else {
            const pNo = document.createElement("p");
            pNo.textContent = "לא נבחרו פעולות.";
            card.appendChild(pNo);
        }

        if (player.note && player.note.trim()) {
            const noteP = document.createElement("p");
            noteP.style.fontStyle="italic";
            noteP.textContent = "הערת מאמן לשחקן: " + player.note;
            card.appendChild(noteP);
        }

        finalDataDiv.appendChild(card);
    });

    if (generalNote) {
        const gNoteP = document.createElement("p");
        gNoteP.style.fontWeight="bold";
        gNoteP.textContent = "הערה כללית: " + generalNote;
        finalDataDiv.appendChild(gNoteP);
    }
}

async function downloadPDF() {
    const elem = document.getElementById("analyst-final-summary-container");
    const canvas = await html2canvas(elem);
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("summary.pdf");
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

function calculateScore(minutesPlayed) {
    let score = 0;
    let goodCount = 0;
    let badCount = 0;
    let simplePosCount = {};

    const importantPosActions = ["בעיטה למסגרת","בעיטה לשער","מסירת מפתח","ניצול הזדמנות","נגיחה למסגרת"];
    const criticalNegActions = ["החמצת מצב ודאי","איבוד כדור מסוכן","אי שמירה על שחקן מפתח"];

    function determineCategory(action, result) {
        let resLower = result.toLowerCase();
        let actLower = action.toLowerCase();
        let isGood = (resLower.includes("מוצלח") || resLower.includes("טוב") || resLower.includes("חיובית"));
        let isBad = (resLower.includes("רעה") || resLower.includes("לא מוצלח") || resLower.includes("לא טוב") || resLower.includes("שלילית"));

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

    actions.forEach(({action, result, minute}) => {
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

async function downloadPDF() {
    const elem = document.getElementById("analyst-final-summary-container");
    const canvas = await html2canvas(elem);
    const imgData = canvas.toDataURL('image/png');

    const { jsPDF } = window.jspdf;
    const pdf = new jsPDF('p', 'pt', 'a4');
    const imgProps= pdf.getImageProperties(imgData);
    const pdfWidth = pdf.internal.pageSize.getWidth();
    const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
    pdf.addImage(imgData, 'PNG', 0, 0, pdfWidth, pdfHeight);
    pdf.save("summary.pdf");
}
