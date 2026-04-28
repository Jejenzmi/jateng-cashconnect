import fs from 'fs';

// Daftar file yang masih mengandung postgresClient
const filesToClean = [
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/components/pharmacy/PharmacyScanner.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/components/referral/SISRUTEDashboard.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/components/quality/INACBGGrouper.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useASPAK.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useAmbulanceData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useReportBuilderData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useInpatientData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBPJSiCareJKN.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useAuditLogs.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBPJSVClaim.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useFormBuilderData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useHRData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/usePurchaseRequestData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useSmartDisplayDevices.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useNotifications.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useHomeCareData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBPJSEClaim.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useAuth.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBloodBankData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useSystemSettings.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useMenuAccess.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useReportData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBookingData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useAccountingData.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useSurgeryData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBPJSFKTP.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useHospitalMigration.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useSetupWizard.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useBPJSAntrean.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useCRUDOperations.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useRLReports.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useModuleConfiguration.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useICUData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/hooks/useDialysisData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Laboratorium.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Pasien.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Inventory.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/PatientAuth.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/RawatJalan.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/MasterData.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/ManajemenUser.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Asuransi.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Farmasi.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Pendaftaran.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Billing.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Antrian.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Radiologi.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/pages/Kiosk.tsx',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/services/HospitalProfileService.ts',
  '/Users/jejenjaenudin/Documents/SIMRSZEN/src/services/ElectronicSignatureService.ts'
];

// Fungsi untuk membersihkan file dari penggunaan postgresClient
function cleanFileContent(content) {
  // Hapus semua baris yang mengandung postgresClient
  let cleanedContent = content.replace(/^\s*import\s+{[^}]*postgresClient[^}]*}\s+from\s+["']@\/integrations\/postgres\/client["'];?\s*\n?/gm, '');
  
  // Ganti semua penggunaan postgresClient dengan API calls generik
  cleanedContent = cleanedContent.replace(/\bpostgresClient\b/g, 'getApi');
  
  // Tambahkan impor API utils jika belum ada
  if (!cleanedContent.match(/import.*api.*from.*utils\/api/) && !cleanedContent.match(/getApi|postApi|putApi|deleteApi/)) {
    const lines = cleanedContent.split('\n');
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
      cleanedContent = lines.join('\n');
    } else {
      // Jika tidak ada impor, tambahkan di awal file
      cleanedContent = 'import { getApi, postApi, putApi, deleteApi } from "@/utils/api";\n\n' + cleanedContent;
    }
  }
  
  return cleanedContent;
}

// Proses setiap file
filesToClean.forEach(filePath => {
  console.log(`Membersihkan ${filePath}...`);
  
  try {
    const content = fs.readFileSync(filePath, 'utf8');
    const cleanedContent = cleanFileContent(content);
    
    // Simpan perubahan
    fs.writeFileSync(filePath, cleanedContent);
    console.log(`  -> Selesai`);
  } catch (error) {
    console.error(`  -> Gagal: ${error.message}`);
  }
});

console.log('Proses pembersihan selesai!');