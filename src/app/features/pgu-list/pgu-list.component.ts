import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { Router } from '@angular/router';
import { WebSocketService } from '@app/_services/web-socket.service';
import { concatMap } from 'rxjs';
import { PGU } from 'src/app/_models';
import { PguService } from 'src/app/_services';

@Component({
  selector: 'app-pgu-list',
  templateUrl: './pgu-list.component.html',
  styleUrls: ['./pgu-list.component.css']
})
export class PguListComponent implements OnInit {
  //public selectedId: number; // set default
  selectedPgu?: PGU;
  pgus = this.pguService.pguList$;


  constructor(private pguService: PguService, private router: Router, private ws: WebSocketService) {
    const localStoragePgu = localStorage.getItem('currentPgu');
    if(localStoragePgu !==undefined && localStoragePgu !== null) {
      const currentPguLocalStorage:PGU = JSON.parse(localStoragePgu);
      this.selectedPgu = currentPguLocalStorage;
    }
  }

  ngOnInit(): void {
    this.pguService
      .getPGUs()
      .pipe(
        concatMap((pgus) => {
          this.pguService.setPgus(pgus);
          return this.pguService.currentPgu;
        })
      )
      .subscribe((pgu) => {
        this.selectedPgu = pgu;
        if (this.selectedPgu === undefined && this.selectedPgu === null) {
          this.pguService.setCurrentPGU(this.pgus[0]);
          //this.reloadRoute();
        }
      });
  }

  getSelectedPgu(): PGU {
    return this.selectedPgu!;
  }

  changePGU(newSelectedPGU: PGU) {
    if(this.selectedPgu !== undefined && newSelectedPGU.id === this.selectedPgu.id) {
      return;
    }
    this.pguService.setCurrentPGU(newSelectedPGU);
    this.selectedPgu = newSelectedPGU;
    this.reloadRoute();
  }


  reloadRoute() {
    const currentURL = this.router.url;
    this.router
      .navigateByUrl('void', { skipLocationChange: true })
      .then(() => this.router.navigate([currentURL]));
  }
}
