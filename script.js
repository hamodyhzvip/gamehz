// script.js
const canvas = document.getElementById('gameCanvas');
const ctx = canvas.getContext('2d');
const playButton = document.getElementById('play-button');
const againButton = document.getElementById('again-button');
const leftButton = document.getElementById('left-button');
const rightButton = document.getElementById('right-button');
let gameOverText = document.createElement('div');
gameOverText.id = 'game-over';
gameOverText.innerText = 'Game Over';
document.getElementById('container').appendChild(gameOverText);

let ballX, ballY, ballDX, ballDY, ballRadius, paddleHeight, paddleWidth, paddleX;
let score = 0;
let level = 1;
let bricks = [];
const brickRowCount = 5;
const brickColumnCount = 7;
const brickWidth = 70; 
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

canvas.width = 800; // زيادة عرض اللوحة
canvas.height = 600; // زيادة ارتفاع اللوحة

function initGame() {
    ballX = canvas.width / 2;
    ballY = canvas.height - 30;
    ballDX = 2 + level; 
    ballDY = -2 - level; 
    ballRadius = 10;
    paddleHeight = 10;
    paddleWidth = 150; 
    paddleX = (canvas.width - paddleWidth) / 2;
    score = 0;
    gameOverText.style.display = 'none';
    againButton.style.display = 'none';
    leftButton.disabled = false; // تمكين الأزرار
    rightButton.disabled = false; // تمكين الأزرار
    createBricks();
}

function createBricks() {
    bricks = []; 
    for (let c = 0; c < brickColumnCount; c++) {
        bricks[c] = [];
        for (let r = 0; r < brickRowCount; r++) {
            bricks[c][r] = { x: 0, y: 0, status: 1 };
        }
    }
}

playButton.addEventListener('click', () => {
    canvas.style.display = 'block';
    playButton.style.display = 'none';
    initGame();
    draw();
});

againButton.addEventListener('click', () => {
    level++; 
    initGame();
    draw();
});

leftButton.addEventListener('click', () => {
    movePaddle(-20); // تحريك اللوح لليسار
});

rightButton.addEventListener('click', () => {
    movePaddle(20); // تحريك اللوح لليمين
});

function movePaddle(direction) {
    paddleX += direction;
    if (paddleX < 0) paddleX = 0; // لمنع اللوح من الخروج عن الحدود
    if (paddleX + paddleWidth > canvas.width) paddleX = canvas.width - paddleWidth; // لمنع اللوح من الخروج عن الحدود
}

function drawBall() {
    ctx.beginPath();
    ctx.arc(ballX, ballY, ballRadius, 0, Math.PI * 2);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawPaddle() {
    ctx.beginPath();
    ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
    ctx.fillStyle = "#0095DD";
    ctx.fill();
    ctx.closePath();
}

function drawBricks() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            if (bricks[c][r].status === 1) {
                const brickX = c * (brickWidth + brickPadding) + brickOffsetLeft;
                const brickY = r * (brickHeight + brickPadding) + brickOffsetTop;
                bricks[c][r].x = brickX;
                bricks[c][r].y = brickY;
                ctx.beginPath();
                ctx.rect(brickX, brickY, brickWidth, brickHeight);
                ctx.fillStyle = getRandomColor();
                ctx.fill();
                ctx.closePath();
            }
        }
    }
}

function drawScore() {
    ctx.font = "16px Arial";
    ctx.fillStyle = "#0095DD";
    ctx.fillText("Score: " + score, 8, 20);
}

function collisionDetection() {
    for (let c = 0; c < brickColumnCount; c++) {
        for (let r = 0; r < brickRowCount; r++) {
            const b = bricks[c][r];
            if (b.status === 1) {
                if (ballX > b.x && ballX < b.x + brickWidth && ballY > b.y && ballY < b.y + brickHeight) {
                    ballDY = -ballDY;
                    b.status = 0;
                    score++;
                    if (score === brickRowCount * brickColumnCount) {
                        alert("YOU WIN, CONGRATULATIONS!");
                        againButton.style.display = 'block'; // عرض زر "Again"
                        return; 
                    }
                }
            }
        }
    }
}

function draw() {
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    drawBricks();
    drawBall();
    drawPaddle();
    drawScore();
    collisionDetection();

    if (ballX + ballDX > canvas.width - ballRadius || ballX + ballDX < ballRadius) {
        ballDX = -ballDX;
    }

    if (ballY + ballDY < ballRadius) {
        ballDY = -ballDY;
    } else if (ballY + ballDY > canvas.height - ballRadius) {
        if (ballX > paddleX && ballX < paddleX + paddleWidth) {
            ballDY = -ballDY;
        } else {
            gameOver();
            return;
        }
    }

    ballX += ballDX;
    ballY += ballDY;
    requestAnimationFrame(draw);
}

function gameOver() {
    gameOverText.style.display = 'block';
    againButton.style.display = 'block'; 
    leftButton.disabled = true; // تعطيل الأزرار عند الخسارة
    rightButton.disabled = true; // تعطيل الأزرار عند الخسارة
    setTimeout(() => {
        canvas.style.display = 'none';
        playButton.style.display = 'block';
    }, 1000);
}

function getRandomColor() {
    const letters = '0123456789ABCDEF';
    let color = '#';
    for (let i = 0; i < 6; i++) {
        color += letters[Math.floor(Math.random() * 16)];
    }
    return color;
}
