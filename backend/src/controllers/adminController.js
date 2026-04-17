const prisma = require('../prisma')

const getEstadisticas = async (req, res) => {
  try {
    // Total de destinos
    const totalDestinos = await prisma.destino.count()
    console.log('📍 Total destinos:', totalDestinos)
    
    // Total de reservas
    const totalReservas = await prisma.reserva.count()
    console.log('📅 Total reservas:', totalReservas)
    
    // Total de usuarios
    const totalUsuarios = await prisma.usuario.count()
    console.log('👥 Total usuarios:', totalUsuarios)
    
// Ingresos totales (calculados manualmente si no existe precioTotal)
let ingresosTotal = 0
const todasReservas = await prisma.reserva.findMany({
  include: { destino: true }
})

for (const reserva of todasReservas) {
  if (reserva.precioTotal) {
    ingresosTotal += reserva.precioTotal
  } else {
    // Calcular si no existe el campo
    const dias = Math.ceil((new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) / (1000 * 60 * 60 * 24))
    const numPersonas = reserva.numPersonas || 1
    ingresosTotal += reserva.destino.precio * dias * numPersonas
  }
}
console.log('💰 Ingresos totales:', ingresosTotal)

    const resultado = {
      totalDestinos,
      totalReservas,
      totalUsuarios,
      ingresosTotal: Math.round(ingresosTotal * 100) / 100 // Redondear a 2 decimales
    }
    
    console.log('📊 Enviando estadísticas:', resultado)
    res.json(resultado)
  } catch (error) {
    console.error('❌ Error al obtener estadísticas:', error)
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

const getTodasReservas = async (req, res) => {
  try {
    const { estado } = req.query
    const reservas = await prisma.reserva.findMany({
      where: estado ? { estado } : {},
      include: {
        usuario: {
          select: { nombre: true, email: true }
        },
        destino: {
          select: { nombre: true, pais: true }
        }
      },
      orderBy: { creadoEn: 'desc' }
    })
    res.json(reservas)
  } catch (error) {
    console.error('Error al obtener reservas:', error)
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
}

const getTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
        _count: {
          select: { reservas: true }
        }
      },
      orderBy: { creadoEn: 'desc' }
    })
    res.json(usuarios)
  } catch (error) {
    console.error('Error al obtener usuarios:', error)
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

const cambiarEstadoReserva = async (req, res) => {
  const { id } = req.params
  const { estado } = req.body
  
  try {
    const reserva = await prisma.reserva.update({
      where: { id: parseInt(id) },
      data: { estado }
    })
    res.json(reserva)
  } catch (error) {
    console.error('Error al cambiar estado de reserva:', error)
    res.status(500).json({ error: 'Error al cambiar estado de reserva' })
  }
}

module.exports = { 
  getEstadisticas, 
  getTodasReservas, 
  getTodosUsuarios,
  cambiarEstadoReserva
}