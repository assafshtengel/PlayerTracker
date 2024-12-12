let analystData = {
    teamAName:"",
    teamBName:"",
    gameDate:null,
    players:[],
    actions:[], // {playerIndex,action,result,minute,note}
    selectedActionsPerPlayer:[], // {playerIndex,actions:[{name,successful,unsuccessful,notes:[]}]}
    gameInterval:null,
    gameMinute:0,
    halfCount:1,
    generalNotes:[]
};

// דוגמה למטרות לפי תפקיד
const positionProfessionalGoals={
    "שוער":["יציאה נכונה","עצירה 1 על 1","הגנה בקו","משחק רגל"],
    "מגן":["תיקול מוצלח","הרחקת כדור","יצירת רוחב","מניעת הגבהה"],
    "קשר":["חילוץ בקישור","מסירה קדימה","ניהול קצב","הרמת הראש"],
    "חלוץ":["בעיטה לשער","תנועה ללא כדור","נוכחות ברחבה","לחץ על ההגנה"]
};
const mentalGoals=["מנטאלי","עמידה בלחץ","תקשורת עם הקבוצה"];

document.addEventListener('DOMContentLoaded',()=>{
    // אין צורך בבדיקת תקינות כאן, כפתור "המשך" זמין תמיד
});

// מסך הגדרת פרטי המשחק
function submitAnalystGameInfo(){
    analystData.teamAName=document.getElementById("analyst-teamA").value.trim();
    analystData.teamBName=document.getElementById("analyst-teamB").value.trim();
    analystData.gameDate=document.getElementById("analyst-game-date").value;
    if(!analystData.teamAName || !analystData.teamBName || !analystData.gameDate){
        alert("אנא מלא את כל הפרטים");
        return;
    }
    document.getElementById("analyst-game-info-container").classList.add("hidden");
    document.getElementById("analyst-players-setup-container").classList.remove("hidden");
}

function addAnalystPlayer(){
    if(analystData.players.length>=10){
        alert("מקסימום 10 שחקנים");
        return;
    }
    const name=document.getElementById("analyst-player-name").value.trim();
    const number=document.getElementById("analyst-player-number").value.trim();
    const pos=document.getElementById("analyst-player-position").value;
    const team=document.getElementById("analyst-player-team").value;
    const color=document.getElementById("analyst-player-color").value;
    if(!name || !pos){
        alert("חובה שם ותפקיד");
        return;
    }
    analystData.players.push({name,number,position:pos,team,color,selectedActions:[]});
    displayAnalystPlayers();
    document.getElementById("analyst-player-name").value="";
    document.getElementById("analyst-player-number").value="";
    document.getElementById("analyst-player-position").value="";
    document.getElementById("analyst-player-team").value="A";
    document.getElementById("analyst-player-color").value="#ffffff";
}

function displayAnalystPlayers(){
    const list=document.getElementById("analyst-players-list");
    list.innerHTML="";
    analystData.players.forEach((p,i)=>{
        const div=document.createElement('div');
        div.style.border="1px solid #ccc";
        div.style.borderRadius="5px";
        div.style.padding="10px";
        div.style.marginBottom="10px";
        div.textContent=`${p.name} (#${p.number||"ללא"}, ${p.position}, קבוצה ${p.team})`;
        const btn=document.createElement('button');
        btn.textContent="X";
        btn.style.background="red";
        btn.style.color="white";
        btn.style.float="left";
        btn.style.marginLeft="10px";
        btn.onclick=()=>{
            analystData.players.splice(i,1);
            displayAnalystPlayers();
        };
        div.appendChild(btn);
        list.appendChild(div);
    });
}

function submitPlayersSetup(){
    if(analystData.players.length===0){
        alert("הוסף לפחות שחקן אחד");
        return;
    }
    document.getElementById("analyst-players-setup-container").classList.add("hidden");
    document.getElementById("analyst-actions-selection-container").classList.remove("hidden");
    displayAnalystPlayersActionsSetup();
}

function displayAnalystPlayersActionsSetup(){
    const container=document.getElementById("analyst-players-actions-setup");
    container.innerHTML="";
    analystData.players.forEach((p,pi)=>{
        const div=document.createElement('div');
        div.style.border="1px solid #ccc";
        div.style.borderRadius="10px";
        div.style.padding="20px";
        div.style.marginBottom="20px";
        div.innerHTML=`<h3>${p.name} (#${p.number||"ללא"}, ${p.position}, ${p.team})</h3><p>בחר פעולות:</p>`;
        
        // פעולות מקצועיות
        const proContainer=document.createElement('div');
        proContainer.innerHTML="<h4>פעולות מקצועיות:</h4>";
        let profGoals=positionProfessionalGoals[p.position]||[];
        profGoals.forEach(g=>{
            proContainer.appendChild(createActionToggle(g,p,"professional",pi));
        });

        // פעולות מנטליות
        const mentalContainer=document.createElement('div');
        mentalContainer.innerHTML="<h4>פעולות מנטאליות:</h4>";
        mentalGoals.forEach(m=>{
            mentalContainer.appendChild(createActionToggle(m,p,"mental",pi));
        });

        // פעולות מותאמות אישית
        const customContainer=document.createElement('div');
        customContainer.innerHTML="<h4>פעולות מותאמות אישית:</h4>";
        const input=document.createElement('input');
        input.type="text";
        input.placeholder="הכנס פעולה מותאמת אישית";
        input.style.marginRight="10px";
        const addBtn=document.createElement('button');
        addBtn.textContent="הוסף פעולה";
        addBtn.className="blue-btn";
        addBtn.onclick=()=>{
            const val=input.value.trim();
            if(!val)return;
            customContainer.appendChild(createActionToggle(val,p,"custom",pi,true));
            input.value="";
        };

        const customGroup=document.createElement('div');
        customGroup.appendChild(input);
        customGroup.appendChild(addBtn);
        customContainer.appendChild(customGroup);

        div.appendChild(proContainer);
        div.appendChild(mentalContainer);
        div.appendChild(customContainer);
        container.appendChild(div);
    });
}

