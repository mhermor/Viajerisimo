import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { DestinoService } from '../../services/destino.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-admin',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './admin.component.html',
  styleUrl: './admin.component.css'
})
export class AdminComponent implements OnInit {
  destinos: any[] = [];
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

  constructor(
    private destinoService: DestinoService,
    private authService: AuthService,
    private router: Router
  ) {}

  ngOnInit() {
    if (!this.authService.estaLogueado() || this.authService.getRol() !== 'admin') {
      this.router.navigate(['/']);
      return;
    }
    this.cargarDestinos();
  }

  cargarDestinos() {
    this.destinoService.getDestinos().subscribe({
      next: (res) => this.destinos = res,
      error: () => this.mensaje = 'Error al cargar destinos'
    });
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
        },
        error: () => this.mensaje = 'Error al actualizar el destino'
      });
    } else {
      this.destinoService.crearDestino(this.destinoActual).subscribe({
        next: () => {
          this.mensaje = 'Destino creado correctamente';
          this.mostrarFormulario = false;
          this.cargarDestinos();
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
      },
      error: () => this.mensaje = 'Error al eliminar el destino'
    });
  }
}