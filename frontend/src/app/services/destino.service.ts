import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class DestinoService {
  private apiUrl = `${environment.apiUrl}/destinos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Añade el token JWT al header para peticiones protegidas (admin)
  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Obtiene todos los destinos con filtro opcional por categoría
  getDestinos(categoria?: string): Observable<any> {
    const url = categoria ? `${this.apiUrl}?categoria=${categoria}` : this.apiUrl;
    return this.http.get(url);
  }

  // Obtiene el detalle de un destino incluyendo sus reseñas
  getDestino(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  // Crea un nuevo destino (requiere rol admin)
  crearDestino(destino: any): Observable<any> {
    return this.http.post(this.apiUrl, destino, { headers: this.getHeaders() });
  }

  // Actualiza un destino existente (requiere rol admin)
  editarDestino(id: number, destino: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, destino, { headers: this.getHeaders() });
  }

  // Elimina un destino por ID (requiere rol admin)
  eliminarDestino(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}