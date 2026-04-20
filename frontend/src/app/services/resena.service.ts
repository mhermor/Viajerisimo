import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root'
})
export class ResenaService {
  private apiUrl = `${environment.apiUrl}/resenas`;

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({
      'Authorization': `Bearer ${this.authService.getToken()}`
    });
  }

  getResenas(destinoId: number): Observable<any> {
    return this.http.get(`${this.apiUrl}/${destinoId}`);
  }

  crearResena(resena: any): Observable<any> {
    return this.http.post(this.apiUrl, resena, { headers: this.getHeaders() });
  }

  eliminarResena(id: number): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getHeaders() });
  }
}