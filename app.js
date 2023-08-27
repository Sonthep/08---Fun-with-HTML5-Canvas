const canvas = document.getElementById('drawingCanvas');
const context = canvas.getContext('2d');

let isDrawing = false;
let isErasing = false;
let currentColor = '#000000';
let brushSize = 5;
let isBurstMode = false;
let drawingHistory = [];

canvas.addEventListener('mousedown', startDrawing);
canvas.addEventListener('mousemove', drawOrErase);
canvas.addEventListener('mouseup', stopDrawing);
canvas.addEventListener('mouseout', stopDrawing);

document.getElementById('drawButton').addEventListener('click', setDrawingMode);
document.getElementById('eraseButton').addEventListener('click', setErasingMode);
document.getElementById('colorPicker').addEventListener('input', setColor);
document.getElementById('brushSize').addEventListener('input', setBrushSize);
document.getElementById('burstButton').addEventListener('click', toggleBurstMode);
document.getElementById('undoButton').addEventListener('click', undoLastStroke);

function startDrawing(event) {
  isDrawing = true;
  drawOrErase(event);
}

function drawOrErase(event) {
  if (!isDrawing) return;

  const x = event.clientX - canvas.getBoundingClientRect().left;
  const y = event.clientY - canvas.getBoundingClientRect().top;

  context.lineWidth = brushSize;
  context.lineCap = 'round';

  if (isErasing) {
    context.strokeStyle = 'white';
  } else {
    context.strokeStyle = currentColor;
  }
  

  if (isBurstMode) {
    for (let i = 0; i < 5; i++) {
      context.lineTo(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10);
      context.stroke();
      context.beginPath();
      context.moveTo(x + Math.random() * 20 - 10, y + Math.random() * 20 - 10);
    }
  } else {
    context.lineTo(x, y);
    context.stroke();
    context.beginPath();
    context.moveTo(x, y);
  }

  if (!isErasing && !isBurstMode) {
    // Save the drawn path for undo
    drawingHistory.push(context.getImageData(0, 0, canvas.width, canvas.height));
  }
}

function stopDrawing() {
  isDrawing = false;
  context.beginPath();
}

function setDrawingMode() {
  isErasing = false;
  canvas.style.cursor = 'crosshair';
}

function setErasingMode() {
  isErasing = true;
  canvas.style.cursor = 'default';
}

function setColor(event) {
  currentColor = event.target.value;
}

function setBrushSize(event) {
  brushSize = event.target.value;
}

function toggleBurstMode() {
  isBurstMode = !isBurstMode;
  if (isBurstMode) {
    document.getElementById('burstButton').classList.add('active');
  } else {
    document.getElementById('burstButton').classList.remove('active');
  }
}

function undoLastStroke() {
  if (drawingHistory.length > 0) {
    context.clearRect(0, 0, canvas.width, canvas.height);
    for(let i = 0;i<20;i++){
    drawingHistory.pop();
    }
    if (drawingHistory.length > 0) {
      context.putImageData(drawingHistory[drawingHistory.length - 1], 0, 0);
    }
  }
}

// Include the following in your JavaScript

let fillCanvasColor = '#FFFFFF';

document.getElementById('fillButton').addEventListener('click', fillCanvas);
document.getElementById('fillColorPicker').addEventListener('input', setFillColor);

function setFillColor(event) {
  fillCanvasColor = event.target.value;
}

function fillCanvas() {
  context.fillStyle = fillCanvasColor;
  context.fillRect(0, 0, canvas.width, canvas.height);
  // Clear the drawing history since the canvas has been filled
  drawingHistory = [];
}

// Include the following in your JavaScript

let eraserSize = 5;

document.getElementById('eraserSize').addEventListener('input', setEraserSize);

function setEraserSize(event) {
  eraserSize = event.target.value;
}
