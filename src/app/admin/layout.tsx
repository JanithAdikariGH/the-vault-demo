import type { ReactNode } from 'react';

export const metadata = {
  title: 'Admin | The Vault',
  description: 'Arclix Labs Command Center',
};

export default function AdminLayout({ children }: { children: ReactNode }) {
  return (
    <div className="min-h-screen bg-zinc-950 text-zinc-50 antialiased"
      style={{ fontFamily: 'var(--font-inter)' }}
    >
      {children}
    </div>
  );
}
