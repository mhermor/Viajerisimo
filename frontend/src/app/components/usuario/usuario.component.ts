import { Component } from '@angular/core';

@Component({
  selector: 'app-usuario',
  standalone: true,
  templateUrl: './usuario.component.html',
  styleUrls: ['./usuario.component.css']
})
export class UsuarioComponent {
  username: string = '';
  password: string = '';
  loggedIn: boolean = false;

  login() {
    if (this.username && this.password) {
      this.loggedIn = true;
    }
  }

  logout() {
    this.loggedIn = false;
    this.username = '';
    this.password = '';
  }

  editProfile() {
    alert('Función "Editar Perfil" en desarrollo :hammer_and_wrench:');
  }

  verReservas() {
    alert('Mostrando tus reservas :luggage:');
  }
}
