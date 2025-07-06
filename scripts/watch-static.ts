// scripts/watch-static.ts
import fs from 'fs-extra';
import path from 'path';
import { fileURLToPath } from 'url';
import { dirname } from 'path';
import { watch } from 'fs';

const __filename = fileURLToPath(import.meta.url);
const __dirname = dirname(__filename);

console.log('🔍 Starting static file watcher...');

// Paths
const sourceDir = path.join(__dirname, '../src/utils');
const outputDir = path.join(__dirname, '../.mastra/output/utils');
const mastraOutputDir = path.join(__dirname, '../.mastra/output');

// Ensure the output directory exists
await fs.ensureDir(outputDir);

// Copy all files initially
copyAllFiles();

// Watch for changes in src/utils
watch(sourceDir, { recursive: true }, (eventType, filename) => {
  if (filename) {
    const fullPath = path.join(sourceDir, filename);
    
    if (eventType === 'change' || eventType === 'rename') {
      if (fs.existsSync(fullPath)) {
        copyFile(fullPath, 'changed');
      } else {
        removeFile(fullPath);
      }
    }
  }
});

// Watch for Mastra rebuilds (when .mastra/output directory changes)
if (fs.existsSync(mastraOutputDir)) {
  watch(mastraOutputDir, { recursive: false }, (eventType, filename) => {
    // When Mastra rebuilds, it often creates/modifies files in the output directory
    if (eventType === 'change' || eventType === 'rename') {
      console.log('🔄 Mastra rebuild detected, re-copying utils...');
      setTimeout(() => {
        // Ensure output directory exists after rebuild
        fs.ensureDirSync(outputDir);
        copyAllFiles();
      }, 2000); // Wait 2 seconds to ensure Mastra build is complete
    }
  });
}

console.log('✅ Watching for changes in src/utils and Mastra rebuilds...');

function copyFile(filePath: string, action: string): void {
  const relativePath = path.relative(sourceDir, filePath);
  const targetPath = path.join(outputDir, relativePath);
  
  try {
    fs.ensureDirSync(path.dirname(targetPath));
    fs.copySync(filePath, targetPath);
    console.log(`📄 File ${action}: ${relativePath}`);
  } catch (err) {
    console.error(`❌ Error copying ${filePath}:`, (err as Error).message);
  }
}

function removeFile(filePath: string): void {
  const relativePath = path.relative(sourceDir, filePath);
  const targetPath = path.join(outputDir, relativePath);
  
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
    if (fs.existsSync(sourceDir)) {
      fs.copySync(sourceDir, outputDir);
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