import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { DestinoService } from '../../services/destino.service';
import { RouterModule } from '@angular/router';

@Component({
  selector: 'app-busqueda',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './busqueda.component.html',
  styleUrl: './busqueda.component.css'
})
export class BusquedaComponent {
  termino: string = '';
  resultados: any[] = [];
  buscado: boolean = false;

  constructor(private destinoService: DestinoService) {}

  buscar() {
    if (!this.termino.trim()) return;
    this.destinoService.getDestinos().subscribe({
      next: (res) => {
        this.buscado = true;
        this.resultados = res.filter((d: any) =>
          d.nombre.toLowerCase().includes(this.termino.toLowerCase()) ||
          d.pais.toLowerCase().includes(this.termino.toLowerCase()) ||
          d.categoria.toLowerCase().includes(this.termino.toLowerCase())
        );
      },
      error: () => console.error('Error al buscar destinos')
    });
  }
}