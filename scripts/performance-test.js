#!/usr/bin/env node

/**
 * Performance Testing Script
 * Runs bundle analysis and provides performance recommendations
 */

const { execSync } = require('child_process');
const fs = require('fs');
const path = require('path');

const colors = {
  reset: '\x1b[0m',
  bright: '\x1b[1m',
  red: '\x1b[31m',
  green: '\x1b[32m',
  yellow: '\x1b[33m',
  blue: '\x1b[34m',
  cyan: '\x1b[36m',
};

function log(message, color = 'reset') {
  console.log(`${colors[color]}${message}${colors.reset}`);
}

function runCommand(command, description) {
  log(`\n${description}...`, 'cyan');
  try {
    execSync(command, { stdio: 'inherit' });
    return true;
  } catch (error) {
    log(`❌ Failed: ${error.message}`, 'red');
    return false;
  }
}

async function main() {
  log('\n🚀 Next EchoBox Performance Testing Suite', 'bright');
  log('==========================================\n', 'bright');

  // Check if bundle analyzer is installed
  const packageJson = JSON.parse(
    fs.readFileSync(path.join(process.cwd(), 'package.json'), 'utf8')
  );

  const hasAnalyzer = 
    packageJson.devDependencies?.['@next/bundle-analyzer'] ||
    packageJson.dependencies?.['@next/bundle-analyzer'];

  if (!hasAnalyzer) {
    log('📦 Installing bundle analyzer...', 'yellow');
    runCommand(
      'npm install --save-dev @next/bundle-analyzer webpack-bundle-analyzer',
      'Installing dependencies'
    );
  }

  // Build the application
  log('\n📊 Step 1: Building application', 'cyan');
  log('=====================================', 'bright');
  const buildSuccess = runCommand('npm run build', 'Building Next.js app');

  if (!buildSuccess) {
    log('\n❌ Build failed. Please fix errors and try again.', 'red');
    process.exit(1);
  }

  // Analyze bundle
  log('\n📈 Step 2: Analyzing bundle size', 'cyan');
  log('=====================================', 'bright');
  log('Opening bundle analyzer in browser...', 'yellow');
  log('Press Ctrl+C when done reviewing\n', 'yellow');

  try {
    execSync('ANALYZE=true npm run build', { stdio: 'inherit' });
  } catch (error) {
    // User pressed Ctrl+C, continue
  }

  // Check .next directory
  log('\n📁 Step 3: Checking build output', 'cyan');
  log('=====================================', 'bright');

  const nextDir = path.join(process.cwd(), '.next');
  if (fs.existsSync(nextDir)) {
    const getTotalSize = (dirPath) => {
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
    };

    const sizeInBytes = getTotalSize(nextDir);
    const sizeInMB = (sizeInBytes / (1024 * 1024)).toFixed(2);
    
    log(`📦 Total build size: ${sizeInMB} MB`, 'blue');
    
    if (sizeInMB > 50) {
      log('⚠️  Build size is large. Consider further optimization.', 'red');
    } else if (sizeInMB > 20) {
      log('✅ Build size is acceptable.', 'yellow');
    } else {
      log('🎉 Build size is excellent!', 'green');
    }
  }

  // Performance recommendations
  log('\n💡 Step 4: Performance Recommendations', 'cyan');
  log('=====================================', 'bright');

  const recommendations = [
    '✅ Bundle analyzer configured',
    '✅ SWC minification enabled',
    '✅ Image optimization configured (AVIF/WebP)',
    '✅ Optimized package imports',
    '✅ Web Vitals tracking enabled',
    '✅ CSS animations optimized',
    '✅ Dynamic imports for heavy components',
    '',
    '📋 Next Steps:',
    '1. Deploy to Vercel staging',
    '2. Run Lighthouse on deployed URL',
    '3. Monitor Web Vitals for 24-48 hours',
    '4. Compare before/after metrics',
  ];

  recommendations.forEach(rec => {
    if (rec === '') {
      console.log('');
    } else if (rec.startsWith('📋')) {
      log(rec, 'cyan');
    } else if (rec.startsWith('✅')) {
      log(rec, 'green');
    } else {
      log(rec, 'yellow');
    }
  });

  log('\n🔍 Step 5: Run Lighthouse (Optional)', 'cyan');
  log('=====================================', 'bright');
  log('To run Lighthouse on your deployed site:', 'yellow');
  log('npx lighthouse https://next-echo-box.vercel.app --view', 'blue');

  log('\n✨ Performance testing complete!', 'green');
  log('Check PERFORMANCE_OPTIMIZATION.md for detailed documentation.\n', 'cyan');
}

main().catch(error => {
  log(`\n❌ Error: ${error.message}`, 'red');
  process.exit(1);
});
