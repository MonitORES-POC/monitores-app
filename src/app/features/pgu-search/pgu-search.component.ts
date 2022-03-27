import { Component, OnInit } from '@angular/core';
import { Observable, Subject } from 'rxjs';

import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { PGU } from 'src/app/_models';
import { PguService } from 'src/app/_services';


@Component({
  selector: 'app-pgu-search',
  templateUrl: './pgu-search.component.html',
  styleUrls: ['./pgu-search.component.css'],
})
export class PguSearchComponent implements OnInit {
  pgus$!: Observable<PGU[]>;
  private searchTerms = new Subject<string>();

  constructor(private pguService: PguService) {}

  ngOnInit(): void {
    /* this.pgus$ = this.searchTerms.pipe(
      // wait 300ms after each keystroke before considering the term
      debounceTime(300),

      // ignore new term if same as previous term
      distinctUntilChanged(),

      // switch to new search observable each time the term changes
      switchMap((term: string) => this.pguService.searchPGUs(term)),
    ); */
  }

  search(term: string): void {
    this.searchTerms.next(term);
  }
}
