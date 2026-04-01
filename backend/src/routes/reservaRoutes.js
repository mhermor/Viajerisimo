const express = require('express')
const router = express.Router()
const { getReservas, crearReserva, cancelarReserva } = require('../controllers/reservaController')
const verificarToken = require('../middleware/auth')

router.get('/', verificarToken, getReservas)
router.post('/', verificarToken, crearReserva)
router.put('/:id/cancelar', verificarToken, cancelarReserva)

module.exports = router