import { Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-chat',
  standalone: true,
  imports: [CommonModule, FormsModule], 
  templateUrl: './chat.component.html',
  styleUrls: ['./chat.component.css']
})
export class ChatComponent {
  @Input() messages: any[] = [];
  @Output() send = new EventEmitter<string>();

  currentMessage: string = '';

  // RENAMED from sendMessage to onSend to match the HTML
  onSend() {
    if (this.currentMessage.trim()) {
      this.send.emit(this.currentMessage);
      this.currentMessage = '';
    }
  }
}