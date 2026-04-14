# VIAJERISIMO - Estado del Proyecto

## Datos del proyecto
- **Alumno:** [Nombre del Alumno]
- **Centro:** C.I.F.P. César Manrique
- **Ciclo:** C.F.G.S. DAW semipresencial 2025-2026
- **Tutor:** José David Díaz Díaz
- **Entrega:** 10 de mayo de 2026
- **Anteproyecto:** Ya entregado y aprobado

## Stack tecnológico
- **Frontend:** Angular 17 (carpeta `/frontend`)
- **Backend:** Node.js + Express.js (carpeta `/backend`)
- **Base de datos:** PostgreSQL + Prisma ORM v5 (cloud, Prisma Platform)
- **Autenticación:** JWT + bcrypt
- **Despliegue:** Render (backend + BD) + Vercel (frontend) + GitHub (CI/CD)
- **Sin Docker**

## Estructura del repositorio
```
Viajerisimo/
├── frontend/          # Angular 17
└── backend/           # Node.js + Express
```

## Estado actual

### ✅ COMPLETADO

#### Backend (`/backend/src/`)
- `index.js` — Servidor Express con CORS, JSON, y todas las rutas
- `prisma.js` — Cliente de Prisma
- `middleware/auth.js` — Verificación de token JWT
- `controllers/authController.js` — Registro y login
- `controllers/destinoController.js` — CRUD completo de destinos
- `controllers/reservaController.js` — Crear, ver y cancelar reservas
- `controllers/resenaController.js` — Crear, ver y eliminar reseñas
- `routes/authRoutes.js` — Rutas de autenticación
- `routes/destinoRoutes.js` — Rutas de destinos
- `routes/reservaRoutes.js` — Rutas de reservas
- `routes/resenaRoutes.js` — Rutas de reseñas

#### Base de datos
- Modelos: `Usuario`, `Destino`, `Reserva`, `Resena`
- Migración aplicada correctamente
- 6 destinos creados: Bali, Maldivas, Alpes Suizos, Andes, Nueva York, Barcelona
- Usuario test: `test@test.com` / `123456` con rol `admin`

#### Frontend (`/frontend/src/app/`)
- `app.config.ts` — HttpClient configurado, SSR desactivado
- `app.routes.ts` — Rutas configuradas incluyendo `/destino/:id` y `/admin`
- `services/auth.service.ts` — Login, registro, token en localStorage
- `services/destino.service.ts` — CRUD destinos con headers JWT
- `services/reserva.service.ts` — Reservas con headers JWT
- `services/resena.service.ts` — Reseñas con headers JWT
- `components/usuario/` — Login, registro y mis reservas (conectado a API)
- `components/explora/` — Destinos de la BD con filtros por categoría
- `components/busqueda/` — Búsqueda por nombre, país o categoría
- `components/destino-detalle/` — Detalle, reservar y dejar reseña
- `components/admin/` — Panel admin (solo rol admin): CRUD destinos

### ⏳ PENDIENTE
1. Despliegue en Render (backend + BD) y Vercel (frontend)
2. Pulir estilos del frontend
3. Crear usuario admin por defecto para el profesor
4. Anexo II (documentación)
5. Vídeo demo
6. Presentación para defensa oral

## Código completo del backend

### `/backend/src/index.js`
```javascript
const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const destinoRoutes = require('./routes/destinoRoutes')
const reservaRoutes = require('./routes/reservaRoutes')
const resenaRoutes = require('./routes/resenaRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Viajerisimo funcionando 🌍' })
})

app.use('/api/auth', authRoutes)
app.use('/api/destinos', destinoRoutes)
app.use('/api/reservas', reservaRoutes)
app.use('/api/resenas', resenaRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})
```

### `/backend/src/prisma.js`
```javascript
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()
module.exports = prisma
```

### `/backend/src/middleware/auth.js`
```javascript
const jwt = require('jsonwebtoken')

const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Acceso denegado, token requerido' })

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = verificado
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

module.exports = verificarToken
```

### `/backend/src/controllers/authController.js`
```javascript
const prisma = require('../prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registro = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' })
    const hash = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hash }
    })
    res.json({ mensaje: 'Usuario registrado correctamente', id: usuario.id })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' })
    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' })
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token, nombre: usuario.nombre, rol: usuario.rol })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

module.exports = { registro, login }
```

