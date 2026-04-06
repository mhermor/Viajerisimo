import { Routes } from '@angular/router';
import { HomeComponent } from './components/home/home.component';
import { ContactoComponent } from './components/contacto/contacto.component';
import { AboutComponent } from './components/about/about.component';
import { BusquedaComponent } from './components/busqueda/busqueda.component';
import { ExploraComponent } from './components/explora/explora.component';
import { UsuarioComponent } from './components/usuario/usuario.component';
import { DestinoDetalleComponent } from './components/destino-detalle/destino-detalle.component';
import { AdminComponent } from './components/admin/admin.component';

export const routes: Routes = [
  { path: '', component: HomeComponent },
  { path: 'busqueda', component: BusquedaComponent },
  { path: 'explora', component: ExploraComponent },
  { path: 'destino/:id', component: DestinoDetalleComponent },
  { path: 'usuario', component: UsuarioComponent },
  { path: 'admin', component: AdminComponent },
  { path: 'contacto', component: ContactoComponent },
  { path: 'about', component: AboutComponent },
  { path: '**', redirectTo: '' }
];