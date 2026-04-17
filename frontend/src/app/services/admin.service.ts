import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AdminService {
  private apiUrl = `${environment.apiUrl}/admin`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` });
  }

  // Estadísticas del dashboard
  getEstadisticas(): Observable<any> {
    return this.http.get(`${this.apiUrl}/estadisticas`, { headers: this.getHeaders() });
  }

  // Obtener todas las reservas (con filtro opcional por estado)
  getTodasReservas(estado?: string): Observable<any> {
    const url = estado ? `${this.apiUrl}/reservas?estado=${estado}` : `${this.apiUrl}/reservas`;
    return this.http.get(url, { headers: this.getHeaders() });
  }

  // Cambiar estado de una reserva
  cambiarEstadoReserva(id: number, estado: string): Observable<any> {
    return this.http.put(
      `${this.apiUrl}/reservas/${id}/estado`, 
      { estado }, 
      { headers: this.getHeaders() }
    );
  }

  // Obtener todos los usuarios
  getTodosUsuarios(): Observable<any> {
    return this.http.get(`${this.apiUrl}/usuarios`, { headers: this.getHeaders() });
  }
}