function createActionToggle(action,player,cat,playerIndex,isCustom=false){
    const div=document.createElement('div');
    div.className='action-toggle';
    div.textContent=action;
    div.dataset.selected="false";
    div.onclick=()=>{
        if(div.dataset.selected==="false"){
            div.dataset.selected="true";
            div.classList.add("selected-action");
            player.selectedActions.push(action);
        }else{
            div.dataset.selected="false";
            div.classList.remove("selected-action");
            player.selectedActions=player.selectedActions.filter(a=>a!==action);
        }
    };
    return div;
}

function confirmAnalystActions(){
    // חייבים שיהיה לפחות שחקן אחד עם פעולה אחת
    const hasActions=analystData.players.some(p=>p.selectedActions.length>0);
    if(!hasActions){
        alert("בחר לפחות פעולה אחת לשחקן אחד");
        return;
    }
    document.getElementById("analyst-actions-selection-container").classList.add("hidden");
    document.getElementById("analyst-marking-container").classList.remove("hidden");
    startAnalystGame();
    displayAnalystMarking();
}

function startAnalystGame(){
    analystData.gameMinute=0;
    document.getElementById("analyst-minute-counter").textContent=analystData.gameMinute;
    analystData.gameInterval=setInterval(()=>{
        analystData.gameMinute++;
        document.getElementById("analyst-minute-counter").textContent=analystData.gameMinute;
    },60000);
}

function displayAnalystMarking(){
    const container=document.getElementById("analyst-players-actions");
    container.innerHTML="";
    analystData.players.forEach((p,pi)=>{
        const div=document.createElement('div');
        div.style.border="1px solid #ccc";
        div.style.borderRadius="10px";
        div.style.padding="20px";
        div.style.marginBottom="20px";
        div.innerHTML=`<h3>${p.name} (#${p.number||"ללא"}, ${p.position}, ${p.team})</h3>`;

        p.selectedActions.forEach(act=>{
            const aDiv=document.createElement('div');
            aDiv.className='action-card';
            aDiv.textContent=act;
            aDiv.onclick=()=>openAnalystActionPopup(pi,act);
            div.appendChild(aDiv);
        });

        container.appendChild(div);
    });
}

let analystActionPopupTimeout=null;
let currentAnalystAction={playerIndex:null,action:null};
function openAnalystActionPopup(playerIndex,action){
    const popup=document.getElementById("analyst-action-popup");
    document.getElementById("analyst-action-popup-header").textContent=action;
    document.getElementById("analyst-action-popup-note").value="";
    currentAnalystAction={playerIndex,action};
    popup.classList.remove("hidden");
    popup.classList.add("active");
    if(analystActionPopupTimeout)clearTimeout(analystActionPopupTimeout);
    analystActionPopupTimeout=setTimeout(()=>closeAnalystActionPopup(),4000);
}

function analystUserInteractedWithPopup(){
    if(analystActionPopupTimeout)clearTimeout(analystActionPopupTimeout);
    analystActionPopupTimeout=setTimeout(()=>closeAnalystActionPopup(),4000);
}

function chooseAnalystActionResult(result){
    const note=document.getElementById("analyst-action-popup-note").value.trim();
    analystData.actions.push({
        playerIndex:currentAnalystAction.playerIndex,
        action:currentAnalystAction.action,
        result:result,
        minute:analystData.gameMinute,
        note:note
    });
    closeAnalystActionPopup();
}

