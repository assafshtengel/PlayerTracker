const ACCESS_CODE = "1976"; 

let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;
let chosenProfessional = [];
let chosenMental = [];
let chosenCustom = [];
let notes = [];
let gameFinished = false;
let customActionsArr = [];

let analystPlayers = [];
let analystGameActions = [];
let analystStartTime = false;

let analystTeamAName = "";
let analystTeamBName = "";
let analystGameDate = "";
let analystTeamAColor = "שחור";
let analystTeamBColor = "שחור";

let coachPlayers = [];
let coachGameActions = [];
let coachStartTime = false;

let coachTeamAName = "";
let coachTeamBName = "";
let coachGameDate = "";
let coachTeamAColor = "שחור";
let coachTeamBColor = "שחור";

let teamMood = "";
let quickNotes = [];

let actionPopupTimeout = null;

// מטרות לחוליות עבור מאמן (דוגמה)
const coachHooliaGoals = {
    "goal-keeper":["מניעת ספיגת שערים מיותרים","תקשורת ברורה עם ההגנה","יציאה נכונה לכדור גובה","עצירה ב-1 על 1","הפצת כדורים חכמה","שמירה על ריכוז","עמידה נכונה"],
    "defense":["סגירת קווי מסירה","הרחקות מדויקות","תיאום קו נבדל","מעבר מהיר להתקפה","חיפוי על מגן","ניהול משחק ראש","שמירה הדוקה על חלוץ"],
    "midfield":["חילוץ כדור בקישור","מסירות עומק","שליטה בקצב","מעבר מהיר קדימה","חיפוי על הגנה","ניצול שטחים","תמיכה בהתקפה"],
    "attack":["ניצול הזדמנויות","בעיטות למסגרת","תנועה ללא כדור","לחץ גבוה","קבלת כדור תחת לחץ","מסירת מפתח","סיום מצבים"]
};

const paletteColors = ["אדום","כחול","ירוק","צהוב","שחור","לבן","כתום","סגול","ורוד","חום","אפור","טורקיז"];
const colorMap = {
    "אדום":"red","כחול":"blue","ירוק":"green","צהוב":"yellow","שחור":"black","לבן":"white",
    "כתום":"orange","סגול":"purple","ורוד":"pink","חום":"brown","אפור":"gray","טורקיז":"turquoise"
};

const mentalActions = ["מנטאלי"];

