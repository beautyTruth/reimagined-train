// You don't always need a plan. Sometimes you just need to breathe, trust, let go, and see what happens.

const canvas = document.querySelector("#shootieMcShooterson");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;
const collisionCanvas = document.querySelector("#shootieVonShooterson");
const collisionCtx = collisionCanvas.getContext("2d");
collisionCanvas.width = window.innerWidth;
collisionCanvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;
let score = 0;
let gameOver = false;
ctx.font = "50px Impact";

let ravens = [];

class Raven {
  constructor() {
    this.spriteWidth = 271;
    this.spriteHeight = 194;
    this.sizeModifier = Math.random() * 0.6 + 0.4;
    this.width = this.spriteWidth * this.sizeModifier;
    this.height = this.spriteHeight * this.sizeModifier;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeath = false;
    this.image = new Image();
    this.image.src = "raven.png";
    this.frame = 0;
    this.maxFrame = 4;
    this.timeSinceFlap = 0;
    this.flapInterval = Math.random() * 50 + 50;
    this.randomColors = [
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
      Math.floor(Math.random() * 255),
    ];
    this.color =
      "rgb(" +
      this.randomColors[0] +
      "," +
      this.randomColors[1] +
      "," +
      this.randomColors[2] +
      ")";
  }
  update(deltatime) {
    if (this.y < 0 || this.y > canvas.height - this.height) {
      this.directionY = -this.directionY;
    }
    this.x -= this.directionX;
    this.y += this.directionY;
    if (this.x < 0 - this.width) this.markedForDeath = true;
    this.timeSinceFlap += deltatime;
    if (this.timeSinceFlap > this.flapInterval) {
      if (this.frame > this.maxFrame) this.frame = 0;
      else ++this.frame;
      this.timeSinceFlap = 0;
    }
    if (this.x < 0 - this.width) gameOver = true;
  }
  draw() {
    collisionCtx.fillStyle = this.color;
    collisionCtx.fillRect(this.x, this.y, this.width, this.height);
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y,
      this.width,
      this.height
    );
  }
}

let explosions = [];
class Explosion {
  constructor(x, y, size) {
    this.image = new Image();
    this.image.src = "dust_cloud.png";
    this.spriteWidth = 200;
    this.spriteHeight = 179;
    this.size = size;
    this.x = x;
    this.y = y;
    this.frame = 0;
    this.sound = new Audio();
    this.sound.src = "fart.mp3";
    this.timeSinceLastFrame = 0;
    this.frameInterval = 200;
    this.markedForDeath = false;
  }
  update(deltatime) {
    if (this.frame === 0) this.sound.play();
    this.timeSinceLastFrame += deltatime;
    if (this.timeSinceLastFrame > this.frameInterval) {
      ++this.frame;
      this.timeSinceLastFrame = 0;
      if (this.frame > 5) this.markedForDeath = true;
    }
  }
  draw() {
    ctx.drawImage(
      this.image,
      this.frame * this.spriteWidth,
      0,
      this.spriteWidth,
      this.spriteHeight,
      this.x,
      this.y - this.size / 4,
      this.size,
      this.size
    );
  }
}

let particles = [];

function drawScore() {
  ctx.fillStyle = "cornflowerblue";
  ctx.fillText("Score: " + score, 50, 75);
  ctx.fillStyle = "papayawhip";
  ctx.fillText("Score: " + score, 53, 77);
}

function drawGameOver() {
  ctx.textAlign = "center";
  ctx.fillStyle = "aqua";
  ctx.fillText(
    "YOU SUCK!!! Score: " + score,
    canvas.width / 2 + 3,
    canvas.height / 2 + 3
  );
  ctx.fillStyle = "cornflowerblue";
  ctx.fillText(
    "YOU SUCK!!! Score: " + score,
    canvas.width / 2,
    canvas.height / 2
  );
}

window.addEventListener("click", function (e) {
  const detectPixelColor = collisionCtx.getImageData(e.x, e.y, 1, 1);
  const pc = detectPixelColor.data;
  ravens.forEach((peach) => {
    if (
      peach.randomColors[0] === pc[0] &&
      peach.randomColors[1] === pc[1] &&
      peach.randomColors[2] === pc[2]
    ) {
      // collision detected by color
      peach.markedForDeath = true;
      ++score;
      explosions.push(new Explosion(peach.x, peach.y, peach.width));
      console.log(explosions);
    }
  });
});

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  collisionCtx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
    ravens.sort(function (a, b) {
      return a.width - b.width;
    });
  }
  drawScore();
  [...ravens, ...explosions].forEach((taco) => taco.update(deltatime));
  [...ravens, ...explosions].forEach((taco) => taco.draw());
  ravens = ravens.filter((burrito) => !burrito.markedForDeath);
  explosions = explosions.filter((burrito) => !burrito.markedForDeath);
  if (!gameOver) requestAnimationFrame(animate);
  else drawGameOver();
}

animate(0);
