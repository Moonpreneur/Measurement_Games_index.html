const questions = [
  {
    id: "q1",
    text1: "4 ounces",
    text2: "1 cup",
    text3: "1 cup 4 ounces",
    text4: "2 cups",
    Correct: "2 cups 4 ounces",
    Choice1: "2 cups",
    Choice2: "4 ounces",
    Choice3: "2 cups 4 ounces",
    Choice4: "1 ounce",
  },
  {
    id: "q2",
    text1: "2 quarts",
    text2: "1 gallon",
    text3: "1 gallon 2 quarts",
    text4: "2 gallons",
    Correct: "2 gallons 2 quarts",
    Choice1: "2 gallons",
    Choice2: "2 quarts",
    Choice3: "2 gallons 4 quarts",
    Choice4: "2 gallons 2 quarts",
  },
];

const values = [
  "2 cups 4 ounces",
  "2 gallons 2 quarts",
  "2 pounds 8 ounces",
  "2 m 50 cm",
];

let score = 0;
let timeRemaining = 60;
let timerInterval;
let playing = false;
let selectedQuestions = [];
let currentQuestionIndex = 0;

document.getElementById("startreset").onclick = function () {
  if (playing) {
    location.reload();
  } else {
    playing = true;
    score = 0;
    timeRemaining = 300;
    clearInterval(timerInterval);
    generateQuestions();
    generateValues();
    startTimer();
    document.getElementById("score").innerText = `Score: ${score}`;
    document.getElementById("timeremaining").style.display = "block";
    document.getElementById("timeremainingvalue").innerHTML = timeRemaining;
    document.getElementById("gameOver").style.display = "none";
    document.getElementById("startreset").innerHTML = "Reset Game";
    document.getElementById("container").classList.remove("hidden");
    document.getElementById("start-image").classList.add("hidden");
    document.getElementById("reset").classList.remove("hidden");
  }
};

function startTimer() {
  timerInterval = setInterval(function () {
    timeRemaining--;
    document.getElementById("timeremainingvalue").innerText = timeRemaining;
    if (timeRemaining <= 0) {
      clearInterval(timerInterval);
      document.getElementById(
        "gameOver"
      ).innerHTML = `<p>Game Over!</p><p>Your score is ${score}.</p>`;
      document.getElementById("gameOver").style.display = "block";
      document.getElementById("timeremaining").style.display = "none";
      playing = false;
      document.getElementById("startreset").innerHTML = "Start Game";
      document.getElementById("formula").classList.add("hidden");
      document.getElementById("container").classList.add("hidden");
      disableGame(); // Call disableGame function to disable draggable elements
    }
  }, 1000);
}

function generateQuestions() {
  selectedQuestions = getRandomQuestions(questions.length);
  currentQuestionIndex = 0;
  displayQuestion();
}

function displayQuestion() {
  const container = document.getElementById("questions-container");
  container.innerHTML = "";

  if (currentQuestionIndex >= selectedQuestions.length) {
    gameOver();
    return;
  }

  const q = selectedQuestions[currentQuestionIndex];
  const questionHTML = `
    <div style="margin: 20px; padding: 10px; border-radius: 10px;">
      <span class="height" id="height">${q.text1}</span>
      <span class="length" id="length">${q.text2}</span>
      <span class="width" id="width">${q.text3}</span>
      <span class="height" id="height">${q.text4}</span>
      <span class="height" id="drop-area" ondrop="drop(event)" ondragover="allowDrop(event)"></span>
      <button id="check-button" onclick="checkAnswer()">Check Answer</button>
      <span id="result" style="display: none;"></span>
    </div>
  `;
  container.innerHTML = questionHTML;
}

function getRandomQuestions(num) {
  const shuffled = questions.sort(() => 0.5 - Math.random());
  return shuffled.slice(0, num);
}

function generateValues() {
  const valuesContainer = document.getElementById("values");
  valuesContainer.innerHTML = "";
  values.forEach((value) => {
    const valueHTML = `
      <td><div draggable="true" ondragstart="drag(event)" id="${value}" style="background-color: #ffcccc; border: 2px solid #333; border-radius: 5px; padding: 5px; cursor: move;">${value}</div></td>
    `;
    valuesContainer.innerHTML += valueHTML;
  });
}

function allowDrop(event) {
  event.preventDefault();
}

function drag(event) {
  event.dataTransfer.setData("text", event.target.id);
}

function drop(event) {
  event.preventDefault();
  var data = event.dataTransfer.getData("text");
  var draggedElement = document.getElementById(data);
  event.target.textContent = draggedElement.textContent;
}

function updateScore(isCorrect) {
  if (isCorrect) {
    score += 1;
  } else {
    score -= 1;
  }
  document.getElementById("score").innerText = `Score: ${score}`;
}

function checkAnswer() {
  const dropArea = document.getElementById("drop-area");
  const answer = dropArea.textContent.trim();
  const correctAnswer = selectedQuestions[currentQuestionIndex].Correct;

  if (answer === correctAnswer) {
    document.getElementById("result").innerText = `Correct! The answer is ${correctAnswer}. ☺️`;
    document.getElementById("result").style.color = "green";
    updateScore(true);
  } else {
    document.getElementById("result").innerText = `Incorrect. Try again. 😓`;
    document.getElementById("result").style.color = "red";
    updateScore(false);
  }
  document.getElementById("result").style.display = "block";
  setTimeout(function () {
    document.getElementById("result").style.display = "none";
    currentQuestionIndex++;
    displayQuestion();
  }, 2000);
}

function disableGame() {
  const valuesContainer = document.getElementById("values");
  valuesContainer.innerHTML = ""; // Clear the draggable elements
  valuesContainer.style.pointerEvents = "none"; // Disable pointer events
}

function gameOver() {
  clearInterval(timerInterval);
  document.getElementById("timeremainingvalue").innerText = "Game Over";
  document.getElementById("score").innerText = `Final Score: ${score}`;
  document.getElementById("gameOver").style.display = "block";
  disableGame();
}

function startGame() {
  document.getElementById("gameOver").style.display = "none";
  startTimer();
}

document.getElementById("reset").addEventListener("click", startGame);

generateQuestions();
generateValues();