### `/backend/src/controllers/destinoController.js`
```javascript
const prisma = require('../prisma')

const getDestinos = async (req, res) => {
  try {
    const { categoria } = req.query
    const destinos = await prisma.destino.findMany({
      where: categoria ? { categoria } : {}
    })
    res.json(destinos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destinos' })
  }
}

const getDestino = async (req, res) => {
  try {
    const destino = await prisma.destino.findUnique({
      where: { id: parseInt(req.params.id) },
      include: { resenas: { include: { usuario: { select: { nombre: true } } } } }
    })
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' })
    res.json(destino)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el destino' })
  }
}

const crearDestino = async (req, res) => {
  const { nombre, descripcion, categoria, imagen, pais, precio } = req.body
  try {
    const destino = await prisma.destino.create({
      data: { nombre, descripcion, categoria, imagen, pais, precio: parseFloat(precio) }
    })
    res.json(destino)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el destino' })
  }
}

const editarDestino = async (req, res) => {
  const { nombre, descripcion, categoria, imagen, pais, precio } = req.body
  try {
    const destino = await prisma.destino.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, descripcion, categoria, imagen, pais, precio: parseFloat(precio) }
    })
    res.json(destino)
  } catch (error) {
    res.status(500).json({ error: 'Error al editar el destino' })
  }
}

const eliminarDestino = async (req, res) => {
  try {
    await prisma.destino.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ mensaje: 'Destino eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el destino' })
  }
}

module.exports = { getDestinos, getDestino, crearDestino, editarDestino, eliminarDestino }
```

### `/backend/src/controllers/reservaController.js`
```javascript
const prisma = require('../prisma')

const getReservas = async (req, res) => {
  try {
    const reservas = await prisma.reserva.findMany({
      where: { usuarioId: req.usuario.id },
      include: { destino: true }
    })
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reservas' })
  }
}

const crearReserva = async (req, res) => {
  const { destinoId, fechaInicio, fechaFin } = req.body
  try {
    const reserva = await prisma.reserva.create({
      data: {
        usuarioId: req.usuario.id,
        destinoId: parseInt(destinoId),
        fechaInicio: new Date(fechaInicio),
        fechaFin: new Date(fechaFin)
      }
    })
    res.json(reserva)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva' })
  }
}

const cancelarReserva = async (req, res) => {
  try {
    const reserva = await prisma.reserva.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!reserva) return res.status(404).json({ error: 'Reserva no encontrada' })
    if (reserva.usuarioId !== req.usuario.id) return res.status(403).json({ error: 'No autorizado' })
    await prisma.reserva.update({
      where: { id: parseInt(req.params.id) },
      data: { estado: 'cancelada' }
    })
    res.json({ mensaje: 'Reserva cancelada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al cancelar la reserva' })
  }
}

module.exports = { getReservas, crearReserva, cancelarReserva }
```

### `/backend/src/controllers/resenaController.js`
```javascript
const prisma = require('../prisma')

const getResenas = async (req, res) => {
  try {
    const resenas = await prisma.resena.findMany({
      where: { destinoId: parseInt(req.params.destinoId) },
      include: { usuario: { select: { nombre: true } } }
    })
    res.json(resenas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reseñas' })
  }
}

const crearResena = async (req, res) => {
  const { destinoId, puntuacion, comentario } = req.body
  try {
    const resena = await prisma.resena.create({
      data: {
        usuarioId: req.usuario.id,
        destinoId: parseInt(destinoId),
        puntuacion: parseInt(puntuacion),
        comentario
      }
    })
    res.json(resena)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reseña' })
  }
}

const eliminarResena = async (req, res) => {
  try {
    const resena = await prisma.resena.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' })
    if (resena.usuarioId !== req.usuario.id) return res.status(403).json({ error: 'No autorizado' })
    await prisma.resena.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ mensaje: 'Reseña eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reseña' })
  }
}

module.exports = { getResenas, crearResena, eliminarResena }
```

### `/backend/src/routes/authRoutes.js`
```javascript
const express = require('express')
const router = express.Router()
const { registro, login } = require('../controllers/authController')

router.post('/registro', registro)
router.post('/login', login)

module.exports = router
```

### `/backend/src/routes/destinoRoutes.js`
```javascript
const express = require('express')
const router = express.Router()
const { getDestinos, getDestino, crearDestino, editarDestino, eliminarDestino } = require('../controllers/destinoController')
const verificarToken = require('../middleware/auth')

router.get('/', getDestinos)
router.get('/:id', getDestino)
router.post('/', verificarToken, crearDestino)
router.put('/:id', verificarToken, editarDestino)
router.delete('/:id', verificarToken, eliminarDestino)

module.exports = router
```

### `/backend/src/routes/reservaRoutes.js`
```javascript
const express = require('express')
const router = express.Router()
const { getReservas, crearReserva, cancelarReserva } = require('../controllers/reservaController')
const verificarToken = require('../middleware/auth')

router.get('/', verificarToken, getReservas)
router.post('/', verificarToken, crearReserva)
router.put('/:id/cancelar', verificarToken, cancelarReserva)

module.exports = router
```

