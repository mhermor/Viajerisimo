import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ReservaService {
  private apiUrl = `${environment.apiUrl}/reservas`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getReservas(): Observable<any> {
    return this.http.get(this.apiUrl, { headers: this.getHeaders() });
  }

  crearReserva(reserva: any): Observable<any> {
    return this.http.post(this.apiUrl, reserva, { headers: this.getHeaders() });
  }

  cancelarReserva(id: number): Observable<any> {
    return this.http.put(`${this.apiUrl}/${id}/cancelar`, {}, { headers: this.getHeaders() });
  }
}