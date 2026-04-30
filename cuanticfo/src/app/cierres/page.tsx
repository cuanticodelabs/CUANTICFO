'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import ClosePeriodChecklist from '@/components/ui/ClosePeriodChecklist';
import { mockCierre } from '@/lib/mock-data/alertas';
import type { CierreMensual } from '@/lib/types';
import { Lock, AlertTriangle } from 'lucide-react';

export default function CierresPage() {
  const [cierre, setCierre] = useState<CierreMensual>(mockCierre);

  const handleToggle = (key: string, value: boolean) => {
    setCierre((prev) => ({ ...prev, [key]: value }));
  };

  const allDone = Object.entries(cierre)
    .filter(([k]) => !['id', 'empresa_id', 'periodo', 'cerrado_por', 'cerrado_at'].includes(k))
    .every(([, v]) => v === true);

  return (
    <AppShell title="Cierre mensual" subtitle="Proceso de cierre contable guiado paso a paso">
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">

        {/* Alert if not complete */}
        {!allDone && (
          <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
            <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
            <p className="text-sm text-amber-800">
              Completa todos los pasos del checklist antes de cerrar el mes.
              El cierre <strong>bloqueará ediciones</strong> en el período.
            </p>
          </div>
        )}

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Checklist */}
          <ClosePeriodChecklist cierre={cierre} onToggle={handleToggle} />

          {/* Actions */}
          <div className="space-y-4">
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Acciones de cierre</h3>
              <div className="space-y-3">
                <button
                  disabled={!allDone}
                  className={`w-full flex items-center justify-center gap-2 px-4 py-3 rounded-xl text-sm font-semibold transition-all ${
                    allDone
                      ? 'bg-green-600 text-white hover:bg-green-700 cursor-pointer'
                      : 'bg-slate-100 text-slate-400 cursor-not-allowed'
                  }`}
                >
                  <Lock size={16} />
                  Cerrar mes y bloquear período
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  Generar snapshot financiero
                </button>
                <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                  Exportar reporte del período
                </button>
              </div>
            </div>

            {/* Info */}
            <div className="card p-5 bg-slate-50">
              <h4 className="text-xs font-semibold text-slate-600 uppercase tracking-wide mb-3">Al cerrar el mes:</h4>
              <ul className="space-y-2 text-sm text-slate-600">
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Se bloquean ediciones en movimientos del período
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Se genera un snapshot financiero inmutable
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-green-500 mt-0.5">✓</span>
                  Los ajustes posteriores quedan con trazabilidad
                </li>
                <li className="flex items-start gap-2">
                  <span className="text-blue-500 mt-0.5">ℹ</span>
                  Los libros contables quedan como referencia oficial
                </li>
              </ul>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
