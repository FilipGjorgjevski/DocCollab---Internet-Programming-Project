import { bootstrapApplication } from '@angular/platform-browser';
import { provideRouter, Routes } from '@angular/router';
import { App } from './app/app'; // The Shell
import { HomeComponent } from './app/home/home.component';
import { EditorComponent } from './app/editor.component';

// Define your routes
const routes: Routes = [
  { path: '', component: HomeComponent },      // Homepage
  { path: 'editor', component: EditorComponent }, // Editor Page
  { path: '**', redirectTo: '' }               // Redirect unknown URLs to Home
];

bootstrapApplication(App, {
  providers: [
    provideRouter(routes) // Activate the router
  ]
}).catch(err => console.error(err));