const express = require('express')
const router = express.Router()
const { getResenas, crearResena, eliminarResena } = require('../controllers/resenaController')
const verificarToken = require('../middleware/auth')

router.get('/:destinoId', getResenas)
router.post('/', verificarToken, crearResena)
router.delete('/:id', verificarToken, eliminarResena)

module.exports = router