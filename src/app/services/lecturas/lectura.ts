import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { LecturaConsumo } from '../../models/form-models';
import { firstValueFrom } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class Lectura {
  private readonly API_URL = `${environment.apiUrl}lecturas/`;
  private _lecturas = signal<LecturaConsumo[]>([]);
  lecturas = this._lecturas.asReadonly();

  constructor(private http: HttpClient) {}

  async fetchLecturas() {
    try {
      const data = await firstValueFrom(this.http.get<LecturaConsumo[]>(this.API_URL));
      this._lecturas.set(data);
      console.log('[LecturaService] Lecturas cargadas:', data);
    } catch (err) {
      console.error('[LecturaService] Error al obtener lecturas:', err);
    }
  }

  public obtenerLecturaAnterior(medidorId: number, anio: number, mes: number): LecturaConsumo | null {
    const lecturas = this._lecturas();
    return lecturas.find(l =>
      l.id_medidor === medidorId &&
      (
        (mes === 1 && l.anio === anio - 1 && l.mes === 12) ||
        (mes > 1 && l.anio === anio && l.mes === mes - 1)
      )
    ) || null;
  }

  async crearLectura(lectura: Partial<LecturaConsumo>): Promise<boolean> {
    try {
      if (!lectura.id_medidor || !lectura.anio || !lectura.mes || lectura.lectura_kwh == null) {
        throw new Error('Datos incompletos para crear la lectura');
      }

      const anterior = this.obtenerLecturaAnterior(lectura.id_medidor, lectura.anio, lectura.mes);
      const consumoCalculado = anterior ? lectura.lectura_kwh - anterior.lectura_kwh! : lectura.lectura_kwh;

      const payload = {
        ...lectura,
        created_at: new Date()
      };

      const nuevo = await firstValueFrom(this.http.post<LecturaConsumo>(this.API_URL, payload));

      this._lecturas.update(list => [...list, nuevo]);

      console.log(`[LecturaService] Lectura creada. Consumo calculado: ${consumoCalculado} kWh`);
      return true;
    } catch (err) {
      console.error('[LecturaService] Error al crear lectura:', err);
      return false;
    }
  }
}
