import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinoService } from '../../services/destino.service';
import { ReservaService } from '../../services/reserva.service';
import { ResenaService } from '../../services/resena.service';
import { AuthService } from '../../services/auth.service';

@Component({
  selector: 'app-destino-detalle',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destino-detalle.component.html',
  styleUrl: './destino-detalle.component.css'
})
export class DestinoDetalleComponent implements OnInit {
  destino: any = null;
  resenas: any[] = [];
  fechaInicio: string = '';
  fechaFin: string = '';
  comentario: string = '';
  puntuacion: number = 5;
  mensaje: string = '';

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

  hacerReserva() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.mensaje = 'Por favor selecciona las fechas';
      return;
    }
    this.reservaService.crearReserva({
      destinoId: this.destino.id,
      fechaInicio: this.fechaInicio,
      fechaFin: this.fechaFin
    }).subscribe({
      next: () => this.mensaje = '¡Reserva realizada correctamente!',
      error: () => this.mensaje = 'Error al realizar la reserva'
    });
  }

  dejarResena() {
    if (!this.comentario.trim()) {
      this.mensaje = 'Por favor escribe un comentario';
      return;
    }
    this.resenaService.crearResena({
      destinoId: this.destino.id,
      puntuacion: this.puntuacion,
      comentario: this.comentario
    }).subscribe({
      next: (res) => {
        this.resenas.push({ ...res, usuario: { nombre: this.authService.getNombre() } });
        this.comentario = '';
        this.mensaje = '¡Reseña publicada correctamente!';
      },
      error: () => this.mensaje = 'Error al publicar la reseña'
    });
  }
}