import { EventEmitter, Injectable, Output } from '@angular/core';
import { PGU, PguStateUpdateDto } from '@app/_models';
import { Socket } from 'ngx-socket-io';

@Injectable({
  providedIn: 'root',
})
export class WebSocketService extends Socket {
  @Output() outUpdateEvent: EventEmitter<PguStateUpdateDto> = new EventEmitter();
  @Output() outBufferEvent: EventEmitter<Array<PguStateUpdateDto>> = new EventEmitter();
  constructor() {
    super({
      url: 'ws://localhost:3000',
      options: {
        query: {
          id: JSON.parse(localStorage.getItem('currentPgu'))?.id, // cookiees or argument
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

  getCurrentBuffer(id: number) {
    this.ioSocket.emit('get_buffer', {id: id});
    this.ioSocket.on('send_buffer', (res) => {
      this.outBufferEvent.emit(JSON.parse(res));
    });
  }

}
