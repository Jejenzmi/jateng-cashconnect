#!/bin/bash

# Script untuk backup otomatis SIMRS ZEN
# Ditulis oleh Tim Pengembang SIMRS ZEN
# Digunakan untuk backup harian database dan file sistem

# Waktu eksekusi
DATE=$(date +%Y%m%d_%H%M%S)
BACKUP_DIR="/home/simrs/backups"
LOG_FILE="$BACKUP_DIR/backup_logs_$DATE.log"

# Konfigurasi database
DB_NAME="simrszen"
DB_USER="satusehat_user"
DB_HOST="localhost"
DB_PORT="5433"

# Pastikan direktori backup ada
mkdir -p $BACKUP_DIR

# Fungsi logging
log_message() {
    echo "$(date '+%Y-%m-%d %H:%M:%S') - $1" | tee -a $LOG_FILE
}

log_message "==================================================="
log_message "Memulai proses backup otomatis SIMRS ZEN"
log_message "Tanggal: $(date)"

# Backup database PostgreSQL
log_message "Memulai backup database..."
pg_dump -h $DB_HOST -p $DB_PORT -U $DB_USER -d $DB_NAME > "$BACKUP_DIR/db_backup_$DATE.sql" 2>>$LOG_FILE

if [ $? -eq 0 ]; then
    log_message "Backup database berhasil disimpan sebagai db_backup_$DATE.sql"
    
    # Kompresi file backup
    gzip "$BACKUP_DIR/db_backup_$DATE.sql"
    log_message "File backup telah dikompresi"
else
    log_message "ERROR: Backup database gagal"
    exit 1
fi

# Backup folder assets penting (gambar pasien, dokumen, dll)
log_message "Memulai backup folder assets..."
ASSETS_SRC="/home/simrs/simrs-zen/public/assets"
ASSETS_DST="$BACKUP_DIR/assets_backup_$DATE.tar.gz"

if [ -d "$ASSETS_SRC" ]; then
    tar -czf $ASSETS_DST -C $(dirname $ASSETS_SRC) $(basename $ASSETS_SRC) 2>>$LOG_FILE
    if [ $? -eq 0 ]; then
        log_message "Backup assets berhasil disimpan sebagai assets_backup_$DATE.tar.gz"
    else
        log_message "ERROR: Backup assets gagal"
    fi
else
    log_message "INFO: Folder assets tidak ditemukan, dilewati"
fi

# Backup konfigurasi penting
log_message "Memulai backup file konfigurasi..."
CONFIG_FILES=(
    "/home/simrs/simrs-zen/.env"
    "/home/simrs/simrs-zen/backend/.env"
    "/home/simrs/simrs-zen/docker-compose.yml"
    "/home/simrs/simrs-zen/nginx.conf"
    "/home/simrs/simrs-zen/backend/nginx.conf"
)

CONFIG_BACKUP="$BACKUP_DIR/config_backup_$DATE.tar.gz"
tar -czf $CONFIG_BACKUP -T <(printf '%s\n' "${CONFIG_FILES[@]}") 2>/dev/null || {
    # Jika beberapa file tidak ditemukan, backup yang tersedia saja
    temp_list=$(mktemp)
    for file in "${CONFIG_FILES[@]}"; do
        if [ -f "$file" ]; then
            echo "$file" >> $temp_list
        fi
    done
    tar -czf $CONFIG_BACKUP -T $temp_list
    rm $temp_list
}

log_message "Backup konfigurasi berhasil disimpan sebagai config_backup_$DATE.tar.gz"

# Hapus backup yang lebih lama dari 30 hari
log_message "Membersihkan backup lama (lebih dari 30 hari)..."
find $BACKUP_DIR -name "*.sql.gz" -type f -mtime +30 -delete
find $BACKUP_DIR -name "*assets*.tar.gz" -type f -mtime +30 -delete
find $BACKUP_DIR -name "*config*.tar.gz" -type f -mtime +30 -delete
find $BACKUP_DIR -name "backup_logs_*" -type f -mtime +30 -delete

log_message "Pembersihan backup lama selesai"

# Hitung ukuran total backup
TOTAL_SIZE=$(du -sh $BACKUP_DIR | cut -f1)
log_message "Ukuran total direktori backup: $TOTAL_SIZE"

log_message "Proses backup otomatis selesai"
log_message "==================================================="