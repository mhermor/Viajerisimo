import { Component, OnInit, PLATFORM_ID, Inject } from '@angular/core';
import { CommonModule, isPlatformBrowser } from '@angular/common';
import { DestinoService } from '../../services/destino.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-explora',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './explora.component.html',
  styleUrl: './explora.component.css'
})
export class ExploraComponent implements OnInit {
  destinos: any[] = [];
  destinosFiltrados: any[] = [];
  categoriaActiva: string = 'todos';

  constructor(
    private destinoService: DestinoService,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  ngOnInit() {
    if (isPlatformBrowser(this.platformId)) {
      this.cargarDestinos();
    }
  }

  cargarDestinos() {
    this.destinoService.getDestinos().subscribe({
      next: (res) => {
        this.destinos = res;
        this.destinosFiltrados = res;
      },
      error: () => console.error('Error al cargar destinos')
    });
  }

  filtrarPorCategoria(categoria: string) {
    this.categoriaActiva = categoria;
    if (categoria === 'todos') {
      this.destinosFiltrados = this.destinos;
    } else {
      this.destinosFiltrados = this.destinos.filter(d => d.categoria === categoria);
    }
  }
}