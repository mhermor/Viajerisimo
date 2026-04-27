import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { DestinoService } from '../../services/destino.service';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrl: './home.component.css'
})
export class HomeComponent implements OnInit {
  destinosDestacados: any[] = [];
  cargando = true;

  constructor(private destinoService: DestinoService) {}

  ngOnInit() {
    // Carga 6 destinos destacados: 2 de cada categoría (playa, montaña, ciudad)
    this.destinoService.getDestinos().subscribe({
      next: (res) => {
        const playas = res.filter((d: any) => d.categoria === 'playa').slice(0, 2);
        const montanas = res.filter((d: any) => d.categoria === 'montaña').slice(0, 2);
        const ciudades = res.filter((d: any) => d.categoria === 'ciudad').slice(0, 2);
        this.destinosDestacados = [...playas, ...montanas, ...ciudades];
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }
}