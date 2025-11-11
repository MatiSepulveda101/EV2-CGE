import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { MedidorState } from '../../../services/medidores/medidor-state';
import { Medidor } from '../../../models/form-models';

@Component({
  selector: 'app-lista-medidores',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './lista-medidores.html',
  styleUrls: ['./lista-medidores.css']
})
export class ListaMedidores implements OnInit {
  medidores: Medidor[] = [];
  cargando = false;
  errorMsg = '';

  constructor(
    public medidorState: MedidorState,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargando = true;
    this.medidorState.fetchMedidoresConClientes();

    this.medidorState.medidores$.subscribe({
      next: (data) => {
        this.medidores = data;
        this.cargando = false;
      },
      error: () => {
        this.errorMsg = 'Error cargando medidores';
        this.cargando = false;
      }
    });
  }

  nuevoMedidor() {
    this.router.navigate(['/medidores/registro-medidores']);
  }

  editarMedidor(id: number) {
    this.router.navigate(['/medidores/editar', id]);
  }

  eliminarMedidor(id: number) {
    if (confirm('¿Seguro que deseas eliminar este medidor?')) {
      this.medidorState.eliminarMedidor(id);
      this.medidores = this.medidorState.medidores();
    }
  }
}
