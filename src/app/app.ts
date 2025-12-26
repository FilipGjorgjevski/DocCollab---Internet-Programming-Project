import { Component, HostListener, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SocketService } from './services/sockets';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './app.html',
  styleUrls: ['./app.css']
})
export class App implements OnInit {
  
  // 1. Access the editable div
  @ViewChild('editor') editor!: ElementRef;

  // 2. State Variables
  cursors: { [key: string]: { x: number, y: number, color: string } } = {};
  myColor: string = '#' + Math.floor(Math.random() * 16777215).toString(16);
  
  chatMessages: { text: string, color: string, time: Date }[] = [];
  currentMessage: string = '';

  constructor(private socketService: SocketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // --- CURSOR LOGIC ---
    this.socketService.onCursorMove().subscribe((data: any) => {
      this.cursors[data.id] = { x: data.x, y: data.y, color: data.color };
      this.cdr.detectChanges(); // Force screen update
    });

    this.socketService.onUserDisconnect().subscribe((id: string) => {
      delete this.cursors[id];
      this.cdr.detectChanges();
    });

    // --- DOCUMENT LOGIC ---
    this.socketService.onTextUpdate().subscribe((htmlContent: string) => {
      // Only update if the content is different (prevents cursor jumping)
      if (this.editor && this.editor.nativeElement.innerHTML !== htmlContent) {
        this.editor.nativeElement.innerHTML = htmlContent;
      }
    });

    // --- CHAT LOGIC ---
    this.socketService.onChatReceive().subscribe((data: any) => {
      this.chatMessages.push({
        text: data.text,
        color: data.color,
        time: new Date(data.timestamp)
      });
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  // --- EDITOR METHODS ---

  // Called when YOU type in the doc
  onContentChange() {
    const html = this.editor.nativeElement.innerHTML;
    this.socketService.emitText(html);
  }

  // Toolbar actions (Bold, Italic, etc)
  formatDoc(cmd: string, value: string | undefined = undefined) {
    document.execCommand(cmd, false, value);
    this.editor.nativeElement.focus(); // Keep focus on the paper
    this.onContentChange(); // Save changes immediately
  }

  // Helper for color pickers
  onColorChange(cmd: string, event: any) {
    this.formatDoc(cmd, event.target.value);
  }

  // --- CHAT METHODS ---

  sendMessage() {
    if (this.currentMessage.trim()) {
      this.socketService.emitChat(this.currentMessage, this.myColor);
      this.currentMessage = ''; // Clear input box
    }
  }

  scrollToBottom() {
    // Wait a tiny bit for the HTML to render the new message
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