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
        // ... אפשר להמשיך כמו בקוד המקורי
    ],
    "בלם":[
        {name:"חטיפת כדורים"},
        // ... המשך כמו בקוד המקורי
    ],
    "קשר":[
        {name:"חילוץ כדור בקישור"},
        // ... המשך כמו בקוד המקורי
    ]
};

function selectRole(role){} // לא בשימוש כאן

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
        if(a.name==="מנטאלי"){
            mentalContainer.appendChild(createActionSelectable(a.name,"mental"));
        } else {
            professionalContainer.appendChild(createActionSelectable(a.name,"professional"));
        }
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
        inp.type="number";inp.min="0";inp.placeholder="יעד...";
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
    document.getElementById("start-game-container").classList.remove("hidden");
}

function saveMeasurableGoals(){
    const popup=document.getElementById("measurable-goals-popup");
    const rows=popup.querySelectorAll("tbody tr");
    measurableGoalsData=[];
    rows.forEach(r=>{
        const actionName=r.cells[0].textContent;
        const val=r.cells[1].querySelector("input").value.trim();
        if(val) measurableGoalsData.push({action:actionName,goal:parseInt(val)});
    });
    closeMeasurableGoalsPopup();
}

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
    // saveGameDataToServer(...)
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

function getActionCounts(){
    return actions.reduce((acc,{action,result})=>{
        const key=`${action}: ${result}`;
        acc[key]=(acc[key]||0)+1;
        return acc;
    },{});
}

function getSummaryHTML(counts,title){
    const summaryHTML=Object.entries(counts)
    .map(([key,count])=>{
        const className=classifyKey(key);
        return `<p class="${className}">${key}: ${count} פעמים</p>`;
    }).join("");
    return `<h3>${title}:</h3>${summaryHTML}`;
}

function classifyKey(key){
    let lowerKey=key.toLowerCase();
    if(lowerKey.includes("לא מוצלח")||lowerKey.includes("רעה")||lowerKey.includes("לא טוב")||lowerKey.includes("שלילית"))return "bad";
    if(lowerKey.includes("מוצלח")||lowerKey.includes("טוב")||lowerKey.includes("חיובית"))return "good";
    return "neutral";
}

function calculateScore(minutesPlayed){
    let score=50;
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

function takeScreenshot(){
    const element=document.getElementById('game-summary-content');
    if(!element)return;
    html2canvas(element).then(canvas=>{
        const link=document.createElement('a');
        link.href=canvas.toDataURL();
        link.download='game_summary_screenshot.png';
        link.click();
    });
}

// saveGameDataToServer(...) ניתן להוסיף אם צריך

