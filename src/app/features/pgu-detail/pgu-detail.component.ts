import { Component, OnInit, Input, ChangeDetectorRef } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Location } from '@angular/common';
import { PguService } from 'src/app/_services';
import { PGU } from 'src/app/_models';

@Component({
  selector: 'app-pgu-detail',
  templateUrl: './pgu-detail.component.html',
  styleUrls: ['./pgu-detail.component.css'],
})
export class PguDetailComponent implements OnInit {
  pgu:PGU;
  
  isUpdate?: boolean;

  @Input() isDisplayOnly: boolean = false;

  constructor(
    private route: ActivatedRoute,
    private pguService: PguService,
    private location: Location,
    private cdRef: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    //this.getPGU(this._pguId);
    if(this.isDisplayOnly) {
      this.pguService.currentPgu.subscribe(pgu => {
        if(pgu[0] === undefined) {
          this.pgu = null;
        } else {
          this.pgu = pgu[0];
        }
      });
    } else {
      const id = Number(this.route.snapshot.paramMap.get('id'));
    if (id != -100) {
      //this.getPGU(id);
      this.pguService.currentPgu.subscribe(pgu => this.pgu = pgu);
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
    if (this.pgu) {
      if (this.isUpdate) {
        //this.pguService.updatePGU(this.pgu).subscribe(() => this.goBack());
      } else {
        this.pguService.addPGU(this.pgu).subscribe(() => this.goBack());
      }
    }
  }

  /* delete(): void {
    if(this.isUpdate) {
      this.pguService.deletePGU(this.pgu!.id).subscribe(() => this.goBack());
    }
  } */

  getTitle(): string {

    return this.pgu!.owner;

  }
}
