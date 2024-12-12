const ACCESS_CODE = "1976"; 
let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let notes = [];
let gameFinished = false;
let customActionsArr = [];
let quickNotes = [];
let teamMood = "";
let actionPopupTimeout = null;
let halfCount = 1;
let baseMinuteStart = 0;
let measurableGoalsData = []; 
let wantMeasurable = false;

// שינוי ראשון: אין מנטאלי כברירת מחדל
const mentalActions=[]; 

const tips = [
    "להרים את הראש ולחפש מסירה חכמה.",
    "לשפר את משחק הלחץ בשליש האחרון.",
    "לשים דגש על מהירות תגובה כשמקבלים כדור.",
    "לתרגל מסירות מדויקות תחת לחץ.",
    "לשפר את הנוכחות באזור הרחבה.",
    "לשמור על ריכוז כאשר הלחץ עולה.",
    "לתרגל שליטה בכדור בתנאי מזג אוויר שונים.",
    "להתמודד עם לחץ מנטלי בעזרת נשימות עמוקות.",
    "לנתח מצבים במשחק ולדעת לצפות תנועה של היריב.",
    "להשקיע בתקשורת עם חברי הקבוצה."
];

const positionActions={...}; // נשאר אותו דבר (אורך מלא הושמט לחסכון מקום)

/** פונקציות selectRole, checkAccessCode, submitUserInfo, loadActionsSelection,
    createActionSelectable, addCustomAction, confirmActions, closeMeasurableConfirmPopup,
    handleMeasurableChoice, openMeasurableGoalsPopup, closeMeasurableGoalsPopup,
    saveMeasurableGoals, displayMeasurableGoals, showStartGameContainer, startGame,
    enableActions, endHalfTime, resumeHalf, startSecondHalf, endGame, showAllActions,
    closeAllActionsPopup, openGeneralNotePopup, closeGeneralNotePopup, approveGeneralNote,
    showPopup, openActionPopup, closeActionPopup, userInteractedWithPopup,
    chooseActionResult, trackAction, classifyResult, calculateSuccessRatio,
    getTip, getExtendedActionCounts, calculateScore, showFeedback, closeFeedbackPopup,
    reopenSummary, saveGameDataToServer, takeScreenshot, openPostGameNotesPopup,
    closePostGameNotesPopup, approvePostGameNotes, initializeCoachPage, createColorPalette,
    selectColor, showSelectedColor, checkCoachFormValidity, submitCoachGameInfo, submitCoachSetup,
    addCoachGoal, enterCoachMarking, finishCoachGame, downloadPDFCoach, openTacticalBoard,
    closeTacticalBoard, captureTacticalBoard, setTeamMoodAndOpenMoodInput ...
    (כל הפונקציות המקוריות נמצאות בקוד הקודם)
**/

// הוספת פונקציית closePopup() (שינוי 4):
function closePopup(){
    const popup = document.getElementById("game-summary-popup");
    if(popup){
        popup.classList.remove("active");
        popup.classList.add("hidden");
    }
}

// שינוי בפונקציה getExtendedSummaryHTML (שינוי 3):
function getExtendedSummaryHTML(actionDataMap, title) {
    let html = `<h3>${title}:</h3>`;
    for (const actionName in actionDataMap) {
        const data = actionDataMap[actionName];
        // קביעת צבע בסיס לשורה
        let className = "neutral";
        if (data.successful > 0 && data.unsuccessful===0) {
            className = "good";
        } else if (data.unsuccessful >0 && data.successful===0) {
            className = "bad";
        } else {
            className = "neutral";
        }

        let successText = "";
        let failText = "";

        if(data.successful > 0) {
            successText = ` <span class="good">מוצלח: ${data.successful} פעמים</span>`;
        }
        if(data.unsuccessful > 0) {
            failText = ` <span class="bad">לא מוצלח: ${data.unsuccessful} פעמים</span>`;
        }

        if (data.notPerformed) {
            html += `<p class="neutral">${actionName}: לא בוצע</p>`;
        } else {
            html += `<p class="${className}">${actionName}:`;
            if(successText) html += ` ${successText}`;
            if(failText) html += ` ${failText}`;
            html += `</p>`;
        }
    }
    return html;
}

// שאר הפונקציות (כמו trackAction, classifyResult וכו') נשארות כפי שהן עם השינויים שכבר בוצעו
// (למשל classifyResult בודק קודם שלילי ואז חיובי)

// הוספת מחלקת red-btn ב-CSS (שינוי 5) כבר נעשה ב-styles.css.
// הגדלת textarea ב-css (שינוי 2) בוצע.
// מחיקת "מנטאלי" (שינוי 1) בוצע למעלה.
// שינוי getExtendedSummaryHTML (שינוי 3) בוצע.
// פונקציית closePopup (שינוי 4) בוצע.
// כפתור "סגור" לפופאפ בצבע אדום (שינוי 5) ב-html כבר שונה.

