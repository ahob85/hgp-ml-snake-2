// Author:

// Global UI Variables
let canvasDiv;
let canvas;
let textDiv;
let textP;
let textP2;
let buttonDiv;
let resetButton;

// Global Game Variables
let snake;
let food;
let resolution;
let scaledWidth;
let scaledHeight;
let score;

// Global ML Variables
let featureExtractor;
let imgFeatures;
let knnClassifier;
let video;
let isModelReady;

function setup() {
  // Build the interface
  canvasDiv = createDiv();
  canvas = createCanvas(640, 480);
  canvas.parent(canvasDiv);
  textDiv = createDiv();
  textP = createP("Model loading, please wait...");
  textP.parent(textDiv);
  textP2 = createP();
  textP2.parent(textDiv);
  buttonDiv = createDiv();
  resetButton = createButton("Reset Game");
  resetButton.mousePressed(resetGame);
  resetButton.parent(buttonDiv);
  // Set the resolution to 20. Play with this later if you want.
  resolution = 20;
  // Scaled width and height are width / resolution, height / resolution
  scaledWidth = floor(width / resolution);
  scaledHeight = floor(height / resolution);
  // Set the game's framerate to 5 (or whatever you prefer)
  frameRate(5);
  // Load the video

}

function draw() {
  if(isModelReady) {
    imgFeatures = featureExtractor.infer(video);
    if(knnClassifier.getNumLabels() > 0) {
      knnClassifier.classify(imgFeatures, gotResults);
      // Scale the canvas according to resolution, then refresh the background

      // Draw game objects

    }
  }
}

function drawGameObjects() {
  // Check if snake is eating the food
  if(snake.eat(food)) {
    createFood();
    score++;
    textP.html("Score: " + score);
  };
  // Draw the snake, but first check the user's position

  snake.update();
  snake.show();
  // Draw the food
  noStroke();
  fill(255, 0, 0);
  rect(food.x, food.y, 1, 1);
  // Check for game over
  if(snake.endGame()) {
    textP.html("YOU LOSE. Final Score: " + score);
    background(255, 0, 0);
    noLoop();
    buttonDiv.style("display", "block");
  }
}

function createFood() {
  let x = floor(random(scaledWidth));
  let y = floor(random(scaledHeight));
  food = createVector(x, y);
}

function checkPosition() {
  if(keyCode === UP_ARROW && snake.yDirection === 0) {
    snake.setDirection(0, -1);
  } else if(keyCode === DOWN_ARROW && snake.yDirection === 0) {
    snake.setDirection(0, 1);
  } else if(keyCode === LEFT_ARROW) && snake.xDirection === 0) {
    snake.setDirection(-1, 0);
  } else if(keyCode === RIGHT_ARROW && snake.xDirection === 0) {
    snake.setDirection(1, 0);
  }
}

function resetGame() {
  snake = new Snake();
  createFood();
  score = 0;
  textP.html("Score: " + score);
  loop();
  buttonDiv.style("display", "none");
}

function videoReady() {
  video.style("transform", "scale(-1, 1)");
  featureExtractor = ml5.featureExtractor("MobileNet", featureExtractorLoaded);
}

function featureExtractorLoaded() {
  knnClassifier = ml5.KNNClassifier();
  knnClassifier.load("model/myKNN.json", function () {
    isModelReady = true;
    // Reset the game

  });
}

function gotResults(error, results) {
  if(error) {
    console.error(error);
  } else {
    let labelString = getLabel(results);
    textP2.html("Your Position: " + labelString);
  }
}

// Don't touch this, it "fixes" a bug in ml5.js
function getLabel(results) {
  const entries = Object.entries(results.confidencesByLabel);
  let greatestConfidence = entries[0];
  for(let i = 0; i < entries.length; i++) {
    if(entries[i][1] > greatestConfidence[1]) {
      greatestConfidence = entries[i];
    }
  }
  return greatestConfidence[0];
}
