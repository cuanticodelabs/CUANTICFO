# AUDITORIA_CONSISTENCIA.md
# Auditoría de Consistencia — CuantiCFO
> **Fecha original:** 25 de abril de 2026  
> **Auditor:** Antigravity (AI Architect)  
> **Archivos revisados:** Contexto_proyecto.txt · Planificacion_front.txt · Planificacion_back.txt · Modelo_datos.txt · Contratos_integracion.txt · bd_esquema.sql · Diseño_Front_pc.png · Diseño_Front_movil.png · Diseño_Front_preliminar.png
>
> **ACTUALIZACIÓN v1.1 — 2026-05-08:**
> Base de datos migrada de Supabase/PostgreSQL a **MongoDB** (schema en `cuanticfo_schema.mongo.js`).
> Los ítems críticos de BD marcados como pendientes en esta auditoría han sido **resueltos** en el schema MongoDB:
> - ✅ Tabla `proyectos` → colección `proyectos` creada
> - ✅ Tabla `honorarios` → colección `honorarios` creada
> - ✅ Campos `honorarios_revisados`, `f29_preparado` en `cierres_mensuales` → incluidos
> - ✅ Campo `remanente_credito` en `impuestos_mensuales` → incluido
> - ✅ Constraint `YYYY-MM` en `periodo` → regex pattern en schema MongoDB
> - ✅ `updated_at` en todas las colecciones → incluido
> - ✅ `empresa_id` en `workflow_logs` → incluido
> - ⚠️ RLS → no aplica en MongoDB; aislamiento por filtrado `empresa_id` en cada query
> - ✅ Colección `transferencias_bancarias` → creada (resuelve módulo de transferencias)
>
> Leer esta auditoría en contexto histórico; el schema de referencia actual es `cuanticfo_schema.mongo.js`.

---

## 1. Resumen Ejecutivo

CuantiCFO tiene una **visión clara y bien articulada**: ser un asistente CFO-first para PYMEs chilenas. La arquitectura (Next.js + n8n + MongoDB) es adecuada para el MVP.

**Lo que está bien:**
- El schema MongoDB es más robusto que el modelo conceptual original (validadores JSON Schema, índices, pattern constraints).
- Los diseños PC y móvil son coherentes entre sí y con los módulos planificados.
- La decisión de NO automatizar la declaración F29 es correcta y está documentada.
- La tabla `workflow_logs` existe y es un buen punto de partida para trazabilidad.
- `empresa_id` presente en todas las tablas operacionales (base para multitenancy).

**Lo que requiere corrección antes de continuar:**
1. **Entidades planificadas que no existen en BD:** proyectos, honorarios, transferencias, cuentas bancarias, centros de costo.
2. **Contratos de integración casi vacíos** — solo existe 1 de los 10 flujos documentados.
3. **Mismatch de tipos:** `categoria` (texto libre) en el payload JSON vs `categoria_id` (UUID FK) en BD.
4. **Campos del checklist visual** (`honorarios_revisados`, `f29_preparado`) no existen en `cierres_mensuales`.
5. **Sin RLS** (Row Level Security) definido en Supabase — riesgo de data leak entre empresas.

---

## 2. Riesgos Detectados

| # | Riesgo | Severidad | Impacto |
|---|--------|-----------|---------|
| R1 | Tabla `proyectos` no existe; `proyecto_id` es FK rota en `ingresos` y `gastos` | 🔴 Alto | Error en producción |
| R2 | Tabla `honorarios` no definida; libro de honorarios y retenciones F29 sin datos | 🔴 Alto | Módulo no funciona |
| R3 | Solo 1 de 10 contratos de integración definidos | 🔴 Alto | Desarrollo frontend bloqueado |
| R4 | `categoria` (texto) en payload JSON vs `categoria_id` (UUID) en SQL | 🟠 Medio | Error de inserción |
| R5 | Sin tabla `cuentas_bancarias`; widget del diseño sin datos | 🟠 Medio | Widget roto |
| R6 | Sin campo `centro_costo_id`; aparece en formulario móvil de gastos | 🟠 Medio | Campo ignorado silenciosamente |
| R7 | Sin `updated_at` en tablas operacionales | 🟠 Medio | Auditoría y sync difíciles |
| R8 | Sin RLS definido en Supabase | 🟠 Medio | Data leak entre empresas |
| R9 | Campo `periodo` como texto sin formato forzado | 🟡 Bajo-Medio | Queries y agrupaciones rotas |
| R10 | `empresa_id` ausente en `workflow_logs` | 🟡 Bajo | Logs no filtrables por empresa |
| R11 | `usuarios` tiene FK directa a `empresas` — no soporta 1 usuario en múltiples empresas | 🟡 Bajo | Limitación multiempresa futura |

