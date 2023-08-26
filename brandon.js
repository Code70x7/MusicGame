const myDiv = document.getElementById("myDiv");
const audio = new Audio("assets/gamemusic.mp3"); // Replace 'sound.mp3' with your actual sound file path

// Global variables
const startPos = 1100; // Horizontal starting position of notes on staff
const endPos = 200; // Horizontal end position of notes on staff before disappearing
let noteSpeed = 1; // Interval (ms) between note position decrement (i.e. travel speed)
let noteInterval = 2000; // Interval between subsequent notes in sequence
let noteNum = 10; // Number of notes in generated note sequence
let noteSeq = []; // Declare note sequence
let matchSeq = []; // Declare match sequence
let score = 0; // Player score

// Note map indicating vertical location on page
const noteMap = new Map([
  ["c1", "296px"],
  ["b", "332px"],
  ["a", "388px"],
  ["g", "444px"],
  ["f", "488px"],
  ["e", "532px"],
  ["d", "576px"],
  ["c2", "612px"],
]);

// Image source map
const imgMap = new Map([
  ["c1", "images/chicken.png"],
  ["b", "images/boy.png"],
  ["a", "images/alligator.png"],
  ["g", "images/gecko.png"],
  ["f", "images/fox.png"],
  ["e", "images/eagle.png"],
  ["d", "images/dog.png"],
  ["c2", "images/chicken.png"],
]);

myDiv.addEventListener("click", () => {
  myDiv.style.display = "none";
  startTimer(); //start timer
  audio.play(); // Play the audio file
});

// 30 Second Timer
const FULL_DASH_ARRAY = 283;
const WARNING_THRESHOLD = 10;
const ALERT_THRESHOLD = 5;

const COLOR_CODES = {
  info: {
    color: "green",
  },
  warning: {
    color: "orange",
    threshold: WARNING_THRESHOLD,
  },
  alert: {
    color: "red",
    threshold: ALERT_THRESHOLD,
  },
};
const TIME_LIMIT = timeCalc();
let timePassed = 0;
let timeLeft = TIME_LIMIT;
let timerInterval = null;
let remainingPathColor = COLOR_CODES.info.color;

document.getElementById("timer").innerHTML = `
        <div class="base-timer">
        <svg class="base-timer__svg" viewBox="0 0 100 100" xmlns="http://www.w3.org/2000/svg">
            <g class="base-timer__circle">
            <circle class="base-timer__path-elapsed" cx="50" cy="50" r="45"></circle>
            <path>
                id="base-timer-path-remaining"
                stroke-dasharray="283"
                class="base-timer__path-remaining ${remainingPathColor}"
                d="
                M 50, 50
                m -45, 0
                a 45,45 0 1,0 90,0
                a 45,45 0 1,0 -90,0
                "
            </path>
            </g>
        </svg>
        <span id="base-timer-label" class="base-timer__label">${formatTime(
          timeLeft
        )}</span>
        </div>`;

document.getElementById("timer").style.display = "none";

function onTimesUp() {
  clearInterval(timerInterval);
  document.getElementById("timer").style.display = "none";
  audio.pause();
  scoreCard();
  //restart button
}

function scoreCard() {
  document.getElementById(
    "score"
  ).innerHTML = `Times Up! You got <strong>${score}</strong> correct.`;
  document.getElementById("score").style.margin = "15px";
  document.getElementById("score").style.padding = "15px";
}

function startTimer() {
  document.getElementById("timer").style.display = "block";
  timerInterval = setInterval(() => {
    timePassed = timePassed += 1;
    timeLeft = TIME_LIMIT - timePassed;
    document.getElementById("base-timer-label").innerHTML =
      formatTime(timeLeft);
    setCircleDasharray();
    setRemainingPathColor(timeLeft);

    if (timeLeft === 0) {
      onTimesUp();
      //end game function
    }
  }, 1000);
}

function formatTime(time) {
  const minutes = Math.floor(time / 60);
  let seconds = time % 60;

  if (seconds < 10) {
    seconds = `0${seconds}`;
  }

  return `${minutes}:${seconds}`;
}

