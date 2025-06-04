let paddle;
let ball;
let blocks = [];
let score = 0;
let lives = 3;
let level = 1;
let totalLevels = 3;

function setup() {
  createCanvas(600, 400);
  paddle = new Paddle();
  ball = new Ball();
  generateBlocks();
}

function draw() {
  background(0);
  textSize(16);
  fill(255);
  text("Puntuación: " + score, 10, 20);
  text("Vidas: " + lives, width - 100, 20);

  paddle.show();
  paddle.move();
  ball.show();
  ball.update();
  ball.checkEdges();
  ball.checkPaddle(paddle);

  for (let i = blocks.length - 1; i >= 0; i--) {
    blocks[i].show();
    if (ball.hits(blocks[i])) {
      ball.yspeed *= -1;
      blocks[i].hits--;
      if (blocks[i].hits <= 0) {
        blocks.splice(i, 1);
        score++;
      }
    }
  }

  // Transición entre niveles
  if (blocks.length === 0 && level < totalLevels) {
    level++;
    generateBlocks();
    ball.reset();
  }
}

function keyPressed() {
  if (keyCode === LEFT_ARROW) {
    paddle.setDir(-1);
  } else if (keyCode === RIGHT_ARROW) {
    paddle.setDir(1);
  }
}

function keyReleased() {
  if (keyCode === LEFT_ARROW || keyCode === RIGHT_ARROW) {
    paddle.setDir(0);
  }
}

class Paddle {
  constructor() {
    this.w = 100;
    this.h = 20;
    this.x = width / 2 - this.w / 2;
    this.y = height - this.h - 10;
    this.xdir = 0;
  }

  show() {
    fill(255);
    rect(this.x, this.y, this.w, this.h);
  }

  setDir(dir) {
    this.xdir = dir;
  }

  move() {
    this.x += this.xdir * 5;
    this.x = constrain(this.x, 0, width - this.w);
  }
}

class Block {
  constructor(x, y, w, h, hits) {
    this.x = x;
    this.y = y;
    this.w = w;
    this.h = h;
    this.hits = hits;
  }

  show() {
    if (this.hits === 3) fill(255, 0, 0);
    else if (this.hits === 2) fill(255, 165, 0);
    else fill(255, 255, 0);
    rect(this.x, this.y, this.w, this.h);
  }
}

class Ball {
  constructor() {
    this.x = width / 2;
    this.y = height / 2;
    this.r = 12;
    this.xspeed = 4;
    this.yspeed = -4;
  }

  show() {
    fill(255);
    ellipse(this.x, this.y, this.r * 2);
  }

  update() {
    let speed = sqrt(this.xspeed ** 2 + this.yspeed ** 2);
    let maxSpeed = 3;
    if (speed > maxSpeed) {
      this.xspeed *= maxSpeed / speed;
      this.yspeed *= maxSpeed / speed;
    }

    this.x += this.xspeed;
    this.y += this.yspeed;
  }

  checkEdges() {
    if (this.x < 0 || this.x > width) {
      this.xspeed *= -1;
    }
    if (this.y < 0) {
      this.yspeed *= -1;
    }
    if (this.y > height) {
      this.reset();
    }
  }

  checkPaddle(p) {
    if (
      this.x > p.x &&
      this.x < p.x + p.w &&
      this.y + this.r > p.y &&
      this.y - this.r < p.y + p.h
    ) {
      let hitPos = (this.x - (p.x + p.w / 2)) / (p.w / 2);
      let angle = hitPos * PI / 3;
      let speed = sqrt(this.xspeed ** 2 + this.yspeed ** 2);
      this.xspeed = speed * sin(angle);
      this.yspeed = -abs(speed * cos(angle));
      this.y = p.y - this.r;
    }
  }

  reset() {
    lives--;
    if (lives <= 0) {
      this.gameOver();
    } else {
      this.x = width / 2;
      this.y = height / 2;
      this.xspeed = 4 * (random() > 0.5 ? 1 : -1);
      this.yspeed = -4;
    }
  }

  gameOver() {
    noLoop();
    textSize(32);
    fill(255, 0, 0);
    textAlign(CENTER, CENTER);
    text("Game Over", width / 2, height / 2);
  }

  hits(block) {
    return (
      this.x + this.r > block.x &&
      this.x - this.r < block.x + block.w &&
      this.y + this.r > block.y &&
      this.y - this.r < block.y + block.h
    );
  }
}

function generateBlocks() {
  blocks = [];

  if (level === 1) {
    for (let i = 0; i < 3; i++) {
      for (let j = 0; j < 8; j++) {
        let x = j * (60 + 10) + 35;
        let y = i * (20 + 10) + 40;
        blocks.push(new Block(x, y, 60, 20, 1));
      }
    }
  }

  if (level === 2) {
    for (let i = 0; i < 5; i++) {
      for (let j = 0; j < 10; j++) {
        let x = j * (50 + 5) + 20;
        let y = i * (20 + 5) + 40;
        let hits = random() < 0.2 ? 3 : 1;
        blocks.push(new Block(x, y, 50, 20, hits));
      }
    }

    ball.xspeed *= 1.2;
    ball.yspeed *= 1.2;
  }
}
