
 // global declaration
 const deckcard = document.querySelector('.deck');
 let toggledCard = [];
 let clockId;
 let clockOff = true;
 let time = 0;
 let moves = 0;
 let matched = 0;

// Shuffle function from http://stackoverflow.com/a/2450976
function shuffle(array) {
    var currentIndex = array.length, temporaryValue, randomIndex;

    while (currentIndex !== 0) {
        randomIndex = Math.floor(Math.random() * currentIndex);
        currentIndex -= 1;
        temporaryValue = array[currentIndex];
        array[currentIndex] = array[randomIndex];
        array[randomIndex] = temporaryValue;
    }

    return array;
}

// event for specifying wich area to deal with

  deckcard.addEventListener('click', function() {
    const clickTarget = event.target;
    if(validClick(clickTarget)){
      if(clockOff){
        startClock();
        clockOff = false;
      }
      toggleCard(clickTarget);
      addToTCards(clickTarget);
      // storing only 2 cards and test the match function
      if(toggledCard.length === 2){
          matchCards(clickTarget);
          addMoves();
          checkScore();
      }
    }

  });

  // checking if the clicked card is meeting all conditions
  function validClick(clickTarget){
    return(
      clickTarget.classList.contains('card')&&
      !clickTarget.classList.contains('match')&&
      toggledCard.length < 2 &&
      !toggledCard.includes(clickTarget)
    );
  }

  // opening and showing all cards
  function toggleCard(card) {
    card.classList.toggle('open');
    card.classList.toggle('show');
  }


  // storing cards in a empty array
  function addToTCards(clickTarget) {
    toggledCard.push(clickTarget);
  }

// matching cards
function matchCards(clickTarget) {
    if(
    toggledCard[0].firstElementChild.className ===
    toggledCard[1].firstElementChild.className
  ){
    toggledCard[0].classList.toggle('match');
    toggledCard[1].classList.toggle('match');
    toggledCard = [];
    matched++;
    const totalPairs = 8;
    if(matched === totalPairs){
      gameOver();
    }
  }
  else {

    setTimeout(()=>{
      toggleCard(toggledCard[0]);
      toggleCard(toggledCard[1]);
      toggledCard = [];
    },1000);
  }
}

// shuffling the cards
function shuffleDeck(){
  const cardsToShuffle = Array.from(document.querySelectorAll('.card'));
  const shuffledCards = shuffle(cardsToShuffle);
  for(card of shuffledCards){
    deckcard.appendChild(card);
  }
}


// counting moves
function addMoves(){
  moves++;
  const movetxt = document.querySelector('.moves')
  movetxt.innerHTML = moves;
}

// score checking for removing stars
function checkScore(){
  if(moves === 16 || moves === 20 || moves === 24){
    hideStar();
  }
}

// star hiding
function hideStar(){
  const stars = document.querySelectorAll('.stars li');
  for(star of stars){
    if(star.style.display !== 'none'){
      star.style.display = 'none';
      break;
    }
  }
}

// starting the timer
function startClock(){
  clockId = setInterval(()=> {
    time++;
    showTime();
  }, 1000);
}

// displying the timer in the Game
function showTime(){
  const clock = document.querySelector('.clock');
  const mins = Math.floor(time / 60);
  const secs = time % 60;
  if(secs < 10){
    clock.innerHTML = `${mins}:0${secs}`;
  }
  else {
    clock.innerHTML = `${mins}:${secs}`;
  }
}

// stopping the clock
function stopTime(){
  clearInterval(clockId);
}

// get stars function for another toggleModal function
function getStars() {
  stars = document.querySelectorAll('.stars li');
  starCount = 0;
  for(star of stars){
    if(star.style.display !== 'none'){
      starCount++;
    }
  }
  return starCount;
}

// modal window functions
function toggleModal() {
  const modal = document.querySelector('.modal_background');
  modal.classList.toggle('hide');
}
toggleModal();

function writeModalStats() {
  const timeStat = document.querySelector('.modal_time');
  const clockTime = document.querySelector('.clock').innerHTML;
  const movesStat = document.querySelector('.modal_moves');
  const starsStat = document.querySelector('.modal_stars');
  const stars = getStars();

  timeStat.innerHTML = `Time : ${clockTime}`;
  starsStat.innerHTML = `Starts : ${stars}`;
  movesStat.innerHTML = `Moves : ${moves}`;
}

// cancel button event
document.querySelector('.modal_cancel').addEventListener('click', function () {
  toggleModal();
});

// game reset and restart events
document.querySelector('.modal_reset').addEventListener('click', restartGame);
document.querySelector('.restart').addEventListener('click', gameReset);

// game reset + modal toggle for neater appearance
function restartGame() {
  matched = 0;
  gameReset();
  toggleModal();
  resetCards();
}
// game reset
function gameReset() {
  matched = 0;
  clockTimeReset();
  resetMoves();
  starsReset();
  cardsReset();
  shuffleDeck();
}

// saprate reset functions to make easy to read
function cardsReset() {
  const cards = document.querySelectorAll('.deck li')
  for(let card of cards){
    card.className = 'card';
  }
}

function clockTimeReset() {
  stopTime();
  clockOff = true;
  time = 0;
  showTime();
}

function resetMoves() {
  moves = 0;
  document.querySelector('.moves').innerHTML = moves;
}

function starsReset() {
  stars = 0;
  const starList = document.querySelectorAll('.stars li');
  for(star of starList){
    star.style.display = 'inline';
  }
}

// game over function
function gameOver() {
  stopTime();
  writeModalStats();
  toggleModal();
}

shuffleDeck();
writeModalStats();
toggleModal();
/*
 * set up the event listener for a card. If a card is clicked:
 *  - display the card's symbol (put this functionality in another function that you call from this one)
 *  - add the card to a *list* of "open" cards (put this functionality in another function that you call from this one)
 *  - if the list already has another card, check to see if the two cards match
 *    + if the cards do match, lock the cards in the open position (put this functionality in another function that you call from this one)
 *    + if the cards do not match, remove the cards from the list and hide the card's symbol (put this functionality in another function that you call from this one)
 *    + increment the move counter and display it on the page (put this functionality in another function that you call from this one)
 *    + if all cards have matched, display a message with the final score (put this functionality in another function that you call from this one)
 */
