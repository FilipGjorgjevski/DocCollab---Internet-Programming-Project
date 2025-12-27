import { Component, HostListener, OnInit, ChangeDetectorRef, ViewChild, ElementRef } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms'; 
import { SocketService } from './services/sockets';

// --- IMPORTS FOR CHILD COMPONENTS ---
import { ToolbarComponent } from './components/toolbar/toolbar.component';
import { CursorLayerComponent } from './components/cursor-layer/cursor-layer.component';
import { ChatComponent } from './components/chat/chat.component';

@Component({
  selector: 'app-editor',
  standalone: true,
  // CRITICAL: You must import your child components here so the HTML recognizes them
  imports: [
    CommonModule, 
    FormsModule, 
    ToolbarComponent, 
    CursorLayerComponent, 
    ChatComponent
  ],
  templateUrl: './editor.component.html',
  styleUrls: ['./editor.component.css']
})
export class EditorComponent implements OnInit {
  
  // Access the editable div directly
  @ViewChild('editor') editor!: ElementRef;

  // --- STATE VARIABLES ---
  cursors: { [key: string]: { x: number, y: number, color: string, name?: string } } = {};
  chatMessages: { text: string, color: string, time: Date, name?: string }[] = [];
  
  // Assign a random color to this user
  myColor: string = '#' + Math.floor(Math.random() * 16777215).toString(16);

  constructor(private socketService: SocketService, private cdr: ChangeDetectorRef) {}

  ngOnInit() {
    // 1. Listen for Cursor Movements
    this.socketService.onCursorMove().subscribe((data: any) => {
      this.cursors[data.id] = { 
        x: data.x, 
        y: data.y, 
        color: data.color, 
        name: data.name 
      };
      this.cdr.detectChanges();
    });

    // 2. Listen for Disconnects
    this.socketService.onUserDisconnect().subscribe((id: string) => {
      delete this.cursors[id];
      this.cdr.detectChanges();
    });

    // 3. Listen for Text Updates
    this.socketService.onTextUpdate().subscribe((htmlContent: string) => {
      // Only update if the content is different to prevent cursor jumping
      if (this.editor && this.editor.nativeElement.innerHTML !== htmlContent) {
        this.editor.nativeElement.innerHTML = htmlContent;
      }
    });

    // 4. Listen for Chat Messages
    this.socketService.onChatReceive().subscribe((data: any) => {
      this.chatMessages.push({
        text: data.text,
        color: data.color,
        time: new Date(data.timestamp),
        name: data.name
      });
      this.cdr.detectChanges();
      this.scrollToBottom();
    });
  }

  // --- DOCUMENT LOGIC ---

  // Called when YOU type in the editable div
  onContentChange() {
    const html = this.editor.nativeElement.innerHTML;
    this.socketService.emitText(html);
  }

  // Called when the Toolbar Component emits an action
  handleToolbarAction(event: { cmd: string, value?: string }) {
    this.formatDoc(event.cmd, event.value);
  }

  // Executes the command on the document
  formatDoc(cmd: string, value: string | undefined = undefined) {
    document.execCommand(cmd, false, value);
    this.editor.nativeElement.focus(); // Keep focus on the paper
    this.onContentChange(); // Save changes
  }

  // --- CHAT LOGIC ---

  // Called when the Chat Component emits a 'send' event
  sendMessage(text: string) {
    if (text && text.trim()) {
      this.socketService.emitChat(text, this.myColor);
    }
  }

  // Auto-scroll chat to the bottom
  scrollToBottom() {
    setTimeout(() => {
      const chatContainer = document.querySelector('.chat-history');
      if (chatContainer) {
        chatContainer.scrollTop = chatContainer.scrollHeight;
      }
    }, 50);
  }

  // --- MOUSE TRACKING ---
  
  // Listens to mouse movement anywhere on the page
  @HostListener('document:mousemove', ['$event'])
  onMouseMove(event: MouseEvent) {
    this.socketService.emitCursor(event.pageX, event.pageY, this.myColor);
  }
}