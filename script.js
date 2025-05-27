const cards = document.querySelectorAll('.card');
let flippedCards = [];
let matchedCount = 0;
const totalPairs = cards.length / 2;

const message = document.createElement('div');
message.id = 'resultMessage';
document.body.appendChild(message);

const timerDisplay = document.getElementById('timer');
let timerInterval;
let timeLeft = 60;

function startTimer() {
  clearInterval(timerInterval);
  timeLeft = 60;
  updateTimerDisplay();

  timerInterval = setInterval(() => {
    timeLeft--;
    updateTimerDisplay();

    if (timeLeft <= 0) {
      clearInterval(timerInterval);
      message.textContent = "⏰ Time’s up! You lose!";
      message.style.color = "red";
      disableAllCards();
      reportResult("lose");
    }
  }, 1000);
}

function updateTimerDisplay() {
  const minutes = Math.floor(timeLeft / 60);
  const seconds = timeLeft % 60;
  timerDisplay.textContent = `⏱ ${minutes}:${seconds.toString().padStart(2, '0')}`;

  if (timeLeft <= 10) {
    timerDisplay.style.color = '#ff4444';
    timerDisplay.style.borderColor = '#ff4444';
  } else if (timeLeft <= 30) {
    timerDisplay.style.color = '#ffaa00';
    timerDisplay.style.borderColor = '#ffaa00';
  } else {
    timerDisplay.style.color = '#ffcc00';
    timerDisplay.style.borderColor = '#888';
  }
}

function disableAllCards() {
  cards.forEach(card => card.removeEventListener('click', handleClick));
}

function enableCards() {
  cards.forEach(card => card.addEventListener('click', handleClick));
}

function handleClick() {
  if (
    this.classList.contains('flipped') ||
    this.classList.contains('matched') ||
    flippedCards.length >= 2
  ) return;

  this.classList.add('flipped');
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;
    if (first.dataset.value === second.dataset.value) {
      setTimeout(() => {
        first.classList.add('matched');
        second.classList.add('matched');
        checkWin();
        resetFlipped();
      }, 600);
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        resetFlipped();
      }, 1000);
    }
  }
}

function setCardContent(card, value) {
  card.innerHTML = `
    <div class="card-inner">
      <div class="card-front"></div>
      <div class="card-back">
        <img src="${value}.png" alt="${value}">
      </div>
    </div>
  `;
}

function resetFlipped() {
  flippedCards = [];
}

function checkWin() {
  matchedCount++;
  if (matchedCount === totalPairs) {
    clearInterval(timerInterval);
    message.textContent = "🎉 Success! You win!";
    message.style.animation = "pulse 1s infinite alternate";
    reportResult("win");
  }
}

function resetGame() {
  shuffleCards();
  flippedCards = [];
  matchedCount = 0;
  message.textContent = '';
  message.style.animation = '';
  message.style.color = 'lime';
  enableCards();
  startTimer();
}

function shuffleCards() {
  const grid = document.querySelector('.grid');
  const cardArray = Array.from(cards);

  const shuffledCards = cardArray.sort(() => Math.random() - 0.5);
  shuffledCards.forEach(card => grid.appendChild(card));

  const values = shuffledCards.map(card => card.dataset.value).sort(() => Math.random() - 0.5);
  shuffledCards.forEach((card, i) => {
    card.dataset.value = values[i];
    card.classList.remove('flipped', 'matched');
    setCardContent(card, values[i]);
  });
}

function reportResult(outcome) {
  fetch('/api/game-result', {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json'
    },
    body: JSON.stringify({
      result: outcome,
      timeLeft: timeLeft
    })
  }).catch(err => {
    console.error("Failed to send game result:", err);
  });
}

document.getElementById('resetBtn').addEventListener('click', resetGame);

// Initialize game on page load
cards.forEach(card => setCardContent(card, card.dataset.value));
enableCards();
resetGame();
