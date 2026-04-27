import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private apiUrl = `${environment.apiUrl}/resenas`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  // Añade el token JWT al header para peticiones protegidas
  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  // Obtiene todas las reseñas de un destino específico
  getResenas(destinoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${destinoId}`);
  }

  // Publica una nueva reseña (requiere autenticación)
  crearResena(resena: any): Observable<any> {
    return this.http.post(this.apiUrl, resena, { headers: this.getHeaders() });
  }

  // Elimina una reseña propia (el backend verifica que pertenezca al usuario)
  eliminarResena(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}