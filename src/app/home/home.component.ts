import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { SocketService } from '../services/sockets';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule, FormsModule],
  template: `
    <div class="login-container">
      <h1>Welcome to CollabEdit</h1>
      <p>Real-time document editing with your team.</p>
      
      <div class="input-group">
        <input type="text" [(ngModel)]="name" placeholder="Enter your name" (keyup.enter)="join()">
        <button (click)="join()" [disabled]="!name">Join Session</button>
      </div>
    </div>
  `,
  styles: [`
    .login-container {
      display: flex; flex-direction: column; align-items: center; 
      justify-content: center; height: 100vh; background: #f0f0f0;
    }
    h1 { margin-bottom: 10px; color: #333; }
    input { padding: 10px; border: 1px solid #ccc; border-radius: 4px; margin-right: 10px; }
    button { padding: 10px 20px; background: #007bff; color: white; border: none; border-radius: 4px; cursor: pointer; }
    button:disabled { background: #ccc; }
  `]
})
export class HomeComponent {
  name: string = '';

  constructor(private socketService: SocketService, private router: Router) {}

  join() {
    if (this.name.trim()) {
      this.socketService.username = this.name; // Save the name
      this.router.navigate(['/editor']);       // Go to the editor
    }
  }
}