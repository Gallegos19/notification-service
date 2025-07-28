const fs = require('fs');
const path = require('path');

function copyDir(src, dest) {
  // Create destination directory if it doesn't exist
  if (!fs.existsSync(dest)) {
    fs.mkdirSync(dest, { recursive: true });
  }

  // Read source directory
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
  console.log('📁 Copying templates and assets...');
  
  // Ensure dist/shared exists
  const sharedDest = path.join(__dirname, '..', 'dist', 'shared');
  if (!fs.existsSync(sharedDest)) {
    fs.mkdirSync(sharedDest, { recursive: true });
  }

  // Copy templates
  const templatesSrc = path.join(__dirname, '..', 'src', 'shared', 'templates');
  const templatesDest = path.join(sharedDest, 'templates');
  copyDir(templatesSrc, templatesDest);
  console.log('✅ Templates copied successfully');

  // Copy assets
  const assetsSrc = path.join(__dirname, '..', 'src', 'shared', 'assets');
  const assetsDest = path.join(sharedDest, 'assets');
  if (fs.existsSync(assetsSrc)) {
    copyDir(assetsSrc, assetsDest);
    console.log('✅ Assets copied successfully');
  }

  console.log('🎉 All shared resources copied to dist/');
} catch (error) {
  console.error('❌ Error copying templates:', error);
  process.exit(1);
}