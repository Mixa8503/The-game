'use strict';

let gap = 90;
let movingPipeChance = 0.15;
let gameOver = false;
let jumpSpeed = 0;
const jumpPower = 3.5;
const gravity = 0.25;
let rockOpacity = 1;

const cvs = document.getElementById("canvas");
const ctx = cvs.getContext("2d");

const bird = new Image();
const bg = new Image();
const fg = new Image();
const pipeUp = new Image();
const pipeDown = new Image();
const rockImage = new Image();
const rockAudio = new Audio();

bird.src = "img/bird.png";
bg.src = "img/bg.png";
fg.src = "img/fg.png";
pipeUp.src = "img/pipeUp.png";
pipeDown.src = "img/pipeDown.png";
rockImage.src = "img/rock.png";
rockAudio.src = "audio/rock.mp3";

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
let score = 0;

document.addEventListener("keydown", function(event) {
    if (event.code === "Escape" && gameOver) {
        showMenu();
    } else if (event.code === "KeyY") {
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
        gap = 75;
        movingPipeChance = 0.40;
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
    jumpSpeed = 0;
    rockOpacity = 0;
    draw();
}

function moveUp() {
    jumpSpeed = jumpPower;
    fly_audio.play();
}

function quitGame() {
    window.close();
}

function showMenu() {
    document.getElementById('menu').style.display = 'block';
    cvs.style.display = 'none';
    gameOver = false;
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
  ctx.clearRect(0, 0, canvas.width, canvas.height);
    animateRockImage();
    setTimeout(showGameOver, 4000);
    gameOver = true;
}

function animateRockImage() {
    let start = null;
    const fadeInDuration = 1800;
    const fadeOutStart = fadeInDuration;
    const totalDuration = fadeInDuration * 2;

    function step(timestamp) {
        if (!start) start = timestamp;
        const elapsed = timestamp - start;

        if (elapsed < fadeInDuration) {
            rockOpacity = elapsed / fadeInDuration;
        } else if (elapsed < totalDuration) {
            rockOpacity = 1 - (elapsed - fadeOutStart) / fadeInDuration;
        } else {
            rockOpacity = 0;
            return;
        }
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.globalAlpha = rockOpacity;
      ctx.drawImage(rockImage, 0, 0);
        requestAnimationFrame(step);
    }

    requestAnimationFrame(step);
    rockAudio.play();
}

function showGameOver() {
  ctx.globalAlpha = 1;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.drawImage(bg, 0, 0);
    ctx.fillStyle = "#000";
    ctx.font = "40px Arial";
    ctx.fillText("Game Over", cvs.width / 2 - 100, cvs.height / 2 - 20);
    ctx.font = "20px Arial";
    ctx.fillText("Score: " + score, cvs.width / 2 - 50, cvs.height / 2 + 20);
    ctx.fillText("Press Y to restart", cvs.width / 2 - 100, cvs.height / 2 + 50);
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
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.drawImage(bg, 0, 0);
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

    yPos -= jumpSpeed;
    jumpSpeed -= gravity;

    if (yPos < 0) yPos = 0;

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    if (!gameOver) {
        ctx.fillStyle = "#000";
        ctx.font = "20px Arial";
        ctx.fillText("Score: " + score, 10, cvs.height - 20);
        requestAnimationFrame(draw);
    }

}