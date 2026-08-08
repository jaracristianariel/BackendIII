import path from "path";
import { fileURLToPath } from "url";

// Resuelve una ruta absoluta relativa a la raiz del proyecto,
// a partir de donde esta ubicado el archivo que llama (pasale su import.meta.url).
function resolveFromRoot(fileUrl, ...segments) {
    const dirname = path.dirname(fileURLToPath(fileUrl));
    return path.join(dirname, ...segments);
}

export { resolveFromRoot };