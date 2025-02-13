const timerElement = document.getElementById('timer');
const resetButton = document.getElementById('resetButton');
const nextLevelButton = document.getElementById('nextLevel');
const messageElement = document.getElementById('message');
const darkModeToggle = document.getElementById('darkModeToggle');
const box = document.querySelector('.box');
const shapesContainer = document.querySelector('.shapes');
const currentLevelElement = document.getElementById('currentLevel');

let timeLeft = 15;
let timerInterval;
let currentLevel = 1;
let shapes = [];
let grooves = [];

darkModeToggle.addEventListener('click', () => {
  document.body.classList.toggle('dark-mode');
  darkModeToggle.textContent = document.body.classList.contains('dark-mode') ? '☀️' : '🌙';
  localStorage.setItem('darkMode', document.body.classList.contains('dark-mode'));
});


if (localStorage.getItem('darkMode') === 'true') {
  document.body.classList.add('dark-mode');
  darkModeToggle.textContent = '☀️';
}


function initializeGame() {
  const levels = [
    { shapes: 3, grooves: 4 },
    { shapes: 5, grooves: 6 }, 
    { shapes: 7, grooves: 8 }, ]

  const level = levels[currentLevel - 1];
  createShapes(level.shapes);
  createGrooves(level.grooves);
  startTimer();
}


function createShapes(count) {
  shapesContainer.innerHTML = '';
  const shapeTypes = ['circle', 'triangle', 'star', 'square', 'hexagon', 'diamond', 'rectangle'];

  for (let i = 0; i < count; i++) {
    const shape = document.createElement('div');
    shape.classList.add('shape');
    shape.id = `shape${i + 1}`;
    shape.dataset.shape = shapeTypes[i];
    shape.draggable = true;
    shapesContainer.appendChild(shape);
  }

  shapes = document.querySelectorAll('.shape');
  shapes.forEach(shape => shape.addEventListener('dragstart', dragStart));
}


function createGrooves(count) {
  box.innerHTML = '';
  const shapeTypes = ['circle', 'triangle', 'star', 'square', 'hexagon', 'diamond', 'rectangle'];

  for (let i = 0; i < count; i++) {
    const groove = document.createElement('div');
    groove.classList.add('groove');
    groove.id = `groove${i + 1}`;
    groove.dataset.shape = shapeTypes[i];
    box.appendChild(groove);
  }

  grooves = document.querySelectorAll('.groove');
  grooves.forEach(groove => {
    groove.addEventListener('dragover', dragOver);
    groove.addEventListener('drop', drop);
  });
}


function dragStart(event) {
  event.dataTransfer.setData('text/plain', event.target.id);
  const dragGhost = event.target.cloneNode(true);
  dragGhost.style.position = 'absolute';
  dragGhost.style.top = '-9999px';
  document.body.appendChild(dragGhost);
  event.dataTransfer.setDragImage(dragGhost, 25, 25);
  setTimeout(() => document.body.removeChild(dragGhost), 0);
}

function dragOver(event) {
  event.preventDefault();
}

function drop(event) {
  event.preventDefault();
  const shapeId = event.dataTransfer.getData('text/plain');
  const shape = document.getElementById(shapeId);
  const groove = event.target;

  if (shape.dataset.shape === groove.dataset.shape) {
    groove.appendChild(shape);
    checkWin();
  } else {
    showMessage('Wrong shape! Try again! 🤔', 'lose');
  }
}


function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 15;
  timerElement.textContent = timeLeft;
  timerInterval = setInterval(() => {
    timeLeft--;
    timerElement.textContent = timeLeft;
    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      showMessage('Time is up! You lose! 😅', 'lose');
      disableGame();
    }
  }, 1000);
}


function checkWin() {
  const allShapesInCorrectGrooves = Array.from(shapes).every(shape => {
    const groove = shape.closest('.groove');
    return groove && groove.dataset.shape === shape.dataset.shape;
  });

  if (allShapesInCorrectGrooves) {
    clearInterval(timerInterval);
    showMessage('🎉 Fantastic! You matched all shapes! 🏆', 'win');
    disableGame();
    nextLevelButton.style.display = 'block';
  }
}


function showMessage(message, type) {
  messageElement.textContent = message;
  messageElement.className = `message ${type} show`;
  messageElement.style.display = 'block';

  if (type === 'lose') {
    messageElement.style.animation = 'none';
    messageElement.offsetHeight; // Trigger reflow
    messageElement.style.animation = 'shake 0.5s ease-in-out';
  }
}


function disableGame() {
  shapes.forEach(shape => (shape.draggable = false));
}


resetButton.addEventListener('click', () => {
  initializeGame();
  messageElement.style.display = 'none';
  nextLevelButton.style.display = 'none';

});


nextLevelButton.addEventListener('click', () => {
  if (currentLevel < 3) {
    currentLevel++;
    currentLevelElement.textContent = currentLevel;
    initializeGame();
    messageElement.style.display = 'none';
    nextLevelButton.style.display = 'none';
  } else {
    showMessage('🎉 You completed all levels! 🏆', 'win');
  }
});



initializeGame();