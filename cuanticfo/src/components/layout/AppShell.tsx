'use client';

import { useState } from 'react';
import Sidebar from './Sidebar';
import TopBar from './TopBar';
import BottomNav from './BottomNav';
import { mockPeriodo } from '@/lib/mock-data/dashboard';

interface AppShellProps {
  children: React.ReactNode;
  title?: string;
  subtitle?: string;
}

export default function AppShell({ children, title, subtitle }: AppShellProps) {
  const [periodo, setPeriodo] = useState(mockPeriodo);

  return (
    <div
      className="flex h-screen overflow-hidden"
      style={{ backgroundColor: 'var(--color-app-bg)' }}
    >
      <a href="#main-content" className="skip-link">
        Saltar al contenido principal
      </a>

      {/* Desktop Sidebar */}
      <Sidebar />

      {/* Main Content */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar
          periodo={periodo}
          onPeriodoChange={setPeriodo}
          title={title}
          subtitle={subtitle}
        />
        <main
          id="main-content"
          tabIndex={-1}
          className="flex-1 overflow-y-auto pb-16 md:pb-0 focus:outline-none"
        >
          <div className="max-w-[1440px] mx-auto">{children}</div>
        </main>
      </div>

      {/* Mobile Bottom Nav */}
      <BottomNav />
    </div>
  );
}