### `/backend/src/routes/resenaRoutes.js`
```javascript
const express = require('express')
const router = express.Router()
const { getResenas, crearResena, eliminarResena } = require('../controllers/resenaController')
const verificarToken = require('../middleware/auth')

router.get('/:destinoId', getResenas)
router.post('/', verificarToken, crearResena)
router.delete('/:id', verificarToken, eliminarResena)

module.exports = router
```

### `/backend/prisma/schema.prisma`
```prisma
generator client {
  provider = "prisma-client-js"
}

datasource db {
  provider = "postgresql"
  url      = env("DATABASE_URL")
}

model Usuario {
  id         Int       @id @default(autoincrement())
  nombre     String
  email      String    @unique
  password   String
  rol        String    @default("usuario")
  creadoEn   DateTime  @default(now())
  reservas   Reserva[]
  resenas    Resena[]
}

model Destino {
  id          Int       @id @default(autoincrement())
  nombre      String
  descripcion String
  categoria   String
  imagen      String?
  pais        String
  precio      Float
  creadoEn    DateTime  @default(now())
  reservas    Reserva[]
  resenas     Resena[]
}

model Reserva {
  id          Int       @id @default(autoincrement())
  usuarioId   Int
  destinoId   Int
  fechaInicio DateTime
  fechaFin    DateTime
  estado      String    @default("pendiente")
  creadoEn    DateTime  @default(now())
  usuario     Usuario   @relation(fields: [usuarioId], references: [id])
  destino     Destino   @relation(fields: [destinoId], references: [id])
}

model Resena {
  id          Int       @id @default(autoincrement())
  usuarioId   Int
  destinoId   Int
  puntuacion  Int
  comentario  String
  creadoEn    DateTime  @default(now())
  usuario     Usuario   @relation(fields: [usuarioId], references: [id])
  destino     Destino   @relation(fields: [destinoId], references: [id])
}
```

## Código completo del frontend (servicios)

### `/frontend/src/app/services/auth.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private apiUrl = 'http://localhost:3000/api/auth';

  constructor(private http: HttpClient) {}

  registro(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/registro`, datos);
  }

  login(datos: any): Observable<any> {
    return this.http.post(`${this.apiUrl}/login`, datos);
  }

  guardarToken(token: string, nombre: string, rol: string) {
    localStorage.setItem('token', token);
    localStorage.setItem('nombre', nombre);
    localStorage.setItem('rol', rol);
  }

  cerrarSesion() {
    localStorage.removeItem('token');
    localStorage.removeItem('nombre');
    localStorage.removeItem('rol');
  }

  getToken(): string | null { return localStorage.getItem('token'); }
  getNombre(): string | null { return localStorage.getItem('nombre'); }
  getRol(): string | null { return localStorage.getItem('rol'); }
  estaLogueado(): boolean { return !!localStorage.getItem('token'); }
}
```

### `/frontend/src/app/services/destino.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class DestinoService {
  private apiUrl = 'http://localhost:3000/api/destinos';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` });
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
```

### `/frontend/src/app/services/reserva.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ReservaService {
  private apiUrl = 'http://localhost:3000/api/reservas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` });
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
```

### `/frontend/src/app/services/resena.service.ts`
```typescript
import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';
import { AuthService } from './auth.service';

@Injectable({ providedIn: 'root' })
export class ResenaService {
  private apiUrl = 'http://localhost:3000/api/resenas';

  constructor(private http: HttpClient, private authService: AuthService) {}

  private getHeaders() {
    return new HttpHeaders({ 'Authorization': `Bearer ${this.authService.getToken()}` });
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
```

## Punto de repaso del código
Estábamos repasando el backend archivo por archivo para entenderlo a fondo.
- ✅ `index.js` — completamente entendido
- 🔄 `middleware/auth.js` — a medias, última pregunta pendiente:
  **¿Por qué guardamos `req.usuario = verificado` antes de llamar a `next()`?**
  Pista: `verificado` contiene `{ id: usuario.id, rol: usuario.rol }`. ¿Dónde se usa eso en los controladores?

## Notas importantes
- SSR desactivado en `angular.json` para evitar errores de localStorage
- Prisma v5 (no v7) por compatibilidad
- `--legacy-peer-deps` necesario en algunos `npm install`
- Usuario admin: `test@test.com` / `123456` (rol cambiado a admin en Prisma Studio)
- JWT_SECRET definido en `.env` como `viajerisimo_secret_2026`
