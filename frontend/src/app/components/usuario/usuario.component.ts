import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule, DecimalPipe],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent implements OnInit {
  // Auth
  modo: 'login' | 'registro' = 'login';
  nombre = '';
  email = '';
  password = '';
  mensaje = '';

  // Reservas
  reservas: any[] = [];

  // Estadísticas
  stats = { totalReservas: 0, reservasActivas: 0, destinosVisitados: 0, gastoTotal: 0 };

  // Editar perfil
  mostrarEditarPerfil = false;
  editNombre = '';
  passwordActual = '';
  passwordNueva = '';
  passwordConfirmar = '';
  mensajePerfil = '';
  exitoPerfil = false;

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService
  ) {}

  ngOnInit() {
    if (this.estaLogueado() && !this.esAdmin()) {
      this.cargarReservas();
      this.cargarEstadisticas();
    }
  }

  estaLogueado(): boolean { return this.authService.estaLogueado(); }
  getNombre(): string { return this.authService.getNombre() || ''; }
  esAdmin(): boolean { return this.authService.getRol() === 'admin'; }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.guardarToken(res.token, res.nombre, res.rol);
        this.mensaje = '';
        if (!this.esAdmin()) {
          this.cargarReservas();
          this.cargarEstadisticas();
        }
      },
      error: () => this.mensaje = 'Email o contraseña incorrectos'
    });
  }

  registro() {
    this.authService.registro({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.mensaje = 'Cuenta creada correctamente. Ahora inicia sesión.';
        this.modo = 'login';
      },
      error: () => this.mensaje = 'Error al registrar. El email puede que ya esté en uso.'
    });
  }

  cargarReservas() {
    this.reservaService.getReservas().subscribe({
      next: (res) => this.reservas = res,
      error: () => this.reservas = []
    });
  }

  cargarEstadisticas() {
    this.authService.getEstadisticas().subscribe({
      next: (res) => this.stats = res,
      error: () => {}
    });
  }

  cancelarReserva(id: number) {
    if (!confirm('¿Seguro que quieres cancelar esta reserva?')) return;
    this.reservaService.cancelarReserva(id).subscribe({
      next: () => {
        this.cargarReservas();
        this.cargarEstadisticas();
      },
      error: () => this.mensaje = 'Error al cancelar la reserva'
    });
  }

  abrirEditarPerfil() {
     console.log('Abriendo modal...');
    this.editNombre = this.getNombre();
    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmar = '';
    this.mensajePerfil = '';
    this.exitoPerfil = false;
    this.mostrarEditarPerfil = true;
  }

  guardarPerfil() {
    this.mensajePerfil = '';
    this.exitoPerfil = false;

    // Validar contraseña si se quiere cambiar
    if (this.passwordNueva || this.passwordActual) {
      if (!this.passwordActual) {
        this.mensajePerfil = 'Introduce tu contraseña actual';
        return;
      }
      if (this.passwordNueva.length < 6) {
        this.mensajePerfil = 'La nueva contraseña debe tener al menos 6 caracteres';
        return;
      }
      if (this.passwordNueva !== this.passwordConfirmar) {
        this.mensajePerfil = 'Las contraseñas nuevas no coinciden';
        return;
      }
    }

    const datos: any = {};
    if (this.editNombre.trim() && this.editNombre.trim() !== this.getNombre()) {
      datos.nombre = this.editNombre.trim();
    }
    if (this.passwordActual && this.passwordNueva) {
      datos.passwordActual = this.passwordActual;
      datos.passwordNueva = this.passwordNueva;
    }

    if (Object.keys(datos).length === 0) {
      this.mensajePerfil = 'No has cambiado ningún dato';
      return;
    }

    this.authService.actualizarPerfil(datos).subscribe({
      next: (res) => {
        if (datos.nombre) this.authService.actualizarNombre(datos.nombre);
        this.exitoPerfil = true;
        this.mensajePerfil = '¡Perfil actualizado correctamente!';
        this.passwordActual = '';
        this.passwordNueva = '';
        this.passwordConfirmar = '';
      },
      error: (err) => {
        this.mensajePerfil = err.error?.error || 'Error al actualizar el perfil';
      }
    });
  }

  logout() {
    this.authService.cerrarSesion();
    this.reservas = [];
    this.stats = { totalReservas: 0, reservasActivas: 0, destinosVisitados: 0, gastoTotal: 0 };
  }
}