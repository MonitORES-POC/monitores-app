import { Component, OnInit, Output, EventEmitter } from '@angular/core';
import { AccountService } from '@app/_services';

@Component({
  selector: 'app-toolbar',
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css']
})
export class ToolbarComponent implements OnInit {
  title = 'MonitORES';
  @Output() toggleSidenav: EventEmitter<any> = new EventEmitter();
  constructor(private accountService: AccountService) { }

  ngOnInit(): void {
  }

  logout() {
    this.accountService.logout();
  }
}
