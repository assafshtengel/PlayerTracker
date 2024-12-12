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

const tips = [
    "להרים את הראש ולחפש מסירה חכמה.",
    "לשפר את משחק הלחץ בשליש האחרון.",
    "לשים דגש על מהירות תגובה.",
    "להתמודד עם לחץ מנטלי בנשימות עמוקות."
];

const mentalActions=["מנטאלי"];
// positionActions כפי שהיה קודם, לא משנים

// ... (positionActions כפי בקוד הקודם)

// פונקציות existing checkAccessCode, submitUserInfo, loadActionsSelection, createActionSelectable, addCustomAction,
// confirmActions, closeMeasurableConfirmPopup, handleMeasurableChoice, openMeasurableGoalsPopup,
// closeMeasurableGoalsPopup, saveMeasurableGoals, startGame, enableActions, openGeneralNotePopup, closeGeneralNotePopup,
// approveGeneralNote, openActionPopup, closeActionPopup, userInteractedWithPopup, chooseActionResult, trackAction,
// showPopup, classifyResult, getActionCounts, getSummaryHTML, classifyKey, calculateScore, showFeedback, closeFeedbackPopup, reopenSummary, takeScreenshot
// נשארות ללא שינוי.

// נוסיף getExtendedActionCounts ו-getExtendedSummaryHTML

function getExtendedActionCounts(selectedActions, actions) {
    const resultMap = {};
    selectedActions.forEach(sa => {
        resultMap[sa.action] = {
            successful: 0,
            unsuccessful: 0,
            notPerformed: true
        };
    });

    actions.forEach(a=>{
        const actionName = a.action;
        const actionResult = a.result.toLowerCase().trim();
        if(!resultMap[actionName]){
            resultMap[actionName]={
                successful:0,
                unsuccessful:0,
                notPerformed:true
            };
        }
        resultMap[actionName].notPerformed=false;
        if(actionResult.includes("לא מוצלח")||actionResult.includes("רעה")||actionResult.includes("לא טוב")||actionResult.includes("שלילית")){
            resultMap[actionName].unsuccessful++;
        } else if(actionResult.includes("מוצלח")||actionResult.includes("טוב")||actionResult.includes("חיובית")){
            resultMap[actionName].successful++;
        } else {
            // לא מזוהה נחשב כלא מוצלח
            resultMap[actionName].unsuccessful++;
        }
    });

    return resultMap;
}

function getExtendedSummaryHTML(actionDataMap, title) {
    let html = `<h3>${title}:</h3>`;
    for (const actionName in actionDataMap) {
        const data = actionDataMap[actionName];
        let className = "neutral";
        if(data.successful >0 && data.unsuccessful===0) className="good";
        else if(data.unsuccessful>0 && data.successful===0) className="bad";
        else className="neutral";

        let successText = data.successful>0 ? ` <span class="good">מוצלח: ${data.successful}</span>` : "";
        let failText = data.unsuccessful>0 ? ` <span class="bad">לא מוצלח: ${data.unsuccessful}</span>` : "";
        if(data.notPerformed){
            html += `<p class="neutral">${actionName}: לא בוצע</p>`;
        } else {
            html += `<p class="${className}">${actionName}:${successText}${failText}</p>`;
        }
    }
    return html;
}

function getTip(ratio){
    const index = Math.floor(Math.random() * tips.length);
    return tips[index];
}

function calculateSuccessRatio() {
    let successCount = 0;
    let failCount = 0;
    actions.forEach(a => {
        let lower = a.result.toLowerCase().trim();
        if(lower.includes("לא מוצלח")||lower.includes("רעה")||lower.includes("לא טוב")||lower.includes("שלילית")){
            failCount++;
        } else if(lower.includes("מוצלח")||lower.includes("טוב")||lower.includes("חיובית")){
            successCount++;
        } else {
            failCount++;
        }
    });
    const total = successCount + failCount;
    let ratio = total > 0 ? (successCount / total) : 0;
    return {ratio, successCount, failCount};
}

