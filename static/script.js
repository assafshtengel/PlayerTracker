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

let gameSummaryViewed = false; // שינוי 4: לצפייה חוזרת בסיכום

const mentalActions=["מנטאלי"];
const positionActions={
    "חלוץ": [...],
    "שוער":[...],
    "מגן":[...],
    "בלם":[...],
    "קשר":[...]
};

// ניתן לשמור את המערכים כמקודם, לא שינינו תוכן הפעולות עבור השחקן. 
// כאן רק מקוצר לצורך הדגמה.
// יש להניח שהפעולות שהיו קודם קיימות כרגיל.

function submitUserInfo(){ ... }
function loadActionsSelection(position){ ... }
function createActionSelectable(action,category){ ... }
function addCustomAction(){ ... }
function confirmActions(){ ... }
function closeMeasurableConfirmPopup(){ ... }
function handleMeasurableChoice(choice){ ... }
function openMeasurableGoalsPopup(){ ... }
function closeMeasurableGoalsPopup(){ ... }
function saveMeasurableGoals(){ ... }
function startGame(){ ... }
function enableActions(enable){ ... }
function endHalfTime(){ ... }
function resumeHalf(){ ... }

// שינוי 2: לאחר startSecondHalf() הסרת כפתורי סיים מחצית והתחל מחצית שנייה
function startSecondHalf(){
    halfCount=2;baseMinuteStart=45;
    document.getElementById("start-second-half").classList.add("hidden");
    document.getElementById("end-half").classList.add("hidden");
    gameMinute=45;document.getElementById("minute-counter").textContent=gameMinute;
    gameInterval=setInterval(()=>{gameMinute++;document.getElementById("minute-counter").textContent=gameMinute;},60000);
    enableActions(true);
}

function endGame(){
    if(gameInterval){clearInterval(gameInterval);gameInterval=null;}
    enableActions(false);
    gameFinished=true;
    const minutesPlayed=parseInt(prompt("כמה דקות שיחקת?","90"))||90;
    const score=calculateScore(minutesPlayed);

    const counts=getActionCounts();
    const summaryContent=document.getElementById("summary-content");
    summaryContent.innerHTML=getSummaryHTML(counts,"סיכום המשחק");
    summaryContent.innerHTML+=`<h3 id="final-score">ציון סיום המשחק שלך: ${score}</h3>`;

    // שינוי 3: הצגת מטרות ומטרות מדידות בסיום המשחק
    displayPlayerGoalsPerformance();

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
    gameSummaryViewed=true; 
}

function displayPlayerGoalsPerformance(){
    const container=document.getElementById("player-goals-summary");
    container.innerHTML="<h4>מטרות ויעדים:</h4>";
    const actionCounts=actions.reduce((acc,a)=>{
        acc[a.action]=acc[a.action]||{success:0,fail:0};
        let lower=a.result.toLowerCase();
        if(lower.includes("מוצלח")) acc[a.action].success++;
        else acc[a.action].fail++;
        return acc;
    },{});

    let html="<table style='width:100%;border-collapse:collapse;'><tr><th>פעולה</th><th>יעד</th><th>מוצלח</th><th>לא מוצלח</th></tr>";
    selectedActions.forEach(sa=>{
        let c=actionCounts[sa.action]||{success:0,fail:0};
        let g=measurableGoalsData.find(m=>m.action===sa.action);
        html+=`<tr style='border:1px solid #ccc;'>
                 <td>${sa.action}</td>
                 <td>${g?g.goal:"לא הוגדר"}</td>
                 <td>${c.success}</td>
                 <td>${c.fail}</td>
               </tr>`;
    });
    html+="</table>";
    container.innerHTML+=html;
}

function showAllActions(){ ... }
function closeAllActionsPopup(){ ... }
function openGeneralNotePopup(){ ... }
function closeGeneralNotePopup(){ ... }
function approveGeneralNote(){ ... }
function showPopup(message,type="neutral"){ ... }
function openActionPopup(actionName){
    const popup=document.getElementById("action-popup");
    const header=document.getElementById("action-popup-header");
    const note=document.getElementById("action-popup-note");
    header.textContent=actionName;
    note.value="";
    popup.classList.add("active");
    if(actionPopupTimeout)clearTimeout(actionPopupTimeout);
    actionPopupTimeout=setTimeout(()=>{closeActionPopup();},4000);
}
function closeActionPopup(){
    const popup=document.getElementById("action-popup");
    popup.classList.remove("active");
}
function userInteractedWithPopup(){
    if(actionPopupTimeout)clearTimeout(actionPopupTimeout);
    actionPopupTimeout=setTimeout(()=>{closeActionPopup();},4000);
}
function chooseActionResult(actionName,result){
    const note=document.getElementById("action-popup-note").value.trim();
    trackAction(actionName,result);
    if(note) notes.push({text:note,minute:gameMinute});
    closeActionPopup();
}
function trackAction(action,result){ ... }
function classifyResult(result){ ... }
function getActionCounts(){ ... }
function getSummaryHTML(counts,title){ ... }
function classifyKey(key){ ... }
function calculateScore(minutesPlayed){ ... }
function showFeedback(score,minutesPlayed){ ... }
function closeFeedbackPopup(){ ... }
function reopenSummary(){ // שינוי 4: צפייה חוזרת בסיכום
    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}
function closePopup(){
    const popup=document.getElementById("game-summary-popup");
    if(popup){
        popup.classList.remove("active");
        popup.classList.add("hidden");
    }
    if(gameSummaryViewed){
        document.getElementById("reopen-summary-container").classList.remove("hidden");
    }
}
function takeScreenshot(){ ... }
function openMeasurableProgressPopup(){ ... }
function closeMeasurableProgressPopup(){ ... }
