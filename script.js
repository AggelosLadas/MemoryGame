const cards = document.querySelectorAll('.card');
let flippedCards = [];
let matchedCount = 0;
const totalPairs = cards.length / 2;

const message = document.createElement('div');
message.id = 'resultMessage';
message.style.marginTop = '30px';
message.style.fontSize = '24px';
message.style.color = 'lime';
document.body.appendChild(message);

cards.forEach(card => {
  card.addEventListener('click', handleCardClick);
});

function handleCardClick() {
  if (
    this.classList.contains('flipped') ||
    this.classList.contains('matched') ||
    flippedCards.length >= 2
  ) return;

  this.classList.add('flipped');
  this.textContent = this.dataset.value;
  flippedCards.push(this);

  if (flippedCards.length === 2) {
    const [first, second] = flippedCards;

    if (first.dataset.value === second.dataset.value) {
      setTimeout(() => {
        first.classList.add('matched');
        second.classList.add('matched');
        matchedCount++;
        checkWin();
        resetFlipped();
      }, 500);
    } else {
      setTimeout(() => {
        first.classList.remove('flipped');
        second.classList.remove('flipped');
        first.textContent = '';
        second.textContent = '';
        resetFlipped();
      }, 1000);
    }
  }
}

function resetFlipped() {
  flippedCards = [];
}

function checkWin() {
  if (matchedCount === totalPairs) {
    message.textContent = "🎉 Success! You win!";
    message.style.animation = "pulse 1s infinite alternate";
  }
}

document.getElementById('resetBtn').addEventListener('click', resetGame);

function resetGame() {
  shuffleCards();
  flippedCards = [];
  matchedCount = 0;
  message.textContent = '';
  message.style.animation = '';
}

function shuffleCards() {
  const values = [];
  cards.forEach(card => values.push(card.dataset.value));
  const shuffled = values.sort(() => Math.random() - 0.5);

  cards.forEach((card, i) => {
    card.textContent = '';
    card.classList.remove('flipped', 'matched');
    card.dataset.value = shuffled[i];
  });
}

shuffleCards();
