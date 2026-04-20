import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-contacto',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './contacto.component.html',
  styleUrl: './contacto.component.css'
})
export class ContactoComponent {
  nombre = '';
  email = '';
  asunto = '';
  mensaje = '';
  errorMsg = '';
  enviado = false;

  enviar() {
    if (!this.nombre.trim() || !this.email.trim() || !this.mensaje.trim()) {
      this.errorMsg = 'Por favor rellena los campos obligatorios (*)';
      return;
    }
    if (!this.email.includes('@')) {
      this.errorMsg = 'Por favor introduce un email válido';
      return;
    }
    // Simulación de envío (sin backend real)
    this.errorMsg = '';
    this.enviado = true;
  }

  reset() {
    this.nombre = '';
    this.email = '';
    this.asunto = '';
    this.mensaje = '';
    this.errorMsg = '';
    this.enviado = false;
  }
}