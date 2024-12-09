let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let chosenCustom = [];
let parentNotes = [];
let gameFinished = false;

const API_KEY = "63c5b5f5d363cf845ffcfa3a98f97fed";
const FORM_ID = "230789031560051";

// פונקציה לשליחת הנתונים ל-JotForm (לא השתנתה)
function sendToJotForm(playerName, teamName, position, gameDate, actionsSummary, score, parentEmail, parentNotesArr) {
    // כאן כבעבר
}

// שאר הפונקציות (trackAction, showPopup...) אותו הדבר

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;
    const parentEmail = document.getElementById("parent-email").value.trim();

    if (!playerName || !teamName || !playerPosition || !parentEmail) {
        alert("אנא מלא את כל השדות (כולל תפקיד ומייל הורה)");
        return;
    }

    // במקום להציג game-info, נעבור ישירות לבחירת פעולות
    document.getElementById("user-input-container").classList.add("hidden");
    
    // שמירת המייל של ההורה
    window.parentEmailGlobal = parentEmail;
    window.playerNameGlobal = playerName;
    window.teamNameGlobal = teamName;
    window.playerPositionGlobal = playerPosition;

    // כעת נטען את בחירת הפעולות
    loadActionsSelection(playerPosition);
    document.getElementById("actions-selection-container").classList.remove("hidden");
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

// שאר הפונקציות (createActionCheckbox, addCustomAction, confirmActions וכו') נשארות זהות

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

// הפונקציה startGame תישאר אותו הדבר, רק שכעת לא הצגנו game-info מראש, זה לא משנה ללוגיקה
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

// שאר הפונקציות (endHalfTime, resumeHalf, endGame, makeActionsGreyAfterGame, closePopup, reopenSummary, showAllActions, closeAllActionsPopup, getActionCounts, classifyKey, classifyResult, getSummaryHTML, enableActions, calculateScore, showFeedback, closeFeedbackPopup, takeScreenshot) נשארות ללא שינוי.

// ודא שבקוד שלך יש את כל הפעולות positionActions וmentalActions שהוגדרו לפני כן.
