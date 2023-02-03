import MetaData from './support/MetaData.js';
import VerseData from './support/VerseData.js';
import DomEngine from './support/DomEngine.js';

const domEngine = new DomEngine();

async function challenge() {
    await domEngine.getNewVerse();
}


await challenge()