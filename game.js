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

document.addEventListener("keydown", moveUp);

function moveUp() {
    yPos -= 25;
}

const pipe = [];

pipe[0] = {
    x : cvs.width,
    y : 0
};

let xPos = 10;
let yPos = 150;
const gravity = 1;

function draw() {
    ctx.drawImage(bg, 0, 0);

    for(let i = 0;i < pipe.length;i++)
    {
        ctx.drawImage(pipeUp, pipe[i].x, pipe[i].y);
        ctx.drawImage(pipeDown, pipe[i].x, pipe[i].y + pipeUp.height + gap);

        pipe[i].x--; 
        
        if(pipe[i].x == 125)
        {
            pipe.push({
                x : cvs.width,
                y : Math.floor(Math.random() * pipeUp.height) - pipeUp.height
            });
        }
    }

    ctx.drawImage(fg, 0, cvs.height - fg.height);
    ctx.drawImage(bird, xPos, yPos);

    yPos += gravity;
    requestAnimationFrame(draw);
}

pipeDown.onload = draw;