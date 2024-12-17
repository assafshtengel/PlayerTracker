let actions = [];
let customActionsArr = [];

function selectRole(role) {
    document.getElementById("main-page").classList.add("hidden");
    document.getElementById("user-input-container").classList.remove("hidden");
}

function submitUserInfo() {
    const playerName = document.getElementById("player-name").value.trim();
    const teamName = document.getElementById("team-name").value.trim();
    const position = document.getElementById("player-position").value;

    if (!playerName || !teamName || !position) {
        alert("אנא מלא את כל השדות");
        return;
    }

    document.getElementById("user-input-container").classList.add("hidden");
    document.getElementById("actions-selection-container").classList.remove("hidden");
    loadActionsSelection();
}

function loadActionsSelection() {
    const container = document.getElementById("professional-actions");
    ["תיקולים מוצלחים", "לחץ על חלוץ", "מסירת מפתח"].forEach(action => {
        container.appendChild(createActionSelectable(action));
    });
}

function createActionSelectable(action) {
    const div = document.createElement("div");
    div.classList.add("action-toggle", "selected-action");
    div.textContent = action;
    actions.push({ action, result: "מוצלח" });
    return div;
}

function addCustomAction() {
    const input = document.getElementById("custom-action-input");
    const val = input.value.trim();

    if (!val) {
        alert("אנא כתוב שם פעולה");
        return;
    }

    const container = document.getElementById("professional-actions");
    const newAction = createActionSelectable(val);
    container.appendChild(newAction);
    input.value = "";
}
