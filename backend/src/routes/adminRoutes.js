const express = require('express')
const router = express.Router()
const { 
  getEstadisticas, 
  getTodasReservas, 
  getTodosUsuarios,
  cambiarEstadoReserva
} = require('../controllers/adminController')
const verificarToken = require('../middleware/auth')

// Todas las rutas requieren autenticación
router.get('/estadisticas', verificarToken, getEstadisticas)
router.get('/reservas', verificarToken, getTodasReservas)
router.get('/usuarios', verificarToken, getTodosUsuarios)
router.put('/reservas/:id/estado', verificarToken, cambiarEstadoReserva)

module.exports = router