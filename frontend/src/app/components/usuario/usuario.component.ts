import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  // Referencia al dialog nativo HTML5 para editar perfil
  @ViewChild('editarDialog') editarDialog!: ElementRef<HTMLDialogElement>;

  // Formulario de login/registro
  modo: 'login' | 'registro' = 'login';
  nombre = '';
  email = '';
  password = '';
  mensaje = '';

  // Lista de reservas del usuario
  reservas: any[] = [];

  // Estadísticas personales del usuario
  stats = { totalReservas: 0, reservasActivas: 0, destinosVisitados: 0, gastoTotal: 0 };

  // Formulario de edición de perfil
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
    // Si ya está logueado como usuario normal, cargar datos al iniciar
    if (this.estaLogueado() && !this.esAdmin()) {
      this.cargarReservas();
      this.cargarEstadisticas();
    }
  }

  estaLogueado(): boolean { return this.authService.estaLogueado(); }
  getNombre(): string { return this.authService.getNombre() || ''; }
  esAdmin(): boolean { return this.authService.getRol() === 'admin'; }

  // Autentica al usuario y carga sus datos si no es admin
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

  // Registra un nuevo usuario y redirige al login
  registro() {
    this.authService.registro({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.mensaje = 'Cuenta creada correctamente. Ahora inicia sesión.';
        this.modo = 'login';
      },
      error: () => this.mensaje = 'Error al registrar. El email puede que ya esté en uso.'
    });
  }

  // Carga las reservas del usuario autenticado
  cargarReservas() {
    this.reservaService.getReservas().subscribe({
      next: (res) => this.reservas = res,
      error: () => this.reservas = []
    });
  }

  // Carga las estadísticas personales del usuario
  cargarEstadisticas() {
    this.authService.getEstadisticas().subscribe({
      next: (res) => this.stats = res,
      error: () => {}
    });
  }

  // Cancela una reserva tras confirmación del usuario
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

  // Abre el dialog de edición de perfil con los datos actuales
  abrirEditarPerfil() {
    this.editNombre = this.getNombre();
    this.passwordActual = '';
    this.passwordNueva = '';
    this.passwordConfirmar = '';
    this.mensajePerfil = '';
    this.exitoPerfil = false;
    this.editarDialog.nativeElement.showModal();
  }

  cerrarEditarPerfil() {
    this.editarDialog.nativeElement.close();
  }

  // Valida y envía los cambios del perfil al backend
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

    // Solo enviar los campos que han cambiado
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
      next: () => {
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

  // Cierra la sesión y limpia los datos locales
  logout() {
    this.authService.cerrarSesion();
    this.reservas = [];
    this.stats = { totalReservas: 0, reservasActivas: 0, destinosVisitados: 0, gastoTotal: 0 };
  }
}