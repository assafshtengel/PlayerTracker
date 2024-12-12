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

// מערך טיפים לדוגמה (מתוך 500 טיפים אפשריים)
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
    "להשקיע בתקשורת עם חברי הקבוצה.",
    // ... המשך עד 500 טיפים ...
];

// פעולות:
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

function selectRole(role){
    document.getElementById("main-page").classList.add("hidden");
    if(role==="player"){
        document.getElementById("login-container").classList.remove("hidden");
    }else if(role==="coach"){
        document.getElementById("coach-game-info-container").classList.remove("hidden");
    } else if(role==="analyst"){
        alert("אנליסט - בפיתוח...");
        document.getElementById("main-page").classList.remove("hidden");
    }
}

function checkAccessCode(){
    const code=document.getElementById("access-code").value;
    if(code===ACCESS_CODE){
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("user-input-container").classList.remove("hidden");
    }else{
        alert("קוד שגוי");
    }
}

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

function loadActionsSelection(position) {
    const professionalContainer=document.getElementById("professional-actions");
    const mentalContainer=document.getElementById("mental-actions");
    const customContainer=document.getElementById("custom-actions");
    professionalContainer.innerHTML="<h4>פעולות מקצועיות:</h4>";
    mentalContainer.innerHTML="<h4>פעולות מנטאליות:</h4>";
    customContainer.innerHTML="<h4>פעולות מותאמות אישית:</h4>";

    const acts=positionActions[position]||[];
    acts.forEach(a=>{
        professionalContainer.appendChild(createActionSelectable(a.name,"professional"));
    });

    mentalActions.forEach(m=>{
        mentalContainer.appendChild(createActionSelectable(m,"mental"));
    });

    customActionsArr.forEach(c=>{
        customContainer.appendChild(createActionSelectable(c,"custom"));
    });
}

function createActionSelectable(action,category){
    const div=document.createElement("div");
    div.classList.add("action-toggle");
    div.textContent=action;
    div.dataset.selected="false";
    div.dataset.category=category;
    div.onclick=()=>{
        if(div.dataset.selected==="false"){
            div.dataset.selected="true";
            div.classList.add("selected-action");
        }else{
            div.dataset.selected="false";
            div.classList.remove("selected-action");
        }
    };
    return div;
}

function addCustomAction(){
    const input=document.getElementById("custom-action-input");
    const val=input.value.trim();
    if(!val){alert("אנא כתוב שם פעולה");return;}
    customActionsArr.push(val);
    const container=document.getElementById("custom-actions");
    container.appendChild(createActionSelectable(val,"custom"));
    input.value="";
}

function confirmActions(){
    const selectedElems=document.querySelectorAll('.action-toggle.selected-action');
    selectedActions=[];
    selectedElems.forEach(e=>{
        selectedActions.push({action:e.textContent,category:e.dataset.category});
    });
    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("are-you-want-measurable-popup").classList.remove("hidden");
    document.getElementById("are-you-want-measurable-popup").classList.add("active");
}

function closeMeasurableConfirmPopup(){
    const popup=document.getElementById("are-you-want-measurable-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    if(!wantMeasurable){
        document.getElementById("start-game-container").classList.remove("hidden");
    }
}

function handleMeasurableChoice(choice){
    wantMeasurable=choice;
    closeMeasurableConfirmPopup();
    if(wantMeasurable)openMeasurableGoalsPopup();
    else document.getElementById("start-game-container").classList.remove("hidden");
}

