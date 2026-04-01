const prisma = require('../prisma')
const bcrypt = require('bcryptjs')
const jwt = require('jsonwebtoken')

const registro = async (req, res) => {
  const { nombre, email, password } = req.body
  try {
    const existe = await prisma.usuario.findUnique({ where: { email } })
    if (existe) return res.status(400).json({ error: 'El email ya está registrado' })
    const hash = await bcrypt.hash(password, 10)
    const usuario = await prisma.usuario.create({
      data: { nombre, email, password: hash }
    })
    res.json({ mensaje: 'Usuario registrado correctamente', id: usuario.id })
  } catch (error) {
    res.status(500).json({ error: 'Error al registrar el usuario' })
  }
}

const login = async (req, res) => {
  const { email, password } = req.body
  try {
    const usuario = await prisma.usuario.findUnique({ where: { email } })
    if (!usuario) return res.status(400).json({ error: 'Usuario no encontrado' })
    const valido = await bcrypt.compare(password, usuario.password)
    if (!valido) return res.status(400).json({ error: 'Contraseña incorrecta' })
    const token = jwt.sign(
      { id: usuario.id, rol: usuario.rol },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    )
    res.json({ token, nombre: usuario.nombre, rol: usuario.rol })
  } catch (error) {
    res.status(500).json({ error: 'Error al iniciar sesión' })
  }
}

module.exports = { registro, login }