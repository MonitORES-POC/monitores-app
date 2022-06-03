import { EventEmitter, Injectable, Output } from '@angular/core';
import { MeasureEvent } from '@app/_models/measure.events';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService extends Socket {
  @Output() outEven: EventEmitter<MeasureEvent> = new EventEmitter();
  constructor() {
    super({
      url: 'ws://localhost:3000',
      /* options: {
        query: {
          pguId: "1",
        },
      }, */
    });
    this.listen();
  }

  listen = () => {
    this.ioSocket.on('measure_event', (res) => {
      console.log(JSON.stringify(res));
      this.outEven.emit(res)});
  };

  // manage connection lost
}
