import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function searchApiCalls(dir) {
    const files = fs.readdirSync(dir);
    let results = [];
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(searchApiCalls(fullPath));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            const lines = content.split('\n');
            lines.forEach((line, index) => {
                if (line.includes('api.get(') || line.includes('api.post(')) {
                    results.push(`${fullPath}:${index + 1} -> ${line.trim()}`);
                }
            });
        }
    }
    return results;
}

const res = searchApiCalls(path.join(__dirname, '../src'));
res.slice(0, 5).forEach(r => console.log(r));
