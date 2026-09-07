import fs from 'node:fs';
import path from 'node:path';

const variablesFile = path.resolve('android', 'variables.gradle');

if (!fs.existsSync(variablesFile)) {
  console.error('No existe android/variables.gradle. Ejecuta primero: npx cap add android');
  process.exit(1);
}

const current = fs.readFileSync(variablesFile, 'utf8');
const pattern = /minSdkVersion\s*=\s*\d+/;

if (!pattern.test(current)) {
  console.error('No se encontró minSdkVersion en android/variables.gradle.');
  process.exit(1);
}

const updated = current.replace(pattern, 'minSdkVersion = 26');
fs.writeFileSync(variablesFile, updated, 'utf8');
console.log('Android minSdkVersion configurado en 26.');
