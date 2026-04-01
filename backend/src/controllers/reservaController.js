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