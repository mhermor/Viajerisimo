const prisma = require('../prisma')

// Devuelve todas las reseñas de un destino específico
const getResenas = async (req, res) => {
  try {
    const resenas = await prisma.resena.findMany({
      where: { destinoId: parseInt(req.params.destinoId) },
      include: { usuario: { select: { nombre: true } } }
    })
    res.json(resenas)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener las reseñas' })
  }
}

// Crea una nueva reseña asociada al usuario autenticado
const crearResena = async (req, res) => {
  const { destinoId, puntuacion, comentario } = req.body
  try {
    const resena = await prisma.resena.create({
      data: {
        usuarioId: req.usuario.id,
        destinoId: parseInt(destinoId),
        puntuacion: parseInt(puntuacion),
        comentario
      }
    })
    res.json(resena)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear la reseña' })
  }
}

// Elimina una reseña verificando que pertenece al usuario autenticado
const eliminarResena = async (req, res) => {
  try {
    const resena = await prisma.resena.findUnique({
      where: { id: parseInt(req.params.id) }
    })
    if (!resena) return res.status(404).json({ error: 'Reseña no encontrada' })
    if (resena.usuarioId !== req.usuario.id) return res.status(403).json({ error: 'No autorizado' })

    await prisma.resena.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ mensaje: 'Reseña eliminada correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar la reseña' })
  }
}

module.exports = { getResenas, crearResena, eliminarResena }