---

## 3. Inconsistencias Encontradas

### 3.1 Entidades en diseño/planificación que NO existen en BD

| Entidad | Dónde se menciona | Estado |
|---------|-------------------|--------|
| `proyectos` | Modelo_datos (FK), Planificacion_front, Diseño_pc | ❌ Tabla no existe |
| `honorarios` | Planificacion_front (libro honorarios), Planificacion_back (Flujo 5) | ❌ Tabla no existe |
| `transferencias` | Diseño_pc (menú lateral), Diseño_movil (tab) | ❌ Tabla no existe |
| `cuentas_bancarias` | Diseño_pc (widget con saldos por banco) | ❌ Tabla no existe |
| `centros_costo` | Diseño_movil (campo en formulario gasto) | ❌ Tabla no existe |
| `resumen_financiero_mensual` | Planificacion_back Flujo 7 | ❌ No existe |

### 3.2 Inconsistencia de nombres y tipos de campos

| Campo en contrato/planificación | Campo en SQL | Problema |
|---------------------------------|--------------|---------|
| `categoria` (string libre) en JSON | `categoria_id` (UUID FK) en `gastos` | ❌ Tipo incompatible |
| `honorarios_revisados` en checklist UI | No existe en `cierres_mensuales` | ❌ Campo faltante |
| `f29_preparado` en checklist UI | No existe en `cierres_mensuales` | ❌ Campo faltante |
| "Remanentes" en módulo F29 UI | No existe en `impuestos_mensuales` | ❌ Campo faltante |
| `proyecto_id` en `ingresos` y `gastos` | FK sin tabla destino `proyectos` | ❌ FK rota |
| `estado_cobro` | Consistente en todos lados | ✅ OK |
| `fecha_documento` en gastos | Consistente en todos lados | ✅ OK |
| `usa_credito_fiscal` | Consistente en todos lados | ✅ OK |

### 3.3 Módulos en el diseño sin ruta Next.js planificada

| Módulo visible en diseño | Ruta planificada | Estado |
|--------------------------|-----------------|--------|
| Transferencias | No definida | ❌ Falta |
| Cuentas contables | No definida | ❌ Falta |
| Documentos | No definida | ❌ Falta |
| Reportes personalizados | Parcial `/reportes` | ⚠️ Incompleto |
| Impuestos mensuales (histórico) | `/impuestos/resumen-mensual` | ⚠️ Nombre confuso |

### 3.4 Flujos n8n sin contrato definido

De los 10 flujos documentados en Planificacion_back, solo Flujo 2 (crear gasto) tiene contrato. Faltan:
Flujo 1 (crear ingreso), Flujo 3 (subida documento), Flujo 4 (libro compras), Flujo 5 (libro ventas), Flujo 6 (F29), Flujo 7 (reporte mensual), Flujo 8 (alertas), Flujo 9 (cierre mensual), Flujo 10 (error handler).

### 3.5 Widgets del dashboard sin fuente de datos definida

| Widget | Fuente necesaria | Estado |
|--------|-----------------|--------|
| Evolución ingresos vs gastos (6 meses) | Agregación por mes en `ingresos` y `gastos` | ⚠️ No documentado |
| Distribución de gastos por categoría | JOIN `gastos` → `categorias_contables` | ⚠️ No documentado |
| Cuentas por cobrar vencidas/por vencer | Lógica de vencimiento sobre `fecha_pago` + `estado_cobro` | ⚠️ No documentado |
| Proyección flujo de caja 30/60/90 días | Modelo de proyección — no definido | ❌ Sin modelo |
| Resultado vs presupuesto | Tabla `presupuestos` — no existe | ❌ Sin tabla |

