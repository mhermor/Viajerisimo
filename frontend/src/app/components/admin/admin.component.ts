import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinoService } from '../../services/destino.service';
import { AuthService } from '../../services/auth.service';
import { AdminService } from '../../services/admin.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  // Sistema de pestañas
  tabActiva: 'destinos' | 'reservas' | 'usuarios' = 'destinos';

  // Estadísticas del dashboard
  estadisticas = {
    totalDestinos: 0,
    totalReservas: 0,
    totalUsuarios: 0,
    ingresosTotal: 0
  };

  // Gestión de destinos
  destinos: any[] = [];
  destinosFiltrados: any[] = [];
  busquedaDestino: string = '';
  mensaje: string = '';
  mostrarFormulario: boolean = false;
  editando: boolean = false;
  destinoActual: any = {
    id: null,
    nombre: '',
    descripcion: '',
    categoria: '',
    imagen: '',
    pais: '',
    precio: 0
  };

  // Gestión de reservas
  reservas: any[] = [];
  filtroEstadoReserva: string = '';

  // Gestión de usuarios
  usuarios: any[] = [];

  constructor(
    private destinoService: DestinoService,
    private authService: AuthService,
    private adminService: AdminService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.estaLogueado() || this.authService.getRol() !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.cargarEstadisticas();
    this.cargarDestinos();
  }

  // ============== ESTADÍSTICAS ==============
  cargarEstadisticas() {
    this.adminService.getEstadisticas().subscribe({
      next: (res) => this.estadisticas = res,
      error: () => console.error('Error al cargar estadísticas')
    });
  }

  // ============== CAMBIO DE PESTAÑAS ==============
  cambiarTab(tab: 'destinos' | 'reservas' | 'usuarios') {
    this.tabActiva = tab;
    this.mensaje = '';
    
    if (tab === 'reservas' && this.reservas.length === 0) {
      this.cargarReservas();
    }
    if (tab === 'usuarios' && this.usuarios.length === 0) {
      this.cargarUsuarios();
    }
  }

  // ============== GESTIÓN DE DESTINOS ==============
  cargarDestinos() {
    this.destinoService.getDestinos().subscribe({
      next: (res) => {
        this.destinos = res;
        this.filtrarDestinos();
      },
      error: () => this.mensaje = 'Error al cargar destinos'
    });
  }

  filtrarDestinos() {
    if (!this.busquedaDestino) {
      this.destinosFiltrados = this.destinos;
    } else {
      const termino = this.busquedaDestino.toLowerCase();
      this.destinosFiltrados = this.destinos.filter(d => 
        d.nombre.toLowerCase().includes(termino) ||
        d.pais.toLowerCase().includes(termino) ||
        d.categoria.toLowerCase().includes(termino)
      );
    }
  }

  nuevoDestino() {
    this.editando = false;
    this.destinoActual = { id: null, nombre: '', descripcion: '', categoria: '', imagen: '', pais: '', precio: 0 };
    this.mostrarFormulario = true;
  }

  editarDestino(destino: any) {
    this.editando = true;
    this.destinoActual = { ...destino };
    this.mostrarFormulario = true;
  }

  guardarDestino() {
    if (this.editando) {
      this.destinoService.editarDestino(this.destinoActual.id, this.destinoActual).subscribe({
        next: () => {
          this.mensaje = 'Destino actualizado correctamente';
          this.mostrarFormulario = false;
          this.cargarDestinos();
          this.cargarEstadisticas();
        },
        error: () => this.mensaje = 'Error al actualizar el destino'
      });
    } else {
      this.destinoService.crearDestino(this.destinoActual).subscribe({
        next: () => {
          this.mensaje = 'Destino creado correctamente';
          this.mostrarFormulario = false;
          this.cargarDestinos();
          this.cargarEstadisticas();
        },
        error: () => this.mensaje = 'Error al crear el destino'
      });
    }
  }

  eliminarDestino(id: number) {
    if (!confirm('¿Estás seguro de que quieres eliminar este destino?')) return;
    this.destinoService.eliminarDestino(id).subscribe({
      next: () => {
        this.mensaje = 'Destino eliminado correctamente';
        this.cargarDestinos();
        this.cargarEstadisticas();
      },
      error: () => this.mensaje = 'Error al eliminar el destino'
    });
  }

  // ============== GESTIÓN DE RESERVAS ==============
  cargarReservas() {
    this.adminService.getTodasReservas(this.filtroEstadoReserva).subscribe({
      next: (res) => this.reservas = res,
      error: () => this.mensaje = 'Error al cargar reservas'
    });
  }

  filtrarReservasPorEstado() {
    this.cargarReservas();
  }

  cambiarEstadoReserva(reserva: any, nuevoEstado: string) {
    this.adminService.cambiarEstadoReserva(reserva.id, nuevoEstado).subscribe({
      next: () => {
        this.mensaje = `Estado de reserva cambiado a ${nuevoEstado}`;
        this.cargarReservas();
        this.cargarEstadisticas();
      },
      error: () => this.mensaje = 'Error al cambiar estado de reserva'
    });
  }

  // ============== GESTIÓN DE USUARIOS ==============
  cargarUsuarios() {
    this.adminService.getTodosUsuarios().subscribe({
      next: (res) => this.usuarios = res,
      error: () => this.mensaje = 'Error al cargar usuarios'
    });
  }
}