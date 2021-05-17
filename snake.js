class Snake {

  constructor() {
    this.body = [];
    this.body[0] = createVector(floor(scaledWidth / 2),  floor(scaledHeight /
      2));
    this.xDirection = 0;
    this.yDirection = 0;
  }

  update() {
    let head = this.body[this.body.length - 1].copy();
    this.body.shift();
    head.x += this.xDirection;
    head.y += this.yDirection;
    this.body.push(head);
  }

  endGame() {
    let head = this.body[this.body.length - 1];
    if(head.x > scaledWidth - 1 || head.x < 0 || head.y > scaledHeight - 1 || head.y < 0) {
      return true;
    }
    for(let i = 0; i < this.body.length - 1; i++) {
      let part = this.body[i];
      if(part.x === head.x && part.y === head.y) {
        return true;
      }
    }
    return false;
  }

  grow() {
    let head = this.body[this.body.length - 1].copy();
    this.body.push(head);
  }

  eat(food) {
    let head = this.body[this.body.length - 1];
    if(head.x === food.x && head.y === food.y) {
      this.grow();
      return true;
    } else {
      return false;
    }
  }

  show() {
    for(let i = 0; i < this.body.length; i++) {
      fill(0);
      noStroke();
      rect(this.body[i].x, this.body[i].y, 1, 1);
    }
  }

  setDirection(x, y) {
    this.xDirection = x;
    this.yDirection = y;
  }

}