function closeAnalystActionPopup(){
    const popup=document.getElementById("analyst-action-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    currentAnalystAction={playerIndex:null,action:null};
}

function endAnalystHalf(){
    if(analystData.gameInterval){clearInterval(analystData.gameInterval);analystData.gameInterval=null;}
    const popup=document.getElementById("analyst-half-summary-popup");
    const content=document.getElementById("analyst-half-summary-content");
    content.innerHTML=getAnalystSummaryHTML();
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function resumeAnalystHalf(){
    const popup=document.getElementById("analyst-half-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
    analystData.halfCount=2;
    analystData.gameMinute=45;
    document.getElementById("analyst-minute-counter").textContent=analystData.gameMinute;
    analystData.gameInterval=setInterval(()=>{
        analystData.gameMinute++;
        document.getElementById("analyst-minute-counter").textContent=analystData.gameMinute;
    },60000);
}

function closeAnalystHalfSummary(){
    const popup=document.getElementById("analyst-half-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function getAnalystSummaryHTML(){
    // סיכום פשוט: ספירת מוצלח/לא מוצלח פר שחקן
    let html="<h3>סיכום מחצית</h3>";
    analystData.players.forEach((p,pi)=>{
        html+=`<h4>${p.name}</h4>`;
        let playerActions=analystData.actions.filter(a=>a.playerIndex===pi);
        p.selectedActions.forEach(act=>{
            let actActions=playerActions.filter(a=>a.action===act);
            let successful=actActions.filter(a=>a.result==="מוצלח").length;
            let unsuccessful=actActions.filter(a=>a.result==="לא מוצלח").length;
            html+=`<p>${act}: מוצלח ${successful}, לא מוצלח ${unsuccessful}</p>`;
        });
    });
    return html;
}

function endAnalystGame(){
    if(analystData.gameInterval){clearInterval(analystData.gameInterval);analystData.gameInterval=null;}
    document.getElementById("analyst-marking-container").classList.add("hidden");
    document.getElementById("analyst-summary-container").classList.remove("hidden");
    const summaryContent=document.getElementById("analyst-summary-content");
    summaryContent.innerHTML=getAnalystFinalSummaryHTML();
}

function getAnalystFinalSummaryHTML(){
    let html="<h3>סיכום המשחק (אנליסט)</h3>";
    html+=`<p>קבוצה א': ${analystData.teamAName}</p>`;
    html+=`<p>קבוצה ב': ${analystData.teamBName}</p>`;
    html+=`<p>תאריך: ${analystData.gameDate}</p>`;

    analystData.players.forEach((p,pi)=>{
        html+=`<h4>${p.name} (#${p.number||"ללא"}, ${p.position}, ${p.team})</h4>`;
        let playerActions=analystData.actions.filter(a=>a.playerIndex===pi);
        p.selectedActions.forEach(act=>{
            let actActions=playerActions.filter(a=>a.action===act);
            let successful=actActions.filter(a=>a.result==="מוצלח").length;
            let unsuccessful=actActions.filter(a=>a.result==="לא מוצלח").length;
            html+=`<p>${act}: מוצלח ${successful}, לא מוצלח ${unsuccessful}</p>`;
            let notes=actActions.filter(a=>a.note&&a.note.trim()!=="");
            if(notes.length>0){
                html+="<ul>";
                notes.forEach(n=>html+=`<li>דקה ${n.minute}: ${n.note}</li>`);
                html+="</ul>";
            }
        });
    });

    if(analystData.generalNotes.length>0){
        html+="<h4>הערות כלליות:</h4><ul>";
        analystData.generalNotes.forEach(n=>{
            html+=`<li>דקה ${n.minute}: ${n.text}</li>`;
        });
        html+="</ul>";
    }

    return html;
}

function openAnalystGeneralNotePopup(){
    const popup=document.getElementById("analyst-general-note-popup");
    document.getElementById("analyst-general-note-text").value="";
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeAnalystGeneralNotePopup(){
    const popup=document.getElementById("analyst-general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function approveAnalystGeneralNote(){
    const note=document.getElementById("analyst-general-note-text").value.trim();
    if(note){
        analystData.generalNotes.push({minute:analystData.gameMinute,text:note});
    }
    closeAnalystGeneralNotePopup();
}

function showAllAnalystActions(){
    const list=document.getElementById("analyst-all-actions-list");
    list.innerHTML="";
    analystData.actions.forEach(a=>{
        const p=analystData.players[a.playerIndex];
        const div=document.createElement('div');
        div.textContent=`${p.name}: ${a.action} - ${a.result} (דקה ${a.minute})${a.note? ", הערה: "+a.note:""}`;
        list.appendChild(div);
    });
    const popup=document.getElementById("analyst-actions-detail-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeAnalystAllActionsPopup(){
    const popup=document.getElementById("analyst-actions-detail-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function saveAnalystPDF(){
    const { jsPDF } = window.jspdf;
    const doc = new jsPDF();
    doc.text("סיכום המשחק (אנליסט)",10,10);
    doc.text("בדוח מלא תוכל לייצר עיבוד HTML-to-PDF מתקדם",10,20);
    doc.save("analyst_summary.pdf");
}

function takeAnalystScreenshot(){
    const element=document.getElementById("analyst-summary-container");
    if(!element)return;
    html2canvas(element).then(canvas=>{
        const link=document.createElement('a');
        link.href=canvas.toDataURL();
        link.download='analyst_summary_screenshot.png';
        link.click();
    });
}

function closePopupAnalyst(){
    const popup=document.getElementById("popup");
    popup.classList.add("hidden");
}
