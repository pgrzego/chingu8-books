export class BookShort {
    constructor(
        public link: string,
        public authors: string[],
        public title: string,
        public publisher: string,
        public publishedYear: number,
        public imgUrl: string
    ) {}
}