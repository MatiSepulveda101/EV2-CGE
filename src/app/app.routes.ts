import { Routes } from '@angular/router';
import { Dashboard } from './components/dashboard/dashboard';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  // Otras rutas que tengas
  { path: '**', redirectTo: 'dashboard' } // rutas no encontradas van al dashboard
];
