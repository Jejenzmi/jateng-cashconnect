/**
 * Utilitas untuk membersihkan session autentikasi
 * Digunakan saat setup ulang atau troubleshooting
 */
export const clearAuthSession = () => {
  // Hapus session dan user dari localStorage
  localStorage.removeItem('auth-session');
  localStorage.removeItem('auth-user');
  
  // Juga hapus item-item cache lainnya yang terkait dengan sesi
  localStorage.removeItem('faskesProfile');
  localStorage.removeItem('userPermissions');
  
  console.log('Session auth telah dibersihkan');
};

/**
 * Fungsi untuk mengecek apakah ada session yang tersimpan
 */
export const checkStoredSession = () => {
  const session = localStorage.getItem('auth-session');
  const user = localStorage.getItem('auth-user');
  
  return {
    hasSession: !!session,
    hasUser: !!user,
    session: session ? JSON.parse(session) : null,
    user: user ? JSON.parse(user) : null
  };
};