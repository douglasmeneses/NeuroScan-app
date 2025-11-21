"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = require("express");
const usuarioController_1 = require("../controllers/usuarioController");
const router = (0, express_1.Router)();
router.get('/', usuarioController_1.listarUsuarios);
router.get('/:id', usuarioController_1.buscarUsuarioPorId);
router.post('/', usuarioController_1.criarUsuario);
router.put('/:id', usuarioController_1.atualizarUsuario);
router.patch('/:id', usuarioController_1.atualizarUsuario);
router.delete('/:id', usuarioController_1.deletarUsuario);
exports.default = router;
//# sourceMappingURL=usuarios.js.map