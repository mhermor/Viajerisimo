import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { DestinoService } from '../../services/destino.service';

@Component({
  selector: 'app-destinos',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './destinos.component.html',
  styleUrl: './destinos.component.css'
})
export class DestinosComponent implements OnInit {
  todos: any[] = [];
  filtrados: any[] = [];
  busqueda: string = '';
  categoriaActiva: string = 'todas';
  cargando = true;

  constructor(
    private destinoService: DestinoService,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    // Leer ?categoria= de la URL si viene del home
    this.route.queryParams.subscribe(params => {
      if (params['categoria']) {
        this.categoriaActiva = params['categoria'];
      }
    });

    this.destinoService.getDestinos().subscribe({
      next: (res) => {
        this.todos = res;
        this.aplicarFiltros();
        this.cargando = false;
      },
      error: () => this.cargando = false
    });
  }

  aplicarFiltros() {
    this.filtrados = this.todos.filter(d => {
      const matchCategoria = this.categoriaActiva === 'todas' || d.categoria === this.categoriaActiva;
      const texto = this.busqueda.toLowerCase();
      const matchBusqueda = !texto ||
        d.nombre.toLowerCase().includes(texto) ||
        d.pais.toLowerCase().includes(texto) ||
        d.categoria.toLowerCase().includes(texto);
      return matchCategoria && matchBusqueda;
    });
  }

  setCategoria(cat: string) {
    this.categoriaActiva = cat;
    this.aplicarFiltros();
  }
}