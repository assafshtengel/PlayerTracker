let actions = [];
let selectedActions = [];
let customActionsArr = [];

function selectRole(role) {
    document.getElementById("main-page").classList.add("hidden");
    document.getElementById("actions-selection-container").classList.remove("hidden");
    loadActionsSelection();
}

function loadActionsSelection() {
    const container = document.getElementById("professional-actions");
    ["תיקולים מוצלחים", "לחץ על חלוץ"].forEach(action => {
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
    if (!val) return alert("אנא כתוב שם פעולה");

    const container = document.getElementById("custom-actions");
    const newAction = createActionSelectable(val);
    container.appendChild(newAction);
    input.value = "";
}

document.querySelectorAll('.color-option').forEach(option => {
    option.addEventListener('click', () => {
        document.querySelectorAll('.color-option').forEach(o => o.classList.remove('selected'));
        option.classList.add('selected');
    });
});
