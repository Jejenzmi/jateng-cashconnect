import fs from 'fs';
import path from 'path';

// Baca semua file frontend yang mengandung postgresClient
const frontendDir = '/Users/jejenjaenudin/Documents/SIMRSZEN/src';
const allFiles = [];

function walkDirectory(dir) {
  const files = fs.readdirSync(dir);
  for (const file of files) {
    const filePath = path.join(dir, file);
    const stat = fs.statSync(filePath);
    if (stat.isDirectory()) {
      walkDirectory(filePath);
    } else if ((filePath.endsWith('.tsx') || filePath.endsWith('.ts')) && !filePath.includes('node_modules')) {
      allFiles.push(filePath);
    }
  }
}

walkDirectory(frontendDir);

// Filter hanya file yang mengandung postgresClient
const filesWithPostgresClient = allFiles.filter(file => {
  try {
    const content = fs.readFileSync(file, 'utf8');
    return content.includes('postgresClient');
  } catch (e) {
    return false;
  }
});

console.log(`Ditemukan ${filesWithPostgresClient.length} file dengan postgresClient:`);
filesWithPostgresClient.forEach(f => console.log(`- ${f}`));

// Fungsi untuk mengganti postgresClient dengan API calls
function replacePostgresClient(content) {
  // Hapus impor postgresClient
  let newContent = content.replace(/import\s+{[^}]*postgresClient[^}]*}\s+from\s+["']@\/integrations\/postgres\/client["'];?\s*\n?/g, '');
  
  // Tambahkan impor API utils jika belum ada dan belum ada impor api sebelumnya
  if (!newContent.match(/import.*api.*from.*utils\/api/) && !newContent.match(/getApi|postApi|putApi|deleteApi/)) {
    const lines = newContent.split('\n');
    let insertIndex = 0;
    
    // Temukan baris pertama impor untuk menambahkan impor API
    for (let i = 0; i < lines.length; i++) {
      if (lines[i].trim().startsWith('import')) {
        insertIndex = i;
        break;
      }
    }
    
    if (insertIndex >= 0) {
      lines.splice(insertIndex, 0, 'import { getApi, postApi, putApi, deleteApi } from "@/utils/api";');
      newContent = lines.join('\n');
    }
  }
  
  // Ganti penggunaan postgresClient dengan API calls (hanya untuk template literals sederhana)
  newContent = newContent.replace(/await\s+postgresClient\s*`([^`]*)`/g, (match, query) => {
    // Coba deteksi jenis operasi SQL untuk menentukan metode API yang sesuai
    if (query.toUpperCase().includes('INSERT')) {
      return 'await postApi("/generic-api", {})'; // Perlu disesuaikan dengan endpoint spesifik
    } else if (query.toUpperCase().includes('UPDATE')) {
      return 'await putApi("/generic-api", {})'; // Perlu disesuaikan dengan endpoint spesifik
    } else if (query.toUpperCase().includes('DELETE')) {
      return 'await deleteApi("/generic-api")'; // Perlu disesuaikan dengan endpoint spesifik
    } else {
      // Untuk SELECT, gunakan GET
      return 'await getApi("/generic-api")'; // Perlu disesuaikan dengan endpoint spesifik
    }
  });
  
  // Ganti penggunaan postgresClient yang bukan await
  newContent = newContent.replace(/postgresClient\s*`([^`]*)`/g, (match, query) => {
    if (query.toUpperCase().includes('INSERT')) {
      return 'postApi("/generic-api", {})';
    } else if (query.toUpperCase().includes('UPDATE')) {
      return 'putApi("/generic-api", {})';
    } else if (query.toUpperCase().includes('DELETE')) {
      return 'deleteApi("/generic-api")';
    } else {
      return 'getApi("/generic-api")';
    }
  });
  
  return newContent;
}

// Proses setiap file
filesWithPostgresClient.forEach(filePath => {
  console.log(`Memperbaiki ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = replacePostgresClient(content);
    
    // Simpan perubahan
    fs.writeFileSync(filePath, newContent);
    console.log(`  -> Selesai`);
  } catch (error) {
    console.error(`  -> Gagal: ${error.message}`);
  }
});

console.log('Proses selesai!');