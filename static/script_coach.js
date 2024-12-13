let coachData = {
    teamAName: "",
    teamBName: "",
    teamAColor: null,
    teamBColor: null,
    gameDate: null,
    goals: {
        "goal-keeper":[],
        "defense":[],
        "midfield":[],
        "attack":[]
    },
    selectedGoals: [],
    actions: [],
    notes: [],
    quickNotes: [],
    mood: "",
    moodMessage: "",
    gameFinished: false,
    gameInterval: null,
    gameMinute:0,
    halfCount:1
};

const availableColors = ["red","blue","green","yellow","orange","white","black"];
const keeperGoals = ["עצירה 1 על 1", "יציאה נכונה לכדור גובה", "משחק רגל"];
const defenseGoals = ["תיקול מוצלח", "הגנה על הקו", "נגיחה בהרחקה"];
const midfieldGoals = ["מסירה קדימה מדויקת", "חילוץ כדור", "שליטה בקצב המשחק"];
const attackGoals = ["בעיטה למסגרת", "דריבל מוצלח", "נוכחות ברחבה"];

document.addEventListener('DOMContentLoaded',()=>{
    createColorPalette("coach-teamA-colors",(color)=>{
        coachData.teamAColor = color;
        checkCoachFormValidity();
    });
    createColorPalette("coach-teamB-colors",(color)=>{
        coachData.teamBColor = color;
        checkCoachFormValidity();
    });

    loadHooliaGoals("goal-keeper",keeperGoals);
    loadHooliaGoals("defense",defenseGoals);
    loadHooliaGoals("midfield",midfieldGoals);
    loadHooliaGoals("attack",attackGoals);

    document.getElementById("coach-game-date").onchange = checkCoachFormValidity;
    document.getElementById("coach-teamA").oninput = checkCoachFormValidity;
    document.getElementById("coach-teamB").oninput = checkCoachFormValidity;
});

function createColorPalette(containerId,onSelect){
    const container = document.getElementById(containerId);
    container.innerHTML="";
    availableColors.forEach(c=>{
        const div=document.createElement('div');
        div.style.width="30px";
        div.style.height="30px";
        div.style.borderRadius="50%";
        div.style.display="inline-block";
        div.style.margin="5px";
        div.style.cursor="pointer";
        div.style.backgroundColor=c;
        div.onclick=()=>{onSelect(c);highlightSelectedColor(containerId,c);};
        container.appendChild(div);
    });
}

function highlightSelectedColor(containerId,color){
    const container=document.getElementById(containerId);
    [...container.children].forEach(child=>{
        child.style.outline="";
    });
    const selected = [...container.children].find(el=>el.style.backgroundColor===color);
    if(selected)selected.style.outline="3px solid #333";
}

function checkCoachFormValidity(){
    const teamA=document.getElementById("coach-teamA").value.trim();
    const teamB=document.getElementById("coach-teamB").value.trim();
    const date=document.getElementById("coach-game-date").value;
    const btn=document.getElementById("submit-coach-game-info-btn");
    if(teamA && teamB && date && coachData.teamAColor && coachData.teamBColor){
        btn.disabled=false;
        btn.style.opacity="1";
    } else {
        btn.disabled=true;
        btn.style.opacity="0.5";
    }
}

function submitCoachGameInfo(){
    coachData.teamAName = document.getElementById("coach-teamA").value.trim();
    coachData.teamBName = document.getElementById("coach-teamB").value.trim();
    coachData.gameDate = document.getElementById("coach-game-date").value;

    document.getElementById("coach-game-info-container").classList.add("hidden");
    document.getElementById("coach-setup-container").classList.remove("hidden");
}

function loadHooliaGoals(hoolia,goalsArr){
    const container=document.getElementById(`coach-${hoolia}`);
    container.innerHTML="";
    goalsArr.forEach(g=>{
        container.appendChild(createGoalCard(g,hoolia));
    });
}

function createGoalCard(goal,hoolia){
    const div=document.createElement('div');
    div.className='action-toggle'; 
    div.textContent=goal;
    div.dataset.selected="false";
    div.onclick=()=>{
        if(div.dataset.selected==="false"){
            div.dataset.selected="true";
            div.classList.add("selected-action");
            if(!coachData.goals[hoolia].includes(goal)) coachData.goals[hoolia].push(goal);
        }else{
            div.dataset.selected="false";
            div.classList.remove("selected-action");
            coachData.goals[hoolia]=coachData.goals[hoolia].filter(x=>x!==goal);
        }
    };
    return div;
}