function openMeasurableGoalsPopup(){
    const popup=document.getElementById("measurable-goals-popup");
    const tbody=popup.querySelector("#measurable-goals-table tbody");
    tbody.innerHTML="";
    selectedActions.forEach(act=>{
        const tr=document.createElement("tr");
        const tdAction=document.createElement("td");
        tdAction.textContent=act.action;
        const tdInput=document.createElement("td");
        const inp=document.createElement("input");
        inp.type="text"; // שינוי למתן אפשרות למלל ולא רק מספר
        inp.placeholder="יעד (מספר או מלל)...";
        inp.style.fontSize="20px";
        inp.style.padding="10px";
        inp.style.textAlign="center";
        tdInput.appendChild(inp);
        tr.appendChild(tdAction);
        tr.appendChild(tdInput);
        tbody.appendChild(tr);
    });
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeMeasurableGoalsPopup(){
    const popup=document.getElementById("measurable-goals-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    //document.getElementById("start-game-container").classList.remove("hidden");
}

function saveMeasurableGoals(){
    const popup=document.getElementById("measurable-goals-popup");
    const rows=popup.querySelectorAll("tbody tr");
    measurableGoalsData=[];
    rows.forEach(r=>{
        const actionName=r.cells[0].textContent;
        const val=r.cells[1].querySelector("input").value.trim();
        if(val) measurableGoalsData.push({action:actionName,goal:val});
    });
    closeMeasurableGoalsPopup();
    
    // אם הוגדרו מטרות, נציג אותן בסיכום מיוחד לפני תחילת המשחק:
    if(measurableGoalsData.length > 0) {
        document.getElementById("start-game-container").classList.add("hidden");
        document.getElementById("goals-summary-container").classList.remove("hidden");
        displayMeasurableGoals();
    } else {
        // אם אין מטרות הוגדרו, חוזרים להתחלת המשחק
        document.getElementById("start-game-container").classList.remove("hidden");
    }
}

function displayMeasurableGoals() {
    const container = document.getElementById("selected-goals-summary");
    container.innerHTML = "";
    if(measurableGoalsData.length > 0) {
        const table = document.createElement("table");
        table.style.width = "100%";
        table.style.borderCollapse = "collapse";

        const thead = document.createElement("thead");
        thead.innerHTML = "<tr><th>פעולה</th><th>יעד</th></tr>";
        table.appendChild(thead);

        const tbody = document.createElement("tbody");
        measurableGoalsData.forEach(g => {
            const tr = document.createElement("tr");

            const tdAction = document.createElement("td");
            tdAction.textContent = g.action;
            tdAction.style.border = "1px solid #ccc";
            tdAction.style.padding = "8px";

            const tdGoal = document.createElement("td");
            tdGoal.textContent = g.goal;
            tdGoal.style.border = "1px solid #ccc";
            tdGoal.style.padding = "8px";

            tr.appendChild(tdAction);
            tr.appendChild(tdGoal);
            tbody.appendChild(tr);
        });
        table.appendChild(tbody);
        container.appendChild(table);
    } else {
        container.textContent = "לא הוגדרו מטרות מדידות";
    }
}

function showStartGameContainer() {
    document.getElementById("goals-summary-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
}

function startGame(){
    document.getElementById("goals-summary-container").classList.add("hidden");
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

function enableActions(enable){
    const cards=document.querySelectorAll('.action-card');
    cards.forEach(card=>{
        if(enable){
            card.style.opacity=1;
            card.style.pointerEvents="auto";
        } else {
            card.style.opacity=0.5;
            card.style.pointerEvents="none";
        }
    });
}

function endHalfTime(){
    if(gameInterval){clearInterval(gameInterval);gameInterval=null;}
    enableActions(false);

    const extendedData = getExtendedActionCounts(selectedActions, actions);
    const halfSummaryContent=document.getElementById("half-summary-content");
    halfSummaryContent.innerHTML = getExtendedSummaryHTML(extendedData,"סיכום המחצית");

    // הוספת קפסולה של יחס הצלחה וטיפ
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

    const playerName="Player"; 
    const teamName="Team";
    const position="חלוץ";
    const today=new Date().toLocaleDateString("he-IL");
    const gameDate=today;

    const extendedData = getExtendedActionCounts(selectedActions, actions);
    const summaryContent=document.getElementById("summary-content");
    summaryContent.innerHTML = getExtendedSummaryHTML(extendedData,"סיכום המשחק");
    summaryContent.innerHTML+=`<h3 id="final-score">ציון סיום המשחק שלך: ${score}</h3>`;

    // הוספת יחס הצלחה וטיפ גם בסוף המשחק
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
    saveGameDataToServer(playerName,teamName,position,gameDate,score,actions,notes);
}

function showAllActions(){
    const allActionsList=document.getElementById("all-actions-list");
    allActionsList.innerHTML="";
    actions.forEach(({action,result,minute})=>{
        let className=classifyResult(result);
        const p=document.createElement("p");
        p.className=className+" action-line";
        const minuteBadge=document.createElement("span");
        minuteBadge.className="minute-badge";
        minuteBadge.textContent="דקה "+minute;
        p.appendChild(minuteBadge);
        const textNode=document.createTextNode(" "+action+" - "+result);
        p.appendChild(textNode);
        allActionsList.appendChild(p);
    });
    const actionsDetailPopup=document.getElementById("actions-detail-popup");
    actionsDetailPopup.classList.remove("hidden");
    actionsDetailPopup.classList.add("active");
}

function closeAllActionsPopup(){
    const actionsDetailPopup=document.getElementById("actions-detail-popup");
    actionsDetailPopup.classList.remove("active");
    actionsDetailPopup.classList.add("hidden");
}

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

function showPopup(message,type="neutral"){
    const popup=document.getElementById("popup");
    popup.textContent=message;
    popup.classList.remove("hidden","popup-good","popup-bad","popup-neutral");
    if(type==="good") popup.classList.add("popup-good");
    else if(type==="bad") popup.classList.add("popup-bad");
    else popup.classList.add("popup-neutral");
    setTimeout(()=>{popup.classList.add("hidden");},800);
}

function openActionPopup(actionName){
    const popup=document.getElementById("action-popup");
    const header=document.getElementById("action-popup-header");
    const note=document.getElementById("action-popup-note");
    header.textContent=actionName;
    note.value="";
    popup.classList.add("active");
    userInteractedWithPopup();
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

function trackAction(action,result){
    if(!gameInterval||gameFinished){
        alert("לא ניתן לרשום פעולה כשהסטופר לא פעיל או המשחק הסתיים!");
        return;
    }
    actions.push({action:action,result:result,minute:gameMinute});
    const type=classifyResult(result);
    let message=`הפעולה "${action}" (${result}) נרשמה!`;
    showPopup(message,type);
}

function classifyResult(result){
    let lowerResult=result.toLowerCase();
    if(lowerResult.includes("לא מוצלח")||lowerResult.includes("רעה")||lowerResult.includes("לא טוב")||lowerResult.includes("שלילית"))
        return "bad";
    if(lowerResult.includes("מוצלח")||lowerResult.includes("טוב")||lowerResult.includes("חיובית"))
        return "good";
    return "neutral";
}

// פונקציה לחישוב יחס הצלחה
function calculateSuccessRatio() {
    let successCount = 0;
    let failCount = 0;
    actions.forEach(a => {
        let lower = a.result.toLowerCase();
        if(lower.includes("מוצלח")||lower.includes("טוב")||lower.includes("חיובית")) {
            successCount++;
        } else if(lower.includes("לא מוצלח")||lower.includes("רעה")||lower.includes("לא טוב")||lower.includes("שלילית")) {
            failCount++;
        }
    });
    const total = successCount + failCount;
    let ratio = total > 0 ? (successCount / total) : 0;
    return {ratio, successCount, failCount};
}

function getTip(ratio){
    const index = Math.floor(Math.random() * tips.length);
    return tips[index];
}

function getExtendedActionCounts(selectedActions, actions) {
    const resultMap = {};
    // אתחול כל הפעולות כלא בוצעו
    selectedActions.forEach(sa => {
        resultMap[sa.action] = {
            successful: 0,
            unsuccessful: 0,
            notPerformed: true
        };
    });

    // ספירה לפי הפעולות שבוצעו בפועל
    actions.forEach(a=>{
        const actionName = a.action;
        const actionResult = a.result.toLowerCase();
        if(!resultMap[actionName]){
            // אם פעולה הופיעה בביצוע ולא נבחרה מראש, נוסיף אותה
            resultMap[actionName]={
                successful:0,
                unsuccessful:0,
                notPerformed:true
            };
        }
        resultMap[actionName].notPerformed=false;
        if(actionResult.includes("מוצלח")||actionResult.includes("טוב")||actionResult.includes("חיובית")){
            resultMap[actionName].successful++;
        } else if(actionResult.includes("לא מוצלח")||actionResult.includes("רעה")||actionResult.includes("לא טוב")||actionResult.includes("שלילית")){
            resultMap[actionName].unsuccessful++;
        } else {
            // פעולה לא מסווגת מפורשות - נגדיר כלא מוצלח או ניטרלי
            resultMap[actionName].unsuccessful++;
        }
    });

    return resultMap;
}

function getExtendedSummaryHTML(actionDataMap, title) {
    let html = `<h3>${title}:</h3>`;
    for (const actionName in actionDataMap) {
        const data = actionDataMap[actionName];
        if (data.notPerformed) {
            // פעולה לא בוצעה בכלל
            html += `<p class="neutral">${actionName}: לא בוצע</p>`;
        } else {
            let className = "neutral";
            // קבע צבע בהתאם לתוצאות
            // אם רק מוצלח >0 ולא מוצלח=0 -> good
            // אם רק לא מוצלח >0 ולא מוצלח > מוצלח -> bad
            // אחרת neutral
            if(data.successful > 0 && data.unsuccessful===0) className="good";
            else if(data.unsuccessful >0 && data.successful===0) className="bad";
            // במידה ויש גם וגם, נשאיר ניטרלי
            let successText = data.successful>0 ? ` מוצלח: ${data.successful} פעמים` : "";
            let failText = data.unsuccessful>0 ? ` לא מוצלח: ${data.unsuccessful} פעמים` : "";
            html += `<p class="${className}">${actionName}:${successText}${failText}</p>`;
        }
    }
    return html;
}

function calculateScore(minutesPlayed){
    let score=50; // לדוגמה, עדיין קבוע
    return score;
}

function showFeedback(score,minutesPlayed){
    let feedback="";
    if(score>85) feedback="מצוין!";
    else if(score>70) feedback="טוב מאוד";
    else feedback="יש מקום לשיפור.";
    document.getElementById("feedback-text").textContent=feedback;
    const feedbackPopup=document.getElementById("feedback-popup");
    feedbackPopup.classList.remove("hidden");
}

function closeFeedbackPopup(){
    document.getElementById("feedback-popup").classList.add("hidden");
}

function reopenSummary(){
    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function saveGameDataToServer(playerName,teamName,position,gameDate,score,actions,notes){
    fetch('/save_data',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({playerName,teamName,position,gameDate,score,actions, parentNotes:notes})
    })
    .then(res=>res.json())
    .then(data=>{console.log("Data saved:",data);})
    .catch(err=>console.error(err));
}

function takeScreenshot(){
    const element=document.getElementById('goals-summary-container'); // שינוי לצילום יעדים
    if(!element)return;
    html2canvas(element).then(canvas=>{
        const link=document.createElement('a');
        link.href=canvas.toDataURL();
        link.download='goals_summary_screenshot.png';
        link.click();
    });
}

// פונקציות מאמן/אנליסט - סקלטון
function submitCoachGameInfo(){}
function addCoachGoal(hoolia){}
function submitCoachSetup(){}
function enterCoachMarking(){}
function finishCoachGame(){}
function downloadPDFCoach(){}
function openTacticalBoard(){}
function closeTacticalBoard(){}
function captureTacticalBoard(){}
function setTeamMoodAndOpenMoodInput(m){
    teamMood=m;
    const moodMsg=document.getElementById("mood-message");
    if(m){moodMsg.classList.remove("hidden");}else{moodMsg.classList.add("hidden");}
}

// פונקציה לסגירת פופאפים כללית
function closePopup(){
    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}
