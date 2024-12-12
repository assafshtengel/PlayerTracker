// script_coach.js
let coachData = {
    teamAName: "",
    teamBName: "",
    teamAColor: null,
    teamBColor: null,
    gameDate: null,
    goals: { "goal-keeper":[], "defense":[],"midfield":[],"attack":[] },
    actions: [],
    notes: [],
    mood: "neutral",
    gameFinished: false
};

function submitCoachGameInfo(){
    // איסוף הנתונים מה-HTML...
    // הצגת מסך הגדרת מטרות
    document.getElementById("coach-game-info-container").classList.add("hidden");
    document.getElementById("coach-setup-container").classList.remove("hidden");
}

function addCoachGoal(hoolia){
    const input = document.getElementById(`coach-${hoolia}-custom`);
    const val = input.value.trim();
    if(val){
        coachData.goals[hoolia].push({name:val});
        displayGoals(hoolia);
        input.value="";
    }
}

function displayGoals(hoolia){
    const container = document.getElementById(`coach-${hoolia}`);
    container.innerHTML="";
    coachData.goals[hoolia].forEach(g=>{
        const div=document.createElement('div');
        div.className='action-toggle';
        div.textContent=g.name;
        div.onclick=()=>{
            div.classList.toggle('selected-action');
        };
        container.appendChild(div);
    });
}

function submitCoachSetup(){
    // מעבר למעקב
    document.getElementById("coach-setup-container").classList.add("hidden");
    document.getElementById("coach-actions-container").classList.remove("hidden");
}

function getExtendedSummaryHTML(actionDataMap, title){
    let html = `<h3>${title}:</h3>`;
    // לוגיקה כאמור
    return html;
}

function endGame(){
    coachData.gameFinished=true;
    const summaryContent=document.getElementById("summary-content");
    const extendedData = {}; // בהתאם לביצוע
    summaryContent.innerHTML=getExtendedSummaryHTML(extendedData,"סיכום המשחק");
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
}
