require('dotenv').config()
const { PrismaClient } = require('@prisma/client')
const prisma = new PrismaClient()

async function main() {
  console.log('🖼️  Actualizando imágenes de destinos...')

  const imagenesActualizadas = {
    // PLAYAS
    'Bali': 'https://images.unsplash.com/photo-1537996194471-e657df975ab4?w=800&q=80', // Bali templo
    'Maldivas': 'https://images.unsplash.com/photo-1514282401047-d79a71a590e8?w=800&q=80', // Maldivas agua
    'Cancún': 'https://images.unsplash.com/photo-1568402102990-bc541580b59f?w=800&q=80', // Cancún playa
    'Santorini': 'https://images.unsplash.com/photo-1613395877344-13d4a8e0d49e?w=800&q=80', // Santorini casas blancas
    'Phuket': 'https://images.unsplash.com/photo-1544551763-46a013bb70d5?w=800&q=80', // Playa tropical
    'Seychelles': 'https://images.unsplash.com/photo-1583511655857-d19b40a7a54e?w=800&q=80', // Playa paradisíaca
    
    // MONTAÑAS
    'Alpes Suizos': 'https://images.unsplash.com/photo-1531366936337-7c912a4589a7?w=800&q=80', // Alpes con nieve
    'Patagonia': 'https://images.unsplash.com/photo-1609198092357-e5a6f0194b02?w=800&q=80', // Torres del Paine
    'Dolomitas': 'https://images.unsplash.com/photo-1506905925346-21bda4d32df4?w=800&q=80', // Dolomitas Italia
    'Himalaya': 'https://images.unsplash.com/photo-1591258739299-5b65d5cbb235?w=800&q=80', // Montañas Himalaya
    'Montañas Rocosas': 'https://images.unsplash.com/photo-1484821582734-6c6c9f99a672?w=800&q=80', // Lago montaña
    
    // CIUDADES
    'Nueva York': 'https://images.unsplash.com/photo-1496442226666-8d4d0e62e6e9?w=800&q=80', // NY skyline
    'Tokio': 'https://images.unsplash.com/photo-1540959733332-eab4deabeeaf?w=800&q=80', // Tokio ciudad
    'París': 'https://images.unsplash.com/photo-1502602898657-3e91760cbb34?w=800&q=80', // Torre Eiffel
    'Barcelona': 'https://images.unsplash.com/photo-1562883676-8c7feb83f09b?w=800&q=80', // Sagrada Familia
    'Dubai': 'https://images.unsplash.com/photo-1512453979798-5ea266f8880c?w=800&q=80', // Dubai skyline
    'Londres': 'https://images.unsplash.com/photo-1513635269975-59663e0ac1ad?w=800&q=80', // Big Ben
    'Roma': 'https://images.unsplash.com/photo-1552832230-c0197dd311b5?w=800&q=80', // Coliseo
    'Ámsterdam': 'https://images.unsplash.com/photo-1534351590666-13e3e96b5017?w=800&q=80', // Canales
    'Estambul': 'https://images.unsplash.com/photo-1524231757912-21f4fe3a7200?w=800&q=80' // Mezquita Azul
  }

  for (const [nombre, imagen] of Object.entries(imagenesActualizadas)) {
    await prisma.destino.updateMany({
      where: { nombre },
      data: { imagen }
    })
    console.log(`  ✓ ${nombre}`)
  }

  console.log('\n🎉 Imágenes actualizadas correctamente!')
}

main()
  .catch((e) => {
    console.error('❌ Error:', e)
    process.exit(1)
  })
  .finally(async () => {
    await prisma.$disconnect()
  })