// positionActions הוגדרו בתשובות קודמות, נשים כאן חלקית לפי ההנחיות האחרונות
const positionActions = {
    "חלוץ": [ /* כבר הוגדר קודם */ 
        {
            name: "בעיטה לשער",
            type: "multi",
            options: ["שער", "למסגרת", "החוצה"]
        },
        {
            name: "תנועה ללא כדור",
            type:"binary",
            options:["נכונה","לא נכונה"]
        },
        {
            name:"קבלת כדור תחת לחץ",
            type:"multi",
            options:["המשך בפעולה טובה","המשך בפעולה לא טובה","איבוד מיד עם הקבלה"]
        },
        {
            name:"פעולה בנגיעה אחת",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"נוכחות ברחבה",
            type:"single",
            options:["בוצע"]
        },
        {
            name:"לחץ גבוה על ההגנה",
            type:"chain",
            options:["בוצע"],
            subOptions:["צורה נכונה","לא נכונה"]
        },
        {
            name:"נגיחה למסגרת",
            type:"multi",
            options:["שער","למסגרת","מחוץ למסגרת"]
        },
        {
            name:"1 על 1 התקפי",
            type:"binary",
            options:["בוצע בהצלחה","לא מוצלח"]
        },
        {
            name:"מסירת מפתח",
            type:"binary",
            options:["הגיע ליעד","לא הגיע ליעד"]
        },
        {
            name:"הגבהה לרחבה",
            type:"binary",
            options:["טובה","לא מוצלחת"]
        },
        {
            name:"סיום מצבים",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"ניצול הזדמנויות",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"משחק עם הגב לשער",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"מנטאלי",
            type:"binary",
            options:["בוצע","לא בוצע"]
        }
    ],
    "שוער":[
        {
            name: "עצירת כדור קשה",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"יציאה לכדור גובה",
            type:"multi",
            options:["תפיסה","הדיפה","פספוס"]
        },
        {
            name:"משחק רגל מדויק",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"שליטה ברחבה",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"תקשורת עם ההגנה",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"יציאה לכדורי גובה",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"מסירה קצרה",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"מסירה ארוכה מדויקת",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"סגירת זויות בעיטות",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"תגובות מהירות",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"ביצוע 1 על 1",
            type:"binary",
            options:["בוצע","לא בוצע"]
        },
        {
            name:"מסירת מפתח",
            type:"binary",
            options:["בוצע","לא בוצע"]
        }
    ],
    "מגן":[
        {name:"מניעת מעבר שחקן יריב באגף",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"הגבהות איכותיות לרחבה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"חיפוי פנימה לכיוון הבלם",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"סגירת אופציית מסירה בצד",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"השתתפות בהנעת הכדור מההגנה קדימה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"תמיכה בהתקפה דרך האגף",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"חזרה מהירה לעמדה הגנתית לאחר יציאה קדימה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"גלישה נקייה לעצירת חדירה לרחבה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"לחץ גבוה על הקיצוני היריב",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"מעבר מהיר מהגנה להתקפה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"יצירת רוחב על הקו ההתקפי",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"הגנה על שחקן מפתח של היריב באזור האגף",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"שיתוף פעולה עם הקשר האגפי",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"הרחקות מדויקות לאורך הקו",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"זיהוי חללים פנויים לחדירה קדימה והרחבת המשחק",type:"binary",options:["בוצע","לא בוצע"]}
    ],
    "בלם":[
        {name:"חטיפת כדורים",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"הרחקות",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"תיקולים מוצלחים",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"לחץ על חלוצים",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"זכייה במאבקי אוויר",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"שמירה על קו הגנה מסודר",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"חיפוי על מגן",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"פתיחת משחק במסירות מדויקות",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"חלוקת עומסים בין בלמים",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"תמיכה בקשר האחורי",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"בלימת בעיטות למסגרת",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"מעקב אחר תנועות חלוצים מהירים",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"פינוי שטחים",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"ניהול משחק ראש",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"יצירת עליונות מספרית בהתקפה",type:"binary",options:["בוצע","לא בוצע"]}
    ],
    "קשר":[
        {name:"חילוץ כדור בקישור",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"מסירה מדויקת קדימה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"הנעת כדור תחת לחץ",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"שינוי כיוון המשחק באמצעות מסירות ארוכות",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"תמיכה בהגנה על ידי ירידה לאחור",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"ניהול קצב המשחק",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"הרמת הראש לזיהוי אופציית מסירה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"כניסה לרחבה להצטרפות להתקפה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"שמירה הדוקה על קשר יריב יצירתי",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"יצירת יתרון מספרי במרכז המגרש",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"חיפוי על מגן או חלוץ שנשארו גבוה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"ניצול שטחים פנויים במסירות עומק",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"תיקולים מוצלחים בקישור",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"מסירות רוחב לשינוי מוקד התקפה",type:"binary",options:["בוצע","לא בוצע"]},
        {name:"בעיטות מדויקת מחוץ לרחבה",type:"binary",options:["בוצע","לא בוצע"]}
    ]
};


function selectRole(role) {
    document.getElementById("main-page").classList.add("hidden");
    if (role === 'player') {
        document.getElementById("login-container").classList.remove("hidden");
    } else if (role === 'coach') {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("coach-game-date").value = today;
        createTeamColorPalette("coach-teamA-color-palette", c => {
            coachTeamAColor = c;
        }, "coach-teamA-color-palette");
        createTeamColorPalette("coach-teamB-color-palette", c => {
            coachTeamBColor = c;
        }, "coach-teamB-color-palette");
        document.getElementById("coach-game-info-container").classList.remove("hidden");
    } else if (role === 'analyst') {
        const today = new Date().toISOString().split('T')[0];
        document.getElementById("analyst-game-date").value = today;
        createTeamColorPalette("teamA-color-palette", c => {
            analystTeamAColor = c;
        },"teamA-color-palette");
        createTeamColorPalette("teamB-color-palette", c => {
            analystTeamBColor = c;
        },"teamB-color-palette");
        document.getElementById("analyst-game-info-container").classList.remove("hidden");
    }
}

function openTrainingSummaryPage() {
    document.getElementById("main-page").classList.add("hidden");
    document.getElementById("training-summary-page").classList.remove("hidden");
}

function closeTrainingSummaryPage() {
    document.getElementById("training-summary-page").classList.add("hidden");
    document.getElementById("main-page").classList.remove("hidden");
}

function generateTrainingSummaryPDF() {
    const elem = document.getElementById("training-summary-page");
    html2canvas(elem).then(canvas=>{
        const imgData = canvas.toDataURL('image/png');
        const { jsPDF } = window.jspdf;
        const pdf = new jsPDF('p','pt','a4');
        const pdfWidth = pdf.internal.pageSize.getWidth();
        const imgProps = pdf.getImageProperties(imgData);
        const pdfHeight = (imgProps.height * pdfWidth) / imgProps.width;
        pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
        pdf.save("training_summary.pdf");
    });
}

function checkAccessCode() {
    const code = document.getElementById("access-code").value.trim();
    if (code === ACCESS_CODE) {
        document.getElementById("login-container").classList.add("hidden");
        document.getElementById("user-input-container").classList.remove("hidden");
    } else {
        alert("קוד שגוי, נסה שוב");
    }
}

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;

    if (!playerName || !teamName || !playerPosition) {
        alert("אנא מלא את כל השדות (כולל תפקיד)");
        return;
    }

    window.playerNameGlobal = playerName;
    window.teamNameGlobal = teamName;
    window.playerPositionGlobal = playerPosition;

    document.getElementById("user-input-container").classList.add("hidden");
    loadActionsSelection(playerPosition);
    document.getElementById("actions-selection-container").classList.remove("hidden");
}

