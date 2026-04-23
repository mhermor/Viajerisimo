# Viajerísimo 🌍✈️

Plataforma web para la gestión y reserva de destinos turísticos. Proyecto final del CFGS Desarrollo de Aplicaciones Web — CIFP César Manrique.

## 🔗 Demo en producción

- **Frontend:** https://viajerisimo-iexr.vercel.app/
- **Backend:** https://viajerisimo-backend.onrender.com

> ⚠️ El backend está alojado en Render (plan gratuito). La primera petición puede tardar ~30 segundos en despertar el servidor.

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
- Búsqueda de destinos por nombre, país o categoría
- Reservas con cálculo automático de precio (días × personas × precio/día)
- Gestión de reservas personales (ver, cancelar)
- Sistema de reseñas con puntuación de 1 a 5 estrellas
- Panel de usuario con estadísticas personales
- Editar nombre y contraseña

### Administradores
- Dashboard con estadísticas en tiempo real
- Gestión completa de destinos (CRUD)
- Visualización y gestión de todas las reservas
- Control de estados de reservas
- Listado de usuarios registrados

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
- PostgreSQL instalado y corriendo

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

Crear archivo `.env` en `/backend`:
```env
DATABASE_URL="postgresql://usuario:password@localhost:5432/viajerisimo"
JWT_SECRET="viajerisimo_secret_key_2026"
PORT=3000
NODE_ENV="development"
```

Aplicar migraciones y poblar la base de datos:
```bash
npx prisma migrate dev
node prisma/seed.js
```

Iniciar el servidor:
```bash
npm run dev
```

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
│   │   ├── controllers/
│   │   ├── middleware/
│   │   └── routes/
│   ├── prisma/
│   │   ├── schema.prisma
│   │   └── seed.js
│   └── package.json
└── frontend/
    ├── src/
    │   ├── app/
│   │   │   ├── components/
│   │   │   ├── services/
│   │   └── environments/
    └── package.json
```

---

## 🗃️ Base de datos

La base de datos incluye datos de ejemplo:
- **20 destinos** (6 playas, 5 montañas, 9 ciudades)
- **9 usuarios** (1 admin + 8 normales)
- **14 reservas** en diferentes estados
- **25 reseñas** variadas

---

## 📄 Documentación

El Anexo II con la documentación técnica completa del proyecto está disponible en la entrega académica.

---

## 👩‍💻 Autor

Desarrollado por Monica Hernandez Morales como proyecto final del CFGS DAW — CIFP César Manrique, 2026.