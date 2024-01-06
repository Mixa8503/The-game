'use strict';

let gap = 90;
let movingPipeChance = 0.15;
let gameOver = false;

const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeDown = new Image();

bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeDown.src = "img/pipeDown.png";

const fly_audio = new Audio();
const score_audio = new Audio();
const score10_audio = new Audio();
const game_over_audio = new Audio();

fly_audio.src = "audio/fly.mp3";
score_audio.src = "audio/score.mp3";
score10_audio.src = "audio/score_audio_10.mp3";
game_over_audio.src = "audio/game_over.mp3";

let xPos = 10;
let yPos = 150;
const gravity = 1.5;
let score = 0;

document.addEventListener("keydown", function(event) {
    if (event.code === "KeyY") {
        if (gameOver) {
            resetGame();
        }
    } else {
        moveUp();
    }
});

function startGame(difficulty) {
    document.getElementById('menu').style.display = 'none';
    cvs.style.display = 'block';

    if (difficulty === 'hard') {
        gap = 80;
        movingPipeChance = 0.5;
    } else {
        gap = 90;
        movingPipeChance = 0.15;
    }

    resetGame();
}

function resetGame() {
    gameOver = false;
    pipe.length = 0;
    pipe[0] = {
        x: cvs.width,
        y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
        moving: Math.random() < movingPipeChance,
        originalY: 0,
        moveRange: 30,
        speed: 1
    };
    score = 0;
    xPos = 10;
    yPos = 150;
    draw();
}

function moveUp() {
    yPos -= 25;
    fly_audio.play();
}

const pipe = [];
pipe[0] = {
    x: cvs.width,
    y: Math.floor(Math.random() * pipeUp.height) - pipeUp.height,
    moving: Math.random() < movingPipeChance,
    originalY: 0,
    moveRange: 30,
    speed: 1
};

function showGameOverScreen() {
    game_over_audio.play();
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", cvs.width / 2 - 100, cvs.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, cvs.width / 2 - 50, cvs.height / 2 + 20);
    ctx.fillText("Press Y to restart", cvs.width / 2 - 100, cvs.height / 2 + 50);
    gameOver = true;
}

function draw() {
    ctx.drawImage(bg, 0, 0);

    for (let i = 0; i < pipe.length; i++) {
        if (pipe[i].moving) {
            pipe[i].originalY = pipe[i].originalY || pipe[i].y;
            pipe[i].y += pipe[i].speed;

            if (pipe[i].y >= pipe[i].originalY + pipe[i].moveRange || pipe[i].y <= pipe[i].originalY - pipe[i].moveRange) {
                pipe[i].speed *= -1;
            }
        }

        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

        pipe[i].x--;

        if (pipe[i].x === 125) {
            let newY = Math.floor(Math.random() * pipeUp.height) - pipeUp.height;
            pipe.push({
                x: cvs.width,
                y: newY,
                moving: Math.random() < movingPipeChance,
                originalY: newY,
                moveRange: 30,
                speed: 1
            });
        }

        if ((xPos + bird.width >= pipe[i].x
            && xPos <= pipe[i].x + pipeUp.width
            && (yPos <= pipe[i].y + pipeUp.height
            || yPos + bird.height >= pipe[i].y + pipeUp.height + gap))
            || yPos + bird.height >= cvs.height - fg.height) {
            showGameOverScreen();
            return;
        }

        if (pipe[i].x === 5) {
            score++;
            score_audio.play();

            if (score === 10) {
                score10_audio.play();
            }
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    yPos += gravity;

    ctx.fillStyle = "#000";
    ctx.font = "25px Arial";
    ctx.fillText("Score: " + score, 10, cvs.height - 20);

    if (!gameOver) {
        requestAnimationFrame(draw);
    }
}
