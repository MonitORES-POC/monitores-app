import { Injectable } from '@angular/core';
import { PGU } from '@app/_models';
import { InMemoryDbService } from 'angular-in-memory-web-api';

@Injectable({
  providedIn: 'root',
})
export class InMemoryDataService implements InMemoryDbService {
  createDb() {
    const pgus = [
      {id: 2, owner: "Wind Turbines BXL", sourceTypeId: 2, statusId:1, contractPower: 1000, installedPower: 5000},
      {id: 3, owner: "David Solar Pannels", sourceTypeId: 1, statusId:1, contractPower: 1000, installedPower: 5000},
      {id: 4, owner: "Wind Turbines CA", sourceTypeId: 2, statusId:1, contractPower: 1000, installedPower: 5000},
    ];
    return {pgus};
  }

  // Overrides the genId method to ensure that a pgu always has an id.
  // If the pgus array is empty,
  // the method below returns the initial number (11).
  // if the pgus array is not empty, the method below returns the highest
  // pgu id + 1.
  genId(pgus: PGU[]): number {
    return pgus.length > 0 ? Math.max(...pgus.map(pgu => pgu.id)) + 1 : 11;
  }
}