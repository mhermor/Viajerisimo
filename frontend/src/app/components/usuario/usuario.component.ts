import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../services/auth.service';
import { ReservaService } from '../../services/reserva.service';

@Component({
  selector: 'app-usuario',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './usuario.component.html',
  styleUrl: './usuario.component.css'
})
export class UsuarioComponent {
  modo: 'login' | 'registro' = 'login';
  nombre = '';
  email = '';
  password = '';
  mensaje = '';
  reservas: any[] = [];

  constructor(
    private authService: AuthService,
    private reservaService: ReservaService
  ) {
    if (this.estaLogueado()) {
      this.cargarReservas();
    }
  }

  estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }

  getNombre(): string {
    return this.authService.getNombre() || '';
  }

  login() {
    this.authService.login({ email: this.email, password: this.password }).subscribe({
      next: (res) => {
        this.authService.guardarToken(res.token, res.nombre, res.rol);
        this.cargarReservas();
        this.mensaje = '';
      },
      error: () => {
        this.mensaje = 'Email o contraseña incorrectos';
      }
    });
  }

  registro() {
    this.authService.registro({ nombre: this.nombre, email: this.email, password: this.password }).subscribe({
      next: () => {
        this.mensaje = 'Usuario registrado correctamente, ahora inicia sesión';
        this.modo = 'login';
      },
      error: () => {
        this.mensaje = 'Error al registrar, puede que el email ya esté en uso';
      }
    });
  }

  cargarReservas() {
    this.reservaService.getReservas().subscribe({
      next: (res) => this.reservas = res,
      error: () => this.reservas = []
    });
  }

  cancelarReserva(id: number) {
    this.reservaService.cancelarReserva(id).subscribe({
      next: () => this.cargarReservas(),
      error: () => this.mensaje = 'Error al cancelar la reserva'
    });
  }

  logout() {
    this.authService.cerrarSesion();
    this.reservas = [];
  }
}