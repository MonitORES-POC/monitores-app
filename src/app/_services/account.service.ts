import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { stringify } from 'querystring';
import { PguService } from './pgu.service';

export interface Token {
    token: string;
}
export interface Response {
    response: Object;
}

@Injectable({ providedIn: 'root' })
export class AccountService {
    public userSubject: BehaviorSubject<User>; // private
    public user: Observable<User>;
    private key: string|null;
    httpOptions = {
        headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:4200' }),
      };

    constructor(
        private pguService: PguService,
        private router: Router,
        private http: HttpClient
    ) {
        this.key = 'user';
        this.userSubject = new BehaviorSubject<User>(JSON.parse(localStorage.getItem(this.key)!));
        this.user = this.userSubject.asObservable();
    }

    public get userValue(): User {
        return this.userSubject.value;
    }

    login(id, secret): Observable<Token> {
        var body = JSON.stringify({username: id, password: secret});
        return this.http.post<Token>(`${environment.apiUrl}/auth/login`, body, this.httpOptions);
    }

    logout() {
        // remove user from local storage and set current user to null
        this.pguService.currentPgu.complete();
        localStorage.removeItem('user');
        localStorage.removeItem('currentPgu');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    createUser(user: User) {
        return this.http.post(`${environment.apiUrl}/user/register`, user);
    }

    getAll() {
        return this.http.get(`${environment.apiUrl}/user/identities`)
        .pipe(map(response => {
            let users: User[] = response['response']['identities'];
            return users;
        }));
    }
}