'use client';

import AppShell from '@/components/layout/AppShell';
import { mockFlujoCaja } from '@/lib/mock-data/reportes';
import { formatCLP } from '@/lib/utils/format';
import {
  ResponsiveContainer, AreaChart, Area, XAxis, YAxis,
  CartesianGrid, Tooltip,
} from 'recharts';
import { TrendingUp, TrendingDown, Banknote } from 'lucide-react';

export default function FlujoCajaPage() {
  const fc = mockFlujoCaja;
  return (
    <AppShell title="Flujo de caja" subtitle="Proyección de liquidez próximos 30 días">
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">

        {/* KPIs */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3">
          {[
            { label: 'Caja actual', value: fc.caja_actual, icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50' },
            { label: 'Ingresos esperados (30d)', value: fc.ingresos_esperados_30d, icon: TrendingUp, color: 'text-green-600', bg: 'bg-green-50' },
            { label: 'Gastos esperados (30d)', value: fc.gastos_esperados_30d, icon: TrendingDown, color: 'text-red-600', bg: 'bg-red-50' },
            { label: 'Flujo proyectado', value: fc.flujo_proyectado_30d, icon: Banknote, color: 'text-blue-600', bg: 'bg-blue-50' },
          ].map((k) => (
            <div key={k.label} className="card p-4">
              <div className={`w-8 h-8 rounded-lg ${k.bg} flex items-center justify-center mb-2`}>
                <k.icon size={16} className={k.color} />
              </div>
              <p className="text-xs text-slate-500">{k.label}</p>
              <p className={`text-xl font-bold mt-1 ${k.color}`}>{formatCLP(k.value)}</p>
            </div>
          ))}
        </div>

        {/* Proyección */}
        <div className="card p-5">
          <h3 className="text-sm font-semibold text-slate-800 mb-4">Proyección próximos 30 días</h3>
          <ResponsiveContainer width="100%" height={220}>
            <AreaChart data={fc.proyeccion}>
              <defs>
                <linearGradient id="saldoGrad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="5%" stopColor="#2563eb" stopOpacity={0.15} />
                  <stop offset="95%" stopColor="#2563eb" stopOpacity={0} />
                </linearGradient>
              </defs>
              <CartesianGrid strokeDasharray="3 3" stroke="#f1f5f9" />
              <XAxis dataKey="fecha" tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false} />
              <YAxis tick={{ fontSize: 11, fill: '#94a3b8' }} axisLine={false} tickLine={false}
                tickFormatter={(v) => `$${(v / 1_000_000).toFixed(0)}M`} width={48} />
              <Tooltip formatter={(v) => formatCLP(Number(v))} />
              <Area type="monotone" dataKey="saldo" stroke="#2563eb" strokeWidth={2.5}
                fill="url(#saldoGrad)" dot={{ fill: '#2563eb', r: 4 }} />
            </AreaChart>
          </ResponsiveContainer>
        </div>

        {/* CxC / CxP */}
        <div className="grid grid-cols-2 gap-4">
          <div className="card p-5">
            <p className="text-xs text-slate-500 mb-1">Cuentas por cobrar</p>
            <p className="text-2xl font-bold text-slate-900">{formatCLP(fc.cuentas_por_cobrar)}</p>
          </div>
          <div className="card p-5">
            <p className="text-xs text-slate-500 mb-1">Cuentas por pagar</p>
            <p className="text-2xl font-bold text-red-600">{formatCLP(fc.cuentas_por_pagar)}</p>
          </div>
        </div>

      </div>
    </AppShell>
  );
}
