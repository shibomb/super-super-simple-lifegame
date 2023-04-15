const FRAMERATES = [0, 1, 5, 12, 24, 60];
let frameRateIdx = 2;
const SIZES = [2, 4, 8, 16, 24, 32, 48, 60];
let sizeIdx = 2;
let ONE_SIZE = 8;

let maxX = 0;
let maxY = 0;
const BUFFER = 4;

let data;

function setup() {
  createCanvas(windowWidth, windowHeight);
  frameRate(FRAMERATES[frameRateIdx]);
  background(0);

  initData(0.5);
}

let isRunning = true;
let canUpdate = true;
function draw() {
  background(isRunning ? 0 : '#040');
  if (canUpdate && isRunning) {
    updateData();
  }

  drawData();
  
}

function drawData() {
  // --------------------------------
  // set draw
  // --------------------------------
  noStroke();
  fill(255);
  // stroke(255);
  // noFill();

  for (let y = 0; y < maxY; y++) {
    for (let x = 0; x < maxX; x++) {
      if (data[y][x] == 1) {
        // --------------------------------
        // draw
        // --------------------------------
        // rectMode(CENTER)
        // rect(
        circle(
          (x - BUFFER) * ONE_SIZE + ONE_SIZE / 2,
          (y - BUFFER) * ONE_SIZE + ONE_SIZE / 2,
          ONE_SIZE
        );
      }
    }
  }
}

function initData(val) {
  ONE_SIZE = SIZES[sizeIdx];

  maxX = Math.floor(width / ONE_SIZE) + BUFFER * 2;
  maxY = Math.floor(height / ONE_SIZE) + BUFFER * 2;

  data = [];
  for (let y = 0; y < maxY; y++) {
    data[y] = [];
    for (let x = 0; x < maxX; x++) {
      data[y][x] = random() < val ? 1 : 0;
    }
  }
}

function updateData() {
  const current = [];
  for (let y = 0; y < data.length; y++) {
    current[y] = data[y].slice();
  }

  const START_IDX = 1
  const END_MINUS_IDX = 1
  for (let y = START_IDX; y < data.length - END_MINUS_IDX; y++) {
    for (let x = START_IDX; x < data[y].length - END_MINUS_IDX; x++) {

      // --------------------------------
      // neighbors
      // --------------------------------
      const neighbors = getNeighbors(current, x, y);

      let count = 0;
      for (let i = 0; i < neighbors.length; i++) {
        count += neighbors[i] == 1 ? 1 : 0;
      }

      // --------------------------------
      // alive or born or die
      // --------------------------------
      // S23B3
      if (current[y][x] === 1 && (count === 2 || count === 3)) {
        data[y][x] = 1;
      } else if (current[y][x] === 0 && count === 3) {
        data[y][x] = 1;
      }
      // // S12345B3
      // if (current[y][x] === 1 && count >= 1 && count <= 5) {
      //   data[y][x] = 1;
      // } else if (current[y][x] === 0 && count === 3) {
      //   data[y][x] = 1;
      // }
      // die
      else {
        data[y][x] = 0;
      }
    }
  }
}

function getNeighbors(current, x, y) {
  const ret = [];

  ret.push(current[y - 1][x - 1]);
  ret.push(current[y - 1][x + 0]);
  ret.push(current[y - 1][x + 1]);

  ret.push(current[y + 0][x - 1]);
  // ret.push(data[y + 0][x + 0]);
  ret.push(current[y + 0][x + 1]);

  ret.push(current[y + 1][x - 1]);
  ret.push(current[y + 1][x + 0]);
  ret.push(current[y + 1][x + 1]);

  return ret;
}

// ------------------------------------------
// god hand
// ------------------------------------------

function mousePressed() {
  canUpdate = false;
  updateByHand();
}
function mouseDragged() {
  updateByHand();
}
function mouseReleased() {
  updateByHand();
  canUpdate = true;
}
function updateByHand() {
  const x = Math.floor(mouseX / ONE_SIZE) + BUFFER;
  const y = Math.floor(mouseY / ONE_SIZE) + BUFFER;
  if (keyIsPressed === true && keyCode === SHIFT) {
    data[y][x] = 0;
  } else {
    data[y][x] = 1;
  }
}

function keyPressed() {
  if (key === "p") {
    isRunning = !isRunning
  }
  else if (key === "q") {
    initData(0);
  } else if (key === "r") {
    initData(random(0.25, 0.75));
  } else if (key === "f") {
    initData(1);
  } else if (key === "w") {
    if (frameRateIdx < FRAMERATES.length - 1) {
      frameRateIdx++;
      frameRate(FRAMERATES[frameRateIdx]);
    }
  } else if (key === "s") {
    if (0 < frameRateIdx) {
      frameRateIdx--;
      frameRate(FRAMERATES[frameRateIdx]);
    }
  } else if (key === "d") {
    if (sizeIdx < SIZES.length - 1) {
      sizeIdx++;
      initData(random(0.25, 0.75));
    }
  } else if (key === "a") {
    if (0 < sizeIdx) {
      sizeIdx--;
      initData(random(0.25, 0.75));
    }
  }
}
