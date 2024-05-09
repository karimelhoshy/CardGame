document.addEventListener("DOMContentLoaded", function () {
  document.getElementById("nameForm").addEventListener("submit", submitForm);
});

function submitForm(event) {
  event.preventDefault();
  var name = document.getElementById("name").value;


  localStorage.setItem("playerName", name);

  // Redirect to game.html
  window.location.href = "game.html";
}

document.addEventListener("DOMContentLoaded", function () {
  startGame();
});

// Define the gameState object
const gameState = {
  deckId: "", // ID of the current deck
  playerHand: [], // Array to store the player's hand of cards
  computerHand: [], // Array to store the computer's hand of cards
  drawCard: null, // Object to store the current draw card
  drawCardColor: null,
  playerPoints: 0, // Player's current score
  computerPoints: 0, // Computer's current score
  remainingCards: 52, // Number of remaining cards in the deck
  playedByPlayer: null,
  playedByComp: null
};

function revealCardColor(card){
  let color = card.suit === "HEARTS" || card.suit === "DIAMONDS" ? "Red" : "Black";
  return `<span class="color-box" style="background-color:${color.toLowerCase()};"></span> ${color}`;
}

function startGame() {
  fetch("https://deckofcardsapi.com/api/deck/new/shuffle/?deck_count=1")
    .then((response) => response.json())
    .then((deck) => {
      // Save the deck_id for further use
      const deckId = deck.deck_id;
      gameState.deckId = deckId; 
      return fetch(
        `https://deckofcardsapi.com/api/deck/${deckId}/draw/?count=5`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      gameState.playerHand = data.cards;
      displayPlayerCards(data.cards);

      // Draw 5 cards for the computer
      return fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=5`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      gameState.computerHand = data.cards;
      displayComputerCards(data.cards);

      // Draw 1 card for the draw pile
      return fetch(
        `https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=1`
      );
    })
    .then((response) => response.json())
    .then((data) => {
      gameState.drawCard = data.cards[0];
      placeDrawCard(data.cards[0]);
      const drawCard = document.getElementById("draw-color");
      drawCard.innerHTML += revealCardColor(gameState.drawCard);
      gameState.drawCardColor = revealCardColor(gameState.drawCard);
    })
    .catch((error) => console.error("Error:", error));

    gameState.remainingCards -= 11;
}

function displayPlayerCards(playerCards) {
  const playerCardsDiv = document.getElementById("player-cards");
  playerCardsDiv.innerHTML = "";

  playerCards.forEach((card, index) => {
    const img = document.createElement("img");
    img.src = card.image;
    img.alt = `Card ${card.value} of ${card.suit}`;
    img.classList.add("card");
    img.addEventListener("click", () => playRound(card, index));
    playerCardsDiv.appendChild(img);
  });
}

function displayComputerCards(computerCards) {
  const computerCardsDiv = document.getElementById("computer-cards");
  computerCardsDiv.innerHTML = ""; // Clear any existing cards

  computerCards.forEach(() => {
    const img = document.createElement("img");
    img.src = "https://www.deckofcardsapi.com/static/img/back.png"; 
    img.alt = "Face-down card";
    img.classList.add("card"); 
    computerCardsDiv.appendChild(img);
  });
}

function placeDrawCard(drawCard) {
  const drawCardDiv = document.getElementById("draw-card");
  drawCardDiv.innerHTML = ""; // Clear the existing draw card

  const img = document.createElement("img");
  img.src = "https://www.deckofcardsapi.com/static/img/back.png"; 
  img.alt = "Face-down draw card";
  img.classList.add("card"); 
  drawCardDiv.appendChild(img);
}

// A helper function to translate card values into numbers
function cardValueToNumber(cardValue) {
  switch (cardValue) {
    case "ACE":
      return 1;
    case "2":
      return 2;
    case "3":
      return 3;
    case "4":
      return 4;
    case "5":
      return 5;
    case "6":
      return 6;
    case "7":
      return 7;
    case "8":
      return 8;
    case "9":
      return 9;
    case "10":
      return 10;
    case "JACK":
      return 11;
    case "QUEEN":
      return 12;
    case "KING":
      return 13;
    default:
      return 0; // For unexpected values
  }
}

// Function called when a player selects a card
function selectPlayerCard(card, index) {
  // Move the selected card to the player-played-card area
  displayPlayedCard(card, "player-played-card");
  gameState.playedByPlayer = card;

  // Have the computer select and play a card
  const computerCard = selectRandomComputerCard();
  setTimeout(() => {
    displayPlayedCard(computerCard, "computer-played-card");
    setTimeout(() => {
      displayPlayedCard(gameState.drawCard, "draw-card");
    }, 400);
  }, 800);
}

// Function to handle displaying the played card in the respective area
function displayPlayedCard(card, elementId) {
  const playedCardDiv = document.getElementById(elementId);
  playedCardDiv.innerHTML = ""; // Clear the previous card
  const img = document.createElement("img");
  img.src = card.image;
  img.alt = `Played card: ${card.value} of ${card.suit}`;
  playedCardDiv.appendChild(img);
}

function selectRandomComputerCard() {
  let colors = [];
  for (const element of gameState.computerHand) {
    if (element.suit === "HEARTS" || element.suit === "DIAMONDS") {
      colors.push("Red");
    } else {
      colors.push("Black");
    }
  }

  const drawCardColor = gameState.drawCard.suit === "HEARTS" || gameState.drawCard.suit === "DIAMONDS" ? "Red" : "Black";
  let cardIndex = colors.indexOf(drawCardColor);

  var played = null;

  // If there's a matching color card, use it; otherwise, pick a random card
  if (cardIndex != -1) {
    gameState.playedByComp = gameState.computerHand[cardIndex];
    played = gameState.playedByComp;
    return played;
  } else {
    gameState.playedByComp = gameState.computerHand[2];
    played = gameState.playedByComp;
    return played;
  }
}

function getSuitAndColor(card){
  const arr = [];
  arr.push(card.suit);
  if (card.suit === "HEARTS" || card.suit === "DIAMONDS") {
    arr.push("Red");
  } else {
    arr.push("Black");
  }

  return arr;
}

function getMatch(drawArr, cardArr){
  if(drawArr[0] == cardArr[0] && drawArr[1] == cardArr[1]){
    return 0;
  } else if (drawArr[1] == cardArr[1]){
    return 2;
  }else{
    return 4;
  }
}

function calculatePoints() {
  const compValue = cardValueToNumber(gameState.playedByComp.value);
  const drawValue = cardValueToNumber(gameState.drawCard.value);
  const playerValue = cardValueToNumber(gameState.playedByPlayer.value);
  const totalValue = compValue + playerValue + drawValue;

  if (compValue > drawValue && playerValue > drawValue) {
    return;
  } else if (compValue > drawValue && playerValue <= drawValue) {
    gameState.playerPoints += totalValue;
  } else if (playerValue > drawValue && compValue <= drawValue) {
    gameState.computerPoints += totalValue;
  } else {
    const drawSuitColor = getSuitAndColor(gameState.drawCard);
    const playerSuitColor = getSuitAndColor(gameState.playedByPlayer);
    const compSuitColor = getSuitAndColor(gameState.playedByComp);
    const compScore = drawValue - compValue + getMatch(drawSuitColor, compSuitColor);
    const playerScore = drawValue - playerValue + getMatch(drawSuitColor, playerSuitColor);

    if (compScore < playerScore) {
      gameState.computerPoints += totalValue;
    } else if (playerScore < compScore) {
      gameState.playerPoints += totalValue;
    }
  }

  updateScoreBoard();
}
function drawNewCards() {
  if (gameState.remainingCards >= 3) {
    fetch(`https://deckofcardsapi.com/api/deck/${gameState.deckId}/draw/?count=3`)
    .then((response) => response.json())
    .then((data) => {
      // Clear existing cards from the UI
      clearGameBoard();

      // Assign new cards to game state
      gameState.drawCard = data.cards[0];
      gameState.playerHand.push(data.cards[1]);
      gameState.computerHand.push(data.cards[2]);

      // Display new cards with delay
      setTimeout(() => displayHandWithDelay(gameState.playerHand, "player-cards"),1000);
      setTimeout(() => displayHandWithDelay(gameState.computerHand, "computer-cards", true), 1000);
      setTimeout(() => {
        placeDrawCard(gameState.drawCard);
        document.getElementById("draw-color").innerHTML = "Draw Card Color: " + revealCardColor(gameState.drawCard);
      }, 1000)

    })
    .catch((error) => console.error("Error:", error));
  } else {
    gameOver();
  }
}


function clearGameBoard() {
  document.getElementById("player-cards").innerHTML = "";
  document.getElementById("computer-cards").innerHTML = "";
  document.getElementById("draw-card").innerHTML = "";
  document.getElementById("draw-color").innerHTML = "Draw Card Color:";
}

function displayDrawCardWithDelay() {
  // Display draw card
  placeDrawCard(gameState.drawCard);
  document.getElementById("draw-color").innerHTML = "Draw Card Color: " + revealCardColor(gameState.drawCard);

  // Display player's new card after a delay
  setTimeout(() => {
    displaySingleCard(gameState.playerHand[gameState.playerHand.length - 1], "player-cards");
  }, 1000);

  // Display computer's new card after an additional delay
  setTimeout(() => {
    displaySingleCard(gameState.computerHand[gameState.computerHand.length - 1], "computer-cards", true);
  }, 1000);
}

function displayHandWithDelay(hand, elementId, isComputer = false) {
  hand.forEach((card, index) => {
    setTimeout(() => {
      displaySingleCard(card, elementId, isComputer);
    }, index * 500); // 2000ms delay between each card
  });
}


function displaySingleCard(card, elementId, isComputer = false) {
  const cardsDiv = document.getElementById(elementId);
  const img = document.createElement("img");
  img.src = isComputer ? "https://www.deckofcardsapi.com/static/img/back.png" : card.image;
  img.alt = isComputer ? "Face-down card" : `Card ${card.value} of ${card.suit}`;
  img.classList.add("card");
  if (!isComputer) {
    img.addEventListener("click", () => playRound(card));
  }
  cardsDiv.appendChild(img);
}


function updateScoreBoard() {
  const compScore = document.getElementById("computer-score");
  const playerScore = document.getElementById("player-score");

  // Check if the scores are actually changing to add the effect
  if (gameState.playerPoints != parseInt(playerScore.textContent.split(": ")[1])) {
    playerScore.classList.add("score-effect");
  }
  if (gameState.computerPoints != parseInt(compScore.textContent.split(": ")[1])) {
    compScore.classList.add("score-effect");
  }

  // Update the scoreboard
  compScore.textContent = "Computer Score: " + gameState.computerPoints;
  playerScore.textContent = "Player Score: " + gameState.playerPoints;

  // Remove the effect class after the animation duration
  setTimeout(() => {
    compScore.classList.remove("score-effect");
    playerScore.classList.remove("score-effect");
  }, 1000); // Match the duration of the animation
}


function resetForNextRound() {
  // Clear the played cards from the game state
  gameState.playedByComp = null;
  gameState.playedByPlayer = null;
  gameState.drawCard = null;
  gameState.drawCardColor = null;

  gameState.remainingCards -=1;

  // Clear the UI elements for the played cards and draw card
  const playedPlayerCardDiv = document.getElementById("player-played-card");
  const playedCompCardDiv = document.getElementById("computer-played-card");
  const drawCardDiv = document.getElementById("draw-card");
  const drawCardColorDiv = document.getElementById("draw-color");

  playedPlayerCardDiv.innerHTML = "";
  playedCompCardDiv.innerHTML = "";
  drawCardDiv.innerHTML = "";
  drawCardColorDiv.textContent = "Draw Card Color: ";

  // Check if enough cards remain to continue the game
  if (gameState.remainingCards > 2) {
    drawNewCards();
  } else {
    gameOver(); // Handle game over logic
  }
}


function discardCard(hand, card) {
  const cardIndex = hand.findIndex(c => c.code === card.code);
  if (cardIndex !== -1) {
    hand.splice(cardIndex, 1);
    gameState.remainingCards -= 1;
  }
}


function gameOver(){
   // Clear the UI elements for the played cards and draw card
   const playedPlayerCardDiv = document.getElementById("player-played-card");
   const playedCompCardDiv = document.getElementById("computer-played-card");
   const drawCardDiv = document.getElementById("draw-card");
   const drawCardColorDiv = document.getElementById("draw-color");
   const playerHand = document.getElementById("player-cards");
   const compHand = document.getElementById("computer-cards");

   playedPlayerCardDiv.innerHTML = "";
   playedCompCardDiv.innerHTML = "";
   drawCardDiv.innerHTML = "";
   drawCardColorDiv.textContent = "Draw Card Color:      ";
   playerHand.innerHTML = "";
   compHand.innerHTML = "";


   const resultDiv = document.getElementById("draw-card");
   gameState.computerPoints > gameState.playerPoints ? 
      (resultDiv.innerHTML = "COMPUTER WINS", resultDiv.classList.add("computer-wins")) : 
      (resultDiv.innerHTML = "YOU WIN !", resultDiv.classList.add("player-wins"));
  
   setTimeout(function() {
    saveGameResults(localStorage.getItem('playerName'), gameState.playerPoints,gameState.computerPoints);
    console.log(localStorage.getItem('latestGameResults'));
    }, 4000); 
 }



function playRound(card, index) {

  selectPlayerCard(card, index);
  setTimeout(() => {
    calculatePoints();
    setTimeout(() => {
    discardCard(gameState.playerHand, gameState.playedByPlayer);
    discardCard(gameState.computerHand, gameState.playedByComp);
    resetForNextRound();
    },2000);
}, 2000);
}

function saveGameResults(playerName, playerScore, computerScore) {
  const gameResults = {
    playerName: playerName,
    playerScore: playerScore,
    computerScore: computerScore,
    timestamp: new Date().toISOString() // ISO string of current date and time
  };
  // Save to local storage
  localStorage.setItem('latestGameResults', JSON.stringify(gameResults));
  
  resetGameState();
  // Navigate to results.html which will handle saving to Firestore
  setTimeout(() => {
    window.location.href = "results.html";
  }, 3500);
}


function resetGameState() {
  gameState.deckId = "";
  gameState.playerHand = [];
  gameState.computerHand = [];
  gameState.drawCard = null;
  gameState.drawCardColor = null;
  gameState.playerPoints = 0;
  gameState.computerPoints = 0;
  gameState.remainingCards = 52; // Reset to 52 if starting a new deck
  gameState.playedByPlayer = null;
  gameState.playedByComp = null;
}
