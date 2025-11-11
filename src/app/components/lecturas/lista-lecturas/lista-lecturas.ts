import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { Lectura } from '../../../services/lecturas/lectura';
import { MedidorState } from '../../../services/medidores/medidor-state';
import { LecturaConsumo, Medidor } from '../../../models/form-models';

@Component({
  selector: 'app-lista-lecturas',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './lista-lecturas.html'
})
export class ListaLecturas implements OnInit {
  lecturas: LecturaConsumo[] = [];
  medidores: Medidor[] = [];
  filtroMedidor = 0;
  filtroAnio = new Date().getFullYear();
  filtroMes = new Date().getMonth() + 1;

  constructor(
    private lecturaService: Lectura,
    private medidorService: MedidorState,
    private router: Router
  ) {}

  ngOnInit() {
    this.medidorService.fetchMedidoresConClientes();
    this.medidorService.medidores$.subscribe(data => this.medidores = data);

    this.lecturaService.fetchLecturas().then(() => {
      this.aplicarFiltros();
    });
  }

  aplicarFiltros() {
    const todas = this.lecturaService.lecturas(); // signal directamente
    this.lecturas = todas.filter(l =>
      (this.filtroMedidor === 0 || l.id_medidor === this.filtroMedidor) &&
      l.anio === this.filtroAnio &&
      l.mes === this.filtroMes
    );
  }

  registrarLectura() {
    this.router.navigate(['/lecturas/registro-lecturas']);
  }

  calcularConsumo(lectura: LecturaConsumo): number {
    const lecturaAnterior = this.lecturaService.obtenerLecturaAnterior(
      lectura.id_medidor,
      lectura.anio,
      lectura.mes
    );
    return lectura.lectura_kwh - (lecturaAnterior?.lectura_kwh || 0);
  }
}
