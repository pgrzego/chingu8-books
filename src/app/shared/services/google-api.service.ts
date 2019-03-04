import { Injectable } from '@angular/core';
import { environment } from '../../../environments/environment';
import { HttpClient, HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map } from 'rxjs/operators';

import { BookShort } from './../models/book-short.model';

interface BookImageLinksShortInterface {
    thumbnail: string
}

interface BookVolumeInfoShortInterface {
    title: string,
    authors: string[],
    publisher: string,
    publishedDate: string,
    imageLinks: BookImageLinksShortInterface,
    language: string
}

interface BookShortInterface {
    selfLink: string,
    volumeInfo: BookVolumeInfoShortInterface
}

interface BookListShortInterface {
    items: BookShortInterface[]
}

@Injectable({
  providedIn: 'root'
})
export class GoogleApiService {
    private googleApiKey = environment.googleApiKey;
    private googleApiBaseUrl = environment.googleApiBaseUrl;

    constructor (
        private http: HttpClient
    ) {}

    search(searchTerm: string): Observable<BookShort[]> {
        let params = new HttpParams().set(
            'fields',
            'items(selfLink,volumeInfo(authors,imageLinks/thumbnail,language,publishedDate,publisher,title))'
        ).set(
            'q',
            encodeURI(searchTerm)
        ).set(
            'key',
            this.googleApiKey
        )
        console.log("GoogleApiService.search: "+searchTerm);
        return this.http.get<BookListShortInterface>(
            this.googleApiBaseUrl+"volumes",
            {'params': params}
        ).pipe(
            map((receivedData: BookListShortInterface): BookShort[] => {
                if (Object.keys(receivedData).length == 0) {
                    return [];
                }
                return receivedData.items.map((bookInfo) => {
                    const imgRef = bookInfo.volumeInfo.imageLinks?bookInfo.volumeInfo.imageLinks.thumbnail:"";
                    const book = new BookShort(
                        bookInfo.selfLink,
                        bookInfo.volumeInfo.authors,
                        bookInfo.volumeInfo.title,
                        bookInfo.volumeInfo.publisher,
                        Number(bookInfo.volumeInfo.publishedDate),
                        imgRef
                    );
                    return book;
                });
            })
        )
    }
}