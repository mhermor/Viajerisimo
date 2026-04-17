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
  const { destinoId, fechaInicio, fechaFin, numPersonas = 1 } = req.body
  try {
    // Obtener el destino para calcular el precio
    const destino = await prisma.destino.findUnique({
      where: { id: parseInt(destinoId) }
    })
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' })

    // Calcular número de días y precio total
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
        precioTotal: precioTotal
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