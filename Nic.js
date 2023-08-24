// Global variables





// Function for randomizing notes => returns array of notes
function noteRandomizer(num) {
    let notes = ['c1', 'b', 'a', 'g', 'f', 'e', 'd', 'c2'];
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
    ['c1', '296px'],
    ['b', '332px'],
    ['a', '388px'],
    ['g', '444px'],
    ['f', '488px'],
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
        newNote.src = 'images/notec.png';
    } else {
        newNote.src = 'images/note.png';
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
    startNote('c1');
    startNote('b');
    startNote('a');
    startNote('g');
    startNote('f');
    startNote('e');
    startNote('d');
    startNote('c2');
}
