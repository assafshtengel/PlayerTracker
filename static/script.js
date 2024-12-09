let actions = [];
let selectedActions = [];
let gameInterval = null;
let gameMinute = 0;

// פעולות מקצועיות - נוסיף לכל תפקיד גם "ביצוע 1 על 1", "מסירת מפתח", "הגבהה לרחבה"
const positionActions = {
    "שוער": [
        "עצירת כדור קשה",
        "יציאה לאגרוף",
        "משחק רגל מדויק",
        "שליטה ברחבה",
        "תקשורת עם ההגנה",
        "יציאה לכדורי גובה",
        "מסירה ארוכה מדויקת",
        "סגירת זויות בעיטות",
        "תגובות מהירות",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "בלם": [
        "בלימת התקפה יריבה",
        "משחק ראש מוצלח",
        "סגירת תוקף",
        "חטיפת כדור",
        "הנעת כדור אחורה בבטחה",
        "משחק רוחב מדויק",
        "סגירת קווי מסירה",
        "הגנה על הרחבה",
        "הובלת הכדור קדימה",
        "החזרת כדור לשוער",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "מגן": [
        "הגבהה מדויקת לרחבה",
        "תמיכה בהתקפה באגף",
        "כיסוי הגנתי באגף",
        "תקשורת עם הקשר",
        "ריצה לאורך הקו",
        "קרוס מדויק",
        "חטיפת כדור באגף",
        "מעבר מהיר להתקפה",
        "משחק רוחב בטוח",
        "שמירה על חלוץ יריב",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "קשר": [
        "מסירה חכמה קדימה",
        "שמירה על קצב המשחק",
        "חטיפת כדור במרכז",
        "משחק קצר מדויק",
        "שליחת כדור לעומק",
        "שליטה בקישור",
        "החלפת אגף",
        "תמיכה בהגנה",
        "ארגון ההתקפה",
        "ראיית משחק רחבה",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "חלוץ": [
        "בעיטה למסגרת",
        "תנועה ללא כדור",
        "קבלת כדור תחת לחץ",
        "סיום מצבים",
        "נוכחות ברחבה",
        "ניצול הזדמנויות",
        "תקשורת עם הקשרים",
        "לחץ על ההגנה היריבה",
        "נגיחה למסגרת",
        "שמירה על הכדור מול הגנה",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ],
    "כנף": [
        "עקיפת מגן באגף",
        "הגבהה איכותית",
        "ריצה מהירה בקו",
        "חדירה לרחבה מהאגף",
        "משחק עומק",
        "קידום הכדור קדימה",
        "יצירת יתרון מספרי",
        "משחק רוחב לשינוי אגף",
        "הפתעת ההגנה בתנועה",
        "השגת פינות",
        "ביצוע 1 על 1",
        "מסירת מפתח",
        "הגבהה לרחבה"
    ]
};

// פעולות מנטאליות + הורדת ראש, הרמת ראש
const mentalActions = [
    "שמירה על ריכוז",
    "התמודדות עם לחץ",
    "תקשורת חיובית עם חברי הקבוצה",
    "אמונה עצמית",
    "ניהול רגשות",
    "קבלת החלטות מהירה",
    "התמדה במאמץ",
    "מנהיגות חיובית",
    "יצירת מוטיבציה",
    "התמודדות עם טעויות",
    "הורדת ראש",
    "הרמת ראש"
];

function trackAction(action, result) {
    if (!gameInterval) {
        alert("לא ניתן לרשום פעולה כאשר הסטופר לא פעיל!");
        return;
    }
    actions.push({ action, result, minute: gameMinute });
    showPopup(`הפעולה "${action} - ${result}" נרשמה!`);
}

function showPopup(message) {
    const popup = document.getElementById("popup");
    popup.textContent = message;
    popup.classList.remove("hidden");
    setTimeout(() => {
        popup.classList.add("hidden");
    }, 1000);
}

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const playerPosition = document.getElementById("player-position").value;

    if (!playerName || !teamName || !playerPosition) {
        alert("אנא מלא את כל השדות (כולל תפקיד)");
        return;
    }

    document.getElementById("player-display").textContent = playerName;
    document.getElementById("team-display").textContent = teamName;

    const today = new Date().toLocaleDateString("he-IL");
    document.getElementById("game-date").textContent = today;
    document.getElementById("player-position-display").textContent = playerPosition;

    document.getElementById("user-input-container").classList.add("hidden");
    document.getElementById("game-info").classList.remove("hidden");

    loadActionsSelection(playerPosition);
}

function loadActionsSelection(position) {
    const actionsContainer = document.getElementById("actions-selection-container");
    const professionalContainer = document.getElementById("professional-actions");
    const mentalContainer = document.getElementById("mental-actions");

    professionalContainer.innerHTML = "";
    mentalContainer.innerHTML = "";

    const actionsForPosition = positionActions[position] || [];

    // יצירת רשימת פעולות מקצועיות
    actionsForPosition.forEach((action, index) => {
        const actionId = `prof-action-${index}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = actionId;
        checkbox.value = action;
        checkbox.name = "selected-actions";

        const label = document.createElement("label");
        label.htmlFor = actionId;
        label.textContent = action;

        const div = document.createElement("div");
        div.classList.add("action-item");
        div.appendChild(checkbox);
        div.appendChild(label);

        professionalContainer.appendChild(div);
    });

    // יצירת רשימת פעולות מנטאליות
    mentalActions.forEach((action, index) => {
        const actionId = `mental-action-${index}`;
        const checkbox = document.createElement("input");
        checkbox.type = "checkbox";
        checkbox.id = actionId;
        checkbox.value = action;
        checkbox.name = "selected-actions";

        const label = document.createElement("label");
        label.htmlFor = actionId;
        label.textContent = action;

        const div = document.createElement("div");
        div.classList.add("action-item");
        div.appendChild(checkbox);
        div.appendChild(label);

        mentalContainer.appendChild(div);
    });

    actionsContainer.classList.remove("hidden");
}

function confirmActions() {
    const checkboxes = document.querySelectorAll('input[name="selected-actions"]:checked');
    if (checkboxes.length < 6 || checkboxes.length > 10) {
        alert("אנא בחר בין 6 ל-10 פעולות.");
        return;
    }

    selectedActions = Array.from(checkboxes).map(cb => cb.value);

    document.getElementById("actions-selection-container").classList.add("hidden");
    document.getElementById("start-game-container").classList.remove("hidden");
}

function startGame() {
    const startGameButton = document.getElementById("start-game-container");
    startGameButton.classList.add("hidden");

    const timer = document.getElementById("game-timer");
    timer.classList.remove("hidden");

    const actionsTitle = document.getElementById("actions-title");
    const actionsContainer = document.getElementById("actions-container");
    actionsTitle.classList.remove("hidden");
    actionsContainer.classList.remove("hidden");

    // יצירת כפתורי הפעולות הנבחרות בלבד
    actionsContainer.innerHTML = "";
    selectedActions.forEach(action => {
        const div = document.createElement("div");
        div.classList.add("action-group");

        const goodBtn = document.createElement("button");
        goodBtn.textContent = "V";
        goodBtn.style.backgroundColor = "#4CAF50";
        goodBtn.style.width = "50px";
        goodBtn.style.fontSize = "20px";
        goodBtn.onclick = () => trackAction(action, "מוצלח");

        const badBtn = document.createElement("button");
        badBtn.textContent = "X";
        badBtn.style.backgroundColor = "#f44336";
        badBtn.style.width = "50px";
        badBtn.style.fontSize = "20px";
        badBtn.onclick = () => trackAction(action, "לא מוצלח");

        const h2 = document.createElement("h2");
        h2.textContent = action;

        div.appendChild(
