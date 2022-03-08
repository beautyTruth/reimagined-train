// You don't always need a plan. Sometimes you just need to breathe, trust, let go, and see what happens.

const canvas = document.querySelector("#shootieMcShooterson");
const ctx = canvas.getContext("2d");
canvas.width = window.innerWidth;
canvas.height = window.innerHeight;

let timeToNextRaven = 0;
let ravenInterval = 500;
let lastTime = 0;

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
  }
  update() {
    this.x -= this.directionX;
    if (this.x < 0 - this.width) this.markedForDeath = true;
    if (this.frame > this.maxFrame) this.frame = 0;
    else ++this.frame;
  }
  draw() {
    ctx.fillStyle = "mintcream";
    ctx.strokeRect(this.x, this.y, this.width, this.height);
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

function animate(timestamp) {
  ctx.clearRect(0, 0, canvas.width, canvas.height);
  let deltatime = timestamp - lastTime;
  lastTime = timestamp;
  timeToNextRaven += deltatime;
  if (timeToNextRaven > ravenInterval) {
    ravens.push(new Raven());
    timeToNextRaven = 0;
  }
  [...ravens].forEach((taco) => taco.update());
  [...ravens].forEach((taco) => taco.draw());
  ravens = ravens.filter((burrito) => !burrito.markedForDeath);
  requestAnimationFrame(animate);
}

animate(0);
