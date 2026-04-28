export interface User {
  id: string;
  email: string;
  fullName: string;
  roles: string[];  // Mengganti role menjadi roles dan sebagai array
  nip?: string;
  is_active: boolean;
  created_at: string;
}

export interface Session {
  token: string;
  expiresAt: Date;
}

// Mengupdate interface AuthContextType agar menyertakan roles
export interface AuthContextType {
  user: User | null;
  roles: string[];
  session: Session | null;
  loading: boolean;
  signIn: (email: string, password: string) => Promise<{ error?: string, needsSetup?: boolean }>;
  signOut: () => void;
  faskesProfileExists?: boolean | null;
  setFaskesProfileExists?: (exists: boolean) => void;
}

// Kita hapus definisi User interface kedua karena menyebabkan konflik