function addCustomAction() {
    const inp = document.getElementById("custom-action-input");
    const val = inp.value.trim();
    if(!val) return;
    customActionsArr.push(val);
    inp.value="";
    renderCustomActions();
}

function renderCustomActions() {
    const container = document.getElementById("custom-actions");
    container.innerHTML="";
    customActionsArr.forEach(action=>{
        const div = document.createElement("div");
        div.classList.add("action-item");
        const checkbox = document.createElement("input");
        checkbox.type="checkbox";
        checkbox.name="selected-actions";
        checkbox.value=action;
        checkbox.dataset.category="custom";
        checkbox.style.display='none';
        div.appendChild(checkbox);

        const label = document.createElement("label");
        label.textContent = action;
        label.onclick=()=>{
            if(checkbox.checked){
                checkbox.checked=false;
                label.classList.remove("selected");
            } else {
                checkbox.checked=true;
                label.classList.add("selected");
            }
        }
        div.appendChild(label);
        container.appendChild(div);
    });
}

function confirmActions() {
    const checkboxes = document.querySelectorAll('#actions-selection-container input[name="selected-actions"]:checked');
    // ללא חסימה, רק המלצה:
    if (checkboxes.length<6 || checkboxes.length>9) {
        alert("אנו ממליצים על בחירת 6-9 פעולות, אך זה לא חובה.");
    }

    selectedActions = Array.from(checkboxes).map(cb => ({action: cb.value, category: cb.dataset.category}));

    chosenProfessional = selectedActions.filter(a=>a.category==='professional');
    chosenMental = selectedActions.filter(a=>a.category==='mental');
    chosenCustom = selectedActions.filter(a=>a.category==='custom');

    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
}

function startGame() {
    document.getElementById("start-game-container").classList.add("hidden");
    document.getElementById("game-timer").classList.remove("hidden");
    document.getElementById("actions-title").classList.remove("hidden");
    document.getElementById("notes-container").classList.remove("hidden");
    document.getElementById("game-actions-container").classList.remove("hidden");

    const profContainer = document.getElementById("prof-actions-chosen");
    const mentalContainer = document.getElementById("mental-actions-chosen");
    const customContainer = document.getElementById("custom-actions-chosen");

    profContainer.innerHTML="";
    chosenProfessional.forEach(obj=>{
        profContainer.appendChild(createActionCard(obj.action));
    });

    mentalContainer.innerHTML="";
    chosenMental.forEach(obj=>{
        mentalContainer.appendChild(createActionCard(obj.action));
    });

    customContainer.innerHTML="";
    chosenCustom.forEach(obj=>{
        customContainer.appendChild(createActionCard(obj.action));
    });

    enableActions(true);

    gameMinute=0;
    actions=[];
    notes=[];
    gameFinished=false;

    document.getElementById("minute-counter").textContent=gameMinute;
    if (gameInterval) clearInterval(gameInterval);
    gameInterval=setInterval(()=>{
        gameMinute++;
        document.getElementById("minute-counter").textContent=gameMinute;
    },60000);

    document.getElementById("end-buttons-container").classList.remove("hidden");
}

function createActionCard(actionName) {
    const div = document.createElement("div");
    div.classList.add("action-card");
    const h2 = document.createElement("h2");
    h2.textContent = actionName;
    div.appendChild(h2);
    div.onclick = ()=>{
        openActionPopup(actionName);
    }
    return div;
}

function openActionPopup(actionName) {
    const popup=document.getElementById("action-popup");
    const header=document.getElementById("action-popup-header");
    header.textContent=actionName;
    const textarea=document.getElementById("action-popup-note");
    textarea.value="";

    popup.classList.add("active");

    if(actionPopupTimeout) clearTimeout(actionPopupTimeout);
    actionPopupTimeout=setTimeout(()=>{
        closeActionPopup();
    },4000);
}

