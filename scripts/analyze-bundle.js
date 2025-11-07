#!/usr/bin/env node

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

// Colors for console output
const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  magenta: '\x1b[35m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function analyzeBundle() {
  log('🔍 Starting Bundle Analysis...', 'cyan');
  log('=====================================', 'bright');

  try {
    // Build the application
    log('📦 Building application...', 'yellow');
    execSync('npm run build', { stdio: 'inherit' });

    // Analyze with next-bundle-analyzer if available
    log('📊 Analyzing bundle size...', 'yellow');
    
    try {
      execSync('npx @next/bundle-analyzer', { stdio: 'inherit' });
    } catch (error) {
      log('⚠️  Bundle analyzer not found. Installing...', 'yellow');
      execSync('npm install --save-dev @next/bundle-analyzer', { stdio: 'inherit' });
      execSync('npx @next/bundle-analyzer', { stdio: 'inherit' });
    }

    // Check .next directory size
    const nextDir = path.join(process.cwd(), '.next');
    if (fs.existsSync(nextDir)) {
      const stats = fs.statSync(nextDir);
      const sizeInBytes = getTotalSize(nextDir);
      const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
      
      log(`📁 .next directory size: ${sizeInMB} MB`, 'blue');
      
      if (sizeInMB > 50) {
        log('⚠️  Bundle size is large. Consider optimization.', 'red');
      } else if (sizeInMB > 20) {
        log('✅ Bundle size is acceptable.', 'yellow');
      } else {
        log('🎉 Bundle size is excellent!', 'green');
      }
    }

    // Analyze individual chunks
    log('📋 Analyzing chunks...', 'yellow');
    const staticDir = path.join(nextDir, 'static');
    if (fs.existsSync(staticDir)) {
      analyzeChunks(staticDir);
    }

    // Performance recommendations
    log('\n💡 Performance Recommendations:', 'cyan');
    log('=====================================', 'bright');
    
    provideRecommendations();

  } catch (error) {
    log(`❌ Error during analysis: ${error.message}`, 'red');
    process.exit(1);
  }
}

function getTotalSize(dirPath) {
  let totalSize = 0;
  const files = fs.readdirSync(dirPath);
  
  files.forEach(file => {
    const filePath = path.join(dirPath, file);
    const stats = fs.statSync(filePath);
    
    if (stats.isDirectory()) {
      totalSize += getTotalSize(filePath);
    } else {
      totalSize += stats.size;
    }
  });
  
  return totalSize;
}

function analyzeChunks(staticDir) {
  const chunksDir = path.join(staticDir, 'chunks');
  if (!fs.existsSync(chunksDir)) return;

  const chunks = fs.readdirSync(chunksDir);
  const chunkSizes = [];

  chunks.forEach(chunk => {
    const chunkPath = path.join(chunksDir, chunk);
    const stats = fs.statSync(chunkPath);
    const sizeInKB = (stats.size / 1024).toFixed(2);
    chunkSizes.push({ name: chunk, size: parseFloat(sizeInKB) });
  });

  // Sort by size
  chunkSizes.sort((a, b) => b.size - a.size);

  log('\n📊 Largest chunks:', 'blue');
  chunkSizes.slice(0, 10).forEach((chunk, index) => {
    const color = chunk.size > 100 ? 'red' : chunk.size > 50 ? 'yellow' : 'green';
    log(`  ${index + 1}. ${chunk.name}: ${chunk.size.toFixed(2)} KB`, color);
  });
}

function provideRecommendations() {
  const recommendations = [
    '🎯 Use dynamic imports for large components',
    '🖼️ Optimize images with next/image',
    '📦 Consider code splitting for features',
    '🗜️ Enable gzip compression on server',
    '🚀 Use CDN for static assets',
    '⚡ Implement lazy loading for images',
    '📱 Optimize for mobile performance',
    '🔍 Remove unused dependencies',
    '📊 Monitor Core Web Vitals',
    '🎨 Use CSS-in-JS efficiently',
  ];

  recommendations.forEach(rec => log(rec, 'green'));

  log('\n🔧 Next.js specific optimizations:', 'cyan');
  log('  • Use next/dynamic for component lazy loading', 'yellow');
  log('  • Implement getStaticProps where possible', 'yellow');
  log('  • Use next/image for image optimization', 'yellow');
  log('  • Enable incremental static regeneration', 'yellow');
  log('  • Use next/script for third-party scripts', 'yellow');
}

// Run the analysis
analyzeBundle();
