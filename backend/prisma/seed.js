require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const bcrypt = require('bcryptjs')
const prisma = new PrismaClient()

async function main() {
  console.log('🌱 Iniciando seed completo de la base de datos...\n')

  // ============== 1. USUARIOS ==============
  console.log('👥 Creando usuarios...')
  
  const adminPassword = await bcrypt.hash('admin123', 10)
  const userPassword = await bcrypt.hash('123456', 10)

  const admin = await prisma.usuario.create({
    data: {
      nombre: 'Administrador',
      email: 'admin@viajerisimo.com',
      password: adminPassword,
      rol: 'admin'
    }
  })
  console.log('  ✓ Admin creado:', admin.email)

  const usuarios = []
  const nombresUsuarios = [
    { nombre: 'Carlos García', email: 'carlos@example.com' },
    { nombre: 'María López', email: 'maria@example.com' },
    { nombre: 'Juan Martínez', email: 'juan@example.com' },
    { nombre: 'Ana Rodríguez', email: 'ana@example.com' },
    { nombre: 'Pedro Sánchez', email: 'pedro@example.com' },
    { nombre: 'Laura Fernández', email: 'laura@example.com' },
    { nombre: 'David González', email: 'david@example.com' },
    { nombre: 'Sara Pérez', email: 'sara@example.com' }
  ]

  for (const userData of nombresUsuarios) {
    const usuario = await prisma.usuario.create({
      data: {
        nombre: userData.nombre,
        email: userData.email,
        password: userPassword
      }
    })
    usuarios.push(usuario)
    console.log('  ✓', usuario.nombre)
  }

  // ============== 2. DESTINOS ==============
  console.log('\n📍 Creando destinos...')
  
  const destinos = [
    // PLAYAS
    {
      nombre: 'Bali',
      descripcion: 'Paraíso tropical con playas de arena blanca, templos antiguos y una cultura fascinante. Perfecto para surf, yoga y desconexión total.',
      categoria: 'playa',
      imagen: 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80',
      pais: 'Indonesia',
      precio: 899
    },
    {
      nombre: 'Maldivas',
      descripcion: 'Islas paradisíacas con aguas cristalinas color turquesa, bungalows sobre el agua y arrecifes de coral. El destino soñado para lunas de miel.',
      categoria: 'playa',
      imagen: 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80',
      pais: 'Maldivas',
      precio: 1899
    },
    {
      nombre: 'Cancún',
      descripcion: 'Playas del Caribe mexicano con arena blanca y agua turquesa. Ruinas mayas, vida nocturna y cenotes naturales te esperan.',
      categoria: 'playa',
      imagen: 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80',
      pais: 'México',
      precio: 749
    },
    {
      nombre: 'Santorini',
      descripcion: 'Icónicas casas blancas con cúpulas azules sobre acantilados volcánicos. Atardeceres mágicos, vinos locales y gastronomía mediterránea.',
      categoria: 'playa',
      imagen: 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80',
      pais: 'Grecia',
      precio: 1099
    },
    {
      nombre: 'Phuket',
      descripcion: 'La perla de Tailandia combina playas paradisíacas con templos budistas, mercados nocturnos y una animada vida nocturna.',
      categoria: 'playa',
      imagen: 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80',
      pais: 'Tailandia',
      precio: 699
    },
    {
      nombre: 'Seychelles',
      descripcion: 'Archipiélago de 115 islas en el océano Índico. Playas vírgenes, naturaleza exuberante y exclusividad absoluta.',
      categoria: 'playa',
      imagen: 'https://images.unsplash.com/photo-1553829176-61484f865ac3?q=80&w=1974&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      pais: 'Seychelles',
      precio: 2199
    },
    // MONTAÑAS
    {
      nombre: 'Alpes Suizos',
      descripcion: 'Montañas majestuosas, pueblos alpinos de cuento y estaciones de esquí de primer nivel. Naturaleza en estado puro.',
      categoria: 'montaña',
      imagen: 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80',
      pais: 'Suiza',
      precio: 1299
    },
    {
      nombre: 'Patagonia',
      descripcion: 'Glaciares imponentes, lagos turquesa y montañas escarpadas. Aventura extrema en uno de los lugares más remotos del planeta.',
      categoria: 'montaña',
      imagen: 'https://images.unsplash.com/photo-1715356758153-6d58ae44e8fe?q=80&w=2532&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      pais: 'Argentina',
      precio: 1499
    },
    {
      nombre: 'Dolomitas',
      descripcion: 'Picos dramáticos de los Alpes italianos declarados Patrimonio de la Humanidad. Senderismo en verano, esquí en invierno.',
      categoria: 'montaña',
      imagen: 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80',
      pais: 'Italia',
      precio: 999
    },
    {
      nombre: 'Himalaya',
      descripcion: 'La cordillera más alta del mundo ofrece trekking épico, monasterios budistas y vistas al Everest. Una experiencia espiritual.',
      categoria: 'montaña',
      imagen: 'https://images.unsplash.com/photo-1617380613434-7495e9b45dfb?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      pais: 'Nepal',
      precio: 1199
    },
    {
      nombre: 'Montañas Rocosas',
      descripcion: 'Parques nacionales espectaculares, lagos alpinos color esmeralda y una fauna increíble. Naturaleza salvaje de Norteamérica.',
      categoria: 'montaña',
      imagen: 'https://images.unsplash.com/photo-1587381419916-78fc843a36f8?q=80&w=2070&auto=format&fit=crop&ixlib=rb-4.1.0&ixid=M3wxMjA3fDB8MHxwaG90by1wYWdlfHx8fGVufDB8fHx8fA%3D%3D',
      pais: 'Canadá',
      precio: 1099
    },
    // CIUDADES
    {
      nombre: 'Nueva York',
      descripcion: 'La ciudad que nunca duerme. Desde Times Square hasta Central Park, cada rincón es icónico. Broadway, museos y gastronomía mundial.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80',
      pais: 'Estados Unidos',
      precio: 1199
    },
    {
      nombre: 'Tokio',
      descripcion: 'Metrópolis futurista donde conviven templos antiguos con rascacielos de neón. Gastronomía excepcional y cultura única.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80',
      pais: 'Japón',
      precio: 1399
    },
    {
      nombre: 'París',
      descripcion: 'La ciudad del amor y la luz. Torre Eiffel, Louvre, Champs-Élysées. Arte, moda y gastronomía en cada esquina.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80',
      pais: 'Francia',
      precio: 899
    },
    {
      nombre: 'Barcelona',
      descripcion: 'Arquitectura modernista de Gaudí, playas urbanas y tapas deliciosas. La capital catalana combina cultura, playa y fiesta.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&q=80',
      pais: 'España',
      precio: 599
    },
    {
      nombre: 'Dubai',
      descripcion: 'Lujo y modernidad en el desierto. El edificio más alto del mundo, islas artificiales y centros comerciales gigantes.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80',
      pais: 'Emiratos Árabes',
      precio: 1599
    },
    {
      nombre: 'Londres',
      descripcion: 'Historia, realeza y cultura británica. Big Ben, Palacio de Buckingham y los mejores museos del mundo. Tradición y modernidad.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80',
      pais: 'Reino Unido',
      precio: 799
    },
    {
      nombre: 'Roma',
      descripcion: 'La ciudad eterna con 3000 años de historia. Coliseo, Vaticano, Fontana di Trevi. Cada calle es un museo al aire libre.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80',
      pais: 'Italia',
      precio: 699
    },
    {
      nombre: 'Ámsterdam',
      descripcion: 'Canales pintorescos, museos de arte mundiales y arquitectura única. La capital más liberal y ciclista de Europa.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80',
      pais: 'Países Bajos',
      precio: 749
    },
    {
      nombre: 'Estambul',
      descripcion: 'Donde Europa se encuentra con Asia. Mezquitas bizantinas, bazares milenarios y el Bósforo. Historia viva en cada rincón.',
      categoria: 'ciudad',
      imagen: 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80',
      pais: 'Turquía',
      precio: 649
    }
  ]

  const destinosCreados = []
  for (const destinoData of destinos) {
    const destino = await prisma.destino.create({
      data: destinoData
    })
    destinosCreados.push(destino)
    console.log(`  ✓ ${destino.nombre}, ${destino.pais}`)
  }

  // ============== 3. RESERVAS ==============
  console.log('\n📅 Creando reservas...')

  const reservasData = [
    // Reservas completadas (pasadas)
    { usuarioId: usuarios[0].id, destinoId: destinosCreados[0].id, fechaInicio: new Date('2026-02-01'), fechaFin: new Date('2026-02-08'), numPersonas: 2, estado: 'completada' },
    { usuarioId: usuarios[1].id, destinoId: destinosCreados[3].id, fechaInicio: new Date('2026-01-15'), fechaFin: new Date('2026-01-20'), numPersonas: 2, estado: 'completada' },
    { usuarioId: usuarios[2].id, destinoId: destinosCreados[11].id, fechaInicio: new Date('2026-03-01'), fechaFin: new Date('2026-03-05'), numPersonas: 1, estado: 'completada' },
    { usuarioId: usuarios[3].id, destinoId: destinosCreados[14].id, fechaInicio: new Date('2026-02-10'), fechaFin: new Date('2026-02-14'), numPersonas: 2, estado: 'completada' },
    { usuarioId: usuarios[4].id, destinoId: destinosCreados[6].id, fechaInicio: new Date('2026-01-20'), fechaFin: new Date('2026-01-27'), numPersonas: 4, estado: 'completada' },
    
    // Reservas confirmadas (próximas)
    { usuarioId: usuarios[5].id, destinoId: destinosCreados[1].id, fechaInicio: new Date('2026-05-15'), fechaFin: new Date('2026-05-22'), numPersonas: 2, estado: 'confirmada' },
    { usuarioId: usuarios[6].id, destinoId: destinosCreados[12].id, fechaInicio: new Date('2026-06-01'), fechaFin: new Date('2026-06-07'), numPersonas: 3, estado: 'confirmada' },
    { usuarioId: usuarios[7].id, destinoId: destinosCreados[7].id, fechaInicio: new Date('2026-07-10'), fechaFin: new Date('2026-07-20'), numPersonas: 2, estado: 'confirmada' },
    { usuarioId: usuarios[0].id, destinoId: destinosCreados[15].id, fechaInicio: new Date('2026-08-01'), fechaFin: new Date('2026-08-05'), numPersonas: 1, estado: 'confirmada' },
    
    // Reservas pendientes
    { usuarioId: usuarios[1].id, destinoId: destinosCreados[2].id, fechaInicio: new Date('2026-09-01'), fechaFin: new Date('2026-09-10'), numPersonas: 2, estado: 'pendiente' },
    { usuarioId: usuarios[2].id, destinoId: destinosCreados[4].id, fechaInicio: new Date('2026-10-15'), fechaFin: new Date('2026-10-22'), numPersonas: 3, estado: 'pendiente' },
    { usuarioId: usuarios[3].id, destinoId: destinosCreados[13].id, fechaInicio: new Date('2026-11-01'), fechaFin: new Date('2026-11-04'), numPersonas: 1, estado: 'pendiente' },
    
    // Reservas canceladas
    { usuarioId: usuarios[4].id, destinoId: destinosCreados[5].id, fechaInicio: new Date('2026-03-15'), fechaFin: new Date('2026-03-22'), numPersonas: 2, estado: 'cancelada' },
    { usuarioId: usuarios[5].id, destinoId: destinosCreados[8].id, fechaInicio: new Date('2026-04-01'), fechaFin: new Date('2026-04-07'), numPersonas: 4, estado: 'cancelada' }
  ]

  for (const reservaData of reservasData) {
    const destino = await prisma.destino.findUnique({ where: { id: reservaData.destinoId } })
    const dias = Math.ceil((reservaData.fechaFin - reservaData.fechaInicio) / (1000 * 60 * 60 * 24))
    const precioTotal = destino.precio * dias * reservaData.numPersonas

    await prisma.reserva.create({
      data: {
        ...reservaData,
        precioTotal
      }
    })
    console.log(`  ✓ Reserva ${reservaData.estado}`)
  }

  // ============== 4. RESEÑAS ==============
  console.log('\n⭐ Creando reseñas...')

  const resenasData = [
    // Bali
    { usuarioId: usuarios[0].id, destinoId: destinosCreados[0].id, puntuacion: 5, comentario: '¡Increíble! Las playas son espectaculares y la cultura balinesa es fascinante. Volveré sin duda.' },
    { usuarioId: usuarios[1].id, destinoId: destinosCreados[0].id, puntuacion: 5, comentario: 'Perfecto para desconectar. Los templos son impresionantes y la gente muy amable.' },
    
    // Santorini
    { usuarioId: usuarios[1].id, destinoId: destinosCreados[3].id, puntuacion: 5, comentario: 'Los atardeceres más bonitos que he visto. La comida griega excelente.' },
    { usuarioId: usuarios[2].id, destinoId: destinosCreados[3].id, puntuacion: 4, comentario: 'Muy bonito pero algo caro. Las vistas valen la pena.' },
    
    // Nueva York
    { usuarioId: usuarios[2].id, destinoId: destinosCreados[11].id, puntuacion: 5, comentario: 'La ciudad que nunca duerme de verdad. Hay tanto que ver que necesitas más de una semana.' },
    { usuarioId: usuarios[3].id, destinoId: destinosCreados[11].id, puntuacion: 4, comentario: 'Impresionante pero agotador. Central Park es un oasis en medio del caos.' },
    
    // Barcelona
    { usuarioId: usuarios[3].id, destinoId: destinosCreados[14].id, puntuacion: 5, comentario: 'La Sagrada Familia te deja sin palabras. Las tapas deliciosas y el ambiente increíble.' },
    { usuarioId: usuarios[4].id, destinoId: destinosCreados[14].id, puntuacion: 5, comentario: 'Ciudad perfecta. Playa, cultura, gastronomía... tiene de todo.' },
    
    // Alpes Suizos
    { usuarioId: usuarios[4].id, destinoId: destinosCreados[6].id, puntuacion: 5, comentario: 'Paisajes de película. El esquí es de primer nivel y los pueblos alpinos son de cuento.' },
    { usuarioId: usuarios[5].id, destinoId: destinosCreados[6].id, puntuacion: 5, comentario: 'Caro pero vale cada euro. La naturaleza suiza es impresionante.' },
    
    // Maldivas
    { usuarioId: usuarios[5].id, destinoId: destinosCreados[1].id, puntuacion: 5, comentario: 'Luna de miel perfecta. El agua es tan cristalina que parece irreal.' },
    
    // Tokio
    { usuarioId: usuarios[6].id, destinoId: destinosCreados[12].id, puntuacion: 5, comentario: 'Choque cultural total. La comida es increíble y la gente muy educada.' },
    { usuarioId: usuarios[7].id, destinoId: destinosCreados[12].id, puntuacion: 4, comentario: 'Fascinante pero la barrera del idioma puede ser complicada.' },
    
    // Patagonia
    { usuarioId: usuarios[7].id, destinoId: destinosCreados[7].id, puntuacion: 5, comentario: 'Aventura épica. Los glaciares son imponentes y la naturaleza salvaje.' },
    
    // Cancún
    { usuarioId: usuarios[0].id, destinoId: destinosCreados[2].id, puntuacion: 4, comentario: 'Playas preciosas y las ruinas mayas impresionantes. Algo turístico.' },
    
    // Phuket
    { usuarioId: usuarios[1].id, destinoId: destinosCreados[4].id, puntuacion: 4, comentario: 'Buena relación calidad-precio. Las playas son bonitas pero hay mucho turismo.' },
    
    // París
    { usuarioId: usuarios[2].id, destinoId: destinosCreados[13].id, puntuacion: 5, comentario: 'Ciudad mágica. La Torre Eiffel de noche es espectacular.' },
    { usuarioId: usuarios[3].id, destinoId: destinosCreados[13].id, puntuacion: 4, comentario: 'Bonito pero masificado. Hay que madrugar para evitar las colas.' },
    
    // Dubai
    { usuarioId: usuarios[4].id, destinoId: destinosCreados[15].id, puntuacion: 4, comentario: 'Impresionante arquitectura y lujo por todas partes. Algo artificial.' },
    
    // Londres
    { usuarioId: usuarios[5].id, destinoId: destinosCreados[16].id, puntuacion: 5, comentario: 'Historia en cada esquina. Los museos gratuitos son un plus.' },
    
    // Roma
    { usuarioId: usuarios[6].id, destinoId: destinosCreados[17].id, puntuacion: 5, comentario: 'El Coliseo te transporta en el tiempo. La pasta es la mejor del mundo.' },
    
    // Ámsterdam
    { usuarioId: usuarios[7].id, destinoId: destinosCreados[18].id, puntuacion: 4, comentario: 'Ciudad encantadora con canales preciosos. El Van Gogh Museum es impresionante.' },
    
    // Estambul
    { usuarioId: usuarios[0].id, destinoId: destinosCreados[19].id, puntuacion: 5, comentario: 'Fusión perfecta entre Europa y Asia. La Mezquita Azul es impresionante.' },
    
    // Dolomitas
    { usuarioId: usuarios[1].id, destinoId: destinosCreados[8].id, puntuacion: 5, comentario: 'Paisajes de montaña espectaculares. Perfecto para senderismo.' },
    
    // Himalaya
    { usuarioId: usuarios[2].id, destinoId: destinosCreados[9].id, puntuacion: 5, comentario: 'Experiencia espiritual única. El trekking es exigente pero gratificante.' }
  ]

  for (const resenaData of resenasData) {
    await prisma.resena.create({ data: resenaData })
    console.log(`  ✓ Reseña ${resenaData.puntuacion}⭐`)
  }

  console.log('\n🎉 Seed completado con éxito!')
  console.log(`📊 Resumen:`)
  console.log(`   - ${usuarios.length + 1} usuarios (1 admin + ${usuarios.length} normales)`)
  console.log(`   - ${destinosCreados.length} destinos`)
  console.log(`   - ${reservasData.length} reservas`)
  console.log(`   - ${resenasData.length} reseñas`)
}

main()
  .catch((e) => {
    console.error('❌ Error en seed:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })