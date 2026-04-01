const express = require('express')
const router = express.Router()
const { getDestinos, getDestino, crearDestino, editarDestino, eliminarDestino } = require('../controllers/destinoController')
const verificarToken = require('../middleware/auth')

router.get('/', getDestinos)
router.get('/:id', getDestino)
router.post('/', verificarToken, crearDestino)
router.put('/:id', verificarToken, editarDestino)
router.delete('/:id', verificarToken, eliminarDestino)

module.exports = router