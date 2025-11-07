let countriesData = [];
let correctCountry = null;
let score = 0;
let guessedLetters = [];
let wrongGuesses = 0;
const maxWrong = 5;

const hangmanImagePaths = [
  "./images/hangman-0.svg",
  "./images/hangman-1.svg",
  "./images/hangman-2.svg",
  "./images/hangman-3.svg",
  "./images/hangman-4.svg",
  "./images/hangman-5.svg",
];

fetch("./json/countries.json")
  .then((response) => response.json())
  .then((data) => {
    countriesData = data;
    startNewRound();
  })
  .catch((error) => console.error("Error loading JSON:", error));

function startNewRound() {
  const result = document.querySelector(".result");
  result.textContent = "";
  const container = document.querySelector(".options");
  container.innerHTML = "";
  document.querySelector(".flag").style.display = "block";
  document.querySelector(".hangman-image").style.display = "none";
  document.querySelector(".word").innerHTML = "";
  document.querySelector(".question").textContent =
    "Which country does the flag below belong to?";

  correctCountry =
    countriesData[Math.floor(Math.random() * countriesData.length)];
  document.querySelector(".flag").src = correctCountry.flag;

  const options = [correctCountry];
  while (options.length < 3) {
    const random =
      countriesData[Math.floor(Math.random() * countriesData.length)];
    if (!options.includes(random)) options.push(random);
  }

  options.sort(() => Math.random() - 0.5);
  options.forEach((country) => {
    const btn = document.createElement("button");
    btn.textContent = country.country;
    btn.onclick = () => handleCountryChoice(country);
    container.appendChild(btn);
  });
}

function handleCountryChoice(selectedCountry) {
  const result = document.querySelector(".result");
  const container = document.querySelector(".options");
  container.innerHTML = "";

  if (selectedCountry.country === correctCountry.country) {
    result.textContent = "✅ Correct! Now guess its capital!";
    result.style.color = "green";
    showCapitalHangman();
  } else {
    result.textContent = `❌ Wrong! The flag belongs to ${correctCountry.country}.`;
    result.style.color = "red";
    setTimeout(startNewRound, 1000);
  }
}

function showCapitalHangman() {
  const container = document.querySelector(".options");
  container.innerHTML = "";
  document.querySelector(".flag").style.display = "none";
  document.querySelector(".hangman-image").style.display = "block";
  document.querySelector(
    ".question"
  ).textContent = `Guess the capital of ${correctCountry.country}:`;

  guessedLetters = [];
  wrongGuesses = 0;

  updateHangmanUI();
  showWordProgress();
  showLetterButtons();
}

function showWordProgress() {
  const wordContainer = document.querySelector(".word");
  wordContainer.innerHTML = "";

  const capital = correctCountry.capital.toUpperCase();
  for (let letter of capital) {
    const span = document.createElement("span");
    span.textContent =
      letter === " " ? " " : guessedLetters.includes(letter) ? letter : "_";

    wordContainer.appendChild(span);
  }
}

function showLetterButtons() {
  const container = document.querySelector(".options");
  const alphabet = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";

  for (let letter of alphabet) {
    const btn = document.createElement("button");
    btn.textContent = letter;
    btn.onclick = () => handleLetterGuess(letter, btn);
    container.appendChild(btn);
  }
}

function handleLetterGuess(letter, btn) {
  btn.disabled = true;
  const result = document.querySelector(".result");
  const capital = correctCountry.capital.toUpperCase();

  if (capital.includes(letter)) {
    guessedLetters.push(letter);
    showWordProgress();

    const allRevealed = capital
      .split("")
      .every((ch) => ch === " " || guessedLetters.includes(ch));

    if (allRevealed) {
      result.textContent = "🎉 Well done! You guessed it right!";
      result.style.color = "green";
      score++;
      document.querySelector(".score").textContent = `Score: ${score}`;
      setTimeout(startNewRound, 3000);
    }
  } else {
    wrongGuesses++;
    updateHangmanUI();

    if (wrongGuesses >= maxWrong) {
      const result = document.querySelector(".result");
      const wordContainer = document.querySelector(".word");
      const optionsContainer = document.querySelector(".options");

      optionsContainer.innerHTML = "";
      wordContainer.innerHTML = "";
      result.textContent = `💀 You lost! The capital was:`;
      result.style.color = "red";
      const capital = correctCountry.capital.toUpperCase();
      for (let letter of capital) {
        const span = document.createElement("span");
        span.textContent = letter === " " ? "\u00A0" : letter;
        span.style.color = "#FF2E2E";
        span.style.borderBottom = "none";
        wordContainer.appendChild(span);
      }

      setTimeout(startNewRound, 3000);
    }
  }
}

function updateHangmanUI() {
  const hangmanImage = document.querySelector(".hangman-image");

  const stage = Math.min(wrongGuesses, maxWrong);

  hangmanImage.src = hangmanImagePaths[stage];
}
