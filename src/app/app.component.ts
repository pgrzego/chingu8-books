import { HttpErrorResponse } from '@angular/common/http';
import { GoogleApiService } from './shared/services/google-api.service';
import { Component, OnInit } from '@angular/core';

import { BookShort } from './shared/models/book-short.model';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements OnInit {
  title = 'app';
  searchTerm: string;
  searchInProgress: boolean = false;
  noBooksFound: boolean = false;
  books: BookShort[];

  constructor(private googleApiService: GoogleApiService) {}

  ngOnInit() {}

  performSearch() {
    if (this.searchTerm == '') {
      return;
    }
    this.searchInProgress = true;
    this.noBooksFound = false;
    this.googleApiService.search(this.searchTerm).subscribe(
      ((books: BookShort[]) => {
        console.log("Books found", books);
        if (books.length > 0) {
          this.books = books;
        } else {
          this.books = [];
          this.noBooksFound = true;
        }
        this.searchInProgress = false;
      }),
      ((error: HttpErrorResponse) => {
        console.error(error);
        this.books = [];
        this.searchInProgress = false;
      })
    )
  }
}
