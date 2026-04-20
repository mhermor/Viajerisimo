import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AboutComponent } from './components/about/about.component';
import { DestinosComponent } from './components/destinos/destinos.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'destinos', component: DestinosComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'about', component: AboutComponent },
  // Redirigir rutas antiguas por si acaso
  { path: 'busqueda', redirectTo: 'destinos' },
  { path: 'explora', redirectTo: 'destinos' },
  { path: '**', redirectTo: '' }
];