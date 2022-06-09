import { Injectable } from '@angular/core';

import { BehaviorSubject, Observable, of } from 'rxjs';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { catchError, map, tap } from 'rxjs/operators';
import { PGU } from '@app/_models';
import { environment } from '@environments/environment';

@Injectable({
  providedIn: 'root',
})
export class PguService {
  private pgusUrl = `${environment.apiUrl}/pgus`;
  public currentPgu = new BehaviorSubject<PGU>(null);
  httpOptions = {
    headers: new HttpHeaders({ 'Content-Type': 'application/json', 'Access-Control-Allow-Origin': 'http://localhost:4200' }),
  };

  constructor(
    private http: HttpClient
    //private messageService: MessageService
  ) {}

  getPGUs(): Observable<PGU[]>{
    return this.http.get<PGU[]>(this.pgusUrl, this.httpOptions ).pipe(
      map(pgus => {
        return pgus.map(x => this.pguFromResponse(x))
      }),
     // tap((_) => this.log('fetched PGUs')),
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

  addPGU(pgu: PGU): Observable<any> {
    return this.http.post<any>(this.pgusUrl, JSON.stringify({newPgu: pgu}), this.httpOptions).pipe(
     // tap((_) => this.log(`added pgu id=${pgu.id}`)),
      catchError(this.handleError<any>('addPGU'))
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
    this.currentPgu.next(newPgu);
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
    var pgu:PGU = new PGU() !!A ENLEVEr et update PGU model!!
    pgu.id = pguResponse['ID']
    pgu.contractPower = pguResponse['ContractPower']
    pgu.installedPower = pguResponse['InstalledPower'];
    pgu.owner = pguResponse['Owner'];
    pgu.sourceTypeId = pguResponse['SourceTypeid'];
    pgu.statusId = pguResponse['StatusId'];
    return pgu;
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
