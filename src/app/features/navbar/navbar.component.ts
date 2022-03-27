import { Component, OnInit } from '@angular/core';
import { User } from '@app/_models';
import { AccountService } from '@app/_services';

export interface Link {
  title: string;
  route: string;
  icon: string;
}

@Component({
  selector: 'app-navbar',
  templateUrl: './navbar.component.html',
  styleUrls: ['./navbar.component.css'],
})

export class NavbarComponent implements OnInit {
  user: User;
  userName: string = "Saul Escalona";
  userDescription: string = "ORES student Monitor";

  links: Link[] = [
    { title: 'Dashboard', route: '/dashboard', icon: 'dashboard' },
    { title: 'Settings', route: '/settings', icon: 'settings' },
  ];
  constructor(private accountService: AccountService) {
    this.accountService.userSubject.subscribe(x => this.user = x);
  }
  ngOnInit(): void {
  }
}
