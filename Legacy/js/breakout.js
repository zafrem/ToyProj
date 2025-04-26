const canvas = document.getElementById("gameCanvas");
const ctx = canvas.getContext("2d");

let ballRadius = 10;
let x = canvas.width / 2;
let y = canvas.height - 30;
let dx = 3;
let dy = -3;

const paddleHeight = 10;
const paddleWidth = 75;
let paddleX = (canvas.width - paddleWidth) / 2;
let rightPressed = false;
let leftPressed = false;

let brickRowCount = window.innerWidth < 600 ? 4 : 6; // 모바일이면 4줄
let brickColumnCount = 8
const brickWidth = 75;
const brickHeight = 20;
const brickPadding = 10;
const brickOffsetTop = 30;
const brickOffsetLeft = 30;

let bricks = [];
let lives = 3;
let isGameOver = false;

for (let c = 0; c < brickColumnCount; c++) {
  bricks[c] = [];
  for (let r = 0; r < brickRowCount; r++) {
    bricks[c][r] = { x: 0, y: 0, status: 1 };
  }
}

document.addEventListener("keydown", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = true;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = true;
});
document.addEventListener("keyup", e => {
  if (e.key === "Right" || e.key === "ArrowRight") rightPressed = false;
  else if (e.key === "Left" || e.key === "ArrowLeft") leftPressed = false;
});

function drawBall() {
  ctx.beginPath();
  ctx.arc(x, y, ballRadius, 0, Math.PI * 2);
  ctx.fillStyle = "#1976d2";
  ctx.fill();
  ctx.closePath();
}

function drawPaddle() {
  ctx.beginPath();
  ctx.rect(paddleX, canvas.height - paddleHeight, paddleWidth, paddleHeight);
  ctx.fillStyle = "#1976d2";
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
        ctx.fillStyle = "red";
        ctx.fill();
        ctx.closePath();
      }
    }
  }
}

function drawLives() {
  ctx.font = "16px Arial";
  ctx.fillStyle = "#000";
  ctx.fillText("Lives: " + lives, canvas.width - 80, 20);
}

function collisionDetection() {
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      const b = bricks[c][r];
      if (b.status === 1) {
        if (x > b.x && x < b.x + brickWidth && y > b.y && y < b.y + brickHeight) {
          dy = -dy;
          b.status = 0;
        }
      }
    }
  }
}

function checkWin() {
  let remaining = 0;
  for (let c = 0; c < brickColumnCount; c++) {
    for (let r = 0; r < brickRowCount; r++) {
      if (bricks[c][r].status === 1) remaining++;
    }
  }
  if (remaining === 0) {
    isGameOver = true;
    ctx.clearRect(0, 0, canvas.width, canvas.height);
    ctx.font = "32px Arial";
    ctx.fillStyle = "#388e3c";
    ctx.textAlign = "center";
    ctx.fillText("🎉 You Win! 🎉", canvas.width / 2, canvas.height / 2);
  }
}

function showGameOver() {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  ctx.font = "32px Arial";
  ctx.fillStyle = "#d32f2f";
  ctx.textAlign = "center";
  ctx.fillText("💥 Game Over 💥", canvas.width / 2, canvas.height / 2);
}

function draw() {
  if (isGameOver) return;
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  drawBricks();
  drawBall();
  drawPaddle();
  drawLives();
  collisionDetection();
  checkWin();

  if (x + dx > canvas.width - ballRadius || x + dx < ballRadius) dx = -dx;
  if (y + dy < ballRadius) dy = -dy;
  else if (y + dy > canvas.height - ballRadius) {
    if (x > paddleX && x < paddleX + paddleWidth) {
      dy = -dy;
    } else {
      lives--;
      if (lives === 0) {
        isGameOver = true;
        showGameOver();
        return;
      } else {
        x = canvas.width / 2;
        y = canvas.height - 30;
        dx = 3;
        dy = -3;
        paddleX = (canvas.width - paddleWidth) / 2;
      }
    }
  }

  x += dx;
  y += dy;

  if (rightPressed && paddleX < canvas.width - paddleWidth) {
    paddleX += 7;
  } else if (leftPressed && paddleX > 0) {
    paddleX -= 7;
  }

  requestAnimationFrame(draw);
}

function resetGame() {
  document.location.reload();
}

function setDifficulty(level) {
  if (level === "easy") {
    dx = 2; dy = -2;
  } else if (level === "medium") {
    dx = 3; dy = -3;
  } else if (level === "hard") {
    dx = 4; dy = -4;
  }
}

draw();

window.onload = () => {
  document.getElementById('back-btn').onclick = () => window.location.href = '../index.html';
};