#!/bin/bash

# Script untuk mengganti semua penggunaan postgresClient di frontend dengan API calls

FRONTEND_FILES=$(find /Users/jejenjaenudin/Documents/SIMRSZEN/src -name "*.tsx" -o -name "*.ts" | xargs grep -l "postgresClient")

for file in $FRONTEND_FILES; do
  echo "Mengganti postgresClient di $file"
  
  # Backup file
  cp "$file" "${file}.backup"
  
  # Hapus baris impor postgresClient
  sed -i '' '/postgresClient/d' "$file" 2>/dev/null || sed -i '/postgresClient/d' "$file"
  
  # Tambahkan impor api utils jika belum ada
  if ! grep -q "import.*api" "$file"; then
    sed -i '' '2i\
import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
' "$file" 2>/dev/null || sed -i '2i\
import { getApi, postApi, putApi, deleteApi } from "@/utils/api";
' "$file"
  fi
  
  # Ganti penggunaan postgresClient dengan API calls (untuk kasus umum)
  sed -i '' 's/await postgresClient\`[^}]*}/await getApi("\/some-endpoint")/g' "$file" 2#!/bin/bash

# Script untuk mengganti semua penggunaan postgresClient di frontennt
# Script le"
FRONTEND_FILES=$(find /Users/jejenjaenudin/Documents/SIMRSZEN/src -name "*.tsx" -o stg
for file in $FRONTEND_FILES; do
  echo "Mengganti postgresClient di $file"
  
  # Backup file
  cp "$file" "${file}.backup"
  
e-e  echo "Mengganti postgresClie '  
  # Backup file
  cp "$file" "${file}.so e-  cp "$file" "fi  
  # Hapus baris impor pos/p st  sed -i '' '/postgresClient/d' "$fso  
  # Tambahkan impor api utils jika belum ada
  if ! grep -q "import.*api" "$file"; thpo nt  if ! grep -q "iv/null || sed -i 's/postgres    sed -i '' '2i\
import { getApi, postAdpimport { getApi, on' "$file" 2>/dev/null || sed -i '2i\
imah dimodifikasi."
