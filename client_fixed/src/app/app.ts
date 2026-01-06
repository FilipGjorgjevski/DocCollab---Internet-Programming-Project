import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterOutlet } from '@angular/router'; // Import RouterOutlet

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [CommonModule, RouterOutlet], // Add RouterOutlet
  template: `<router-outlet></router-outlet>`, // This is where the pages load
})
export class App {}