---

## 4. Recomendaciones de Corrección

### 4.1 Agregar al bd_esquema.sql

```sql
-- NUEVA TABLA: proyectos
create table if not exists public.proyectos (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  nombre text not null,
  descripcion text,
  estado text default 'activo' check (estado in ('activo', 'cerrado', 'pausado')),
  created_at timestamptz not null default now()
);
create index if not exists idx_proyectos_empresa_id on public.proyectos(empresa_id);

-- NUEVA TABLA: honorarios
create table if not exists public.honorarios (
  id uuid primary key default gen_random_uuid(),
  empresa_id uuid not null references public.empresas(id) on delete cascade,
  fecha_emision date not null,
  prestador text not null,
  rut_prestador text not null,
  folio text,
  monto_bruto numeric default 0,
  retencion numeric default 0,
  monto_neto numeric default 0,
  estado_pago text default 'pendiente',
  proyecto_id uuid references public.proyectos(id) on delete set null,
  archivo_url text,
  created_at timestamptz not null default now(),
  updated_at timestamptz
);
create index if not exists idx_honorarios_empresa_fecha on public.honorarios(empresa_id, fecha_emision desc);

-- CAMPOS FALTANTES en cierres_mensuales
alter table public.cierres_mensuales
  add column if not exists honorarios_revisados boolean not null default false,
  add column if not exists f29_preparado boolean not null default false;

-- CAMPO FALTANTE en impuestos_mensuales
alter table public.impuestos_mensuales
  add column if not exists remanente_iva numeric default 0;

-- updated_at para auditoría
alter table public.gastos add column if not exists updated_at timestamptz;
alter table public.ingresos add column if not exists updated_at timestamptz;

-- empresa_id en workflow_logs
alter table public.workflow_logs
  add column if not exists empresa_id uuid references public.empresas(id) on delete set null;

-- Constraint de formato YYYY-MM en periodo
alter table public.impuestos_mensuales
  add constraint chk_impuestos_periodo check (periodo ~ '^\d{4}-\d{2}$');
alter table public.cierres_mensuales
  add constraint chk_cierres_periodo check (periodo ~ '^\d{4}-\d{2}$');
alter table public.alertas
  add constraint chk_alertas_periodo check (periodo is null or periodo ~ '^\d{4}-\d{2}$');
```

### 4.2 Corregir el contrato de gastos

**Antes (incorrecto):**
```json
{ "categoria": "infraestructura_cloud" }
```

**Después (correcto):**
```json
{ "categoria_id": "uuid-de-la-categoria" }
```

El frontend debe cargar el listado de categorías desde BD y enviar el UUID. El workflow n8n no debe necesitar resolver nombres.

### 4.3 RLS para multitenancy seguro

```sql
-- Habilitar RLS en todas las tablas operacionales
alter table public.ingresos enable row level security;
alter table public.gastos enable row level security;
alter table public.honorarios enable row level security;
alter table public.proyectos enable row level security;
alter table public.impuestos_mensuales enable row level security;
alter table public.cierres_mensuales enable row level security;
alter table public.alertas enable row level security;

-- Política base (replicar en cada tabla)
create policy "aislar_por_empresa" on public.ingresos
  for all using (
    empresa_id = (select empresa_id from public.usuarios where id = auth.uid())
  );
```

### 4.4 Estrategia mock → datos reales

Crear dos implementaciones de la misma interfaz TypeScript en el frontend:

```typescript
// services/finance/types.ts (interfaz compartida)
export interface FinanceService {
  createExpense(data: CreateExpenseDTO): Promise<ExpenseResponse>;
  getDashboardKPIs(period: string): Promise<DashboardKPIs>;
  // ...
}

// services/finance/mock.ts  → usa datos estáticos
// services/finance/api.ts   → llama a /api/finance/* (Next.js routes → n8n)

// lib/services.ts
export const financeService: FinanceService =
  process.env.NEXT_PUBLIC_USE_MOCK === 'true' ? mockService : apiService;
```

