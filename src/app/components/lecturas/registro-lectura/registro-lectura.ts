import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Lectura } from '../../../services/lecturas/lectura';
import { MedidorState } from '../../../services/medidores/medidor-state';
import { LecturaConsumo, Medidor } from '../../../models/form-models';

@Component({
  selector: 'app-registro-lectura',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './registro-lectura.html'
})
export class RegistroLectura implements OnInit {
  lectura: Partial<LecturaConsumo> = {
    id_medidor: 0,
    anio: new Date().getFullYear(),
    mes: new Date().getMonth() + 1,
    lectura_kwh: 0,
    observacion: ''
  };

  medidores: Medidor[] = [];
  cargando = false;

  constructor(
    private lecturaService: Lectura,
    private medidorService: MedidorState,
    private router: Router
  ) {}

  ngOnInit() {
    this.cargando = true;
    this.medidorService.fetchMedidoresConClientes();
    this.medidorService.medidores$.subscribe(data => this.medidores = data);
    this.cargando = false;
  }

  async guardarLectura() {
    if (!this.lectura.id_medidor || !this.lectura.anio || !this.lectura.mes || this.lectura.lectura_kwh == null) {
      alert('Todos los campos obligatorios deben estar completos');
      return;
    }

    try {
      const exito = await this.lecturaService.crearLectura(this.lectura);
      if (!exito) throw new Error('Error al guardar la lectura');

      alert('Lectura registrada correctamente');
      this.router.navigate(['/lecturas']);
    } catch (err) {
      console.error(err);
      alert('Error al guardar lectura');
    }
  }

  cancelar() {
    this.router.navigate(['/lecturas']);
  }
}
