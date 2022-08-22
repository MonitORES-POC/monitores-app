import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';
import { Constraint, PGU } from '@app/_models';
import { PguService } from '@app/_services';
import { WebSocketService } from '@app/_services/web-socket.service';

@Component({
  selector: 'app-pgu-constraint',
  templateUrl: './pgu-constraint.component.html',
  styleUrls: ['./pgu-constraint.component.css'],
})
export class PguConstraintComponent implements OnInit {
  public constraintForm = new FormGroup({
    powerLimit: new FormControl('', [Validators.required, Validators.min(0)]),
  });
  public latestConstraint?: Constraint;
  currentPgu?: PGU;
  isAlertOpened: boolean = false;
  isUrgencyOpened: boolean = false;

  constructor(private pguService: PguService, private ws: WebSocketService) {}

  ngOnInit(): void {
    this.pguService.currentPgu.subscribe((pgu) => (this.currentPgu = pgu));
    this.ws.outBufferEvent.subscribe(
      (updateListDto) => {
        if(updateListDto && updateListDto !== undefined) {
          if(updateListDto[updateListDto.length - 1].constraint.powerLimit >= 0) {
            this.latestConstraint =
            updateListDto[updateListDto.length - 1].constraint
          } 
        }
        
      }
        
    );
    this.ws.outUpdateEvent.subscribe(
      (update) => {
        if(this.currentPgu.id === update.id) {
          if(update.constraint.powerLimit >= 0) {
            this.latestConstraint =
            update.constraint
          } 
        }
      }
    );
  }

  declareAlert() {
    this.pguService.declareAlert(this.currentPgu.id).subscribe();
    this.isAlertOpened = !this.isAlertOpened;
  }

  declareUrgency() {
    this.pguService.declareUrgency(this.currentPgu.id).subscribe();
    this.isUrgencyOpened = !this.isUrgencyOpened;
  }

  onSubmit() {
    const now = new Date();
    const newConstraint = {
      applicationTime: new Date(now.getTime() + 60 * 5 * 1000).toString(),
      powerLimit: this.constraintForm.value.powerLimit,
    } as Constraint;
    this.latestConstraint = newConstraint;
    this.pguService
      .submitConstraint(newConstraint, this.currentPgu?.id)
      .subscribe();
  }
}
