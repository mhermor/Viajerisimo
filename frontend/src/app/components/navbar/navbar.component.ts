import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-navbar',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.css'
})
export class NavbarComponent {
  // Controla si el sidebar está abierto o cerrado
  isOpen = false;

  constructor(private authService: AuthService) {}

  // Alterna la visibilidad del sidebar
  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  // Cierra el sidebar al hacer click en un enlace o en el overlay
  closeMenu() {
    this.isOpen = false;
  }

  // Devuelve el nombre del usuario autenticado para mostrarlo en el botón de perfil
  getNombre(): string {
    return this.authService.getNombre() || '';
  }

  estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }
}