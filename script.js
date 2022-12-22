let verseDetails = {
  verse: "",
  surah: "",
  number: "",
  missingWord: "",
  verseAr: "",
  tafsir: "",
};

// function to apply when doing challenges from different specific juzzs. including the max verse
function randomInt(min, max) {
  return Math.floor(Math.random() * (max - min + 1)) + min;
}

// random verse from the whole quran
let randomVerse = randomInt(1, 6236);

let tafsir = "";

async function getEngVerseDetails() {
  let url = `https://api.alquran.cloud/v1/ayah/${randomVerse}/en.hilali`;
  let responseEn = await fetch(url);
  let json = await responseEn.json();
  let verse = json.data.text;
  let surah = json.data.surah.englishName;
  let number = json.data.numberInSurah;
  verse = verse.split(" ");
  let randomWordIndex = randomInt(0, verse.length - 1);
  const reg = '!"#$%&\'()*+,-./:;<=>?@[\\]^_`{|}~';
  let regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  let missingWord = verse[randomWordIndex].replace(regex, "").toLowerCase()
  if (missingWord = 'v'){
    missingWord = verse[randomWordIndex].replace(regex, "").toLowerCase()
  }
  console.log(`missingWord in getEnglishVerseDetails: ${missingWord}`);
  verse[randomWordIndex] = "____";
  verse = verse.join(" ");
  let verseDetails = {
    verse: verse,
    surah: surah,
    number: number,
    missingWord: missingWord,
    verseAr: String,
    tafsir: String,
  };

  return verseDetails;
}

async function getArabicVerseDetails() {
  let urlAr = `https://api.alquran.cloud/v1/ayah/${randomVerse}/ar`;
  let responseAr = await fetch(urlAr);
  let json = await responseAr.json();
  let verseAr = json.data.text;
  return verseAr;
}

async function getTafsir() {
  let urlTaf = `https://api.alquran.cloud/v1/ayah/${randomVerse}/ar.muyassar`;
  let responseTaf = await fetch(urlTaf);
  let json = await responseTaf.json();
  let tafsir = json.data.text;
  return tafsir;
}

let verseH = document.querySelector("#verse");
let surahH = document.querySelector("#surah");
let numberH = document.querySelector("#number");
let verseArH = document.querySelector("#verseAr");
let tafsirH = document.querySelector("#tafsir");
let textInput = document.querySelector("#textInput");
let submitBtn = document.querySelector("#submitBtn");
let revealBtn = document.querySelector("#revealBtn");
let missingWordH = document.querySelector("#missingWord");
let hiddenContent = document.querySelector("#hiddenContent");
let successMsg = document.querySelector("#successMsg");

function hideContent() {
  // tafsirH.hidden=true
  // missingWordH.hidden=true
  hiddenContent.hidden = true;
}

function showContent() {
  // tafsirH.hidden=false
  // missingWordH.hidden=false
  hiddenContent.hidden = false;
}

async function getVerseAndMissingWord() {
  console.log("getVerseAndMissingWord running")
  verseDetails = await getEngVerseDetails();
  verseDetails.verseAr = await getArabicVerseDetails();
  verseDetails.tafsir = await getTafsir();

  verseArH.innerHTML = verseDetails.verseAr;
  verseH.innerHTML = verseDetails.verse;
  surahH.innerHTML = verseDetails.surah + ', ' + verseDetails.number ;
//   numberH.innerHTML = verseDetails.number;
  tafsirH.innerHTML = verseDetails.tafsir;
  missingWordH.innerHTML = verseDetails.missingWord;
  return verseDetails;
}

function inputLength() {
  return textInput.value.length;
}

// # This function is needed to make the challenge case-sensitive, check the user\s input compared to the rigth answer, give a feedback message, and reveal the additional information only when the answer is correct
function checkUserInput() {

  console.log("verseDetails");
  console.log(verseDetails);

  console.log("textInput.value.toLowerCase()");
  console.log(textInput.value.toLowerCase());

  if(inputLength() == 0){
    successMsg.innerHTML = "please type a word"
  }

  else {
    
    if (textInput.value.toLowerCase() === verseDetails.missingWord) {
      showContent();
      successMsg.innerHTML = "Well done";
      goToNextVerse()
    } else {
      hideContent();
      successMsg.innerHTML = "Try again or click reveal answer";
    }  
  }

}

function goToNextVerse(){
  revealBtn.innerHTML = "Next Verse"
  submitBtn.innerHTML = "Next Verse"
  revealBtn.addEventListener("click", getVerseAndMissingWord)
  submitBtn.addEventListener("click", challenge)  
}

// # when the user gives up reveal the right answers, not sure how to explain this
function revealAnswer() {
  if (hiddenContent.hidden) {
    showContent();
  } else {
    goToNextVerse()
  }
}

function challenge() {
  // # hiding the answer from the beginning
  getVerseAndMissingWord();
  hideContent();

  submitBtn.addEventListener("click", checkUserInput)
  revealBtn.addEventListener("click", revealAnswer)
  textInput.addEventListener("keypress", (event)=> {
    if (event.keyCode === 13) { // key code of the keybord key
      event.preventDefault();
      checkUserInput()
    }
  });
}

challenge();
