const prisma = require('../prisma')

// Devuelve todas las reservas del usuario autenticado con datos del destino
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

// Crea una nueva reserva calculando el precio total automáticamente
const crearReserva = async (req, res) => {
  const { destinoId, fechaInicio, fechaFin, numPersonas = 1 } = req.body
  try {
    // Obtener el destino para calcular el precio por día
    const destino = await prisma.destino.findUnique({
      where: { id: parseInt(destinoId) }
    })
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' })

    // Calcular días y precio total: precio/día × días × personas
    const inicio = new Date(fechaInicio)
    const fin = new Date(fechaFin)
    const dias = Math.ceil((fin - inicio) / (1000 * 60 * 60 * 24))
    const precioTotal = destino.precio * dias * numPersonas

    const reserva = await prisma.reserva.create({
      data: {
        usuarioId: req.usuario.id,
        destinoId: parseInt(destinoId),
        fechaInicio: inicio,
        fechaFin: fin,
        numPersonas: parseInt(numPersonas),
        precioTotal
      }
    })
    res.json(reserva)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reserva' })
  }
}

// Cancela una reserva verificando que pertenece al usuario autenticado
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