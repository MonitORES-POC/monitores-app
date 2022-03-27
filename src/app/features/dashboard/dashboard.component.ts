import { Component, OnInit, ViewChild } from '@angular/core';
import { PGU } from 'src/app/_models';
import { PguService } from 'src/app/_services';
import { PguListComponent } from '../pgu-list/pgu-list.component';


export interface Card {
  title: string;
  cols: number;
  rows: number;
  chart: string;
}

@Component({
  selector: 'app-dashboard',
  templateUrl: './dashboard.component.html',
  styleUrls: ['./dashboard.component.css'],
})
export class DashboardComponent implements OnInit {
  /* selectedPgu!: PGU;
  pgus: PGU[] = []; */
  cards: Card[] = [
    { title: 'PGU List', chart: 'pgu-list', cols: 1, rows: 1 },
    { title: 'Energy Production', chart: 'chart', cols: 3, rows: 1 },
    { title: 'Penalties', chart: 'penalties', cols: 1, rows: 1 },
    { title: 'PGU Details', chart: 'pgu-detail', cols: 5, rows: 1 },
  ];
  @ViewChild(PguListComponent) pguList!: PguListComponent;

  chartCols: number = 5;
  constructor(private pguService: PguService) {
    /* this.pguService.getPGU(2).subscribe((pgu) => (this.selectedPgu = pgu)); */
  }

  ngOnInit(): void {
    /* this.getPGUs(); */
  }

 /*  getPGUs(): void {
    this.pguService
      .getPGUs()
      .subscribe((pgus) => (this.pgus = pgus));
  }
 */
/*   updateSelect(): void {
    this.selectedPgu = this.pguList.getSelectedPgu();
  } */
}
