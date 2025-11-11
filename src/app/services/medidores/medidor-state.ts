import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Medidor } from '../../models/form-models';

const EMPTY_MEDIDORES: Medidor[] = [];

@Injectable({
  providedIn: 'root'
})
export class MedidorState {
  private readonly API_URL = `${environment.apiUrl}medidores/`;

  private _state = signal<Medidor[]>(EMPTY_MEDIDORES);
  readonly medidores = computed(() => this._state());
  readonly medidores$ = new BehaviorSubject<Medidor[]>(this._state());

  constructor(private http: HttpClient) {
    this.fetchMedidoresConClientes();
  }

  private normalizarId(obj: any): number {
    const maybe = obj?.id_medidor ?? obj?.id ?? null;
    return maybe == null ? NaN : Number(maybe);
  }

  fetchMedidoresConClientes() {
    this.http.get<Medidor[]>(this.API_URL).subscribe({
      next: (data) => {
        const normalized = data.map(item => ({
          ...item,
          id_medidor: this.normalizarId(item)
        }));
        this._state.set(normalized);
        this.medidores$.next(normalized);
        console.log('[MedidorState] Medidores cargados desde API:', normalized);
      },
      error: (err) => console.error('[MedidorState] Error al obtener medidores:', err)
    });
  }

  // 🔹 Crear medidor: acepta Partial y renombra id_cliente -> cliente
  async crearMedidor(medidor: Partial<Medidor>): Promise<boolean> {
    try {
      const { id_medidor, id_cliente, ...resto } = medidor;
      const dataEnviar = { ...resto, cliente: id_cliente };

      const nuevo = await firstValueFrom(
        this.http.post<Medidor>(this.API_URL, dataEnviar)
      );

      const nuevoNormalized = {
        ...nuevo,
        id_medidor: this.normalizarId(nuevo)
      };

      this._state.update(state => [...state, nuevoNormalized]);
      this.medidores$.next(this._state());

      console.log('[MedidorState] Medidor creado en API:', nuevoNormalized);
      return true;
    } catch (err) {
      console.error('[MedidorState] Error al crear medidor:', err);
      return false;
    }
  }


  async actualizarMedidor(id_medidor: number, data: Partial<Medidor>): Promise<boolean> {
    const idNum = Number(id_medidor);
    try {
      const actualizado = await firstValueFrom(this.http.put<Medidor>(`${this.API_URL}${idNum}/`, data));
      const updatedObj = {
        ...actualizado,
        id_medidor: this.normalizarId(actualizado)
      };
      this._state.update(state =>
        state.map(m => this.normalizarId(m) === idNum ? updatedObj : m)
      );
      this.medidores$.next(this._state());
      console.log('[MedidorState] Medidor actualizado en API:', updatedObj);
      return true;
    } catch (err) {
      console.error('[MedidorState] Error al actualizar medidor:', err);
      return false;
    }
  }

  eliminarMedidor(id_medidor: number) {
    const idNum = Number(id_medidor);
    this.http.delete(`${this.API_URL}${idNum}/`).subscribe({
      next: () => {
        this._state.update(state => state.filter(m => this.normalizarId(m) !== idNum));
        this.medidores$.next(this._state());
        console.log('[MedidorState] Medidor eliminado en API:', idNum);
      },
      error: (err) => console.error('[MedidorState] Error al eliminar medidor:', err)
    });
  }

  getMedidorById(id_medidor: number): Medidor | null {
    const idNum = Number(id_medidor);
    return this._state().find(m => this.normalizarId(m) === idNum) ?? null;
  }

  reset() {
    this._state.set(EMPTY_MEDIDORES);
    this.medidores$.next(EMPTY_MEDIDORES);
  }
}