---

## 5. Cambios Críticos Antes de Continuar

> [!CAUTION]
> Estos cambios deben hacerse ANTES de escribir código de frontend o workflows n8n.

| Prioridad | Cambio | Archivo |
|-----------|--------|---------|
| 🔴 P1 | Crear tabla `proyectos` | bd_esquema.sql |
| 🔴 P1 | Crear tabla `honorarios` | bd_esquema.sql |
| 🔴 P1 | Agregar `honorarios_revisados` y `f29_preparado` a `cierres_mensuales` | bd_esquema.sql |
| 🔴 P1 | Constraint `YYYY-MM` en campo `periodo` | bd_esquema.sql |
| 🔴 P1 | Completar contratos para los 9 flujos n8n restantes | Contratos_integracion.txt |
| 🔴 P1 | Corregir `categoria` → `categoria_id` en contrato de gastos | Contratos_integracion.txt |
| 🟠 P2 | `updated_at` en `ingresos` y `gastos` | bd_esquema.sql |
| 🟠 P2 | `empresa_id` en `workflow_logs` | bd_esquema.sql |
| 🟠 P2 | RLS policies en todas las tablas con `empresa_id` | bd_esquema.sql |
| 🟠 P2 | `remanente_iva` en `impuestos_mensuales` | bd_esquema.sql |
| 🟠 P2 | Rutas Next.js para Transferencias, Documentos, Cuentas contables | Planificacion_front.txt |

---

## 6. Cambios Opcionales para Fases Futuras

| Cambio | Justificación | Fase |
|--------|---------------|------|
| Tabla `cuentas_bancarias` | Widget en diseño PC — no crítico para MVP | Fase 2 |
| Tabla `centros_costo` | Aparece como opcional en diseño móvil | Fase 2 |
| Tabla `empresa_usuarios` (multiempresa real) | MVP con 1 empresa no lo necesita | Fase 2 |
| Tabla `presupuestos` | Estado de resultados muestra "vs presupuesto" | Fase 2 |
| OCR/IA para clasificación de documentos | Flujo 3 lo menciona — alta complejidad | Fase 3 |
| Alertas por WhatsApp/Slack | Flujo 8 lo menciona | Fase 3 |
| Escenarios flujo de caja (conservador/optimista) | Planificacion_front | Fase 3 |

---

## 7. Checklist MVP

### Base de datos
- [ ] Tabla `proyectos` creada
- [ ] Tabla `honorarios` creada
- [ ] `cierres_mensuales` con `honorarios_revisados` y `f29_preparado`
- [ ] `impuestos_mensuales` con `remanente_iva`
- [ ] Constraint formato `YYYY-MM` en `periodo`
- [ ] `updated_at` en `ingresos` y `gastos`
- [ ] RLS habilitado en todas las tablas con `empresa_id`
- [ ] Índices existentes ✅

### Contratos de integración
- [ ] Crear ingreso (POST)
- [ ] Crear gasto (POST) — con `categoria_id` correcto
- [ ] Subir documento (POST multipart)
- [ ] Generar libro compras/ventas (POST → URL)
- [ ] Preparar F29 (POST → resumen)
- [ ] Ejecutar cierre mensual (POST)
- [ ] Obtener KPIs dashboard (GET)
- [ ] Listar alertas (GET)

### Frontend
- [ ] Layout desktop con sidebar ✅ (diseñado)
- [ ] Layout móvil con bottom nav 5 tabs ✅ (diseñado)
- [ ] Mock services con interfaz TypeScript
- [ ] Selector de empresa funcional
- [ ] Dashboard con 5 KPI cards + gráficos
- [ ] Módulo ingresos (CRUD básico)
- [ ] Módulo gastos (CRUD + selector categoría desde BD)
- [ ] Módulo F29 como "vista predeclaración" — sin envío automático
- [ ] Cierre mensual como checklist guiado
- [ ] Centro de alertas con severidades

### Backend / n8n
- [ ] Flujo 1: Crear ingreso
- [ ] Flujo 2: Crear gasto (con `categoria_id`)
- [ ] Flujo 6: Preparador F29
- [ ] Flujo 9: Cierre mensual
- [ ] Flujo 10: Error handler global

