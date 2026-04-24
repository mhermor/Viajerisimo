import { Injectable, PLATFORM_ID, Inject } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  // Comprueba si el código se ejecuta en el navegador (evita errores con SSR)
  private isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  // Registra un nuevo usuario
  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  // Autentica un usuario y devuelve el token JWT
  login(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, datos);
  }

  // Almacena el token JWT y datos del usuario en localStorage
  guardarToken(token: string, nombre: string, rol: string) {
    if (this.isBrowser()) {
      localStorage.setItem('token', token);
      localStorage.setItem('nombre', nombre);
      localStorage.setItem('rol', rol);
    }
  }

  // Elimina todos los datos de sesión del localStorage
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

  // Devuelve true si hay un token activo en localStorage
  estaLogueado(): boolean {
    return this.isBrowser() && !!localStorage.getItem('token');
  }

  // Actualiza nombre y/o contraseña del perfil del usuario autenticado
  actualizarPerfil(datos: any): Observable<any> {
    return this.http.put(
      `${environment.apiUrl}/usuarios/perfil`,
      datos,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` }) }
    );
  }

  // Obtiene estadísticas personales del usuario autenticado
  getEstadisticas(): Observable<any> {
    return this.http.get(
      `${environment.apiUrl}/usuarios/estadisticas`,
      { headers: new HttpHeaders({ 'Authorization': `Bearer ${this.getToken()}` }) }
    );
  }

  // Actualiza el nombre en localStorage tras editar el perfil
  actualizarNombre(nombre: string) {
    if (this.isBrowser()) {
      localStorage.setItem('nombre', nombre);
    }
  }
}