import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of, throwError, timer } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, delayWhen, map, mergeMap, retryWhen, tap } from 'rxjs/operators';
import { Constraint, PGU } from '@app/_models';
import { environment } from '@environments/environment';
import { WebSocketService } from './web-socket.service';

@Injectable({
  providedIn: 'root',
})
export class PguService {
  private pgusUrl = `${environment.apiUrl}/pgus`;
  public currentPgu = new BehaviorSubject<PGU>(null);
  private pguListSubject = new BehaviorSubject<PGU[]|undefined>([]);
  public pguList$ = this.pguListSubject.asObservable();

  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:4200' }),
  };

  constructor(
    private http: HttpClient,
    private ws: WebSocketService
  ) {
    const localStoragePgu = localStorage.getItem('currentPgu');
    if(localStoragePgu !==undefined && localStoragePgu !== null) {
      const currentPguLocalStorage:PGU = JSON.parse(localStoragePgu);
      this.setCurrentPGU(currentPguLocalStorage);
    }
  }

  getPGUs(): Observable<PGU[]>{
    return this.http.get<PGU[]>(this.pgusUrl, this.httpOptions ).pipe(
      catchError(this.handleError<PGU[]>('getPGUs', []))
    );
  }

  getPGU(id: Number): Observable<PGU> {
    return this.http.get<PGU>(this.pgusUrl+'/'+id, this.httpOptions).pipe(
      map(pgu => pgu),
       catchError(this.handleError<PGU>('getPGU', null))
     );
  }

  addPGU(pgu: PGU, isRespectful: boolean,fromHistoricalData: boolean): Observable<any> {
    return this.http.post<any>(this.pgusUrl, JSON.stringify({newPgu: pgu, isRespectful: isRespectful, fromHistoricalData: fromHistoricalData}), this.httpOptions).pipe(
      catchError(this.handleError<any>('addPGU'))
    );
  }

  submitConstraint(newConstraint: Constraint, id: number): Observable<any> {
    return this.http.post<any>(this.pgusUrl+'/constraint/'+id, JSON.stringify(newConstraint), this.httpOptions).pipe(
      catchError(this.handleError<any>('addPGU'))
    );
  }

  declareAlert(id: Number): Observable<any> {
    return this.http.get<any>(this.pgusUrl+'/alert/'+id, this.httpOptions).pipe(
       catchError(this.handleError<PGU>('getPGU', null))
     );
  }

  declareUrgency(id: Number): Observable<any> {
    return this.http.get<any>(this.pgusUrl+'/urgency/'+id, this.httpOptions).pipe(
       catchError(this.handleError<PGU>('getPGU', null))
     );
  }

  setCurrentPGU(newPgu : PGU) {
    localStorage.setItem('currentPgu', JSON.stringify(newPgu));
    console.log('new pgu');
    this.currentPgu.next(newPgu);
    this.ws.getCurrentBuffer(newPgu.id);
  }

  setPgus(newPgus : PGU[]) {
    this.pguListSubject.next(newPgus);
  }

  get pgusListValue() {
    return this.pguListSubject.value;
  }

  /* updatePGU(pgu: PGU): Observable<any> {
    return this.http.put(this.pgusUrl, pgu, this.httpOptions).pipe(
     // tap((_) => this.log(`updated pgu id=${pgu.id}`)),
      catchError(this.handleError<any>('updatePGU'))
    );
  } */

  /* deletePGU(id: number): Observable<any> {
    var body = { // TODO refactor all smart contracts bodies
      method: this.PGUMonitorContractMethod.deletePGU,
      args: [
        id
      ]
    }
    return this.http.post<any>(this.pgusUrl,  JSON.stringify(body), this.httpOptions).pipe(
     // tap((_) => this.log(`deleted pgu id=${id}`)),
      catchError(this.handleError<any>('deletePGU'))
    );
  } */

   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      console.error(error); 
      return of(result as T);
    };
  }
}
