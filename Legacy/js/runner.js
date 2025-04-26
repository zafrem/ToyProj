const player = document.getElementById('player');
const game = document.getElementById('game');
const sprite = document.getElementById('sprite');

let activeObstacles = 0;
let jumpCount = 0;
let isJumping = false;
let jumpY = 0;
let velocity = 0;
let gravity = -4;
let lastObstacleX = 0;
let difficulty = 'easy';
let obstacleSpeed = 5;
let minObstacleInterval = 1000;

function startGame(selectedDifficulty) {
  difficulty = selectedDifficulty;

  if (difficulty === 'easy') {
    obstacleSpeed = 5;
    minObstacleInterval = 1000;
  } else if (difficulty === 'hard') {
    obstacleSpeed = 8;
    minObstacleInterval = 800;
  }
  startRandomObstacleGenerator();
}

function jump() {
  if (jumpCount >= 2) return;

  velocity = 35;
  jumpCount++;

  sprite.classList.remove('idle', 'running');
  sprite.classList.add('rotating');

  setTimeout(() => {
    sprite.classList.remove('rotating');
    if (jumpCount < 2) {
      sprite.classList.add('running');
    }
  }, 600);
}

document.body.onkeydown = function (e) {
  if (e.code === 'Space') {
    jump();
    createParticles();
  }
};

document.addEventListener('touchstart', function (e) {
  jump();
  createParticles();
});

let frame = 0;
setInterval(() => {
  const sprite = document.getElementById('sprite');
  frame = (frame + 1) % 2;
  sprite.style.backgroundImage = `url('../img/character_${frame === 0 ? 'idle' : 'run'}.png')`;
}, 150);

setInterval(() => {
    const currentBottom = parseInt(player.style.bottom || '0');
    const newBottom = currentBottom + velocity;
    player.style.bottom = `${newBottom}px`;
    velocity += gravity;


  if (newBottom <= 0) {
      player.style.bottom = '0px';
      velocity = 0;
      jumpCount = 0;

      sprite.classList.remove('rotating', 'idle');
      sprite.classList.add('running');
    } else {
      sprite.classList.remove('idle');
      sprite.classList.add('running');
    }

}, 30);


function createParticles() {
  for (let i = 0; i < 5; i++) {
    const p = document.createElement('div');
    p.classList.add('particle');

    const x = (Math.random() - 0.5) * 20 + 'px';
    const y = (Math.random() * 20) + 'px';

    p.style.left = player.offsetLeft + 10 + 'px';
    p.style.setProperty('--x', x);
    p.style.setProperty('--y', y);

    game.appendChild(p);
    setTimeout(() => p.remove(), 500);
  }
}

const obstacleImages = [
  'obstacle_box.png',
  'obstacle_spike.png',
  'obstacle_rock.png'
];

function getRandomObstacleImage() {
  return obstacleImages[Math.floor(Math.random() * obstacleImages.length)];
}

let lastObstacleTime = 0;

function createObstacle() {
  const screenRight = game.offsetWidth;
  const now = Date.now();

  if (activeObstacles >= 4 || now - lastObstacleTime < minObstacleInterval) return;

  const obstacle = document.createElement('div');
  obstacle.classList.add('obstacle');

  const image = getRandomObstacleImage();
  obstacle.style.backgroundImage = `url('../img/${image}')`;

  let obstacleLeft = screenRight;
  obstacle.style.left = obstacleLeft + 'px';
  lastObstacleX = obstacleLeft;

  game.appendChild(obstacle);
  activeObstacles++;
  lastObstacleTime = now;

  const moveInterval = setInterval(() => {
    obstacleLeft -= obstacleSpeed;
    obstacle.style.left = obstacleLeft + 'px';

    const playerBottom = parseInt(window.getComputedStyle(player).getPropertyValue("bottom"));
    const playerLeft = player.offsetLeft;
    const playerRight = playerLeft + player.offsetWidth;

    const obsLeft = obstacle.offsetLeft;
    const obsRight = obsLeft + obstacle.offsetWidth;
    const obstacleHeight = obstacle.offsetHeight;

    const xOverlap = obsLeft < playerRight - 20 && obsRight > playerLeft + 20;
    const yTooLow = playerBottom < obstacleHeight - 20;

    if (xOverlap && yTooLow) {
      alert("Game Over!");
      clearInterval(moveInterval);
      window.location.reload();
    }

    if (obstacleLeft < -48) {
      clearInterval(moveInterval);
      obstacle.remove();
      activeObstacles--;
    }
  }, 20);
}

function startRandomObstacleGenerator() {
  const interval = Math.random() * 2000 + 1000; // 1~3 sec
  setTimeout(() => {
    if (Math.random() < 0.7) {
      createObstacle();
    }
    startRandomObstacleGenerator();
  }, interval);
}

window.onload = () => {
  document.getElementById('back-btn').onclick = () => window.location.href = '../index.html';
};