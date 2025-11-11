import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { ClienteState } from '../../../services/clientes/cliente-state';
import { Cliente } from '../../../models/form-models';

@Component({
  selector: 'app-registro-cliente',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './registro-cliente.html',
  styleUrls: ['./registro-cliente.css']
})
export class RegistroCliente implements OnInit {
  cliente: Omit<Cliente, 'id_cliente'> = {
    rut: '',
    nombre_razon: '',
    email_contacto: '',
    telefono: '',
    direccion_facturacion: '',
    estado: 'activo',
    created_at: new Date(),
    updated_at: new Date()
  };

  cargando = false;
  editando = false;
  id_cliente: number | null = null;

  constructor(
    private clienteState: ClienteState,
    private route: ActivatedRoute,
    private router: Router
  ) {}

  ngOnInit() {
    const idParam = this.route.snapshot.paramMap.get('id');
    if (idParam) {
      this.id_cliente = Number(idParam);
      const clienteExistente = this.clienteState.getClienteById(this.id_cliente);

      if (clienteExistente) {
        this.cliente = { ...clienteExistente };
        this.editando = true;
        console.log('[RegistroCliente] Modo edición para:', clienteExistente);
      } else {
        console.warn('[RegistroCliente] No se encontró cliente con ID:', this.id_cliente);
        alert('No se encontró el cliente. Redirigiendo...');
        this.router.navigate(['/clientes/lista-clientes']);
      }
    }
  }

  async onSubmit() {
    const error = this.validarCampos();
    if (error) {
      alert(error);
      return;
    }

    this.cargando = true;
    this.cliente.updated_at = new Date();

    try {
      if (this.editando && this.id_cliente) {
        this.clienteState.actualizarCliente(this.id_cliente, this.cliente);
        alert('Cliente actualizado correctamente.');
      } else {
        const exito = await this.clienteState.crearCliente(this.cliente as Cliente);
        if (exito) {
          alert('Cliente creado correctamente.');
          this.resetForm();
        } else {
          alert('Error al crear el cliente.');
        }
      }
      this.router.navigate(['/clientes/lista-clientes']);
    } catch (err) {
      console.error('[RegistroCliente] Error al guardar:', err);
      alert('No se pudo guardar el cliente. Verifica la conexión o los datos.');
    } finally {
      this.cargando = false;
    }
  }

  private validarCampos(): string | null {
    const camposVacios: string[] = [];

    if (!this.cliente.rut.trim()) camposVacios.push('RUT');
    if (!this.cliente.nombre_razon.trim()) camposVacios.push('Nombre o Razón Social');
    if (!this.cliente.email_contacto.trim()) camposVacios.push('Correo Electrónico');
    if (!this.cliente.telefono.trim()) camposVacios.push('Teléfono');
    if (!this.cliente.direccion_facturacion.trim()) camposVacios.push('Dirección de Facturación');
    if (!this.cliente.estado.trim()) camposVacios.push('Estado');

    if (camposVacios.length > 0) {
      return `Por favor completa los siguientes campos:\n\n- ${camposVacios.join('\n- ')}`;
    }

    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    if (!emailRegex.test(this.cliente.email_contacto)) {
      return 'El correo electrónico no tiene un formato válido.';
    }

    return null;
  }

  private resetForm() {
    this.cliente = {
      rut: '',
      nombre_razon: '',
      email_contacto: '',
      telefono: '',
      direccion_facturacion: '',
      estado: 'activo',
      created_at: new Date(),
      updated_at: new Date()
    };
  }
}
