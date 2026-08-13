import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function searchFiles(dir) {
    const files = fs.readdirSync(dir);
    let results = [];
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(searchFiles(fullPath));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('http://localhost') || content.includes('http://127.0.0.1')) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

const res = searchFiles(path.join(__dirname, '../src'));
console.log(JSON.stringify(res, null, 2));
