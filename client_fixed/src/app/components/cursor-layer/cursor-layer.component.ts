import { Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-cursor-layer',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './cursor-layer.component.html',
  styleUrls: ['./cursor-layer.component.css'] // Copy .remote-cursor CSS here
})
export class CursorLayerComponent {
  @Input() cursors: any = {};
}