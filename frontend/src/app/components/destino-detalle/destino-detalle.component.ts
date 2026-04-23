import { Component, OnInit, ViewChild, ElementRef } from '@angular/core';
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
  @ViewChild('pagoDialog') pagoDialog!: ElementRef<HTMLDialogElement>;

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

  // Pago simulado
  pagoNombre: string = '';
  pagoTarjeta: string = '';
  pagoCaducidad: string = '';
  pagoCVV: string = '';
  pagoProcesando: boolean = false;
  pagoCompletado: boolean = false;
  pagoError: string = '';
  numeroReserva: string = '';

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

  // Abre el dialog de pago
  abrirPago() {
    if (!this.fechaInicio || !this.fechaFin) {
      this.mensajeReserva = 'Por favor selecciona las fechas';
      return;
    }
    if (this.numDias <= 0) {
      this.mensajeReserva = 'La fecha de fin debe ser posterior a la de inicio';
      return;
    }
    // Resetear estado del pago
    this.pagoNombre = '';
    this.pagoTarjeta = '';
    this.pagoCaducidad = '';
    this.pagoCVV = '';
    this.pagoProcesando = false;
    this.pagoCompletado = false;
    this.pagoError = '';
    this.mensajeReserva = '';
    this.pagoDialog.nativeElement.showModal();
  }

  cerrarPago() {
    if (this.pagoProcesando) return;
    this.pagoDialog.nativeElement.close();
  }

  // Formatea el número de tarjeta con espacios cada 4 dígitos
  formatearTarjeta(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 16);
    val = val.replace(/(.{4})/g, '$1 ').trim();
    this.pagoTarjeta = val;
  }

  // Formatea la caducidad MM/AA
  formatearCaducidad(event: any) {
    let val = event.target.value.replace(/\D/g, '').substring(0, 4);
    if (val.length >= 2) val = val.substring(0, 2) + '/' + val.substring(2);
    this.pagoCaducidad = val;
  }

  procesarPago() {
    // Validaciones básicas
    const tarjetaLimpia = this.pagoTarjeta.replace(/\s/g, '');
    if (!this.pagoNombre.trim()) {
      this.pagoError = 'Por favor introduce el nombre del titular';
      return;
    }
    if (tarjetaLimpia.length !== 16) {
      this.pagoError = 'El número de tarjeta debe tener 16 dígitos';
      return;
    }
    if (this.pagoCaducidad.length !== 5) {
      this.pagoError = 'Introduce la fecha de caducidad (MM/AA)';
      return;
    }
    if (this.pagoCVV.length < 3) {
      this.pagoError = 'El CVV debe tener 3 dígitos';
      return;
    }

    this.pagoError = '';
    this.pagoProcesando = true;

    // Simulamos procesamiento de 2 segundos
    setTimeout(() => {
      this.reservaService.crearReserva({
        destinoId: this.destino.id,
        fechaInicio: this.fechaInicio,
        fechaFin: this.fechaFin,
        numPersonas: this.numPersonas
      }).subscribe({
        next: (res) => {
          this.pagoProcesando = false;
          this.pagoCompletado = true;
          this.numeroReserva = 'VJ-' + String(res.id || Math.floor(Math.random() * 90000) + 10000).padStart(5, '0');
          // Limpiar formulario de reserva
          this.fechaInicio = '';
          this.fechaFin = '';
          this.numPersonas = 1;
          this.precioTotal = 0;
          this.numDias = 0;
        },
        error: () => {
          this.pagoProcesando = false;
          this.pagoError = 'Error al procesar la reserva. Inténtalo de nuevo.';
        }
      });
    }, 2000);
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