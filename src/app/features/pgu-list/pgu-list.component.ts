import { Component, EventEmitter, OnInit, Output } from '@angular/core';
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
  pgus: PGU[]= [];
  //@Output() selectIdUpdate: EventEmitter<any> = new EventEmitter<any>();
  /* updateParent(){
    this.selectedPgu = this.pgus.find(pgu => pgu.id  == this.selectedId)
    this.selectIdUpdate.emit();
  } */

  constructor(private pguService: PguService) { 
    //this.pguService.getPGU(this.selectedId).subscribe(pgu => this.selectedPgu = pgu);
  }

  ngOnInit(): void {
    this.getPGUs();
    this.pguService.currentPgu.subscribe(pgu => this.selectedPgu = pgu)
    if(!this.selectedPgu){
      this.pguService.setCurrentPGU(this.pgus[0]);
    }
  }

  /* onSelect(pgu: PGU): void {
    this.selectedPgu = pgu;
    this.messageService.add('PguListComponent: Selected hero id=${pgu.id}')
  } */

  getPGUs(): void {
    this.pguService.getPGUs().subscribe(pgus => this.pgus = pgus);
  }

  delete(pgu: PGU): void {
    this.pgus = this.pgus.filter(p => p !== pgu);
    this.pguService.deletePGU(pgu.id).subscribe();
  }

  getSelectedPgu(): PGU {
    return this.selectedPgu!;
  }

  changePGU(newSelectedPGU: PGU){
    this.pguService.setCurrentPGU(newSelectedPGU);
  } 

  comparePGU(p1: PGU, p2: PGU): boolean {
    return p1 && p2 ? p1.id === p2.id: p1 === p2;
  }
}
