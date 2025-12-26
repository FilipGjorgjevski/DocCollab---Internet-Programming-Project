import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService { // We keep the class name "SocketService"
  private socket: Socket;

  constructor() {
    this.socket = io('http://10.198.93.8:3000');
  }

  emitCursor(x: number, y: number, color: string) {
    this.socket.emit('cursor-move', { x, y, color });
  }

  onCursorMove(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('cursor-move', (data) => {
        observer.next(data);
      });
    });
  }

  onUserDisconnect(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('user-disconnected', (id) => {
        observer.next(id);
      });
    });
  }
  // NEW: Send text to server
  emitText(text: string) {
    this.socket.emit('text-change', text);
  }

  // NEW: Listen for text updates
  onTextUpdate(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('text-update', (text) => {
        observer.next(text);
      });
    });
  }

  // Send a chat message with my color
  emitChat(text: string, color: string) {
    this.socket.emit('send-chat', { text, color, timestamp: new Date() });
  }

  // Listen for incoming chats
  onChatReceive(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive-chat', (data) => {
        observer.next(data);
      });
    });
  }
}
