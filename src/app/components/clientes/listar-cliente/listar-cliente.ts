import { Component, OnInit, signal, computed } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { ClienteState } from '../../../services/clientes/cliente-state';
import { Cliente } from '../../../models/form-models';

@Component({
  selector: 'app-listar-cliente',
  standalone: true,
  imports: [CommonModule, RouterModule, FormsModule],
  templateUrl: './listar-cliente.html',
  styleUrls: ['./listar-cliente.css']
})
export class ListarCliente implements OnInit {
  clientes = signal<Cliente[]>([]);
  cargando = signal<boolean>(true);
  error = signal<string | null>(null);

  terminoBusqueda = '';
  paginaActual = 1;
  elementosPorPagina = 5;

  private STORAGE_KEY = 'clientes_list_state';

  constructor(
    private clienteState: ClienteState,
    private router: Router
  ) {}

  ngOnInit() {
    this.restaurarEstado();
    this.cargarClientes();
  }

  cargarClientes() {
    this.cargando.set(true);
    this.error.set(null);

    this.clienteState.clientes$.subscribe({
      next: (data) => {
        this.clientes.set(data);
        this.cargando.set(false);
      },
      error: (err) => {
        console.error('[ListarCliente] Error al obtener clientes:', err);
        this.error.set('No se pudieron cargar los clientes.');
        this.cargando.set(false);
      }
    });
  }

  eliminarCliente(id_cliente: number) {
    if (confirm('¿Seguro que deseas eliminar este cliente?')) {
      this.clienteState.eliminarCliente(id_cliente);
    }
  }

  editarCliente(id_cliente: number) {
    this.router.navigate(['/clientes/editar', id_cliente]);
  }

  crearCliente() {
    this.router.navigate(['/clientes/registro-clientes']);
  }

  buscarClientes(): Cliente[] {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    const filtrados = this.clientes().filter(c =>
      c.nombre_razon.toLowerCase().includes(termino) ||
      c.rut.toLowerCase().includes(termino)
    );

    const inicio = (this.paginaActual - 1) * this.elementosPorPagina;
    return filtrados.slice(inicio, inicio + this.elementosPorPagina);
  }

  totalPaginas(): number {
    const termino = this.terminoBusqueda.toLowerCase().trim();
    const filtrados = this.clientes().filter(c =>
      c.nombre_razon.toLowerCase().includes(termino) ||
      c.rut.toLowerCase().includes(termino)
    );
    return Math.ceil(filtrados.length / this.elementosPorPagina);
  }

  cambiarPagina(pagina: number) {
    if (pagina >= 1 && pagina <= this.totalPaginas()) {
      this.paginaActual = pagina;
      this.guardarEstado();
    }
  }

  onBuscarCambio() {
    this.paginaActual = 1;
    this.guardarEstado();
  }

  guardarEstado() {
    const estado = {
      terminoBusqueda: this.terminoBusqueda,
      paginaActual: this.paginaActual
    };
    localStorage.setItem(this.STORAGE_KEY, JSON.stringify(estado));
  }

  restaurarEstado() {
    const estadoGuardado = localStorage.getItem(this.STORAGE_KEY);
    if (estadoGuardado) {
      try {
        const estado = JSON.parse(estadoGuardado);
        this.terminoBusqueda = estado.terminoBusqueda || '';
        this.paginaActual = estado.paginaActual || 1;
      } catch {
        console.warn('Error restaurando estado de clientes');
      }
    }
  }
}
