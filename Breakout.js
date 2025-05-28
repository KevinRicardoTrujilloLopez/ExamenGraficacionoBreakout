let paddle;
let ball;

function setup() {
  createCanvas(600, 400);
  paddle = new Paddle();
  ball = new Ball();
}

function draw() {
  background(0);
  paddle.show();
  paddle.move();
  ball.show();
  ball.update();
  ball.checkEdges();
  ball.checkPaddle(paddle);
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
      this.yspeed *= -1;
      this.y = p.y - this.r;
    }
  }

  reset() {
    this.x = width / 2;
    this.y = height / 2;
    this.xspeed = 4 * (random() > 0.5 ? 1 : -1);
    this.yspeed = -4;
  }
}
