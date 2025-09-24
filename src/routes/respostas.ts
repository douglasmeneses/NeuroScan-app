import { Router } from "express";
import {
  listarRespostas,
  criarResposta,
  buscarRespostaPorId,
  buscarSensoresPorResposta,
} from "../controllers/respostaController";

const router = Router();

router.get("/", listarRespostas as any);
router.post("/", criarResposta as any);
router.get("/:id", buscarRespostaPorId as any);
router.get("/:id/sensores", buscarSensoresPorResposta as any);

export default router;
