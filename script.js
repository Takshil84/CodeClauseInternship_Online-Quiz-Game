const levels = [
    {
      level: "Easy",
      questions: [
        {
          question: "What is the capital of France?",
          choices: ["Berlin", "Madrid", "Paris", "Rome"],
          correctAnswer: 2,
        },
        {
          question: "What is 2 + 2?",
          choices: ["3", "4", "5", "6"],
          correctAnswer: 1,
        },
      ],
    },
    {
      level: "Medium",
      questions: [
        {
          question: "What is the largest planet in our solar system?",
          choices: ["Earth", "Jupiter", "Mars", "Venus"],
          correctAnswer: 1,
        },
        {
          question: "What is the symbol for potassium?",
          choices: ["P", "K", "Na", "Pt"],
          correctAnswer: 1,
        },
      ],
    },
    {
      level: "Hard",
      questions: [
        {
          question: "Who developed the theory of relativity?",
          choices: ["Isaac Newton", "Albert Einstein", "Galileo", "Nikola Tesla"],
          correctAnswer: 1,
        },
        {
          question: "Which element has the atomic number 79?",
          choices: ["Gold", "Silver", "Iron", "Copper"],
          correctAnswer: 0,
        },
      ],
    },
  ];
  
  let currentLevel = 0;
  let currentQuestionIndex = 0;
  let score = 0;
  let timer;
  let timeLeft = 15;
  
  const questionElement = document.getElementById("question");
  const choicesElement = document.getElementById("choices");
  const nextBtn = document.getElementById("next-btn");
  const scoreElement = document.getElementById("score");
  const levelElement = document.getElementById("level");
  const timerElement = document.getElementById("timer");
  const leaderboardList = document.getElementById("leaderboard-list");
  
  function startTimer() {
    timer = setInterval(() => {
      timeLeft--;
      timerElement.textContent = `Time Left: ${timeLeft}`;
  
      if (timeLeft <= 0) {
        clearInterval(timer);
        nextBtn.style.display = "block";
      }
    }, 1000);
  }
  
  function loadQuestion() {
    const currentLevelQuestions = levels[currentLevel].questions;
    const currentQuestion = currentLevelQuestions[currentQuestionIndex];
  
    questionElement.textContent = currentQuestion.question;
    choicesElement.innerHTML = "";
  
    // Randomize choices
    const randomizedChoices = [...currentQuestion.choices];
    for (let i = randomizedChoices.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [randomizedChoices[i], randomizedChoices[j]] = [randomizedChoices[j], randomizedChoices[i]];
    }
  
    randomizedChoices.forEach((choice, index) => {
      const choiceItem = document.createElement("li");
      choiceItem.textContent = choice;
      choiceItem.addEventListener("click", () => checkAnswer(index, currentQuestion.correctAnswer));
      choicesElement.appendChild(choiceItem);
    });
  
    nextBtn.style.display = "none";
    timeLeft = 15;
    startTimer();
  }
  
  function checkAnswer(selectedIndex, correctAnswer) {
    clearInterval(timer);
  
    if (selectedIndex === correctAnswer) {
      score++;
    }
  
    scoreElement.textContent = `Score: ${score}`;
  
    // Show the next button
    nextBtn.style.display = "block";
  }
  
  nextBtn.addEventListener("click", () => {
    currentQuestionIndex++;
  
    if (currentQuestionIndex < levels[currentLevel].questions.length) {
      loadQuestion();
    } else {
      currentLevel++;
      if (currentLevel < levels.length) {
        currentQuestionIndex = 0;
        levelElement.textContent = `Level: ${levels[currentLevel].level}`;
        loadQuestion();
      } else {
        alert(`Quiz Over! Your score is: ${score}`);
        saveToLeaderboard(score);
        displayLeaderboard();
        resetGame();
      }
    }
  });
  
  function saveToLeaderboard(score) {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboard.push(score);
    leaderboard.sort((a, b) => b - a); // Sort scores in descending order
    localStorage.setItem("leaderboard", JSON.stringify(leaderboard));
  }
  
  function displayLeaderboard() {
    const leaderboard = JSON.parse(localStorage.getItem("leaderboard")) || [];
    leaderboardList.innerHTML = "";
    leaderboard.slice(0, 5).forEach((score, index) => {
      const li = document.createElement("li");
      li.textContent = `#${index + 1}: ${score} points`;
      leaderboardList.appendChild(li);
    });
  }
  
  function resetGame() {
    score = 0;
    currentLevel = 0;
    currentQuestionIndex = 0;
    levelElement.textContent = `Level: Easy`;
    scoreElement.textContent = `Score: 0`;
    loadQuestion();
  }
  
  // Start the quiz with the first question
  loadQuestion();
  