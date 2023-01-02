const verseH = document.querySelector("#verse");
const surahH = document.querySelector("#surah");
const numberH = document.querySelector("#number");
const verseArH = document.querySelector("#verseAr");
const tafsirH = document.querySelector("#tafsir");
const textInput = document.querySelector("#textInput");
const submitBtn = document.querySelector("#submitBtn");
const revealBtn = document.querySelector("#revealBtn");
const missingWordH = document.querySelector("#missingWord");
const hiddenContent = document.querySelector("#hiddenContent");
const successMsg = document.querySelector("#successMsg");

// function to apply when doing challenges from different specific juzzs. including the max verse
const randomInt = (min, max) => Math.floor(Math.random() * (max - min + 1)) + min;
let randomVerse;
async function getEngVerseDetails() {
  // random verse from the whole quran
randomVerse = randomInt(1, 6236);
  const url = `https://api.alquran.cloud/v1/ayah/${randomVerse}/en.hilali`;
  const responseEn = await fetch(url);
  const json = await responseEn.json();
  let verse = json.data.text;
  const surah = json.data.surah.englishName;
  const number = json.data.numberInSurah;
  verse = verse.split(" ");
  const randomWordIndex = randomInt(0, verse.length - 1);
  const regex = /[!"#$%&'()*+,-./:;<=>?@[\]^_`{|}~]/g;
  let missingWord = verse[randomWordIndex].replace(regex, "").toLowerCase();
  if ((missingWord == "v")) {
    missingWord = verse[randomWordIndex].replace(regex, "").toLowerCase();
  }
  console.log(`missingWord in getEnglishVerseDetails: ${missingWord}`);
  verse[randomWordIndex] = "____";
  verse = verse.join(" ");
  const verseDetails = {
    verse: verse,
    surah: surah,
    number: number,
    missingWord: missingWord,
  };

  return verseDetails;
}

 const getArabicVerseDetails = async () => {
  const urlAr = `https://api.alquran.cloud/v1/ayah/${randomVerse}/ar`;
  const responseAr = await fetch(urlAr);
  const json = await responseAr.json();
  const verseAr = json.data.text;
  return verseAr;
}

 const getTafsir = async () => {
  const urlTaf = `https://api.alquran.cloud/v1/ayah/${randomVerse}/ar.muyassar`;
  const responseTaf = await fetch(urlTaf);
  const json = await responseTaf.json();
  const tafsir = json.data.text;
  return tafsir;
}

const refreshContent = () => 
  // tafsirH.hidden=true
  // missingWordH.hidden=true
  hiddenContent.hidden = true;
  revealBtn.innerHTML = "Reveal";
  submitBtn.innerHTML = "Submit";
  textInput.value = "";
  successMsg.innerHTML = "";

const showContent = () => {
  // tafsirH.hidden=false
  // missingWordH.hidden=false
  hiddenContent.hidden = false;
  readyNextVerse();
}

 const getVerseAndMissingWord = async () => {
  console.log("getVerseAndMissingWord running");
  verseDetails = await getEngVerseDetails();
  verseDetails.verseAr = await getArabicVerseDetails();
  verseDetails.tafsir = await getTafsir();

  verseArH.innerHTML = verseDetails.verseAr;
  verseH.innerHTML = verseDetails.verse;
  surahH.innerHTML = verseDetails.surah + ", " + verseDetails.number;
  //   numberH.innerHTML = verseDetails.number;
  tafsirH.innerHTML = verseDetails.tafsir;
  missingWordH.innerHTML = verseDetails.missingWord;
  return verseDetails;
}

const inputLength = () => textInput.value.length;


// # This function is needed to make the challenge case-sensitive, check the user\s input compared to the rigth answer, give a feedback message, and reveal the additional information only when the answer is correct
function checkUserInput() {
  console.log("verseDetails");
  console.log(verseDetails);

  console.log("textInput.value.toLowerCase()");
  console.log(textInput.value.toLowerCase());

  if (inputLength() == 0) {
    successMsg.innerHTML = "please type a word";
  } else {
    if (textInput.value.toLowerCase() === verseDetails.missingWord) {
      successMsg.innerHTML = "Well done";
      showContent();
    } else {
      refreshContent();
      successMsg.innerHTML = "Try again or click reveal answer";
    }
  }
}

const readyNextVerse = () => {
  revealBtn.innerHTML = "Next Verse";
  submitBtn.innerHTML = "Next Verse";

  submitBtn.removeEventListener("click", checkUserInput);
  submitBtn.addEventListener("click", challenge);

  revealBtn.removeEventListener("click", revealAnswer);
  revealBtn.addEventListener("click", challenge);

}

// # when the user gives up reveal the right answers, not sure how to explain this
const revealAnswer = () => {if (hiddenContent.hidden) {
    showContent();
  }}

const challenge = () => {
  // # hiding the answer from the beginning
  getVerseAndMissingWord();
  refreshContent();

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

challenge();
