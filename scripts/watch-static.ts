// scripts/watch-static.ts
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { watch } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Starting static file watcher...');

// Ensure the output directory exists
const outputDir = path.join(__dirname, '../.mastra/output/utils');
await fs.ensureDir(outputDir);

// Copy all files initially
copyAllFiles();

// Watch for changes in src/utils
const sourceDir = path.join(__dirname, '../src/utils');

watch(sourceDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    const fullPath = path.join(sourceDir, filename);
    
    if (eventType === 'change' || eventType === 'rename') {
      // Check if file exists (rename can be delete or create)
      if (fs.existsSync(fullPath)) {
        copyFile(fullPath, 'changed');
      } else {
        removeFile(fullPath);
      }
    }
  }
});

console.log('✅ Watching for changes in src/utils...');

function copyFile(filePath: string, action: string): void {
  const relativePath = path.relative(path.join(__dirname, '../src/utils'), filePath);
  const targetPath = path.join(__dirname, '../.mastra/output/utils', relativePath);
  
  try {
    // Ensure target directory exists
    fs.ensureDirSync(path.dirname(targetPath));
    fs.copySync(filePath, targetPath);
    console.log(`📄 File ${action}: ${relativePath}`);
  } catch (err) {
    console.error(`❌ Error copying ${filePath}:`, (err as Error).message);
  }
}

function removeFile(filePath: string): void {
  const relativePath = path.relative(path.join(__dirname, '../src/utils'), filePath);
  const targetPath = path.join(__dirname, '../.mastra/output/utils', relativePath);
  
  try {
    if (fs.existsSync(targetPath)) {
      fs.removeSync(targetPath);
      console.log(`🗑️ File removed: ${relativePath}`);
    }
  } catch (err) {
    console.error(`❌ Error removing ${filePath}:`, (err as Error).message);
  }
}

function copyAllFiles(): void {
  try {
    const sourceDir = path.join(__dirname, '../src/utils');
    const targetDir = path.join(__dirname, '../.mastra/output/utils');
    
    if (fs.existsSync(sourceDir)) {
      fs.copySync(sourceDir, targetDir);
      console.log(`📁 All files copied from src/utils to .mastra/output/utils`);
    }
  } catch (err) {
    console.error('❌ Error copying all files:', (err as Error).message);
  }
}

// Graceful shutdown
process.on('SIGINT', () => {
  console.log('\n👋 Shutting down watcher...');
  process.exit(0);
});