function endHalfTime(){
    if(gameInterval){clearInterval(gameInterval);gameInterval=null;}
    enableActions(false);

    // השתמש ב-getExtendedActionCounts להצגת פעולות שלא בוצעו ועוד.
    const extendedData = getExtendedActionCounts(selectedActions, actions);
    const halfSummaryContent=document.getElementById("half-summary-content");
    halfSummaryContent.innerHTML = getExtendedSummaryHTML(extendedData,"סיכום המחצית");

    // הוספת יחס הצלחה + טיפ
    const {ratio, successCount, failCount} = calculateSuccessRatio();
    const tip = getTip(ratio);
    const capsule = document.createElement('div');
    capsule.style.padding = "10px";
    capsule.style.border = "2px solid #333";
    capsule.style.borderRadius = "8px";
    capsule.style.marginTop = "20px";
    capsule.style.backgroundColor = "#f9f9f9";
    capsule.style.textAlign = "right";
    const ratioPercent = Math.round(ratio * 100);
    capsule.innerHTML = `
        <h4>יחס הצלחה:</h4>
        <p>פעולות מוצלחות: ${successCount}, פעולות לא מוצלחות: ${failCount}</p>
        <p>אחוז הצלחה: ${ratioPercent}%</p>
        <h4>טיפ לשיפור:</h4>
        <p>${tip}</p>
    `;
    halfSummaryContent.appendChild(capsule);

    // הערות מחצית
    const halfGeneralNoteDisplay=document.getElementById("half-general-note-display");
    const halfParentNotesList=document.getElementById("half-parent-notes-list");
    halfParentNotesList.innerHTML="";
    if(notes.length>0){
        notes.forEach(n=>{
            const li=document.createElement("li");
            li.textContent=`דקה ${n.minute}: ${n.text}`;
            halfParentNotesList.appendChild(li);
        });
        halfGeneralNoteDisplay.classList.remove("hidden");
    } else {
        halfGeneralNoteDisplay.classList.add("hidden");
    }

    const halfPopup=document.getElementById("half-time-summary-popup");
    halfPopup.classList.remove("hidden");
    halfPopup.classList.add("active");
    document.getElementById("start-second-half").classList.remove("hidden");
}

function endGame(){
    if(gameInterval){clearInterval(gameInterval);gameInterval=null;}
    enableActions(false);
    gameFinished=true;
    const minutesPlayed=parseInt(prompt("כמה דקות שיחקת?","90"))||90;
    const score=calculateScore(minutesPlayed);

    // סיכום מורחב בסיום
    const extendedData = getExtendedActionCounts(selectedActions, actions);
    const summaryContent=document.getElementById("summary-content");
    summaryContent.innerHTML = getExtendedSummaryHTML(extendedData,"סיכום המשחק");
    summaryContent.innerHTML+=`<h3 id="final-score">ציון סיום המשחק שלך: ${score}</h3>`;

    // יחס הצלחה + טיפ גם בסיום
    const {ratio, successCount, failCount} = calculateSuccessRatio();
    const tip = getTip(ratio);
    const capsule = document.createElement('div');
    capsule.style.padding = "10px";
    capsule.style.border = "2px solid #333";
    capsule.style.borderRadius = "8px";
    capsule.style.marginTop = "20px";
    capsule.style.backgroundColor = "#f9f9f9";
    capsule.style.textAlign = "right";
    const ratioPercent = Math.round(ratio * 100);
    capsule.innerHTML = `
        <h4>יחס הצלחה:</h4>
        <p>פעולות מוצלחות: ${successCount}, פעולות לא מוצלחות: ${failCount}</p>
        <p>אחוז הצלחה: ${ratioPercent}%</p>
        <h4>טיפ לשיפור:</h4>
        <p>${tip}</p>
    `;
    summaryContent.appendChild(capsule);

    const generalNoteDisplay=document.getElementById("general-note-display");
    const parentNotesList=document.getElementById("parent-notes-list");
    parentNotesList.innerHTML="";
    if(notes.length>0){
        notes.forEach(n=>{
            const li=document.createElement("li");
            li.textContent=`דקה ${n.minute}: ${n.text}`;
            parentNotesList.appendChild(li);
        });
        generalNoteDisplay.classList.remove("hidden");
    } else generalNoteDisplay.classList.add("hidden");

    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    setTimeout(()=>{showFeedback(score,minutesPlayed);},500);
}

// פופאפ לצפייה בהתקדמות ביעדים
function openMeasurableProgressPopup(){
    const popup=document.getElementById("measurable-progress-popup");
    const tbody=popup.querySelector("#measurable-progress-table tbody");
    tbody.innerHTML="";
    
    // חישוב כמה מוצלח לכל פעולה
    const actionCounts = {};
    actions.forEach(a=>{
        if(!actionCounts[a.action])actionCounts[a.action]={success:0,fail:0};
        let lower=a.result.toLowerCase();
        if(lower.includes("מוצלח")||lower.includes("טוב")||lower.includes("חיובית")) actionCounts[a.action].success++;
        else actionCounts[a.action].fail++;
    });

    selectedActions.forEach(sa=>{
        const tr=document.createElement("tr");
        const tdAction=document.createElement("td");
        tdAction.textContent=sa.action;
        const tdGoal=document.createElement("td");
        let goalData = measurableGoalsData.find(g=>g.action===sa.action);
        tdGoal.textContent=goalData?goalData.goal:"לא הוגדר";

        const tdDone=document.createElement("td");
        if(actionCounts[sa.action]){
            tdDone.textContent=actionCounts[sa.action].success + actionCounts[sa.action].fail;
        } else {
            tdDone.textContent="0";
        }

        tr.appendChild(tdAction);
        tr.appendChild(tdGoal);
        tr.appendChild(tdDone);
        tbody.appendChild(tr);
    });

    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeMeasurableProgressPopup(){
    const popup=document.getElementById("measurable-progress-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function closePopup(){
    const popup=document.getElementById("game-summary-popup");
    if(popup){
        popup.classList.remove("active");
        popup.classList.add("hidden");
    }
}
