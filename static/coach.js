const availableColors = ["red", "blue", "green", "yellow", "orange", "white", "black"];

document.addEventListener('DOMContentLoaded', () => {
    createColorPalette("coach-teamA-color-palette", (color) => {
        console.log(`צבע קבוצה א': ${color}`);
    });
    createColorPalette("coach-teamB-color-palette", (color) => {
        console.log(`צבע קבוצה ב': ${color}`);
    });
});

function createColorPalette(containerId, onSelect) {
    const container = document.getElementById(containerId);
    container.innerHTML = "";
    availableColors.forEach(c => {
        const div = document.createElement('div');
        div.style.backgroundColor = c;
        div.style.width = "30px";
        div.style.height = "30px";
        div.style.borderRadius = "50%";
        div.style.cursor = "pointer";
        div.style.margin = "5px";
        div.onclick = () => onSelect(c);
        container.appendChild(div);
    });
}

function submitCoachGameInfo() {
    const teamA = document.getElementById("coach-teamA").value;
    const teamB = document.getElementById("coach-teamB").value;
    const date = document.getElementById("coach-game-date").value;

    if (!teamA || !teamB || !date) {
        alert("אנא מלא את כל הפרטים");
        return;
    }

    alert(`משחק הוגדר בהצלחה: ${teamA} מול ${teamB} בתאריך ${date}`);
}
