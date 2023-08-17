const myDiv = document.getElementById('myDiv');
const audio = new Audio('assets/gamemusic.mp3'); // Replace 'sound.mp3' with your actual sound file path

myDiv.addEventListener('click', () => {
    myDiv.style.display = 'none';
    audio.play(); // Play the audio file
});
