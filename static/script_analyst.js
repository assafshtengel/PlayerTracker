// script_analyst.js
let analystData = {
    teamAName: "",
    teamBName: "",
    gameDate: null,
    players: [],
    actions: [],
    notes: [],
    gameFinished: false
};

function submitAnalystGameInfo(){
    analystData.teamAName = document.getElementById("analyst-teamA").value.trim();
    analystData.teamBName = document.getElementById("analyst-teamB").value.trim();
    analystData.gameDate = document.getElementById("analyst-game-date").value;
    document.getElementById("analyst-game-info-container").classList.add("hidden");
    document.getElementById("analyst-players-setup-container").classList.remove("hidden");
}

function addAnalystPlayer(){
    const name = document.getElementById("player-name").value.trim();
    const number = document.getElementById("player-number").value.trim();
    const pos = document.getElementById("player-position").value;
    const team = document.getElementById("player-team").value;
    if(name && number){
        analystData.players.push({name,number,position:pos,team:team,actions:[]});
        displayAnalystPlayers();
    }
}

function displayAnalystPlayers(){
    const list=document.getElementById("analyst-players-list");
    list.innerHTML="";
    analystData.players.forEach(p=>{
        const div = document.createElement('div');
        div.textContent=`${p.name} (#${p.number}, ${p.position}, קבוצה ${p.team})`;
        list.appendChild(div);
    });
}

function submitPlayersSetup(){
    document.getElementById("analyst-players-setup-container").classList.add("hidden");
    document.getElementById("analyst-actions-selection-container").classList.remove("hidden");
    // כאן בוחרים פעולות לשחקנים
}

function confirmAnalystActions(){
    document.getElementById("analyst-actions-selection-container").classList.add("hidden");
    document.getElementById("analyst-tracking-container").classList.remove("hidden");
}

function getExtendedSummaryHTML(actionDataMap, title) {
    let html = `<h3>${title}:</h3>`;
    return html;
}

function endAnalystGame(){
    analystData.gameFinished=true;
    const summaryContent=document.getElementById("summary-content");
    const extendedData = {};
    summaryContent.innerHTML = getExtendedSummaryHTML(extendedData,"סיכום המשחק");
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
