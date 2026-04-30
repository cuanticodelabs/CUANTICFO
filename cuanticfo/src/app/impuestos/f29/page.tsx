'use client';

import AppShell from '@/components/layout/AppShell';
import TaxSummaryCard from '@/components/ui/TaxSummaryCard';
import { mockImpuesto } from '@/lib/mock-data/alertas';
import { formatCLP } from '@/lib/utils/format';
import { Download, Send, CheckCircle, AlertTriangle } from 'lucide-react';

export default function F29Page() {
  return (
    <AppShell title="Preparador F29" subtitle="Pre-declaración IVA y PPM — solo referencial, requiere revisión contable">
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">

        {/* Aviso legal */}
        <div className="flex items-start gap-3 bg-amber-50 border border-amber-200 rounded-xl p-4">
          <AlertTriangle size={18} className="text-amber-500 mt-0.5 flex-shrink-0" />
          <p className="text-sm text-amber-800">
            Este resumen es una <strong>estimación referencial</strong> basada en los movimientos registrados.
            No constituye una declaración oficial. Revisa con tu contador antes de declarar en SII.
          </p>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {/* Resumen F29 */}
          <TaxSummaryCard data={mockImpuesto} />

          {/* Detalle */}
          <div className="space-y-4">
            {/* Checklist SII */}
            <div className="card p-5">
              <h3 className="text-sm font-semibold text-slate-800 mb-4">Checklist pre-declaración SII</h3>
              <div className="space-y-2.5">
                {[
                  { label: 'Libro de ventas cuadrado', ok: true },
                  { label: 'Libro de compras cuadrado', ok: true },
                  { label: 'Sin facturas sin clasificar', ok: false },
                  { label: 'Sin documentos observados', ok: false },
                  { label: 'PPM calculado correctamente', ok: true },
                  { label: 'Retenciones honorarios calculadas', ok: true },
                ].map((item) => (
                  <div key={item.label} className="flex items-center gap-2.5">
                    {item.ok
                      ? <CheckCircle size={16} className="text-green-500 flex-shrink-0" />
                      : <AlertTriangle size={16} className="text-orange-400 flex-shrink-0" />
                    }
                    <span className={`text-sm ${item.ok ? 'text-slate-700' : 'text-orange-700'}`}>
                      {item.label}
                    </span>
                  </div>
                ))}
              </div>
            </div>

            {/* Acciones */}
            <div className="card p-5 space-y-3">
              <h3 className="text-sm font-semibold text-slate-800">Acciones</h3>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 bg-blue-600 text-white rounded-xl text-sm font-medium hover:bg-blue-700 transition-colors">
                <Download size={16} /> Descargar respaldo F29
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-slate-200 text-slate-700 rounded-xl text-sm font-medium hover:bg-slate-50 transition-colors">
                <Send size={16} /> Enviar al contador
              </button>
              <button className="w-full flex items-center justify-center gap-2 px-4 py-2.5 border border-green-200 text-green-700 bg-green-50 rounded-xl text-sm font-medium hover:bg-green-100 transition-colors">
                <CheckCircle size={16} /> Marcar como declarado
              </button>
            </div>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
