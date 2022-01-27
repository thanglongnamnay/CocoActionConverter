import { run } from './generated/Library.js'
import { readFileSync, writeFileSync } from 'fs'

try {
    const fileName = process.argv[2];
    const data = readFileSync(fileName, 'utf8');
    console.log("data", data);
    writeFileSync('out.txt', run(data), 'utf8');
} catch (e) {
    console.error(e);
}