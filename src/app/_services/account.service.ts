import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { HttpClient, HttpHeaders, HttpParams } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { environment } from '@environments/environment';
import { User } from '@app/_models';
import { stringify } from 'querystring';

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

    constructor(
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
        let headers = new HttpHeaders()
 
        headers=headers.append('content-type','text/plain')
        headers=headers.append('Autorization','Bearer')
        headers=headers.append('Access-Control-Allow-Origin','http://localhost:4200')
        var body = JSON.stringify({id: id, secret: secret});
        return this.http.post<Token>(`${environment.apiUrl}/user/enroll`, body, {headers: headers});
    }

    logout() {
        // remove user from local storage and set current user to null
        localStorage.removeItem('user');
        this.userSubject.next(null);
        this.router.navigate(['/account/login']);
    }

    register(user: User) {
        return this.http.post(`${environment.apiUrl}/user/register`, user);
    }

    getAll() {
        return this.http.get(`${environment.apiUrl}/user/identities`)
        .pipe(map(response => {
            let users: User[] = response['response']['identities'];
            return users;
        }));
    }

    /* getById(id: string) {
        return this.http.get<User>(`${environment.apiUrl}/user/${id}`);
    } */

    /* update(id, params) {
        return this.http.put(`${environment.apiUrl}/user/${id}`, params)
            .pipe(map(x => {
                // update stored user if the logged in user updated their own record
                if (id == this.userValue.id) {
                    // update local storage
                    const user = { ...this.userValue, ...params };
                    localStorage.setItem('user', JSON.stringify(user));

                    // publish updated user to subscribers
                    this.userSubject.next(user);
                }
                return x;
            }));
    }

    delete(id: string) {
        return this.http.delete(`${environment.apiUrl}/user/${id}`)
            .pipe(map(x => {
                // auto logout if the logged in user deleted their own record
                if (id == this.userValue.id) {
                    this.logout();
                }
                return x;
            }));
    } */
}