function closeActionPopup() {
    const popup=document.getElementById("action-popup");
    popup.classList.remove("active");
    if(actionPopupTimeout) clearTimeout(actionPopupTimeout);
    actionPopupTimeout=null;
}

function userInteractedWithPopup() {
    if (actionPopupTimeout) clearTimeout(actionPopupTimeout);
    actionPopupTimeout=setTimeout(()=>{closeActionPopup();},4000);
}

function chooseActionResult(actionName,result) {
    const note=document.getElementById("action-popup-note").value.trim();
    trackAction(actionName,result);
    if(note) {
        notes.push({text:note, minute:gameMinute});
    }
    closeActionPopup();
}

function trackAction(action,result) {
    if(!gameInterval||gameFinished){
        alert("לא ניתן לרשום פעולה כשהסטופר לא פעיל או כשהמשחק הסתיים!");
        return;
    }
    actions.push({action,result,minute:gameMinute});
    const type=classifyResult(result);
    let message=`הפעולה "${action}" (${result}) נרשמה!`;
    showPopup(message,type);
}

function showPopup(message,type="neutral") {
    const popup=document.getElementById("popup");
    popup.textContent=message;
    popup.classList.remove("hidden","popup-good","popup-bad","popup-neutral");
    if(type==="good") popup.classList.add("popup-good");
    else if(type==="bad") popup.classList.add("popup-bad");
    else popup.classList.add("popup-neutral");

    setTimeout(()=>{
        popup.classList.add("hidden");
    },800);
}

function endHalfTime() {
    if(gameInterval){
        clearInterval(gameInterval);
        gameInterval=null;
    }
    enableActions(false);
    const counts=getActionCounts();
    const halfSummaryContent=document.getElementById("half-summary-content");
    halfSummaryContent.innerHTML=getSummaryHTML(counts,"סיכום המחצית");

    // המלצות למחצית
    const recommendations = giveCoachRecommendations();
    if(recommendations.length>0) {
        halfSummaryContent.innerHTML+= "<h4>המלצות:</h4><ul>" + recommendations.map(r=>"<li>"+r+"</li>").join("")+"</ul>";
    }

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
}

function resumeHalf() {
    const halfPopup=document.getElementById("half-time-summary-popup");
    halfPopup.classList.remove("active");
    halfPopup.classList.add("hidden");

    document.getElementById("end-half").style.display='none';

    gameInterval=setInterval(()=>{
        gameMinute++;
        document.getElementById("minute-counter").textContent=gameMinute;
    },60000);

    enableActions(true);
}

function endGame() {
    if(gameInterval){
        clearInterval(gameInterval);
        gameInterval=null;
    }
    enableActions(false);
    gameFinished=true;

    const minutesPlayed=parseInt(prompt("כמה דקות שיחקת?","60"))||0;
    const score=calculateScore(minutesPlayed);
    const playerName=window.playerNameGlobal||"";
    const teamName=window.teamNameGlobal||"";
    const position=window.playerPositionGlobal||"";
    const today=new Date().toLocaleDateString("he-IL");
    const gameDate=today;

    const summaryContent=document.getElementById("summary-content");
    summaryContent.innerHTML=getSummaryHTML(getActionCounts(),"סיכום המשחק");
    summaryContent.innerHTML+=`<h3 id="final-score">ציון סיום המשחק שלך: ${score}</h3>`;

    const generalNoteDisplay=document.getElementById("general-note-display");
    const parentNotesList=document.getElementById("parent-notes-list");
    parentNotesList.innerHTML="";
    if(notes.length>0) {
        notes.forEach(n=>{
            const li=document.createElement("li");
            li.textContent=`דקה ${n.minute}: ${n.text}`;
            parentNotesList.appendChild(li);
        });
        generalNoteDisplay.classList.remove("hidden");
    } else {
        generalNoteDisplay.classList.add("hidden");
    }

    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");

    setTimeout(()=>{
        showFeedback(score,minutesPlayed);
    },500);

    document.getElementById("notes-container").style.display='none';
    document.getElementById("end-half").style.display='none';
    document.getElementById("end-game").style.display='none';

    document.getElementById("reopen-summary-container").classList.remove("hidden");

    saveGameDataToServer(playerName,teamName,position,gameDate,score,actions,notes);
}

