import MetaData from "./MetaData.js"
import VerseData from './VerseData.js'



export default class DomEngine {
  constructor() {

    this.metadata = new MetaData();

    this.verses = []
    this.selectedVerse = 0
    this.verse = document.querySelector('#verse')
    this.verseTranslated = document.querySelector("#verseTranslated")
    this.chapterName = document.querySelector("#chapterName")
    this.missingWord = document.querySelector('#missingWord')
    this.tafsir = document.querySelector('#tafsir')
    this.tafsirName = document.querySelector('#tafsirName')
    this.tafsirEnglishName = document.querySelector('#tafsirEnglishName')
    this.textInput = document.querySelector("#textInput");
    this.submitBtn = document.querySelector("#submitBtn");
    this.revealBtn = document.querySelector("#revealBtn");
    this.hiddenContent = document.querySelector("#hiddenContent");
    this.successMsg = document.querySelector("#successMsg");
    this.audioPlayer = document.querySelector("#audioPlayer");
    this.reciterName = document.querySelector('#reciterName')
    this.previousVerseBtn = document.querySelector("#previousVerseBtn")
    this.nextVerseBtn = document.querySelector("#nextVerseBtn")

    this.submitBtn.addEventListener("click", this.checkUserInput.bind(this));
    this.revealBtn.addEventListener("click", this.revealAnswer.bind(this));
    this.textInput.addEventListener("keypress", this.checkEnterKeyInput.bind(this));
    this.previousVerseBtn.addEventListener("click", this.goToPreviousVerse.bind(this));
    this.nextVerseBtn.addEventListener("click", this.goToNextVerse.bind(this));

  }
  setDomValues(verseDetails) {
    this.verse.innerHTML = verseDetails.verse
    this.verseTranslated.innerHTML = verseDetails.verseForChallenge
    this.chapterName.innerHTML = `${verseDetails.chapterName}, verse ${verseDetails.verseIndex}  `
    this.missingWord.innerHTML = verseDetails.missingWord
    this.tafsir.innerHTML = verseDetails.tafsir
    this.tafsirName.innerHTML = `${verseDetails.tafsirName}`
    this.tafsirEnglishName.innerHTML = `${verseDetails.tafsirEnglishName}`
    this.hiddenContent.hidden = true;
    this.textInput.value = ""
    this.successMsg.hidden = false
    this.successMsg.innerHTML = ""
    this.reciterName.innerHTML = verseDetails.reciterName;
    this.verseAudio = this.verses[this.selectedVerse].audio
    this.audioPlayer.src = this.verseAudio
  }


  async goToNextVerse() {
    this.selectedVerse++
    // console.log(this.selectedVerse)
    if (this.selectedVerse < this.verses.length)
      this.setDomValues(this.verses[this.selectedVerse])
    else
      await this.getNewVerse()

  }

  goToPreviousVerse() {
    this.selectedVerse = this.selectedVerse == 0 ? 0 : this.selectedVerse - 1
    this.setDomValues(this.verses[this.selectedVerse])
    // console.log(this.selectedVerse)
    // console.log(this.verses[this.selectedVerse])

  }

  inputLength() {
    return textInput.value.length;
  }

  checkUserInput() {
    console.log(this.inputLength());
    if (this.inputLength() === 0) {
      successMsg.innerHTML = "Please type a word";
    } else {
      if (textInput.value.toLowerCase() === this.verses[this.selectedVerse].missingWord) {
        successMsg.innerHTML = "Well done";
        this.showContent();
      } else {
        successMsg.innerHTML = "Try again or click reveal answer";
      }
    }
  }

  checkEnterKeyInput(event) {
    if (event.keyCode === 13) {
      this.checkUserInput();
    }
  }

  showContent() {
    return hiddenContent.hidden = false;
  }

  revealAnswer() {
    if (hiddenContent.hidden) {
      this.successMsg.hidden = true
      this.showContent();
    }
  }


  async getNewVerse() {
    await this.metadata.getMetadata();
    // console.log(this.metadata);
    // console.log(this.metadata.verseIndex);
    // using the verse Index for the API
    const verseData = new VerseData(this.metadata.verseIndex);
    await verseData.getDataFromAPI();
    const verseDetails = { ...this.metadata, ...verseData };
    // console.log(verseDetails);
    // pushing verse details into one array for the prev/next functionality 
    this.verses.push(verseDetails);
    // console.log(this.verses);
    this.setDomValues(verseDetails);
  }

}