'use client';

import AppShell from '@/components/layout/AppShell';
import { mockEstadoResultados, mockEstadoResultadosHistorico } from '@/lib/mock-data/reportes';
import { formatCLP } from '@/lib/utils/format';
import {
  ResponsiveContainer, LineChart, Line, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';

function Row({ label, value, bold, highlight, indent }: {
  label: string; value: number; bold?: boolean; highlight?: 'green' | 'blue'; indent?: boolean;
}) {
  return (
    <div className={`flex justify-between items-center py-2 ${bold ? 'border-t border-slate-100 mt-1' : ''} ${indent ? 'pl-4' : ''}`}>
      <span className={`text-sm ${bold ? 'font-semibold text-slate-900' : 'text-slate-600'}`}>{label}</span>
      <span className={`text-sm font-semibold ${
        highlight === 'green' ? 'text-green-600 text-base' :
        highlight === 'blue' ? 'text-blue-600 text-base' :
        value < 0 ? 'text-red-600' : 'text-slate-900'
      }`}>
        {formatCLP(value)}
      </span>
    </div>
  );
}

export default function EstadoResultadosPage() {
  const er = mockEstadoResultados;
  return (
    <AppShell title="Estado de resultados" subtitle="Resumen financiero del período seleccionado">
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">

          {/* Estado de resultados */}
          <div className="card p-6 space-y-1">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Resumen del período</h3>

            <Row label="Ingresos operacionales" value={er.ingresos_operacionales} />
            <Row label="(-) Costos directos" value={er.costos_directos} indent />
            <Row label="= Margen bruto" value={er.margen_bruto} bold highlight="green" />

            <div className="pt-2">
              <Row label="(-) Gastos administración" value={er.gastos_administracion} indent />
              <Row label="(-) Gastos ventas" value={er.gastos_ventas} indent />
              <Row label="(-) Gastos tecnología" value={er.gastos_tecnologia} indent />
            </div>

            <Row label="= Resultado operacional" value={er.resultado_operacional} bold highlight="blue" />

            <div className="pt-2">
              <Row label="(+) Otros ingresos" value={er.otros_ingresos} indent />
              <Row label="(-) Otros egresos" value={er.otros_egresos} indent />
            </div>

            <Row label="= Resultado antes de impuestos" value={er.resultado_antes_impuestos} bold highlight="green" />
          </div>

          {/* Gráfico histórico */}
          <div className="card p-5">
            <h3 className="text-sm font-semibold text-slate-800 mb-4">Evolución resultado operacional</h3>
            <p className="text-xs text-slate-400 mb-3">Últimos 6 meses</p>
            <ResponsiveContainer width="100%" height={220}>
              <LineChart data={mockEstadoResultadosHistorico}>
                <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
                <XAxis dataKey="mes" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
                <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                  tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} width={45} />
                <Tooltip formatter={(v) => formatCLP(Number(v))} />
                <Line type="monotone" dataKey="resultado" stroke="#2563eb" strokeWidth={2.5}
                  dot={{ fill: '#2563eb', r: 4 }} activeDot={{ r: 6 }} />
              </LineChart>
            </ResponsiveContainer>
          </div>
        </div>
      </div>
    </AppShell>
  );
}
