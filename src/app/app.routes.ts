import { Routes } from '@angular/router';
import { Dashboard } from './pages/dashboard/dashboard';
import {ListaMedidores} from './components/medidores/lista-medidores/lista-medidores';
import {RegistroMedidores} from './components/medidores/registro-medidores/registro-medidores';
import {RegistroCliente} from './components/clientes/registro-cliente/registro-cliente';
import {ListarCliente} from './components/clientes/listar-cliente/listar-cliente';
import { ListaLecturas } from './components/lecturas/lista-lecturas/lista-lecturas';
import { RegistroLectura } from './components/lecturas/registro-lectura/registro-lectura';

export const routes: Routes = [
  { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
  { path: 'dashboard', component: Dashboard },
  { path: 'medidores/listar-medidores', component: ListaMedidores },
  { path: 'medidores/registro-medidores', component: RegistroMedidores },
  { path: 'medidores/editar/:id', component: RegistroMedidores },
  { path: 'clientes/registro-clientes', component: RegistroCliente },
  { path: 'clientes/listar-clientes', component: ListarCliente },
  { path: 'clientes/editar/:id', component: RegistroCliente },
  { path: 'lecturas/listar-lecturas', component: ListaLecturas },
  { path: 'lecturas/registro-lecturas', component: RegistroLectura },
  { path: 'lecturas/editar/:id', component: RegistroLectura },

  { path: '**', redirectTo: 'dashboard' }
];
