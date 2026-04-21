const express = require('express')
const router = express.Router()
const { actualizarPerfil, getEstadisticasUsuario } = require('../controllers/usuarioController')
const verificarToken = require('../middleware/auth')

router.put('/perfil', verificarToken, actualizarPerfil)
router.get('/estadisticas', verificarToken, getEstadisticasUsuario)

module.exports = router