function addCoachGoal(hoolia){
    const input=document.getElementById(`coach-${hoolia}-custom`);
    const val=input.value.trim();
    if(!val){alert("אנא כתוב מטרה מותאמת");return;}
    coachData.goals[hoolia].push(val);
    const container=document.getElementById(`coach-${hoolia}`);
    const newGoal=createGoalCard(val,hoolia);
    newGoal.dataset.selected="true";
    newGoal.classList.add("selected-action");
    container.appendChild(newGoal);
    input.value="";
}

function submitCoachSetup(){
    document.getElementById("coach-setup-container").classList.add("hidden");
    document.getElementById("coach-tracking-container").classList.remove("hidden");
    const allSelectedGoals=[];
    Object.keys(coachData.goals).forEach(h=>{
        coachData.goals[h].forEach(g=>{
            allSelectedGoals.push({hoolia:h,goal:g,successful:0,unsuccessful:0,notes:[]});
        });
    });
    coachData.selectedGoals=allSelectedGoals;

    displayCoachActions();
    startCoachGame();
}

function displayCoachActions(){
    const container=document.getElementById("coach-actions");
    container.innerHTML="";
    coachData.selectedGoals.forEach(item=>{
        const div=document.createElement('div');
        div.className='action-card';
        div.textContent=item.goal;
        div.onclick=()=>openCoachActionPopup(item);
        container.appendChild(div);
    });
}

function startCoachGame(){
    coachData.gameMinute=0;
    document.getElementById("coach-minute-counter").textContent=coachData.gameMinute;
    coachData.gameInterval=setInterval(()=>{
        coachData.gameMinute++;
        document.getElementById("coach-minute-counter").textContent=coachData.gameMinute;
    },60000);
}

let coachActionPopupTimeout=null;
let currentCoachAction=null;

function openCoachActionPopup(item){
    const popup=document.getElementById("coach-action-popup");
    document.getElementById("coach-action-popup-header").textContent=item.goal;
    document.getElementById("coach-action-popup-note").value="";
    popup.classList.remove("hidden");
    popup.classList.add("active");
    if(coachActionPopupTimeout)clearTimeout(coachActionPopupTimeout);
    coachActionPopupTimeout=setTimeout(()=>closeCoachActionPopup(),4000);
    currentCoachAction=item;
}

function coachUserInteractedWithPopup(){
    if(coachActionPopupTimeout)clearTimeout(coachActionPopupTimeout);
    coachActionPopupTimeout=setTimeout(()=>closeCoachActionPopup(),4000);
}

function chooseCoachActionResult(result){
    if(!currentCoachAction)return;
    const note=document.getElementById("coach-action-popup-note").value.trim();
    if(result==="מוצלח") currentCoachAction.successful++;
    else currentCoachAction.unsuccessful++;
    if(note) currentCoachAction.notes.push({minute:coachData.gameMinute,text:note});
    closeCoachActionPopup();
}

