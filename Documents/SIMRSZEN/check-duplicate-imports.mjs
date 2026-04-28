import fs from 'fs';
import path from 'path';

// Fungsi untuk mencari file dengan potensi duplikasi impor
function checkDuplicateImports() {
  const frontendDir = '/Users/jejenjaenudin/Documents/SIMRSZEN/src';
  const problematicFiles = [];

  function walkDirectory(dir) {
    const files = fs.readdirSync(dir);
    for (const file of files) {
      const filePath = path.join(dir, file);
      const stat = fs.statSync(filePath);
      if (stat.isDirectory()) {
        walkDirectory(filePath);
      } else if ((filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && !filePath.includes('node_modules')) {
        try {
          const content = fs.readFileSync(filePath, 'utf8');
          
          // Cek apakah ada duplikasi import React hooks
          const importMatches = content.match(/import\s+\{[^}]*\buseState\b[^}]*\}\s+from\s+["']react["']/g);
          if (importMatches && importMatches.length > 1) {
            problematicFiles.push({ file: filePath, issue: 'Multiple useState imports' });
          }
          
          const useEffectMatches = content.match(/import\s+\{[^}]*\buseEffect\b[^}]*\}\s+from\s+["']react["']/g);
          if (useEffectMatches && useEffectMatches.length > 1) {
            problematicFiles.push({ file: filePath, issue: 'Multiple useEffect imports' });
          }
          
          // Cek apakah ada duplikasi baris yang mirip
          const lines = content.split('\n');
          const seenImports = new Set();
          for (let i = 0; i < lines.length; i++) {
            const line = lines[i].trim();
            if (line.startsWith('import {') && line.includes('from "react"')) {
              if (seenImports.has(line)) {
                problematicFiles.push({ file: filePath, issue: `Duplicate import line at line ${i+1}: ${line}` });
              } else {
                seenImports.add(line);
              }
            }
          }
        } catch (e) {
          // Skip file yang tidak bisa dibaca
        }
      }
    }
  }

  walkDirectory(frontendDir);

  if (problematicFiles.length > 0) {
    console.log('Ditemukan file dengan potensi masalah:');
    problematicFiles.forEach(p => {
      console.log(`- ${p.file}: ${p.issue}`);
    });
  } else {
    console.log('Tidak ditemukan file dengan duplikasi impor yang signifikan.');
  }
}

checkDuplicateImports();