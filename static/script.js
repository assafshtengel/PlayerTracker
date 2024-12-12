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
let gameSummaryViewed = false;

const mentalActions=["מנטאלי"];
const positionActions={
    "חלוץ": [
        {name:"בעיטה לשער"},
        {name:"תנועה ללא כדור"},
        {name:"קבלת כדור תחת לחץ"},
        {name:"פעולה בנגיעה אחת"},
        {name:"נוכחות ברחבה"},
        {name:"לחץ גבוה על ההגנה"},
        {name:"נגיחה למסגרת"},
        {name:"1 על 1 התקפי"},
        {name:"מסירת מפתח"},
        {name:"הגבהה לרחבה"},
        {name:"סיום מצבים"},
        {name:"ניצול הזדמנויות"},
        {name:"משחק עם הגב לשער"},
        {name:"מנטאלי"}
    ],
    "שוער":[
        {name:"יציאה נכונה לכדור גובה"},
        {name:"עצירה ב-1 על 1"},
        {name:"שמירה על ליכוד"},
        {name:"עמידה נכונה"},
        {name:"מסירה קצרה"}
    ],
    "מגן":[
        {name:"מניעת מעבר שחקן יריב באגף"},
        {name:"הגבהות איכותיות לרחבה"},
        {name:"חיפוי פנימה לכיוון הבלם"},
        {name:"סגירת אופציית מסירה בצד"},
        {name:"השתתפות בהנעת הכדור מההגנה קדימה"},
        {name:"תמיכה בהתקפה דרך האגף"},
        {name:"חזרה מהירה לעמדה הגנתית"},
        {name:"גלישה נקייה לעצירת חדירה לרחבה"},
        {name:"לחץ גבוה על הקיצוני היריב"},
        {name:"מעבר מהיר מהגנה להתקפה"},
        {name:"יצירת רוחב על הקו ההתקפי"},
        {name:"הגנה על שחקן מפתח של היריב באזור האגף"},
        {name:"שיתוף פעולה עם הקשר האגפי"},
        {name:"הרחקות מדויקות לאורך הקו"},
        {name:"זיהוי חללים פנויים לחדירה קדימה והרחבת המשחק"}
    ],
    "בלם":[
        {name:"חטיפת כדורים"},
        {name:"הרחקות"},
        {name:"תיקולים מוצלחים"},
        {name:"לחץ על חלוצים"},
        {name:"זכייה במאבקי אוויר"},
        {name:"שמירה על קו הגנה מסודר"},
        {name:"חיפוי על מגן"},
        {name:"פתיחת משחק במסירות מדויקות"},
        {name:"חלוקת עומסים בין בלמים"},
        {name:"תמיכה בקשר האחורי"},
        {name:"בלימת בעיטות למסגרת"},
        {name:"מעקב אחר תנועות חלוצים מהירים"},
        {name:"פינוי שטחים"},
        {name:"ניהול משחק ראש"},
        {name:"יצירת עליונות מספרית בהתקפה"}
    ],
    "קשר":[
        {name:"חילוץ כדור בקישור"},
        {name:"מסירה מדויקת קדימה"},
        {name:"הנעת כדור תחת לחץ"},
        {name:"שינוי כיוון המשחק במסירות ארוכות"},
        {name:"תמיכה בהגנה בירידה לאחור"},
        {name:"ניהול קצב המשחק"},
        {name:"הרמת הראש לזיהוי אופציית מסירה"},
        {name:"כניסה לרחבה להצטרפות להתקפה"},
        {name:"שמירה הדוקה על קשר יריב יצירתי"},
        {name:"יצירת יתרון מספרי במרכז"},
        {name:"חיפוי על מגן/חלוץ גבוה"},
        {name:"ניצול שטחים פנויים במסירות עומק"},
        {name:"תיקולים מוצלחים בקישור"},
        {name:"מסירות רוחב לשינוי מוקד התקפה"},
        {name:"בעיטה מדויקת מחוץ לרחבה"}
    ]
};

function submitUserInfo(){
    const playerName=document.getElementById("player-name").value.trim();
    const teamName=document.getElementById("team-name").value.trim();
    const playerPosition=document.getElementById("player-position").value;
    if(!playerName||!teamName||!playerPosition){
        alert("אנא מלא את כל השדות");
        return;
    }
    document.getElementById("user-input-container").classList.add("hidden");
    document.getElementById("actions-selection-container").classList.remove("hidden");
    loadActionsSelection(playerPosition);
}

function loadActionsSelection(position) { ... }
function createActionSelectable(action,category){ ... }
function addCustomAction(){ ... }
function confirmActions(){ ... }
function closeMeasurableConfirmPopup(){ ... }
function handleMeasurableChoice(choice){ ... }
function openMeasurableGoalsPopup(){ ... }
function closeMeasurableGoalsPopup(){ ... }
function saveMeasurableGoals(){ ... }

function startGame(){
    document.getElementById("start-game-container").classList.add("hidden");
    document.getElementById("game-timer").classList.remove("hidden");
    document.getElementById("actions-title").classList.remove("hidden");
    document.getElementById("notes-container").classList.remove("hidden");

    const actionsContainer=document.getElementById("game-actions-container");
    actionsContainer.classList.remove("hidden");
    actionsContainer.innerHTML="";
    selectedActions.forEach(act=>{
        const div=document.createElement("div");
        div.classList.add("action-card");
        const h2=document.createElement("h2");
        h2.textContent=act.action;
        div.appendChild(h2);
        div.onclick=()=>{openActionPopup(act.action);};
        actionsContainer.appendChild(div);
    });

    enableActions(true);

    gameMinute=0;actions=[];notes=[];gameFinished=false;
    document.getElementById("minute-counter").textContent=gameMinute;
    gameInterval=setInterval(()=>{gameMinute++;document.getElementById("minute-counter").textContent=gameMinute;},60000);
    document.getElementById("end-buttons-container").classList.remove("hidden");
}

function enableActions(enable){ ... }

function endHalfTime(){
    if(gameInterval){clearInterval(gameInterval);gameInterval=null;}
    enableActions(false);
    const counts=getActionCounts();
    const halfSummaryContent=document.getElementById("half-summary-content");
    halfSummaryContent.innerHTML=getSummaryHTML(counts,"סיכום המחצית");

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

function resumeHalf(){
    const halfPopup=document.getElementById("half-time-summary-popup");
    halfPopup.classList.remove("active");
    halfPopup.classList.add("hidden");
    gameInterval=setInterval(()=>{gameMinute++;document.getElementById("minute-counter").textContent=gameMinute;},60000);
    enableActions(true);
}

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

function openGeneralNotePopup(){
    document.getElementById("general-note-text").value="";
    const popup=document.getElementById("general-note-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}
function closeGeneralNotePopup(){
    const popup=document.getElementById("general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}
function approveGeneralNote(){
    const note=document.getElementById("general-note-text").value.trim();
    if(note){
        notes.push({text:note,minute:gameMinute});
    }
    setTimeout(()=>{
        closeGeneralNotePopup();
        showPopup("הערה נשמרה!","neutral");
        enableActions(true);
    },2300);
}

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

function reopenSummary(){
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
