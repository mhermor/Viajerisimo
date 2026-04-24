const prisma = require('../prisma')

// Devuelve estadísticas generales del sistema para el dashboard de admin
const getEstadisticas = async (req, res) => {
  try {
    const totalDestinos = await prisma.destino.count()
    const totalReservas = await prisma.reserva.count()
    const totalUsuarios = await prisma.usuario.count()

    // Calcular ingresos sumando precioTotal de todas las reservas no canceladas
    const todasReservas = await prisma.reserva.findMany({
      include: { destino: true }
    })

    let ingresosTotal = 0
    for (const reserva of todasReservas) {
      if (reserva.precioTotal) {
        ingresosTotal += reserva.precioTotal
      } else {
        // Fallback: calcular precio si el campo no existe (compatibilidad)
        const dias = Math.ceil((new Date(reserva.fechaFin) - new Date(reserva.fechaInicio)) / (1000 * 60 * 60 * 24))
        const numPersonas = reserva.numPersonas || 1
        ingresosTotal += reserva.destino.precio * dias * numPersonas
      }
    }

    res.json({
      totalDestinos,
      totalReservas,
      totalUsuarios,
      ingresosTotal: Math.round(ingresosTotal * 100) / 100
    })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

// Devuelve todas las reservas del sistema con datos de usuario y destino
// Acepta filtro opcional por estado (?estado=pendiente)
const getTodasReservas = async (req, res) => {
  try {
    const { estado } = req.query
    const reservas = await prisma.reserva.findMany({
      where: estado ? { estado } : {},
      include: {
        usuario: { select: { nombre: true, email: true } },
        destino: { select: { nombre: true, pais: true } }
      },
      orderBy: { creadoEn: 'desc' }
    })
    res.json(reservas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener reservas' })
  }
}

// Devuelve todos los usuarios registrados con contador de reservas
const getTodosUsuarios = async (req, res) => {
  try {
    const usuarios = await prisma.usuario.findMany({
      select: {
        id: true,
        nombre: true,
        email: true,
        rol: true,
        creadoEn: true,
        _count: { select: { reservas: true } }
      },
      orderBy: { creadoEn: 'desc' }
    })
    res.json(usuarios)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener usuarios' })
  }
}

// Actualiza el estado de una reserva (pendiente/confirmada/completada/cancelada)
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
    res.status(500).json({ error: 'Error al cambiar estado de reserva' })
  }
}

module.exports = { getEstadisticas, getTodasReservas, getTodosUsuarios, cambiarEstadoReserva }