import { Component, HostListener, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SocketService } from './services/sockets';

@Component({
  selector: 'app-editor',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  
  // Access the editable div
  @ViewChild('editor') editor!: ElementRef;

  // --- STATE VARIABLES ---
  // Cursors now store 'name' (optional string)
  cursors: { [key: string]: { x: number, y: number, color: string, name?: string } } = {};
  
  // Chat now stores 'name'
  chatMessages: { text: string, color: string, time: Date, name?: string }[] = [];
  
  currentMessage: string = '';
  myColor: string = '#' + Math.floor(Math.random() * 16777215).toString(16);

  constructor(private socketService: SocketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 1. Listen for Cursors
    this.socketService.onCursorMove().subscribe((data: any) => {
      this.cursors[data.id] = { 
        x: data.x, 
        y: data.y, 
        color: data.color,
        name: data.name // Capture name
      };
      this.cdr.detectChanges();
    });

    // 2. Listen for Disconnects
    this.socketService.onUserDisconnect().subscribe((id: string) => {
      delete this.cursors[id];
      this.cdr.detectChanges();
    });

    // 3. Listen for Text Changes
// Inside ngOnInit
    this.socketService.onTextUpdate().subscribe((htmlContent: string) => {
      // If the server sends valid text (even empty string is valid), update.
      // But we check if it's different to prevent cursor jumping.
      if (this.editor && this.editor.nativeElement.innerHTML !== htmlContent) {
        this.editor.nativeElement.innerHTML = htmlContent;
      }
    });

    // 4. Listen for Chat
    this.socketService.onChatReceive().subscribe((data: any) => {
      this.chatMessages.push({
        text: data.text,
        color: data.color,
        time: new Date(data.timestamp),
        name: data.name // Capture name
      });
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  // --- EDITOR METHODS ---
  onContentChange() {
    const html = this.editor.nativeElement.innerHTML;
    this.socketService.emitText(html);
  }

  formatDoc(cmd: string, value: string | undefined = undefined) {
    document.execCommand(cmd, false, value);
    this.editor.nativeElement.focus();
    this.onContentChange();
  }

  onColorChange(cmd: string, event: any) {
    this.formatDoc(cmd, event.target.value);
  }

  // --- CHAT METHODS ---
  sendMessage() {
    if (this.currentMessage.trim()) {
      this.socketService.emitChat(this.currentMessage, this.myColor);
      this.currentMessage = '';
    }
  }

  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-history');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }

  // --- MOUSE TRACKING ---
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.socketService.emitCursor(event.pageX, event.pageY, this.myColor);
  }
}