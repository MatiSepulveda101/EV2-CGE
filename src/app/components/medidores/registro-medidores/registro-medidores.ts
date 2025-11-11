import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MedidorState } from '../../../services/medidores/medidor-state';
import { ClienteState } from '../../../services/clientes/cliente-state';
import { Medidor, Cliente } from '../../../models/form-models';

@Component({
  selector: 'app-registro-medidores',
  standalone: true,
  imports: [FormsModule, CommonModule, RouterModule],
  templateUrl: './registro-medidores.html'
})
export class RegistroMedidores implements OnInit {
  medidor: Medidor = {
    id_medidor: 0,
    codigo_medidor: '',
    id_cliente: 0,
    direccion_suministro: '',
    estado: 'activo',
    created_at: new Date(),
    updated_at: new Date()
  };

  clientes: Cliente[] = [];
  modoEdicion = false;
  cargando = false;
  errorMsg = '';

  constructor(
    private medidorState: MedidorState,
    private clienteState: ClienteState,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  async ngOnInit() {
    this.cargando = true;

    try {
      await this.clienteState.fetchClientes(); // si tu fetchClientes devuelve promesa

      this.clienteState.clientes$.subscribe(clientes => {
        this.clientes = clientes;

        console.log('Clientes cargados:', this.clientes);

        const id = this.route.snapshot.paramMap.get('id');
        if (id) {
          this.modoEdicion = true;
          const medidorExistente = this.medidorState.getMedidorById(Number(id));
          if (medidorExistente) {
            this.medidor = {
              ...medidorExistente,
              id_cliente: Number(medidorExistente.cliente)
            };
            console.log('Medidor normalizado:', this.medidor);
          }
        }
      });

    } catch (err) {
      console.error(err);
      this.errorMsg = 'Error al cargar datos';
    } finally {
      this.cargando = false;
    }
  }



  guardarMedidor() {
    this.medidor.updated_at = new Date();

    if (this.modoEdicion) {
      this.medidorState.actualizarMedidor(this.medidor.id_medidor, this.medidor);
      alert('Medidor actualizado correctamente');
    } else {
      this.medidorState.crearMedidor(this.medidor);
      alert(' Medidor registrado correctamente');
    }

    this.router.navigate(['/medidores/listar-medidores']);
  }

  cancelar() {
    this.router.navigate(['/medidores/lista-medidores']);
  }
}
