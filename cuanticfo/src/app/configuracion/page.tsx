'use client';

import { useState } from 'react';
import AppShell from '@/components/layout/AppShell';
import { mockEmpresa } from '@/lib/mock-data/dashboard';
import { Building2, Save } from 'lucide-react';
import type { Empresa } from '@/lib/types';

export default function ConfiguracionPage() {
  const [empresa, setEmpresa] = useState<Empresa>({ ...mockEmpresa });
  const [saved, setSaved] = useState(false);

  const handleSave = () => {
    setSaved(true);
    setTimeout(() => setSaved(false), 2000);
  };

  return (
    <AppShell title="Configuración" subtitle="Datos de empresa y configuración tributaria">
      <div className="p-4 md:p-6 space-y-6 animate-fade-in">
        <div className="max-w-2xl">

          {/* Empresa */}
          <div className="card p-6 space-y-5">
            <div className="flex items-center gap-3 mb-2">
              <div className="w-10 h-10 bg-blue-100 rounded-xl flex items-center justify-center">
                <Building2 size={20} className="text-blue-600" />
              </div>
              <div>
                <h3 className="text-sm font-semibold text-slate-800">Datos de la empresa</h3>
                <p className="text-xs text-slate-500">Información tributaria y de contacto</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {[
                { label: 'Razón social', key: 'razon_social', type: 'text' },
                { label: 'RUT empresa', key: 'rut', type: 'text' },
                { label: 'Giro comercial', key: 'giro', type: 'text' },
                { label: 'Correo contador', key: 'correo_contador', type: 'email' },
                { label: 'Banco principal', key: 'banco_principal', type: 'text' },
                { label: 'Inicio actividades', key: 'fecha_inicio_actividades', type: 'date' },
              ].map((field) => (
                <div key={field.key}>
                  <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                    {field.label}
                  </label>
                  <input
                    type={field.type}
                    value={empresa[field.key as keyof typeof empresa] as string || ''}
                    onChange={(e) => setEmpresa({ ...empresa, [field.key]: e.target.value })}
                    className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 transition"
                  />
                </div>
              ))}
            </div>

            {/* Régimen */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Régimen tributario
              </label>
              <select
                value={empresa.regimen_tributario}
                onChange={(e) => setEmpresa({ ...empresa, regimen_tributario: e.target.value as 'general' | 'pyme' | 'simplificado' })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30"
              >
                <option value="general">Renta efectiva (general)</option>
                <option value="pyme">PYME transparente</option>
                <option value="simplificado">Renta presunta</option>
              </select>
            </div>

            {/* Tasa PPM */}
            <div>
              <label className="block text-xs font-semibold text-slate-600 mb-1.5">
                Tasa PPM (%)
              </label>
              <input
                type="number"
                step="0.1"
                value={empresa.tasa_ppm}
                onChange={(e) => setEmpresa({ ...empresa, tasa_ppm: parseFloat(e.target.value) })}
                className="w-full px-3 py-2 text-sm border border-slate-200 rounded-xl bg-white focus:outline-none focus:ring-2 focus:ring-blue-500/30 max-w-xs"
              />
            </div>

            {/* Save */}
            <button
              onClick={handleSave}
              className={`flex items-center gap-2 px-5 py-2.5 rounded-xl text-sm font-semibold transition-all ${
                saved
                  ? 'bg-green-600 text-white'
                  : 'bg-blue-600 text-white hover:bg-blue-700'
              }`}
            >
              <Save size={16} />
              {saved ? '¡Guardado!' : 'Guardar cambios'}
            </button>
          </div>

        </div>
      </div>
    </AppShell>
  );
}
