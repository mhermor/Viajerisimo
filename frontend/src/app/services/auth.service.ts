import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environment';
import { isPlatformBrowser } from '@angular/common';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = `${environment.apiUrl}/auth`;

  constructor(
    private http: HttpClient,
    @Inject(PLATFORM_ID) private platformId: Object
  ) {}

  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  login(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, datos);
  }

  guardarToken(token: string, nombre: string, rol: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('rol', rol);
    }
  }

  cerrarSesion() {
    if (this.isBrowser()) {
      localStorage.removeItem('token');
      localStorage.removeItem('nombre');
      localStorage.removeItem('rol');
    }
  }

  getToken(): string | null {
    return this.isBrowser() ? localStorage.getItem('token') : null;
  }

  getNombre(): string | null {
    return this.isBrowser() ? localStorage.getItem('nombre') : null;
  }

  getRol(): string | null {
    return this.isBrowser() ? localStorage.getItem('rol') : null;
  }

  estaLogueado(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }
}