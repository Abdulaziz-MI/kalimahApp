export default class MetaData {
    constructor(chapterIndex) {
        this.chapterIndex = chapterIndex;
    }

    async fetchData() {
        const response = await fetch('support/metadata.json');
        const data = await response.json();
        return data;
    }

    async setChapter(chapterIndex) {
        const data = await this.fetchData();
        if (chapterIndex == null) {
            chapterIndex = this.randomInt(0, data.length);
        }
        this.chapterIndex = chapterIndex;
        return data[chapterIndex];
    }

    randomInt(min, max) {
        return Math.floor(Math.random() * (max - min + 1)) + min;
    }

    async getData() {
        if (!this.data) {
            this.data = await this.fetchData();
        }
        return this.data;
    }

    async getRandomVerseByChapter() {
        const data = await this.getData();
        this.chapter = data[this.chapterIndex - 1];
        this.chapterName = `${this.chapter.name} (${this.chapter.translated_name})`;
        this.verseIndex = `${this.chapterIndex}:${this.randomInt(1, this.chapter.verse_count)}`;
    }

    async getMetadata() {
        await this.setChapter(null);
        await this.getRandomVerseByChapter();
        delete this.chapter;
        delete
            delete this.chapterIndex;
    }
}