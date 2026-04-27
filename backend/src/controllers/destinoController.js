const prisma = require('../prisma')

// Devuelve todos los destinos, con filtro opcional por categoría
const getDestinos = async (req, res) => {
  try {
    const { categoria } = req.query
    const destinos = await prisma.destino.findMany({
      where: categoria ? { categoria } : {}
    })
    res.json(destinos)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener destinos' })
  }
}

// Devuelve el detalle de un destino incluyendo sus reseñas con nombre de usuario
const getDestino = async (req, res) => {
  try {
    const destino = await prisma.destino.findUnique({
      where: { id: parseInt(req.params.id) },
      include: {
        resenas: {
          include: { usuario: { select: { nombre: true } } }
        }
      }
    })
    if (!destino) return res.status(404).json({ error: 'Destino no encontrado' })
    res.json(destino)
  } catch (error) {
    res.status(500).json({ error: 'Error al obtener el destino' })
  }
}

// Crea un nuevo destino (requiere rol admin)
const crearDestino = async (req, res) => {
  const { nombre, descripcion, categoria, imagen, pais, precio } = req.body
  try {
    const destino = await prisma.destino.create({
      data: { nombre, descripcion, categoria, imagen, pais, precio: parseFloat(precio) }
    })
    res.json(destino)
  } catch (error) {
    res.status(500).json({ error: 'Error al crear el destino' })
  }
}

// Actualiza los datos de un destino existente (requiere rol admin)
const editarDestino = async (req, res) => {
  const { nombre, descripcion, categoria, imagen, pais, precio } = req.body
  try {
    const destino = await prisma.destino.update({
      where: { id: parseInt(req.params.id) },
      data: { nombre, descripcion, categoria, imagen, pais, precio: parseFloat(precio) }
    })
    res.json(destino)
  } catch (error) {
    res.status(500).json({ error: 'Error al editar el destino' })
  }
}

// Elimina un destino por ID (requiere rol admin)
const eliminarDestino = async (req, res) => {
  try {
    await prisma.destino.delete({ where: { id: parseInt(req.params.id) } })
    res.json({ mensaje: 'Destino eliminado correctamente' })
  } catch (error) {
    res.status(500).json({ error: 'Error al eliminar el destino' })
  }
}

module.exports = { getDestinos, getDestino, crearDestino, editarDestino, eliminarDestino }