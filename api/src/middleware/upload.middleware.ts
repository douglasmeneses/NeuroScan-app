import multer from "multer";
import path from "node:path";
import { AppError } from "./error.middleware";

// Configuração do storage em memória para processar diretamente
const storage = multer.memoryStorage();

// Filtro de arquivo para aceitar apenas .gz
const fileFilter = (
  req: Express.Request,
  file: Express.Multer.File,
  cb: multer.FileFilterCallback
) => {
  const allowedExtensions = [".gz"];
  const ext = path.extname(file.originalname).toLowerCase();

  if (allowedExtensions.includes(ext)) {
    cb(null, true);
  } else {
    cb(
      new AppError(
        "Formato de arquivo inválido. Apenas arquivos .gz são permitidos.",
        400
      )
    );
  }
};

// Configuração do multer
export const upload = multer({
  storage,
  fileFilter,
  limits: {
    fileSize: 50 * 1024 * 1024, // Limite de 50MB
  },
});
