import fs from 'fs';
import path from 'path';
import { fileURLToPath } from 'url';

const __dirname = path.dirname(fileURLToPath(import.meta.url));
const srcDir = path.resolve(__dirname, 'dist');
const destDir = path.resolve(__dirname, '../../dist');

function copyDir(src, dest) {
  fs.mkdirSync(dest, { recursive: true });
  const entries = fs.readdirSync(src, { withFileTypes: true });

  for (const entry of entries) {
    const srcPath = path.join(src, entry.name);
    const destPath = path.join(dest, entry.name);

    if (entry.isDirectory()) {
      copyDir(srcPath, destPath);
    } else {
      fs.copyFileSync(srcPath, destPath);
    }
  }
}

try {
  console.log(`Copying built files from ${srcDir} to ${destDir}...`);
  if (fs.existsSync(srcDir)) {
    if (fs.existsSync(destDir)) {
      fs.rmSync(destDir, { recursive: true, force: true });
    }
    copyDir(srcDir, destDir);
    console.log('Successfully copied built files to public folder!');
  } else {
    console.warn(`Source directory ${srcDir} does not exist. Skipping copy.`);
  }
} catch (err) {
  console.error('Error copying files:', err);
  process.exit(1);
}
