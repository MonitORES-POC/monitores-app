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
    //private messageService: MessageService
  ) {
    const localStoragePgu = localStorage.getItem('currentPgu');
    if(localStoragePgu !==undefined && localStoragePgu !== null) {
      const currentPguLocalStorage:PGU = JSON.parse(localStoragePgu);
      this.setCurrentPGU(currentPguLocalStorage);
    }
  }

  getPGUs(): Observable<PGU[]>{
    return this.http.get<PGU[]>(this.pgusUrl, this.httpOptions ).pipe(
    /*   mergeMap(pgus => {
        //throw error for demonstration
        if(pgus !== null && pgus !== undefined && this.pguListSubject.value !== null && this.pguListSubject.value !== undefined ) {
          if (this.pguListSubject.value.length > pgus.length) {
            return throwError(() => new Error('pgu list'));
          }
          this.setPgus(pgus);
        }
        return of(pgus.map(x => this.pguFromResponse(x)));
      }), */
      //retry 2 times on error
      retryWhen(errors =>
        errors.pipe(
          //log error message
          tap((_) => console.log(`Problem with pgu list`)),
          //restart in 6 seconds
          delayWhen((_)  => timer(1500))
        )),
      catchError(this.handleError<PGU[]>('getPGUs', []))
    );
  }

  getPGU(id: Number): Observable<PGU> {
    return this.http.get<PGU>(this.pgusUrl+'/'+id, this.httpOptions).pipe(
      map(pgu => this.pguFromResponse(pgu)),
      // tap((_) => this.log('fetched PGUs')),
       catchError(this.handleError<PGU>('getPGU', null))
     );
  }

  addPGU(pgu: PGU, isRespectful: boolean,fromHistoricalData: boolean): Observable<any> {
    return this.http.post<any>(this.pgusUrl, JSON.stringify({newPgu: pgu, isRespectful: isRespectful, fromHistoricalData: fromHistoricalData}), this.httpOptions).pipe(
     // tap((_) => this.log(`added pgu id=${pgu.id}`)),
      catchError(this.handleError<any>('addPGU'))
    );
  }

  submitConstraint(newConstraint: Constraint, id: number): Observable<any> {
    return this.http.post<any>(this.pgusUrl+'/constraint/'+id, JSON.stringify(newConstraint), this.httpOptions).pipe(
     // tap((_) => this.log(`added pgu id=${pgu.id}`)),
      catchError(this.handleError<any>('addPGU'))
    );
  }

  declareAlert(id: Number): Observable<any> {
    return this.http.get<any>(this.pgusUrl+'/alert/'+id, this.httpOptions).pipe(
      // tap((_) => this.log('fetched PGUs')),
       catchError(this.handleError<PGU>('getPGU', null))
     );
  }

  declareUrgency(id: Number): Observable<any> {
    return this.http.get<any>(this.pgusUrl+'/urgency/'+id, this.httpOptions).pipe(
      // tap((_) => this.log('fetched PGUs')),
       catchError(this.handleError<PGU>('getPGU', null))
     );
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

  /* GET pgus whose name contains search term */
  /* searchPGUs(term: string): Observable<PGU[]> {
    if (!term.trim()) {
      // if not search term, return empty PGU array.
      return of([]);
    }
    return this.http.get<PGU[]>(`${this.pgusUrl}/?name=${term}`).pipe(
      tap((x) =>
        x.length
          //? //this.log(`found pgus matching "${term}"`)
          //: //this.log(`no pgus matching "${term}"`)
      ),
      catchError(this.handleError<PGU[]>('searchPGUs', []))
    );
  } */

  /* private log(message: string) {
    this.messageService.add(`PguService: ${message}`);
  } */

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
  private pguFromResponse(pguResponse): PGU {
    return pguResponse;
  }

  /**
   * Handle Http operation that failed.
   * Let the app continue.
   * @param operation - name of the operation that failed
   * @param result - optional value to return as the observable result
   */
   private handleError<T>(operation = 'operation', result?: T) {
    return (error: any): Observable<T> => {
      // TODO: send the error to remote logging infrastructure
      console.error(error); // log to console instead

      // TODO: better job of transforming error for user consumption
      //this.log(`${operation} failed: ${error.message}`);

      // Let the app keep running by returning an empty result.
      return of(result as T);
    };
  }
}