### Seguridad
- [ ] Autenticación con Supabase Auth
- [ ] Webhooks n8n protegidos (Header Auth)
- [ ] Next.js valida sesión antes de llamar a n8n
- [ ] RLS activo en Supabase

---

## 8. Evaluación de los 12 Puntos Auditados

| # | Dimensión | Estado | Notas |
|---|-----------|--------|-------|
| 1 | Pantallas ↔ Modelo de datos | 🟠 Parcial | Proyectos, honorarios, transferencias sin tabla |
| 2 | Contratos JSON ↔ SQL | 🔴 Crítico | Solo 1/10 contratos; mismatch `categoria` |
| 3 | Nombres de campos consistentes | 🟠 Parcial | `periodo` sin formato forzado; `honorarios_revisados` faltante |
| 4 | Sin conceptos duplicados | 🟡 Menor | "Resultado operacional" vs "resultado estimado" — estandarizar |
| 5 | Flujos n8n con inputs/outputs claros | 🔴 Crítico | 9/10 flujos sin contrato formal |
| 6 | Mock → datos reales | ✅ Bien | Arquitectura Next.js routes permite cambio limpio |
| 7 | Multiempresa | 🟠 Parcial | `empresa_id` presente, pero sin RLS ni membresías múltiples |
| 8 | Fuentes de datos para reportes | 🟠 Parcial | Dashboard OK; proyección flujo de caja sin modelo |
| 9 | F29 asistido, no automático | ✅ Bien | Documentado y reflejado en diseño |
| 10 | Trazabilidad y logs | 🟠 Parcial | `workflow_logs` existe; falta `updated_at` y `empresa_id` |
| 11 | MVP sin sobreingeniería | ✅ Bien | OCR/IA y escenarios correctamente diferidos |
| 12 | Mobile-first usable | ✅ Bien | Diseño coherente; tablas densas en libros requieren adaptación |

---

## 9. Orden Recomendado de Próximos Pasos

```
FASE 0 — Correcciones de diseño (1-2 días)
  [1] Actualizar bd_esquema.sql con tablas y campos faltantes
  [2] Estandarizar campo periodo como YYYY-MM con constraints
  [3] Completar Contratos_integracion.txt con los 9 flujos restantes
  [4] Definir políticas RLS en SQL

FASE 1 — Infraestructura base (3-5 días)
  [5] Crear proyecto Next.js con estructura de rutas
  [6] Configurar Supabase (ejecutar bd_esquema.sql actualizado)
  [7] Configurar autenticación (Supabase Auth)
  [8] Instalar n8n (self-hosted o cloud)
  [9] Configurar variables de entorno (.env.local)

FASE 2 — Mock services y UI base (5-7 días)
  [10] Crear interfaz TypeScript + mock services
  [11] Implementar layout desktop (sidebar) y móvil (bottom nav)
  [12] Dashboard con datos mock
  [13] Módulo Ingresos (CRUD)
  [14] Módulo Gastos (CRUD + selector categoría)

FASE 3 — Workflows n8n core (5-7 días)
  [15] Flujo 1: Crear ingreso
  [16] Flujo 2: Crear gasto (con categoria_id)
  [17] Flujo 6: Preparador F29
  [18] Flujo 9: Cierre mensual
  [19] Flujo 10: Error handler global

FASE 4 — Integración real y validación (3-5 días)
  [20] Conectar frontend con webhooks n8n reales
  [21] Activar RLS y probar aislamiento entre empresas
  [22] Módulo F29 completo (predeclaración)
  [23] Centro de alertas conectado
  [24] Prueba end-to-end de cierre mensual

FASE 5 — Reportes y exportaciones (3-5 días)
  [25] Estado de resultados con datos reales
  [26] Libro de compras y ventas (con exportación)
  [27] Flujo 7: Reporte mensual por correo
  [28] Libro de honorarios
```

---

*Auditoría generada el 25/04/2026. Revisar con el equipo técnico antes de ejecutar cambios en BD de producción.*
