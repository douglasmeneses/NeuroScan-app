import zlib from "node:zlib";
import { promisify } from "node:util";

const gunzip = promisify(zlib.gunzip);

/**
 * Descomprime um buffer de arquivo .gz
 * @param buffer Buffer do arquivo comprimido
 * @returns Promise com o conteúdo descomprimido como string
 */
export async function decompressGzip(buffer: Buffer): Promise<string> {
  const decompressed = await gunzip(buffer);
  return decompressed.toString("utf-8");
}

/**
 * Descomprime e faz parse de um arquivo .gz contendo JSON
 * @param buffer Buffer do arquivo comprimido
 * @returns Promise com o objeto JSON parseado
 */
export async function decompressAndParseJson<T = unknown>(
  buffer: Buffer
): Promise<T> {
  const content = await decompressGzip(buffer);
  return JSON.parse(content) as T;
}
