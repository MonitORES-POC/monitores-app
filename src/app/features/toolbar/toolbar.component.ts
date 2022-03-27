import { Component, OnInit, Output, EventEmitter } from '@angular/core';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  title = 'ORES Monitoring App';
  @Output() toggleSidenav: EventEmitter<any> = new EventEmitter();
  constructor() { }

  ngOnInit(): void {
  }
}
