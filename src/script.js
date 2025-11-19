let score = 0;
let scoreProduction = 1;
let upgradeArray = [];


const scoreElement = document.getElementById("score");
const clickButton = document.getElementById("click-button");
const passiveProduction = document.getElementById("passiveProduction");

clickButton.addEventListener("click", () => {
    score += scoreIncrement;
    scoreElement.textContent = score;
});

setInterval(() => {
    score += scoreProduction
    scoreElement.textContent = score;
}, 1000);


let scoreIncrement = 1;


const mouseBaseIncrement = 0.5;
let mouseCount = 0;
let mouseIncrement = 0;
let mouseCost = 15;

if (score >= mouseCost){
    
}