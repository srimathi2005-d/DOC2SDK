import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

export function saveGeneratedCode(language, filename, code) {
  const baseDir = path.resolve(__dirname, '../../generated');
  const langDir = path.join(baseDir, language);
  
  if (!fs.existsSync(langDir)) {
    fs.mkdirSync(langDir, { recursive: true });
  }

  const filePath = path.join(langDir, filename);
  fs.writeFileSync(filePath, code, 'utf-8');
  return filePath;
}
