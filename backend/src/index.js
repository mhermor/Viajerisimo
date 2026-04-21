const express = require('express')
const cors = require('cors')
require('dotenv').config()

const authRoutes = require('./routes/authRoutes')
const destinoRoutes = require('./routes/destinoRoutes')
const reservaRoutes = require('./routes/reservaRoutes')
const resenaRoutes = require('./routes/resenaRoutes')
const adminRoutes = require('./routes/adminRoutes')
const usuarioRoutes = require('./routes/usuarioRoutes')

const app = express()
app.use(cors())
app.use(express.json())

app.get('/', (req, res) => {
  res.json({ mensaje: 'API de Viajerisimo funcionando 🌍' })
})

app.use('/api/auth', authRoutes)
app.use('/api/destinos', destinoRoutes)
app.use('/api/reservas', reservaRoutes)
app.use('/api/resenas', resenaRoutes)
app.use('/api/admin', adminRoutes)
app.use('/api/usuarios', usuarioRoutes)

const PORT = process.env.PORT || 3000
app.listen(PORT, () => {
  console.log(`Servidor corriendo en http://localhost:${PORT}`)
})