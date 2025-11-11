import { Injectable, signal, computed } from '@angular/core';
import { BehaviorSubject, firstValueFrom } from 'rxjs';
import { HttpClient } from '@angular/common/http';
import { environment } from '../../environments/environment';
import { Cliente } from '../../models/form-models';

const EMPTY_CLIENTES: Cliente[] = [];

@Injectable({
  providedIn: 'root'
})
export class ClienteState {
  private readonly API_URL = `${environment.apiUrl}clientes/`;

  private _state = signal<Cliente[]>(EMPTY_CLIENTES);
  readonly clientes = computed(() => this._state());
  readonly clientes$ = new BehaviorSubject<Cliente[]>(this._state());

  constructor(private http: HttpClient) {
    this.fetchClientes();
  }

  private normalizarId(obj: any): number {
    const maybe = obj?.id_cliente ?? obj?.id ?? null;
    return maybe == null ? NaN : Number(maybe);
  }

  fetchClientes() {
    this.http.get<Cliente[]>(this.API_URL).subscribe({
      next: (data) => {
        const normalized = data.map(item => ({
          ...item,
          id_cliente: this.normalizarId(item)
        }));
        this._state.set(normalized);
        this.clientes$.next(normalized);
        console.log('[ClienteState] Clientes cargados desde API:', normalized);
      },
      error: (err) => console.error('[ClienteState] Error al obtener clientes:', err)
    });
  }

  async crearCliente(cliente: Omit<Cliente, 'id_cliente'>): Promise<boolean> {
    try {
      const nuevo = await firstValueFrom(this.http.post<Cliente>(this.API_URL, cliente));
      const nuevoNormalized = {
        ...nuevo,
        id_cliente: this.normalizarId(nuevo)
      };
      this._state.update(state => [...state, nuevoNormalized]);
      this.clientes$.next(this._state());
      console.log('[ClienteState] Cliente creado en API:', nuevoNormalized);
      return true;
    } catch (err) {
      console.error('[ClienteState] Error al crear cliente:', err);
      return false;
    }
  }

  async actualizarCliente(id_cliente: number, data: Partial<Cliente>): Promise<boolean> {
    const idNum = Number(id_cliente);
    try {
      const actualizado = await firstValueFrom(this.http.put<Cliente>(`${this.API_URL}${idNum}/`, data));
      const updatedObj = {
        ...actualizado,
        id_cliente: this.normalizarId(actualizado)
      };
      this._state.update(state =>
        state.map(c => this.normalizarId(c) === idNum ? updatedObj : c)
      );
      this.clientes$.next(this._state());
      console.log('[ClienteState] Cliente actualizado en API:', updatedObj);
      return true;
    } catch (err) {
      console.error('[ClienteState] Error al actualizar cliente:', err);
      return false;
    }
  }

  eliminarCliente(id_cliente: number) {
    const idNum = Number(id_cliente);
    this.http.delete(`${this.API_URL}${idNum}/`).subscribe({
      next: () => {
        this._state.update(state => state.filter(c => this.normalizarId(c) !== idNum));
        this.clientes$.next(this._state());
        console.log('[ClienteState] Cliente eliminado en API:', idNum);
      },
      error: (err) => console.error('[ClienteState] Error al eliminar cliente:', err)
    });
  }

  getClienteById(id_cliente: number): Cliente | null {
    const idNum = Number(id_cliente);
    return this._state().find(c => this.normalizarId(c) === idNum) ?? null;
  }

  reset() {
    this._state.set(EMPTY_CLIENTES);
    this.clientes$.next(EMPTY_CLIENTES);
  }
}
