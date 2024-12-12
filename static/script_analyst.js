// script_analyst.js

let analystData = {
    teamAName: "",
    teamBName: "",
    gameDate: null,
    players: [],
    actionsMap: {}, // שחקן -> פעולות
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
    // כאן נבחר פעולות לכל שחקן...
}

function getExtendedSummaryHTML(actionDataMap, title) {
    let html = `<h3>${title}:</h3>`;
    // לוגיקה דומה לזו שבמאמן
    return html;
}

// ועוד פונקציות לחישוב, endAnalystGame, takeScreenshot, etc.

function endAnalystGame(){
    analystData.gameFinished=true;
    const summaryContent=document.getElementById("summary-content");
    const extendedData = {}; // לבנות מסיכום הפעולות
    summaryContent.innerHTML = getExtendedSummaryHTML(extendedData,"סיכום המשחק");
    document.getElementById("game-summary-popup").classList.remove("hidden");
    document.getElementById("game-summary-popup").classList.add("active");
}

function closePopup(){
    const popup=document.getElementById("game-summary-popup");
    if(popup){
        popup.classList.remove("active");
        popup.classList.add("hidden");
    }
}

// וכו'... פונקציות נוספות בהתאם לצורך, בדומה למאמן.


