import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class SocketService {
  private socket: Socket;

  // Initialize username from LocalStorage or default to 'Anonymous'
  username: string = localStorage.getItem('username') || 'Anonymous';

  constructor() {
    // Dynamic URL: Works on localhost AND on your phone (IP address)
    const serverUrl = `http://${window.location.hostname}:3000`;
    this.socket = io(serverUrl);
  }

  // Helper: Update name and save it so it survives refresh
  setName(name: string) {
    this.username = name;
    localStorage.setItem('username', name);
  }


  onCursorMove(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('cursor-move', (data) => observer.next(data));
    });
  }

  onUserDisconnect(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('user-disconnected', (id) => observer.next(id));
    });
  }

  // --- 2. DOCUMENT TEXT ---
  emitText(text: string) {
    this.socket.emit('text-change', text);
  }

  onTextUpdate(): Observable<string> {
    return new Observable(observer => {
      this.socket.on('text-update', (text) => observer.next(text));
    });
  }

  // --- 3. CHAT ---
  emitChat(text: string, color: string) {
    this.socket.emit('send-chat', { 
      text, color, 
      name: this.username, // Send the name with the message
      timestamp: new Date() 
    });
  }

  onChatReceive(): Observable<any> {
    return new Observable(observer => {
      this.socket.on('receive-chat', (data) => observer.next(data));
    });
  }
   // Update this function to ensure name is ALWAYS attached
   emitCursor(x: number, y: number, color: string) {
    // 1. Double check we have a name, if not, grab it again
    if (!this.username || this.username === 'Anonymous') {
      this.username = localStorage.getItem('username') || 'Anonymous';
    }

    this.socket.emit('cursor-move', { 
      x, y, color, 
      name: this.username // Send the name!
    });
  }
}