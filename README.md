# Viajerísimo 🌍✈️

Plataforma web para la gestión y reserva de destinos turísticos. Proyecto final del CFGS Desarrollo de Aplicaciones Web — CIFP César Manrique.

## 🔗 Demo en producción

- **Frontend:** https://viajerisimo-iexr.vercel.app/
- **Backend:** https://viajerisimo-backend.onrender.com

> ⚠️ El backend está alojado en Render (plan gratuito). La primera petición puede tardar ~30 segundos en despertar el servidor tras un periodo de inactividad.

---

## 👤 Credenciales de acceso

### Administrador
```
Email: admin@viajerisimo.com
Contraseña: admin123
```

### Usuarios de prueba
```
Email: carlos@example.com  |  Contraseña: 123456
Email: maria@example.com   |  Contraseña: 123456
Email: juan@example.com    |  Contraseña: 123456
```

---

## ✨ Funcionalidades

### Usuarios normales
- Registro e inicio de sesión con JWT
- Exploración de destinos por categoría (playa, montaña, ciudad)
- Búsqueda de destinos por nombre, país o categoría en tiempo real
- Reservas con cálculo automático de precio (días × personas × precio/día)
- Simulacro de pasarela de pago con formulario de tarjeta y confirmación
- Gestión de reservas personales con historial y opción de cancelación
- Sistema de reseñas con puntuación de 1 a 5 estrellas
- Panel de usuario con estadísticas personales (reservas, destinos visitados, gasto total)
- Editar nombre y contraseña desde el perfil

### Administradores
- Dashboard con estadísticas en tiempo real (destinos, reservas, usuarios, ingresos)
- Gestión completa de destinos (CRUD) con buscador
- Visualización y gestión de todas las reservas con filtros por estado
- Control de estados de reservas (pendiente → confirmada → completada)
- Listado de usuarios registrados con número de reservas

---

## 🛠️ Stack tecnológico

| Capa | Tecnología |
|------|-----------|
| Frontend | Angular 19, TypeScript |
| Backend | Node.js, Express.js |
| Base de datos | PostgreSQL |
| ORM | Prisma |
| Autenticación | JWT + bcrypt |
| Hosting frontend | Vercel |
| Hosting backend | Render |

---

## 🚀 Instalación en local

### Requisitos previos
- Node.js v18+
- PostgreSQL instalado y corriendo localmente

### 1. Clonar el repositorio
```bash
git clone https://github.com/mhermor/Viajerisimo.git
cd Viajerisimo
```

### 2. Configurar el Backend
```bash
cd backend
npm install
```

Crear archivo `.env` en `/backend` (no incluido en el repositorio por seguridad):
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/viajerisimo"
JWT_SECRET="viajerisimo_secret_key_2026"
PORT=3000
NODE_ENV="development"
```
> 💡 Sustituye `usuario` y `password` por tus credenciales locales de PostgreSQL
> (normalmente el usuario es `postgres`). La base de datos `viajerisimo` debe 
> existir antes de ejecutar las migraciones. Créala con:
> ```sql
> CREATE DATABASE viajerisimo;
> ```

Aplicar migraciones y poblar la base de datos:
```bash
# Primera vez (base de datos vacía)
npx prisma migrate dev
node prisma/seed.js

# Para resetear y repoblar desde cero
npx prisma migrate reset --force
node prisma/seed.js
```

Iniciar el servidor:
```bash
npm run dev   # Modo desarrollo con recarga automática
# o
npm start     # Modo producción
```

El backend estará disponible en `http://localhost:3000`

### 3. Configurar el Frontend
```bash
cd ../frontend
npm install
ng serve
```

La aplicación estará disponible en `http://localhost:4200`

---

## 📁 Estructura del proyecto

```
Viajerisimo/
├── backend/
│   ├── src/
│   │   ├── controllers/    (lógica de negocio)
│   │   ├── middleware/     (autenticación JWT)
│   │   └── routes/         (definición de endpoints)
│   ├── prisma/
│   │   ├── schema.prisma   (modelo de datos)
│   │   └── seed.js         (datos de prueba)
│   └── package.json
├── frontend/
│   ├── src/
│   │   ├── app/
│   │   │   ├── components/ (vistas y lógica de UI)
│   │   │   ├── services/   (comunicación con el backend)
│   │   │   └── environments/ (configuración por entorno)
│   └── package.json
└── README.md
```

---

## 🗃️ Base de datos

La base de datos incluye datos de ejemplo listos para probar:
- **20 destinos** (6 playas, 5 montañas, 9 ciudades) con imágenes de Unsplash
- **9 usuarios** (1 admin + 8 normales)
- **14 reservas** en diferentes estados (completadas, confirmadas, pendientes, canceladas)
- **25 reseñas** variadas con puntuaciones y comentarios realistas

---

## 📄 Documentación

El Anexo II con la documentación técnica completa del proyecto está disponible en la entrega académica.

---

## 👩‍💻 Autor

Desarrollado por Monica Hernandez Morales como proyecto final del CFGS DAW — CIFP César Manrique, 2026.