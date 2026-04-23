import { Component, OnInit } from '@angular/core';
import { CommonModule, DecimalPipe } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { DestinoService } from '../../services/destino.service';
import { ReservaService } from '../../services/reserva.service';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-destino-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterLink, DecimalPipe],
  templateUrl: './destino-detalle.component.html',
  styleUrl: './destino-detalle.component.css'
})
export class DestinoDetalleComponent implements OnInit {
  destino: any = null;
  resenas: any[] = [];

  // Reserva
  fechaInicio: string = '';
  fechaFin: string = '';
  numPersonas: number = 1;
  numDias: number = 0;
  precioTotal: number = 0;
  mensajeReserva: string = '';

  // Reseña
  comentario: string = '';
  puntuacion: number = 5;
  mensajeResena: string = '';

  // Fecha mínima = hoy
  hoy: string = new Date().toISOString().split('T')[0];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private destinoService: DestinoService,
    private reservaService: ReservaService,
    private resenaService: ResenaService,
    private authService: AuthService
  ) {}

  ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id');
    if (id) {
      this.destinoService.getDestino(parseInt(id)).subscribe({
        next: (res) => {
          this.destino = res;
          this.resenas = res.resenas || [];
        },
        error: () => this.router.navigate(['/'])
      });
    }
  }

  estaLogueado(): boolean {
    return this.authService.estaLogueado();
  }

  calcularPrecio() {
    if (!this.fechaInicio || !this.fechaFin || !this.destino) {
      this.precioTotal = 0;
      this.numDias = 0;
      return;
    }
    const inicio = new Date(this.fechaInicio);
    const fin = new Date(this.fechaFin);
    const diff = fin.getTime() - inicio.getTime();
    this.numDias = Math.ceil(diff / (1000 * 60 * 60 * 24));
    if (this.numDias <= 0) {
      this.precioTotal = 0;
      this.numDias = 0;
      return;
    }
    this.precioTotal = this.destino.precio * this.numDias * this.numPersonas;
  }

  hacerReserva() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.mensajeReserva = 'Por favor selecciona las fechas';
      return;
    }
    if (this.numDias <= 0) {
      this.mensajeReserva = 'La fecha de fin debe ser posterior a la de inicio';
      return;
    }
    this.reservaService.crearReserva({
      destinoId: this.destino.id,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin,
      numPersonas: this.numPersonas
    }).subscribe({
      next: () => {
        this.mensajeReserva = '¡Reserva realizada correctamente! 🎉';
        this.fechaInicio = '';
        this.fechaFin = '';
        this.numPersonas = 1;
        this.precioTotal = 0;
        this.numDias = 0;
      },
      error: () => this.mensajeReserva = 'Error al realizar la reserva'
    });
  }

  dejarResena() {
    if (!this.comentario.trim()) {
      this.mensajeResena = 'Por favor escribe un comentario';
      return;
    }
    this.resenaService.crearResena({
      destinoId: this.destino.id,
      puntuacion: this.puntuacion,
      comentario: this.comentario
    }).subscribe({
      next: (res) => {
        this.resenas.unshift({ ...res, usuario: { nombre: this.authService.getNombre() } });
        this.comentario = '';
        this.puntuacion = 5;
        this.mensajeResena = '¡Reseña publicada correctamente! 🌟';
      },
      error: () => this.mensajeResena = 'Error al publicar la reseña'
    });
  }

  getNombreUsuario(): string {
  return this.authService.getNombre() || '';
}

eliminarResena(id: number) {
  if (!confirm('¿Eliminar esta reseña?')) return;
  this.resenaService.eliminarResena(id).subscribe({
    next: () => {
      this.resenas = this.resenas.filter(r => r.id !== id);
      this.mensajeResena = 'Reseña eliminada correctamente';
    },
    error: () => this.mensajeResena = 'Error al eliminar la reseña'
  });
}
}