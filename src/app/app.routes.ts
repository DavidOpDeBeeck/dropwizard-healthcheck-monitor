import { Routes } from '@angular/router';
import { EnvironmentListComponent } from './environment-list/environment-list.component';

export const appRoutes : Routes = [
  { path: '', component: EnvironmentListComponent },
  { path: '**', redirectTo: '/' }
];