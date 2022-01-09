'use strict';

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

const gap = 90;

let xPos = 10;
let yPos = 150;
const gravity = 1;

function draw() {
    ctx.drawImage(bg, 0, 0);
    ctx.drawImage(pipeUp, 100, 0);
    ctx.drawImage(pipeDown, 100, 0 + pipeUp.height + gap);
    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    yPos += gravity;
    requestAnimationFrame(draw);
}

pipeDown.onload = draw;