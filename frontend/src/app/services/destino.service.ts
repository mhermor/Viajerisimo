import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class DestinoService {
  private apiUrl = `${environment.apiUrl}/destinos`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getDestinos(categoria?: string): Observable<any> {
    const url = categoria ? `${this.apiUrl}?categoria=${categoria}` : this.apiUrl;
    return this.http.get(url);
  }

  getDestino(id: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${id}`);
  }

  crearDestino(destino: any): Observable<any> {
    return this.http.post(this.apiUrl, destino, { headers: this.getHeaders() });
  }

  editarDestino(id: number, destino: any): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}`, destino, { headers: this.getHeaders() });
  }

  eliminarDestino(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}