function setRemainingPathColor(timeLeft) {
  const { alert, warning, info } = COLOR_CODES;
  if (timeLeft <= alert.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(warning.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(alert.color);
  } else if (timeLeft <= warning.threshold) {
    document
      .getElementById("base-timer-path-remaining")
      .classList.remove(info.color);
    document
      .getElementById("base-timer-path-remaining")
      .classList.add(warning.color);
  }
}

function calculateTimeFraction() {
  const rawTimeFraction = timeLeft / TIME_LIMIT;
  return rawTimeFraction - (1 / TIME_LIMIT) * (1 - rawTimeFraction);
}

function setCircleDasharray() {
  const circleDasharray = `${(
    calculateTimeFraction() * FULL_DASH_ARRAY
  ).toFixed(0)} 283`;
  document
    .getElementById("base-timer-path-remaining")
    .setAttribute("stroke-dasharray", circleDasharray);
}

function timeCalc() {
  let time =
    ((startPos - endPos) * noteSpeed) / 1000 + (noteNum * noteInterval) / 1000;
  return Math.ceil(time);
}

// Function for randomizing notes => returns array of notes
function noteRandomizer(num) {
  let notes = ["c1", "b", "a", "g", "f", "e", "d", "c2"];
  let sequence = [];
  for (let i = 0; i < num; i++) {
    sequence.push(notes[Math.floor(Math.random() * notes.length)]);
  }
  return sequence;
}

// Function for converting note sequence to sequence for player to match
function matchSequence(sequence) {
  let newSequence = sequence.map((note) => {
    if (note === "c1" || note === "c2") {
      return "c";
    }
    return note;
  });
  return newSequence;
}

// Function to generate new sequences and store them globally
function generateSequence(noteNum) {
  noteSeq = noteRandomizer(noteNum);
  matchSeq = matchSequence(noteSeq);
}

// Function to place note at initial position
function startNote(note) {
  let newNote = document.createElement("img");
  newNote.style.position = "absolute";
  newNote.style.top = noteMap.get(note);
  newNote.style.left = startPos + "px";
  newNote.src = imgMap.get(note);
  /*if (note === 'c2') {
                newNote.src = 'images/notec.png';
            } else {
                newNote.src = 'images/note.png';
            }*/
  document.getElementById("staff").appendChild(newNote);
}

// Function to move notes across the screen
function slideNote(noteNode) {
  let xPosition = startPos;
  let pushNote = setInterval(() => {
    if (xPosition < endPos && document.contains(noteNode)) {
      // Change final xPosition based on location of end of staff
      clearInterval(pushNote);
      noteNode.remove();
      matchSeq.shift();
      console.log(matchSeq); // Debugging code; to be deleted
    } else if (xPosition < endPos) {
      clearInterval(pushNote);
    }
    xPosition--;
    noteNode.style.left = xPosition + "px";
  }, noteSpeed);
}

// Function to feed notes into staff
function noteFeeder(noteList) {
  noteIndex = 0;
  let feeder = setInterval(() => {
    if (noteIndex >= noteList.length) {
      clearInterval(feeder);
      return;
    }
    startNote(noteList[noteIndex]);
    slideNote(document.getElementById("staff").lastElementChild);
    noteIndex++;
  }, noteInterval);
}

//
function playGame() {
  score = 0; // Reinitialize score
  generateSequence(noteNum);

  document.getElementById("body").addEventListener("keydown", (event) => {
    // console.log(matchSeq); // Debugging code; to be deleted

    if (event.key == matchSeq[0]) {
      document.getElementById("staff").firstElementChild.remove();
      matchSeq.shift();
      console.log(matchSeq); // Debugging code; to be deleted
      score++;
      console.log(score);
    }
  });

  noteFeeder(noteSeq);
}

// Test note placement on staff
function testStaff() {
  startNote("c1");
  startNote("b");
  startNote("a");
  startNote("g");
  startNote("f");
  startNote("e");
  startNote("d");
  startNote("c2");
}
