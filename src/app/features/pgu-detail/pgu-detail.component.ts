import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { Location } from '@angular/common';
import { PguService } from 'src/app/_services';
import { PGU } from 'src/app/_models';
import { WebSocketService } from '@app/_services/web-socket.service';
import { AppConstants } from '@app/app.constants';
import { FormControl, FormGroup, Validators } from '@angular/forms';

@Component({
  selector: 'app-pgu-detail',
  templateUrl: './pgu-detail.component.html',
  styleUrls: ['./pgu-detail.component.css'],
})
export class PguDetailComponent implements OnInit {
  pgu: PGU;
  onBoardingPercentage?: number;
  status: string;
  sourceType: string;
  isUpdate?: boolean;
  public pguForm = new FormGroup({
    id: new FormControl('', [Validators.required, Validators.min(0)]),
    owner: new FormControl('', [Validators.required]),
    sourceTypeId: new FormControl('', [Validators.required]),
    contractPower: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    installedPower: new FormControl('', [
      Validators.required,
      Validators.min(0),
    ]),
    amplificationFactor: new FormControl(1, [
      Validators.required,
      Validators.min(0),
    ]),
    isRespectful: new FormControl(true, [Validators.required]),
    fromHistoricalData: new FormControl(true, [Validators.required]),
  });

  @Input() isDisplayOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private pguService: PguService,
    private location: Location,
    private ws: WebSocketService
  ) {}

  ngOnInit(): void {
    //this.getPGU(this._pguId);
    if (this.isDisplayOnly) {
      this.pguService.currentPgu.asObservable().subscribe((pgu) => {
        console.log('hey')
        if (pgu === null && pgu === undefined) {
          this.pgu = this.pguService.currentPgu.value !== null ? this.pguService.currentPgu.value : null;
          console.log(this.pgu)
        } else {
          this.sourceType = AppConstants.SourceTypeMap[pgu.sourceTypeId - 1];
          this.status = AppConstants.StatusMap[pgu.statusId];
          this.pgu = pgu;
        }
      });
      this.ws.outBufferEvent.subscribe((updateListDto) => {
        if (updateListDto && updateListDto !== undefined) {
          this.onBoardingPercentage =
            updateListDto[updateListDto.length - 1].onBoardPercentage;
        }
        if (
          this.pgu?.statusId === 0 &&
          (this.onBoardingPercentage === undefined ||
            this.onBoardingPercentage === null)
        ) {
          this.onBoardingPercentage = 0;
        }
      });
      this.ws.outUpdateEvent.subscribe((update) => {
        if (this.pguService.currentPgu.value?.id === update.id) {
          this.onBoardingPercentage = update.onBoardPercentage;
          if (
            this.pgu.statusId === 0 &&
            (this.onBoardingPercentage === undefined ||
              this.onBoardingPercentage === null)
          ) {
            this.onBoardingPercentage = 0;
          }
          this.status = AppConstants.StatusMap[update.statusId];
          this.pgu.statusId = update.statusId;
          this.pguService.setCurrentPGU(this.pgu);
        }
      });
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
      if (id != -100) {
        //this.getPGU(id);
        this.pguService.currentPgu.subscribe((pgu) => (this.pgu = pgu));
        this.isUpdate = true;
      } else {
        this.pgu = {} as PGU;
        this.isUpdate = false;
      }
    }
  }

  getPGU(id: number): void {
    this.pguService.getPGU(id).subscribe((pgu) => (this.pgu = pgu));
  }

  goBack(): void {
    this.location.back();
  }

  save(): void {
    if (this.pguForm.valid) {
      if (this.isUpdate) {
        //this.pguService.updatePGU(this.pgu).subscribe(() => this.goBack());
      } else {
        this.pgu = {
          id: this.pguForm.value.id,
          owner: this.pguForm.value.owner,
          statusId: 0,
          sourceTypeId: this.pguForm.value.sourceTypeId,
          contractPower: this.pguForm.value.contractPower,
          installedPower: this.pguForm.value.installedPower,
          amplificationFactor: this.pguForm.value.amplificationFactor,
        };
        this.pguService
          .addPGU(
            this.pgu,
            this.pguForm.value.isRespectful,
            this.pguForm.value.fromHistoricalData
          )
          .subscribe(() => {
            this.pguService.setCurrentPGU(this.pgu);
            this.pguService.setPgus(
              this.pguService.pgusListValue.concat([this.pgu])
            );
            this.router.navigateByUrl('dashboard');
          });
      }
    }
  }

  /* delete(): void {
    if(this.isUpdate) {
      this.pguService.deletePGU(this.pgu!.id).subscribe(() => this.goBack());
    }
  } */

  getTitle(): string {
    if (this.pgu && this.isUpdate) {
      return this.pgu!.owner;
    }
    return 'New PGU';
  }
}
