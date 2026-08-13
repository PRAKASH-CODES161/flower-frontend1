import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __filename = fileURLToPath(import.meta.url);
const __dirname = path.dirname(__filename);

function searchAxios(dir) {
    const files = fs.readdirSync(dir);
    let results = [];
    for (const file of files) {
        const fullPath = path.join(dir, file);
        const stat = fs.statSync(fullPath);
        if (stat.isDirectory()) {
            results = results.concat(searchAxios(fullPath));
        } else if (file.endsWith('.js') || file.endsWith('.jsx')) {
            if (fullPath.includes('api.js')) continue;
            const content = fs.readFileSync(fullPath, 'utf8');
            if (content.includes('import axios from \'axios\'') || content.includes('import axios from "axios"')) {
                results.push(fullPath);
            }
        }
    }
    return results;
}

const res = searchAxios(path.join(__dirname, '../src'));
console.log(JSON.stringify(res, null, 2));
