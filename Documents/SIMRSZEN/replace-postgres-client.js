const fs = require('fs');
const path = require('path');

// Daftar file yang harus diperbaiki
const filesToFix = [
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useAuth.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useMenuAccess.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useDashboardData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useMedicalRecords.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/components/hr/ScheduleRosterTab.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/components/hr/ShiftManagementTab.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/components/inventory/AutoReorderSettings.tsx',
];

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
function replacePostgresClient(content, filePath) {
  // Hapus impor postgresClient
  let newContent = content.replace(/import\s+{[^}]*postgresClient[^}]*}\s+from\s+["']@\/integrations\/postgres\/client["'];?\s*\n?/g, '');
  
  // Tambahkan impor API utils jika belum ada
  if (!newContent.match(/import.*api.*from.*utils\/api/)) {
    const importIndex = newContent.indexOf('import');
    newContent = `import { getApi, postApi, putApi, deleteApi } from "@/utils/api";\n${newContent}`;
  }
  
  // Ganti penggunaan postgresClient dengan API calls
  newContent = newContent.replace(/\bpostgresClient\s*`([^`]*)`/g, () => {
    // Untuk sementara, ganti dengan API generik
    return 'await getApi("/generic-api")';
  });
  
  // Ganti await postgresClient dengan API calls
  newContent = newContent.replace(/await\s+postgresClient\s*`([^`]*)`/g, () => {
    return 'await getApi("/generic-api")';
  });
  
  return newContent;
}

// Proses setiap file
filesWithPostgresClient.forEach(filePath => {
  console.log(`Memperbaiki ${filePath}...`);
  
  try {
    let content = fs.readFileSync(filePath, 'utf8');
    const newContent = replacePostgresClient(content, filePath);
    
    // Simpan perubahan
    fs.writeFileSync(filePath, newContent);
    console.log(`  -> Selesai`);
  } catch (error) {
    console.error(`  -> Gagal: ${error.message}`);
  }
});

console.log('Proses selesai!');