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

  cards: Card[] = [
    { title: 'PGU List', chart: 'pgu-list', cols: 1, rows: 5 },
    { title: 'Energy Production', chart: 'chart', cols: 4, rows: 5 },
    { title: 'PGU Details', chart: 'pgu-detail', cols: 2, rows: 4 },
    { title: 'PGU Infractions', chart: 'pgu-infractions', cols: 2, rows: 4 },
    { title: 'PGU Constraint', chart: 'pgu-constraint', cols: 1, rows: 4 },
  ];
  @ViewChild(PguListComponent) pguList!: PguListComponent;

  chartCols: number = 5;
  constructor(private pguService: PguService) {
  }
  ngOnInit(): void {
  }

}
