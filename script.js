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
    this.width = 100;
    this.height = 50;
    this.x = canvas.width;
    this.y = Math.random() * (canvas.height - this.height);
    this.directionX = Math.random() * 5 + 3;
    this.directionY = Math.random() * 5 - 2.5;
    this.markedForDeath = false;
  }
  update() {
    this.x -= this.directionX;
    if (this.x < 0 - this.width) this.markedForDeath = true;
  }
  draw() {
    ctx.fillStyle = "peachpuff";
    ctx.fillRect(this.x, this.y, this.width, this.height);
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
