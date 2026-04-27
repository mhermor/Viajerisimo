const jwt = require('jsonwebtoken')

// Middleware que verifica el token JWT en el header Authorization
// Inyecta los datos del usuario en req.usuario para los controladores
const verificarToken = (req, res, next) => {
  const authHeader = req.headers['authorization']
  const token = authHeader && authHeader.split(' ')[1]

  if (!token) return res.status(401).json({ error: 'Acceso denegado, token requerido' })

  try {
    const verificado = jwt.verify(token, process.env.JWT_SECRET)
    req.usuario = verificado
    next()
  } catch (error) {
    res.status(401).json({ error: 'Token inválido' })
  }
}

module.exports = verificarToken