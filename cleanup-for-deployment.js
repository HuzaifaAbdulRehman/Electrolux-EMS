/**
 * Cleanup Script for Deployment
 * Removes all test files, documentation, and backups before deploying
 */

const fs = require('fs');
const path = require('path');

console.log('🧹 Starting cleanup for deployment...\n');

// Files to keep (important)
const keepFiles = [
  'README.md',
  'package.json',
  'package-lock.json',
  'next.config.js',
  'next.config.mjs',
  'tsconfig.json',
  'tailwind.config.ts',
  'postcss.config.js',
  'drizzle.config.ts',
  '.gitignore',
  '.env.example',
  'DEPLOYMENT_GUIDE.md',
  'cleanup-for-deployment.js',
];

// Patterns to delete
const deletePatterns = [
  // Documentation files (except README.md and DEPLOYMENT_GUIDE.md)
  /^.*\.md$/,
  // SQL backup files
  /^.*\.sql$/,
  // Test scripts
  /^test-.*\.js$/,
  /^check-.*\.js$/,
  /^verify-.*\.js$/,
  /^reset-.*\.js$/,
  /^clear-.*\.js$/,
  /^fix-.*\.js$/,
  /^add-.*\.js$/,
  /^create-.*\.sql$/,
  // Backup files
  /^backup.*$/,
  // Specific files to delete
  /^nul$/,
];

// Get all files in root directory
const rootFiles = fs.readdirSync('.', { withFileTypes: true })
  .filter(item => item.isFile())
  .map(item => item.name);

let deletedCount = 0;
let keptCount = 0;

rootFiles.forEach(file => {
  // Skip files we want to keep
  if (keepFiles.includes(file)) {
    console.log(`✅ Keeping: ${file}`);
    keptCount++;
    return;
  }

  // Check if file matches delete patterns
  const shouldDelete = deletePatterns.some(pattern => pattern.test(file));

  if (shouldDelete) {
    try {
      fs.unlinkSync(file);
      console.log(`🗑️  Deleted: ${file}`);
      deletedCount++;
    } catch (err) {
      console.log(`❌ Error deleting ${file}:`, err.message);
    }
  } else {
    console.log(`⚠️  Unknown file (keeping): ${file}`);
    keptCount++;
  }
});

console.log('\n📊 Cleanup Summary:');
console.log(`   ✅ Files kept: ${keptCount}`);
console.log(`   🗑️  Files deleted: ${deletedCount}`);
console.log('\n✨ Cleanup complete! Your project is ready for deployment.\n');
console.log('📝 Next steps:');
console.log('   1. Review changes: git status');
console.log('   2. Commit: git add . && git commit -m "Prepare for deployment"');
console.log('   3. Push: git push origin main');
console.log('   4. Deploy: Follow DEPLOYMENT_GUIDE.md\n');
