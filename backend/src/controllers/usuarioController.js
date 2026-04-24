const prisma = require('../prisma')
const bcrypt = require('bcryptjs')

// Actualiza nombre y/o contraseña del usuario autenticado
const actualizarPerfil = async (req, res) => {
  const { nombre, passwordActual, passwordNueva } = req.body
  const userId = req.usuario.id

  try {
    const usuario = await prisma.usuario.findUnique({ where: { id: userId } })
    if (!usuario) return res.status(404).json({ error: 'Usuario no encontrado' })

    const datosActualizar = {}

    // Actualizar nombre si se proporcionó y es diferente al actual
    if (nombre && nombre.trim()) {
      datosActualizar.nombre = nombre.trim()
    }

    // Actualizar contraseña solo si se proporcionaron ambos campos
    if (passwordActual && passwordNueva) {
      const esValida = await bcrypt.compare(passwordActual, usuario.password)
      if (!esValida) return res.status(400).json({ error: 'La contraseña actual no es correcta' })
      if (passwordNueva.length < 6) return res.status(400).json({ error: 'La nueva contraseña debe tener al menos 6 caracteres' })
      datosActualizar.password = await bcrypt.hash(passwordNueva, 10)
    }

    if (Object.keys(datosActualizar).length === 0) {
      return res.status(400).json({ error: 'No hay datos para actualizar' })
    }

    const actualizado = await prisma.usuario.update({
      where: { id: userId },
      data: datosActualizar,
      select: { id: true, nombre: true, email: true, rol: true }
    })

    res.json({ mensaje: 'Perfil actualizado correctamente', usuario: actualizado })
  } catch (error) {
    res.status(500).json({ error: 'Error al actualizar el perfil' })
  }
}

// Devuelve estadísticas personales del usuario autenticado
const getEstadisticasUsuario = async (req, res) => {
  const userId = req.usuario.id
  try {
    const reservas = await prisma.reserva.findMany({ where: { usuarioId: userId } })

    const totalReservas = reservas.length
    const reservasActivas = reservas.filter(r => r.estado === 'confirmada' || r.estado === 'pendiente').length
    const destinosVisitados = reservas.filter(r => r.estado === 'completada').length
    const gastoTotal = reservas
      .filter(r => r.estado !== 'cancelada')
      .reduce((sum, r) => sum + (r.precioTotal || 0), 0)

    res.json({ totalReservas, reservasActivas, destinosVisitados, gastoTotal })
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener estadísticas' })
  }
}

module.exports = { actualizarPerfil, getEstadisticasUsuario }