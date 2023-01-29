import VerseDetails from './support/class.js';

const verses = []
let selectedVerse = 0

async function getVerseDetails(verse) {
  verse = new VerseDetails()
  verses.push(verse)
  verse.setRandomChapter()
  verse.getRandomVerseByChapter()
  await verse.getQuranAndAudio();
  await verse.getTafsir()
  console.log(selectedVerse);
  console.log(verses);
  return verse
}

await challenge();


console.log(verses[selectedVerse]);
console.log(selectedVerse);
console.log(verses);


let verseAudio = new Audio(verses[selectedVerse].audio);
const audioBtn = document.querySelector("#audioBtn");
audioBtn.addEventListener("click", (e) => {
  e.preventDefault()
  console.log(verses[selectedVerse])
  verseAudio.src = verses[selectedVerse].audio;
  return verseAudio ? verseAudio.play() : verseAudio.pause();
});

function refreshContent() {
  const verse = document.querySelector('#verse').innerHTML = verses[selectedVerse].verse
  const verseTranslated = document.querySelector("#verseTranslated").innerHTML = verses[selectedVerse].verseForChallenge
  const chapterName = document.querySelector("#chapterName").innerHTML = `${verses[selectedVerse].chapterName}, verse ${verses[selectedVerse].verseIndex}  `
  const missingWord = document.querySelector('#missingWord').innerHTML = verses[selectedVerse].missingWord
  const tafsir = document.querySelector('#tafsir').innerHTML = verses[selectedVerse].tafsir
  const tafsirName = document.querySelector('#tafsirName').innerHTML = `Tafsir: ${verses[selectedVerse].tafsirName}`
  const textInput = document.querySelector("#textInput");
  const submitBtn = document.querySelector("#submitBtn");
  const revealBtn = document.querySelector("#revealBtn");
  const hiddenContent = document.querySelector("#hiddenContent");
  const successMsg = document.querySelector("#successMsg");
  hiddenContent.hidden = true;
  revealBtn.innerHTML = "Reveal";
  submitBtn.innerHTML = "Submit";
  textInput.value = ""
  successMsg.innerHTML = ""
}

function showContent() {
  // tafsirH.hidden=false
  // missingWordH.hidden=false
  hiddenContent.hidden = false;
  readyNextVerse();
}

function inputLength() {
  return textInput.value.length;
}

function checkUserInput() {

  if (inputLength() == 0) {
    successMsg.innerHTML = "Please type a word";
  } else {
    if (textInput.value.toLowerCase() === verses[selectedVerse].missingWord) {
      successMsg.innerHTML = "Well done";
      showContent();
    } else {
      refreshContent();
      successMsg.innerHTML = "Try again or click reveal answer";
    }
  }
}

function readyNextVerse() {
  //   there is an error with this function next verse is constant

  revealBtn.innerHTML = "Next Verse";
  submitBtn.innerHTML = "Next Verse";

  submitBtn.removeEventListener("click", checkUserInput);
  submitBtn.addEventListener("click", challenge);

  revealBtn.removeEventListener("click", revealAnswer);
  revealBtn.addEventListener("click", challenge);

}

// # when the user gives up reveal the right answers, not sure how to explain this
function revealAnswer() {
  if (hiddenContent.hidden) {
    showContent();
  }
}
console.log(selectedVerse);
previousVerse.addEventListener("click", function () {selectedVerse = selectedVerse - 1
  console.log(selectedVerse), challenge(); return challenge()})
nextVerse.addEventListener("click", function () {  selectedVerse = selectedVerse + 1
  console.log(selectedVerse), challenge(); return challenge()})

async function challenge() {
  // # hiding the answer from the beginning
  await getVerseDetails();
  refreshContent();
  //   there is an issue witht the buttons possibly due to this

  
  submitBtn.removeEventListener("click", challenge);
  submitBtn.addEventListener("click", checkUserInput);
  
  revealBtn.removeEventListener("click", challenge);
  revealBtn.addEventListener("click", revealAnswer);



  textInput.addEventListener("keypress", (event) => {
    if (event.keyCode === 13) {
      // key code of the keybord key
      event.preventDefault();
      checkUserInput();
    }
  });
}




// update selected verse value on user interaction
// document.querySelector("#verseSelector").addEventListener("change", (e) => {
//     e.preventDefault()
//     selectedVerse = e.target.value;
// });
