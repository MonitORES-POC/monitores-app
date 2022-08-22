import { Component, OnInit } from '@angular/core';
import { Infractions } from '@app/_models';
import { PguService } from '@app/_services';
import { WebSocketService } from '@app/_services/web-socket.service';
import { concatMap } from 'rxjs';

@Component({
  selector: 'app-pgu-penalties',
  templateUrl: './pgu-penalties.component.html',
  styleUrls: ['./pgu-penalties.component.css'],
})
export class PguPenaltiesComponent implements OnInit {
  //infractionList?: Infractions = {minor: {count: 2, timeStamp: "now"}, major: {count: 2, timeStamp: "now"},critical: {count: 2, timeStamp: "now"} };
  infractionList?: Infractions;
  constructor(private ws: WebSocketService, private pguService: PguService) {}

  ngOnInit(): void {
    this.ws.outBufferEvent
      .pipe(
        concatMap((updateListDto) => {
          this.infractionList =
            updateListDto[updateListDto.length - 1].infractionList;
          return this.ws.outUpdateEvent;
        })
      )
      .subscribe((update) => {
        if (this.pguService.currentPgu.value?.id === update.id) {
          this.infractionList = update.infractionList;
        }
      });
  }
}
