// Global variables

// Function for randomizing notes => returns array of notes
function noteRandomizer(num) {
    let notes = ['b', 'a', 'e', 'd', 'c2'];
    let sequence = [];

    for (let i = 0; i < num; i++) {
        sequence.push(notes[Math.floor(Math.random() * notes.length)]);
    }

    return sequence;
}

function matchSequence(sequence) {
    let newSequence = sequence.map((note) => {
        if (note === 'c1' || note === 'c2') {
            return 'c';
        }
        return note;
    })

    return newSequence;
}

// Note map indicating vertical location on page
const noteMap = new Map([
    ['b', '332px'],
    ['a', '388px'],
    ['e', '532px'],
    ['d', '576px'],
    ['c2', '612px']
]);

// Function to place note at initial position
function startNote(note) {
    let newNote = document.createElement('img');
    newNote.style.position = 'absolute';
    newNote.style.top = noteMap.get(note);
    newNote.style.left = '1100px';

    // CHANGE TO SWITCH STATEMENT TO USE CHARACTER IMAGES INSTEAD OF NOTES
    if (note === 'c2') {
        newNote.src = 'assets/uncroppedAnimalNotes/chicken.png';
    } else if (note === 'a') {
        newNote.src = 'assets/uncroppedAnimalNotes/alligator.png';
    } else if (note === 'b') {
        newNote.src = 'assets/uncroppedAnimalNotes/boy.png';
    } else if (note === 'd') {
        newNote.src = 'assets/uncroppedAnimalNotes/dog.png';
    } else if (note === 'e') {
        newNote.src = 'assets/uncroppedAnimalNotes/eagle.png';
    }

    document.getElementById('staff').appendChild(newNote);
}

// Function to move notes across the screen
// Change final xPosition based on location of end of staff
function slideNote(noteNode, xPosition) {
    let pushNote = setInterval(() => {
        if (xPosition < 200) {
            clearInterval(pushNote);
            noteNode.remove();
        }
        xPosition--;
        noteNode.style.left = xPosition + 'px';
    }, 5);
}

// Function to feed notes into staff
function noteFeeder(noteList, interval) {
    noteIndex = 0;
    let feeder = setInterval(() => {
        if (noteIndex >= noteList.length) {
            clearInterval(feeder);
            return;
        }
        startNote(noteList[noteIndex]);
        slideNote(document.getElementById('staff').lastChild, 1100);
        noteIndex++;
    }, interval);
}

// 
function playGame() {
    let noteSequence = noteRandomizer(10);
    let matchSeq = matchSequence(noteSequence);

    document.getElementById('body').addEventListener('keydown', (event) => {
        console.log(matchSeq);

        if (event.key == matchSeq[0]) {
            matchSeq.shift();
            console.log(matchSeq);
            document.getElementById('staff').firstElementChild.remove();
        }
    })

    noteFeeder(noteSequence, 2000);
}

// Test note placement on staff
function testStaff() {
    startNote('b');
    startNote('a');
    startNote('e');
    startNote('d');
    startNote('c2');
}

const audioPlayer = document.querySelectorAll("audioPlayer");
const playImage = document.querySelectorAll(".playImage");

playImage.forEach(image => {
    image.addEventListener("click", function () {
        const audioId = image.getAttribute("data-audio");
        const audioPlayer = document.getElementById(audioId);
        audioPlayer.play()
    })
})

pauseButton.addEventListener("click", function () {
    audioPlayers.forEach(player => {
        player.pause();
    });
});
