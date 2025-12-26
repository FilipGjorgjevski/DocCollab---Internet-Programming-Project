import { bootstrapApplication } from '@angular/platform-browser';
import { App } from './app/app'; // This imports the class 'App' from 'app/app.ts'

bootstrapApplication(App)
  .catch((err) => console.error(err));