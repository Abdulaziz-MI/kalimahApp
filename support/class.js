// from github
import data from './metadata.json' assert { type: 'json' };

export default class VerseDetails {
    constructor(chapterIndex) {
        this.chapterIndex = chapterIndex
        // egt api from here
    }
    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }
    setRandomChapter() {
        this.chapterIndex = this.randomInt(0, data.length)
    }

    // ********* this  will return a random verse from a specific surah number using the parametre
    getRandomVerseByChapter(chapterIndex) {
        this.chapter = data[this.chapterIndex - 1]
        // console.log(this.chapter);
        // this.chapterNumber = this.chapter.chapter
        // console.log(this.chapterNumber);
        this.chapterName = `${this.chapter.name} (${this.chapter.translated_name})`
        // this.chapterEngName = chapter.translated_name
        // console.log(this.chapterName);
        this.verseCount = this.chapter.verse_count
        // console.log(` Verse Count(${this.verseCount})`);
        this.randomVerse = this.randomInt(1, this.verseCount)
        // console.log(this.randomVerse);

        this.verseIndex = `${this.chapterIndex}:${this.randomVerse}`
    }

    // *********
    // The two params will be this by default but I plan to give users a choice.
    async getQuranAndAudio(translation = 131, reciter = 9) {
        const url =
            `https://api.quran.com/api/v4/verses/by_key/${this.verseIndex}?language=en
        &words=true&translations=${translation}&audio=${reciter}&fields=text_imlaei`;
        const response = await fetch(url)
        const json = await response.json();

        this.verse = json.verse.text_imlaei;
        this.verseTranslated = json.verse.translations[0].text;
        this.verseForChallenge = this.verseTranslated.split(" ");
        this.randomWordIndex = this.randomInt(0, this.verseForChallenge.length - 1);
        const regex = /[!"#$%""".&'(˹˺)*+,,-./:;<=>?@[\]^_`{|}~]/g;
        this.missingWord = this.verseForChallenge[this.randomWordIndex].replace(regex, "").toLowerCase();
        if (this.missingWord == "v") {
            this.missingWord = this.verseForChallenge[this.randomWordIndex].replace(regex, "").toLowerCase();
        }
        this.verseForChallenge[this.randomWordIndex] = "____";
        this.verseForChallenge = this.verseForChallenge.join(" ");
        this.audioFile = json.verse.audio.url
        this.audio = `https://verses.quran.com/${this.audioFile}`
        return {
            verse: this.verse,
            verseTranslated: this.verseTranslated,
            verseForChallenge: this.verseForChallenge,
            missingWord: this.missingWord,
            audio: this.audio
        }

    }

    // *********
    // This will be the default param but I plan to give users a choice.
    async getTafsir(tafsir = 14) {
        const url = `https://api.quran.com/api/v4/tafsirs/${tafsir}/by_ayah/${this.verseIndex}`;
        const response = await fetch(url);
        const json = await response.json();
        // console.log(json);
        this.tafsirName = json.tafsir.resource_name;
        this.translatedTafsirName = json.tafsir.translated_name.name;
        this.tafsirName = `${json.tafsir.resource_name} (${json.tafsir.translated_name.name})`
        // console.log(`${this.tafsirName} (${this.translatedTafsirName})`);
        this.tafsir = json.tafsir.text;
        return {
            tafsirName: this.tafsirName,
            tafsir: this.tafsir,

        }
    };


}
