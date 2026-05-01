# CuantiCFO — Frontend Notes

## ¿Cómo correr el proyecto?

```bash
cd e:/Proyectos/CUANTICFO/cuanticfo
npm run dev
```

Abre en → **http://localhost:3000** (redirige automáticamente a `/dashboard`)

**Node requerido:** v22.17.0 (ver `.nvmrc` en raíz del repo)

---

## Stack tecnológico

| Capa | Tecnología | Versión |
|------|-----------|---------|
| Framework | Next.js (App Router) | 16.2.4 |
| UI | React | 19.2.4 |
| Estilos | Tailwind CSS | v4 |
| Lenguaje | TypeScript | 5.x |
| Gráficos | Recharts | 3.8.x |
| Sparklines | react-sparklines | latest |
| Íconos | lucide-react | 1.11.x |
| Utilidades | clsx + tailwind-merge | latest |

---

## Estructura de carpetas

```
src/
├── app/                        # Rutas (Next.js App Router)
│   ├── dashboard/page.tsx      ✅ Dashboard principal completo
│   ├── movimientos/page.tsx    ✅ Tabla + filtros + search
│   ├── ingresos/page.tsx       ✅ Tabla de facturas emitidas
│   ├── gastos/page.tsx         ✅ Tabla de facturas recibidas
│   ├── libros/page.tsx         ✅ Libro compras/ventas/honorarios
│   ├── impuestos/f29/page.tsx  ✅ Preparador F29
│   ├── reportes/
│   │   ├── estado-resultados/  ✅ Estado de resultados + gráfico
│   │   └── flujo-caja/         ✅ Proyección flujo + área chart
│   ├── alertas/page.tsx        ✅ Centro de alertas con severidades
│   ├── cierres/page.tsx        ✅ Checklist cierre mensual interactivo
│   ├── configuracion/page.tsx  ✅ Datos empresa + régimen tributario
│   └── documentos/page.tsx     🔶 Placeholder — pendiente Supabase Storage
│
├── components/
│   ├── layout/
│   │   ├── AppShell.tsx        ✅ Wrapper principal (sidebar + topbar + nav)
│   │   ├── Sidebar.tsx         ✅ Sidebar desktop colapsable (azul oscuro)
│   │   ├── TopBar.tsx          ✅ Header con MonthSelector + avatar
│   │   └── BottomNav.tsx       ✅ Navegación inferior mobile (5 items)
│   ├── ui/
│   │   ├── KpiCard.tsx         ✅ Card KPI con sparkline y tendencia
│   │   ├── FinancialChartCard  ✅ Gráfico líneas ingresos vs gastos
│   │   ├── TaxSummaryCard      ✅ Resumen IVA/PPM/F29
│   │   ├── AlertCard           ✅ Alerta con severidad (alta/media/baja)
│   │   ├── MovementTable       ✅ Tabla desktop responsive
│   │   ├── MovementListMobile  ✅ Lista optimizada mobile
│   │   ├── QuickActionButton   ✅ Botón acción rápida con ícono
│   │   └── ClosePeriodChecklist ✅ Checklist con progreso circular
│   └── charts/
│       └── DonutChart.tsx      ✅ Gráfico donut distribución gastos
│
├── lib/
│   ├── mock-data/
│   │   ├── dashboard.ts        ✅ KPIs, gráficos, cuentas, movimientos
│   │   ├── movimientos.ts      ✅ Ingresos, gastos, movimientos unificados
│   │   ├── alertas.ts          ✅ Alertas + impuesto F29 + cierre mensual
│   │   └── reportes.ts         ✅ Estado resultados + flujo de caja
│   ├── types/index.ts          ✅ Tipos alineados con Modelo_datos.txt
│   └── utils/format.ts         ✅ formatCLP, formatDate, formatPct, cn()
│
└── services/
    └── finance.service.ts      ✅ Capa de servicios lista para API real
```

---

## Paleta de colores

| Token | Hex | Uso |
|-------|-----|-----|
| Sidebar | `#0f1729` | Fondo sidebar desktop |
| Accent | `#2563eb` | Botones, links, activo |
| Income | `#16a34a` | Ingresos, positivos |
| Expense | `#dc2626` | Gastos, negativos |
| Alert High | `#dc2626` | Alertas críticas |
| Alert Medium | `#ea580c` | Alertas intermedias |
| App BG | `#f1f5f9` | Fondo general |
| Card | `#ffffff` | Cards y paneles |

---

## Cómo conectar con n8n / Supabase

Todo el data fetching está en `src/services/finance.service.ts`.
Actualmente retorna mock data con un `delay()` simulado.

Para conectar con APIs reales:
1. Crear `src/services/api.client.ts` con `fetch()` hacia n8n webhooks
2. En `finance.service.ts`, reemplazar `return mockXXX` por `return await apiClient.get(...)`
3. Agregar variables de entorno en `.env.local`:

```env
NEXT_PUBLIC_N8N_BASE_URL=https://n8n.cuanticode.com
NEXT_PUBLIC_SUPABASE_URL=https://xxxx.supabase.co
NEXT_PUBLIC_SUPABASE_ANON_KEY=eyJ...
```

El patrón recomendado (ver `Contratos_integracion.txt`):
```
Browser → Next.js Route Handler → n8n Webhook → Supabase
```

---

## Lo que falta / próximos pasos

### Prioridad Alta
- [ ] **Autenticación** — Login con Supabase Auth o NextAuth
- [ ] **Formulario Nuevo Ingreso** — Modal o página `/ingresos/nuevo`
- [ ] **Formulario Nuevo Gasto** — Modal o página `/gastos/nuevo`
- [ ] **Supabase Storage** — Subida real de documentos PDF/XML

### Prioridad Media
- [ ] **Cuentas contables** — Página `/cuentas` (categorías PCGA)
- [ ] **Impuestos mensuales** — Página `/impuestos` con historial F29
- [ ] **Reportes personalizados** — Filtros por proyecto/cliente
- [ ] **Modo oscuro** — Opcional pero valioso para uso nocturno

### Prioridad Baja
- [ ] **Conciliación bancaria** — Importar estado de cuenta banco
- [ ] **Multi-empresa** — Selector de empresa en sidebar
- [ ] **Exportación PDF/Excel** — Libros contables y estado de resultados
- [ ] **Notificaciones push** — Integración con n8n → alertas en tiempo real

---

## Variables de entorno requeridas

Crear `cuanticfo/.env.local` (no versionar):
```env
# Supabase (cuando esté listo)
NEXT_PUBLIC_SUPABASE_URL=
NEXT_PUBLIC_SUPABASE_ANON_KEY=
SUPABASE_SERVICE_ROLE_KEY=

# n8n (cuando esté listo)
N8N_BASE_URL=
N8N_WEBHOOK_SECRET=

# App
NEXT_PUBLIC_APP_URL=http://localhost:3000
```

---

## Referencias

- Diseño base: `../Diseño_Front_pc.png` y `../Diseño_Front_movil.png`
- Planificación: `../Planificacion_front.txt`
- Modelo de datos: `../Modelo_datos.txt`
- Contratos API: `../Contratos_integracion.txt`
