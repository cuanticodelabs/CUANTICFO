'use client';

import AppShell from '@/components/layout/AppShell';
import { Upload, FileText, FolderOpen } from 'lucide-react';

export default function DocumentosPage() {
  return (
    <AppShell title="Documentos" subtitle="Gestión de archivos, facturas y comprobantes">
      <div className="p-4 md:p-6 animate-fade-in">
        <div className="max-w-lg mx-auto mt-12 text-center">
          <div className="w-16 h-16 bg-blue-50 rounded-2xl flex items-center justify-center mx-auto mb-4">
            <FolderOpen size={28} className="text-blue-500" />
          </div>
          <h2 className="text-lg font-semibold text-slate-800 mb-2">Gestor de documentos</h2>
          <p className="text-sm text-slate-500 mb-6">
            Sube y gestiona tus facturas, boletas, comprobantes y cualquier documento financiero.
            Esta sección se conectará con Supabase Storage.
          </p>
          <button className="flex items-center gap-2 px-5 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors mx-auto">
            <Upload size={16} /> Subir documento
          </button>
          <p className="text-xs text-slate-400 mt-4 flex items-center gap-1 justify-center">
            <FileText size={12} /> PDF, XML, JPG — hasta 10MB por archivo
          </p>
        </div>
      </div>
    </AppShell>
  );
}
