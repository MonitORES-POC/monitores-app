import { EventEmitter, Injectable, Output } from '@angular/core';
import { MeasureEvent } from '@app/_models/measure.events';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService extends Socket {
  @Output() outUpdateEvent: EventEmitter<MeasureEvent> = new EventEmitter();
  @Output() outBufferEvent: EventEmitter<MeasureEvent> = new EventEmitter();
  constructor() {
    super({
      url: 'ws://localhost:3000',
      options: {
        query: {
          id: '1', // cookiees or argument
        },
      },
    });
    this.listenPguUpdate();
  }

  listenPguUpdate() {
    this.ioSocket.on('update_state_event', (res) => {
      console.log(JSON.stringify(res));
      this.outUpdateEvent.emit(res);
    });
  }

  getCurrentBuffer(payload = {}) {
    this.ioSocket.emit('get_buffer', payload);
    this.ioSocket.on('send_buffer', (res) => {
      console.log(JSON.stringify(res));
      this.outBufferEvent.emit(res);
    });
  }

  // manage connection lost
}