function closeCoachActionPopup(){
    const popup=document.getElementById("coach-action-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    currentCoachAction=null;
}

function addQuickNote(){
    const inp=document.getElementById("coach-quick-note-input");
    const val=inp.value.trim();
    if(!val)return;
    coachData.quickNotes.push({minute:coachData.gameMinute,text:val});
    displayQuickNotes();
    inp.value="";
}

function displayQuickNotes(){
    const list=document.getElementById("coach-quick-notes-list");
    list.innerHTML="";
    coachData.quickNotes.forEach(q=>{
        const div=document.createElement("div");
        div.style.background="yellow";
        div.style.padding="10px";
        div.style.marginBottom="10px";
        div.style.border="1px solid #ccc";
        div.style.borderRadius="5px";
        div.textContent=`דקה ${q.minute}: ${q.text}`;
        list.appendChild(div);
    });
}

function setTeamMoodInput(){
    const mood=document.getElementById("coach-mood-select").value;
    coachData.mood=mood;
    const container=document.getElementById("coach-mood-message-container");
    if(mood){
        container.classList.remove("hidden");
    } else {
        container.classList.add("hidden");
    }
}

function openTacticalBoard(){
    const popup=document.getElementById("tactical-board-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeTacticalBoard(){
    const popup=document.getElementById("tactical-board-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function captureTacticalBoard(){
    const element=document.getElementById("tactical-board");
    if(!element)return;
    html2canvas(element).then(canvas=>{
        const link=document.createElement('a');
        link.href=canvas.toDataURL();
        link.download='tactical_board.png';
        link.click();
    });
}

function endCoachHalf(){
    if(coachData.gameInterval){clearInterval(coachData.gameInterval);coachData.gameInterval=null;}
    const popup=document.getElementById("coach-half-summary-popup");
    const content=document.getElementById("coach-half-summary-content");
    content.innerHTML=getCoachSummaryHTML();
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function resumeCoachHalf(){
    const popup=document.getElementById("coach-half-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    coachData.halfCount=2;
    coachData.gameMinute=45;
    document.getElementById("coach-minute-counter").textContent=coachData.gameMinute;
    coachData.gameInterval=setInterval(()=>{
        coachData.gameMinute++;
        document.getElementById("coach-minute-counter").textContent=coachData.gameMinute;
    },60000);
}

function closeCoachHalfSummary(){
    const popup=document.getElementById("coach-half-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function endCoachGame(){
    if(coachData.gameInterval){clearInterval(coachData.gameInterval);coachData.gameInterval=null;}
    coachData.gameFinished=true;
    coachData.moodMessage=document.getElementById("coach-mood-message").value.trim()||"";
    document.getElementById("coach-tracking-container").classList.add("hidden");
    document.getElementById("coach-summary-container").classList.remove("hidden");
    const summaryContent=document.getElementById("coach-summary-content");
    summaryContent.innerHTML=getCoachFinalSummaryHTML();
}

function getCoachSummaryHTML(){
    let html="<h3>סיכום מחצית</h3>";
    coachData.selectedGoals.forEach(g=>{
        html+=`<p>${g.goal}: מוצלח ${g.successful}, לא מוצלח ${g.unsuccessful}</p>`;
    });
    return html;
}

function getCoachFinalSummaryHTML(){
    let html="<h3>סיכום המשחק</h3>";
    html+=`<p>קבוצה א': ${coachData.teamAName} (צבע: ${coachData.teamAColor})</p>`;
    html+=`<p>קבוצה ב': ${coachData.teamBName} (צבע: ${coachData.teamBColor})</p>`;
    html+=`<p>תאריך המשחק: ${coachData.gameDate}</p>`;

    html+="<h4>מטרות שנבחרו</h4>";
    coachData.selectedGoals.forEach(g=>{
        html+=`<p>${g.goal}: מוצלח ${g.successful}, לא מוצלח ${g.unsuccessful}</p>`;
        if(g.notes.length>0){
            html+="<ul>";
            g.notes.forEach(n=>html+=`<li>דקה ${n.minute}: ${n.text}</li>`);
            html+="</ul>";
        }
    });

    if(coachData.quickNotes.length>0){
        html+="<h4>פתקים:</h4><ul>";
        coachData.quickNotes.forEach(q=>{
            html+=`<li>דקה ${q.minute}: ${q.text}</li>`;
        });
        html+="</ul>";
    }

    if(coachData.mood){
        html+=`<h4>מצב רוח הקבוצה: ${coachData.mood}</h4>`;
        if(coachData.moodMessage)html+=`<p>מסר: ${coachData.moodMessage}</p>`;
    }

    return html;
}

function savePDFCoach(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    const summaryContent=document.getElementById("coach-summary-content").innerHTML;
    doc.text("סיכום המשחק (מאמן)",10,10);
    doc.text("ראה מסמך HTML מלא לדוח מורכב.",10,20);
    doc.save("coach_summary.pdf");
}

function takeScreenshotCoach(){
    const element=document.getElementById("coach-summary-container");
    if(!element)return;
    html2canvas(element).then(canvas=>{
        const link=document.createElement('a');
        link.href=canvas.toDataURL();
        link.download='coach_summary_screenshot.png';
        link.click();
    });
}

function showPopupCoach(message,type="neutral"){
    const popup=document.getElementById("popup");
    popup.textContent=message;
    popup.classList.remove("hidden","popup-good","popup-bad","popup-neutral");
    if(type==="good") popup.classList.add("popup-good");
    else if(type==="bad") popup.classList.add("popup-bad");
    else popup.classList.add("popup-neutral");
    setTimeout(()=>{popup.classList.add("hidden");},800);
}