function closePopup() {
    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function reopenSummary() {
    const popup=document.getElementById("game-summary-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function showAllActions() {
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

function closeAllActionsPopup() {
    const actionsDetailPopup=document.getElementById("actions-detail-popup");
    actionsDetailPopup.classList.remove("active");
    actionsDetailPopup.classList.add("hidden");
}

function getActionCounts() {
    return actions.reduce((acc,{action,result})=>{
        const key=`${action}: ${result}`;
        acc[key]=(acc[key]||0)+1;
        return acc;
    },{});
}

function classifyKey(key) {
    let lowerKey=key.toLowerCase();
    if(lowerKey.includes("לא מוצלח")||lowerKey.includes("רעה")||lowerKey.includes("לא טוב")||lowerKey.includes("שלילית")||lowerKey.includes("לא בוצע")||lowerKey.includes("לא נכונה"))
        return "bad";
    if(lowerKey.includes("מוצלח")||lowerKey.includes("טוב")||lowerKey.includes("חיובית")||lowerKey.includes("בוצע")||lowerKey.includes("נכונה")||lowerKey.includes("שער")||lowerKey.includes("למסגרת"))
        return "good";
    return "neutral";
}

function classifyResult(result) {
    let lowerResult=result.toLowerCase();
    if(lowerResult.includes("לא מוצלח")||lowerResult.includes("רעה")||lowerResult.includes("לא טוב")||lowerResult.includes("שלילית")||lowerResult.includes("לא בוצע")||lowerResult.includes("לא נכונה"))
        return "bad";
    if(lowerResult.includes("מוצלח")||lowerResult.includes("טוב")||lowerResult.includes("חיובית")||lowerResult.includes("בוצע")||lowerResult.includes("נכונה")||lowerResult.includes("שער")||lowerResult.includes("למסגרת"))
        return "good";
    return "neutral";
}

function getSummaryHTML(counts,title) {
    const summaryHTML=Object.entries(counts)
    .map(([key,count])=>{
        const className=classifyKey(key);
        return `<p class="${className}">${key}: ${count} פעמים</p>`;
    }).join("");
    return `<h3>${title}:</h3>${summaryHTML}`;
}

function enableActions(enable){
    const allButtons=document.querySelectorAll('#prof-actions-chosen button, #mental-actions-chosen button, #custom-actions-chosen button');
    allButtons.forEach(button=>{
        if(enable){
            button.removeAttribute('disabled');
            button.classList.remove("finished");
        } else {
            button.setAttribute('disabled','disabled');
        }
    });
}

function saveGeneralNote() {
    const note=document.getElementById("general-note-text").value.trim();
    if(note){
        notes.push({text:note,minute:gameMinute});
        closeGeneralNotePopup();
        showPopup("הערה נשמרה!","neutral");
        enableActions(true);
    } else {
        alert("לא הוזנה הערה");
    }
}

function openGeneralNotePopup() {
    document.getElementById("general-note-text").value="";
    const popup=document.getElementById("general-note-popup");
    popup.classList.remove("hidden");
    popup.classList.add("active");
}

function closeGeneralNotePopup() {
    const popup=document.getElementById("general-note-popup");
    popup.classList.remove("active");
    popup.classList.add("hidden");
}

function loadActionsSelection(position) {
    const professionalContainer=document.getElementById("professional-actions");
    const mentalContainer=document.getElementById("mental-actions");
    const customContainer=document.getElementById("custom-actions");

    professionalContainer.innerHTML="";
    mentalContainer.innerHTML="";
    customContainer.innerHTML="";

    const actionsForPosition=positionActions[position]||[];
    actionsForPosition.forEach(act=>{
        const div=document.createElement("div");
        div.classList.add("action-item");

        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.name="selected-actions";
        checkbox.value=act.name;
        checkbox.dataset.category="professional";
        checkbox.style.display='none';
        div.appendChild(checkbox);

        const label=document.createElement("label");
        label.textContent=act.name;
        label.onclick=()=>{
            if(checkbox.checked){
                checkbox.checked=false;
                label.classList.remove("selected");
            } else {
                checkbox.checked=true;
                label.classList.add("selected");
            }
        }
        div.appendChild(label);
        professionalContainer.appendChild(div);
    });

    mentalActions.forEach(action=>{
        const div=document.createElement("div");
        div.classList.add("action-item");
        const checkbox=document.createElement("input");
        checkbox.type="checkbox";
        checkbox.name="selected-actions";
        checkbox.value=action;
        checkbox.dataset.category="mental";
        checkbox.style.display='none';
        div.appendChild(checkbox);

        const label=document.createElement("label");
        label.textContent=action;
        label.onclick=()=>{
            if(checkbox.checked){
                checkbox.checked=false;
                label.classList.remove("selected");
            } else {
                checkbox.checked=true;
                label.classList.add("selected");
            }
        }
        div.appendChild(label);
        mentalContainer.appendChild(div);
    });

    renderCustomActions();
}

function showFeedback(score,minutesPlayed){
    let feedback="";
    let successfulActions=actions.filter(a=>classifyResult(a.result)==="good").length;
    let badActions=actions.filter(a=>classifyResult(a.result)==="bad").length;

    if(score>92) feedback="מעולה פלוס! משחק יוצא דופן!";
    else if(score>85) feedback="מצוין! נתת משחק חזק. המשך לעבוד קשה!";
    else if(score>70) feedback="ביצוע טוב מאוד. שים לב לדייק יותר בחלק מהפעולות.";
    else if(score>55) feedback="עשית עבודה טובה, אך יש מקום לשיפור.";
    else feedback="יש הרבה מקום לשיפור. אל תתייאש, למד ושפר!";

    if(minutesPlayed<30) feedback+=" שיחקת פחות מ-30 דקות, נסה להאריך את משך המשחק.";
    if(actions.length>=4) feedback+=" ביצעת מספר פעולות לא מבוטל - המשך להתמיד!";
    if(successfulActions>5) feedback+=" מעל 5 פעולות מוצלחות - יפה מאוד!";
    if(score<50 && successfulActions>3) feedback+=" למרות הציון הנמוך, ראינו מספר פעולות מוצלחות.";
    if(actions.length>15) feedback+=" ביצעת הרבה פעולות - מראה על נחישות!";

    document.getElementById("feedback-text").textContent=feedback;
    const feedbackPopup=document.getElementById("feedback-popup");
    feedbackPopup.classList.remove("hidden");
}

function closeFeedbackPopup() {
    document.getElementById("feedback-popup").classList.add("hidden");
}

function calculateScore(minutesPlayed){
    let goodCount=actions.filter(a=>classifyResult(a.result)==="good").length;
    let badCount=actions.filter(a=>classifyResult(a.result)==="bad").length;

    let score=goodCount*3 - badCount*2;

    if(actions.length>20) score+=5;
    if(actions.length<5) score-=3;

    if(minutesPlayed<30) score=Math.floor(score*0.9);
    else if(minutesPlayed>60) score=Math.min(score+5,100);

    if(score>100) score=100;
    if(score<0) score=0;

    return score;
}

async function downloadPDF() {
    const elem=document.getElementById("analyst-final-summary-container");
    const canvas=await html2canvas(elem);
    const imgData=canvas.toDataURL('image/png');

    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF('p','pt','a4');
    const imgProps=pdf.getImageProperties(imgData);
    const pdfWidth=pdf.internal.pageSize.getWidth();
    const pdfHeight=(imgProps.height*pdfWidth)/imgProps.width;
    pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
    pdf.save("summary.pdf");
}

function saveGameDataToServer(playerName, teamName, position, gameDate, score, actions, parentNotes) {
    fetch('/save_data',{
        method:'POST',
        headers:{'Content-Type':'application/json'},
        body:JSON.stringify({playerName,teamName,position,gameDate,score,actions,parentNotes})
    }).then(res=>res.json()).then(data=>{
        console.log("Data saved:",data);
    }).catch(err=>console.error(err));
}

function createTeamColorPalette(paletteId,onColorSelect,uniqueId) {
    const paletteDiv=document.getElementById(paletteId);
    if(!paletteDiv)return;
    paletteDiv.innerHTML="";
    paletteColors.forEach(c=>{
        const colorDiv=document.createElement("div");
        colorDiv.style.backgroundColor=colorMap[c];
        colorDiv.title=c;
        colorDiv.onclick=()=>{
            onColorSelect(c);
            // אפור לשאר
            [...paletteDiv.children].forEach(ch=>{
                if(ch!==colorDiv){
                    ch.style.filter="grayscale(100%)";
                    if(ch.querySelector("span")) ch.removeChild(ch.querySelector("span"));
                }
            });
            if(!colorDiv.querySelector("span")){
                const vMark=document.createElement("span");
                vMark.textContent="✓";
                vMark.style.color="#000";
                vMark.style.fontWeight="bold";
                vMark.style.fontSize="20px";
                colorDiv.appendChild(vMark);
            }
            // הוסף כפתור "שנה צבע" אם אין
            if(!document.getElementById(uniqueId+"-reset")){
                const resetBtn=document.createElement("button");
                resetBtn.id=uniqueId+"-reset";
                resetBtn.textContent="שנה צבע";
                resetBtn.classList.add("blue-btn");
                resetBtn.onclick=()=>{
                    [...paletteDiv.children].forEach(ch=>{
                        ch.style.filter="none";
                        if(ch.querySelector("span")) ch.removeChild(ch.querySelector("span"));
                    });
                    if(document.getElementById(uniqueId+"-reset")){
                        document.getElementById(uniqueId+"-reset").remove();
                    }
                };
                paletteDiv.parentNode.appendChild(resetBtn);
            }
        };
        paletteDiv.appendChild(colorDiv);
    });
}

function setTeamMood(mood) {
    teamMood=mood;
}

function addQuickNote() {
    const inp=document.getElementById('quick-note-input');
    const val=inp.value.trim();
    if(!val)return;
    quickNotes.push(val);
    inp.value="";
    renderQuickNotes();
}

function renderQuickNotes() {
    const list=document.getElementById('quick-notes-list');
    list.innerHTML="";
    quickNotes.forEach(note=>{
        const p=document.createElement('p');
        p.textContent=note;
        list.appendChild(p);
    });
}

function dragStart(e) {
    e.dataTransfer.setData("text","");
    draggedElement = e.target;
}
let draggedElement=null;
function dragOver(e) {e.preventDefault();}
function drop(e) {
    e.preventDefault();
    const rect=e.currentTarget.getBoundingClientRect();
    const x=e.clientX - rect.left;
    const y=e.clientY - rect.top;
    if(draggedElement){
        draggedElement.style.top=(y-12)+"px";
        draggedElement.style.left=(x-12)+"px";
        draggedElement=null;
    }
}

function captureTacticalBoard(){
    const field=document.getElementById('tactical-field');
    html2canvas(field).then(canvas=>{
        const imgData=canvas.toDataURL('image/png');
        const link=document.createElement('a');
        link.href=imgData;
        link.download="tactical_plan.png";
        link.click();
    });
}

const field=document.getElementById('tactical-field');
if(field) {
    field.addEventListener('dragover',dragOver);
    field.addEventListener('drop',drop);
}

function giveCoachRecommendations() {
    let counts=getActionCounts();
    let goodCount=0;let badCount=0;
    Object.entries(counts).forEach(([key,count])=>{
        if(classifyKey(key)==="good") goodCount+=count;
        else if(classifyKey(key)==="bad") badCount+=count;
    });

    const rec=[];

    if(badCount>goodCount) {
        rec.push("הקבוצה מתקשה. נסה לחזק את המורל או לשנות מערך.");
    } else {
        rec.push("ביצוע טוב עד כה. אפשר לשקול להגביר לחץ באגף בו אנחנו מצליחים.");
    }

    if(teamMood==="חוסר ריכוז") {
        rec.push("מורגש חוסר ריכוז - מומלץ להפנות תשומת לב בשיחה קצרה בהפסקה.");
    }

    return rec;
}

// פונקציות למאמן - מטרות לחוליות
function submitCoachGameInfo() {
    coachTeamAName=document.getElementById("coach-teamA").value.trim()||"קבוצה א'";
    coachTeamBName=document.getElementById("coach-teamB").value.trim()||"קבוצה ב'";
    coachGameDate=document.getElementById("coach-game-date").value||new Date().toISOString().split('T')[0];

    document.getElementById("coach-game-info-container").classList.add("hidden");
    document.getElementById("coach-setup-container").classList.remove("hidden");

    // הצגת מטרות מומלצות
    loadCoachGoals("goal-keeper",coachHooliaGoals["goal-keeper"]);
    loadCoachGoals("defense",coachHooliaGoals["defense"]);
    loadCoachGoals("midfield",coachHooliaGoals["midfield"]);
    loadCoachGoals("attack",coachHooliaGoals["attack"]);
}

function loadCoachGoals(hoolia,arr) {
    const div=document.getElementById("coach-"+hoolia);
    if(!div)return;
    div.innerHTML="";
    arr.forEach(g=>{
        const chk=document.createElement("input");
        chk.type="checkbox";
        chk.value=g;
        chk.style.display='none';
        const label=document.createElement("label");
        label.textContent=g;
        label.onclick=()=>{
            if(chk.checked){
                chk.checked=false;label.classList.remove("selected");
            } else {
                chk.checked=true;label.classList.add("selected");
            }
        }
        const cont=document.createElement("div");
        cont.classList.add("action-item");
        cont.appendChild(chk);
        cont.appendChild(label);
        div.appendChild(cont);
    });
}

function addCoachGoal(hoolia) {
    const inp=document.getElementById("coach-"+hoolia+"-custom");
    const val=inp.value.trim();
    if(!val)return;
    const div=document.getElementById("coach-"+hoolia);
    const chk=document.createElement("input");
    chk.type="checkbox";
    chk.value=val;
    chk.style.display='none';
    const label=document.createElement("label");
    label.textContent=val;
    label.onclick=()=>{
        if(chk.checked){chk.checked=false;label.classList.remove("selected");
        } else {chk.checked=true;label.classList.add("selected");}
    }
    const cont=document.createElement("div");
    cont.classList.add("action-item");
    cont.appendChild(chk);
    cont.appendChild(label);
    div.appendChild(cont);
    inp.value="";
}

function submitCoachSetup() {
    document.getElementById("coach-setup-container").classList.add("hidden");
    document.getElementById("coach-actions-container").classList.remove("hidden");
    // כאן נוכל להציג את כל המטרות שנבחרו עבור כל חוליה בצורה מרוכזת (בדומה לשחקן)
    // לפשטות, נעשה כמו שעשינו לשחקן
    loadCoachChosenGoals();
}

function loadCoachChosenGoals() {
    const container=document.getElementById("coach-players-actions");
    container.innerHTML="";

    function getChosen(hoolia) {
        const div=document.getElementById("coach-"+hoolia);
        const checks=div.querySelectorAll('input[type=checkbox]');
        return [...checks].filter(ch=>ch.checked).map(ch=>ch.value);
    }

    let allGoals={
        "שוער":getChosen("goal-keeper"),
        "הגנה":getChosen("defense"),
        "קישור":getChosen("midfield"),
        "התקפה":getChosen("attack")
    };

    for(const [hooliaName,goalsArr] of Object.entries(allGoals)) {
        if(goalsArr.length>0) {
            const h4=document.createElement("h4");
            h4.textContent=hooliaName;
            container.appendChild(h4);
            goalsArr.forEach(g=>{
                const div=document.createElement("div");
                div.classList.add("action-item");
                const chk=document.createElement("input");
                chk.type='checkbox';
                chk.value=g;
                chk.style.display='none';
                const label=document.createElement("label");
                label.textContent=g;
                label.onclick=()=>{
                    if(chk.checked){chk.checked=false;label.classList.remove("selected");}
                    else {chk.checked=true;label.classList.add("selected");}
                }
                div.appendChild(chk);
                div.appendChild(label);
                container.appendChild(div);
            });
        }
    }
}

function submitCoachActions() {
    document.getElementById("coach-actions-container").classList.add("hidden");
    document.getElementById("coach-marking-container").classList.remove("hidden");
    // כאן נוכל להציג כרטיסים (action-card) עבור כל מטרה שנבחרה.
    const container=document.getElementById("coach-marking-players");
    container.innerHTML="";
    const checks=document.querySelectorAll('#coach-players-actions input[type=checkbox]');
    [...checks].forEach(ch=>{
        if(ch.checked){
            container.appendChild(createActionCard(ch.value));
        }
    });
}

function finishCoachGame() {
    document.getElementById("coach-marking-container").classList.add("hidden");
    document.getElementById("coach-final-summary-container").classList.remove("hidden");
    // כאן נציג סיכום וניתן להוריד כ-PDF
    const cfd=document.getElementById("coach-final-data");
    cfd.innerHTML=`<p>תאריך המשחק: ${coachGameDate}<br>קבוצה א': ${coachTeamAName} (${coachTeamAColor})<br>קבוצה ב': ${coachTeamBName} (${coachTeamBColor})<br>מצב רוח: ${teamMood}<br>פתקים:<br>${quickNotes.join(', ')}</p>`;
    // אפשר להרחיב עם ניתוח פעולות כמו בשחקן
}

async function downloadPDFCoach() {
    const elem=document.getElementById("coach-final-summary-container");
    const canvas=await html2canvas(elem);
    const imgData=canvas.toDataURL('image/png');
    const {jsPDF}=window.jspdf;
    const pdf=new jsPDF('p','pt','a4');
    const pdfWidth=pdf.internal.pageSize.getWidth();
    const imgProps=pdf.getImageProperties(imgData);
    const pdfHeight=(imgProps.height*pdfWidth)/imgProps.width;
    pdf.addImage(imgData,'PNG',0,0,pdfWidth,pdfHeight);
    pdf.save("coach_summary.pdf");
}

function userInteractedWithPopup(){/* כבר מוגדר */}

function chooseActionResult(actionName,result){/* כבר מוגדר */}

function openGeneralNotePopup(){/* כבר מוגדר */}
function closeGeneralNotePopup(){/* כבר מוגדר */}
function saveGeneralNote(){/* כבר מוגדר */}

function giveCoachRecommendations(){/* כבר מוגדר */}

function calculateScore(minutesPlayed){/* כבר מוגדר */}

function trackAction(action,result){/* כבר מוגדר */}

function showPopup(message,type="neutral"){/* כבר מוגדר */}

function closePopup(){/* כבר מוגדר */}

function reopenSummary(){/* כבר מוגדר */}

function endHalfTime(){/* כבר מוגדר */}
function resumeHalf(){/* כבר מוגדר */}
function endGame(){/* כבר מוגדר */}

function showAllActions(){/* כבר מוגדר */}
function closeAllActionsPopup(){/* כבר מוגדר */}

function enableActions(enable){/* כבר מוגדר */}
