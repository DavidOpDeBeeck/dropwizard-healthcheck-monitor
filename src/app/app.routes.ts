import { Routes } from '@angular/router';
import { EnvironmentListComponent } from './environment-list/environment-list.component';

export const APP_ROUTES : Routes = [
  { path: '', component: EnvironmentListComponent },
  { path: '**', redirectTo: '/' }
];