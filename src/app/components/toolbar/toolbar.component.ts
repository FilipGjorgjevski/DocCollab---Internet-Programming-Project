import { Component, EventEmitter, Output } from '@angular/core';

@Component({
  selector: 'app-toolbar', // Ensure this matches usage in editor
  standalone: true,
  templateUrl: './toolbar.component.html',
  styleUrls: ['./toolbar.component.css'] 
})
export class ToolbarComponent {
  @Output() action = new EventEmitter<{cmd: string, value?: string}>();

  // RENAMED from formatDoc to onAction to match the HTML
  onAction(cmd: string, value: string | undefined = undefined) {
    this.action.emit({ cmd, value });
  }

  onColorChange(cmd: string, event: any) {
    this.onAction(cmd, event.target.value);
  }
}