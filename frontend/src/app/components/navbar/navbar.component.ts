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
  isOpen = false;

  constructor(private authService: AuthService) {}

  toggleMenu() {
    this.isOpen = !this.isOpen;
  }

  closeMenu() {
    this.isOpen = false;
  }

  getNombre(): string {
    return this.authService.getNombre() || '';
  }

  estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }
}