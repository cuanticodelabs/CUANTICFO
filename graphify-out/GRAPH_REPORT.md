# Graph Report - CUANTICFO  (2026-05-08)

## Corpus Check
- 89 files · ~236,207 words
- Verdict: corpus is large enough that graph structure adds value.

## Summary
- 681 nodes · 1014 edges · 54 communities (44 shown, 10 thin omitted)
- Extraction: 99% EXTRACTED · 1% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `179775dd`
- Run `git rev-parse HEAD` and compare to check if the graph is stale.
- Run `graphify update .` after code changes (no API cost).

## Community Hubs (Navigation)
- [[_COMMUNITY_Community 0|Community 0]]
- [[_COMMUNITY_Community 1|Community 1]]
- [[_COMMUNITY_Community 2|Community 2]]
- [[_COMMUNITY_Community 3|Community 3]]
- [[_COMMUNITY_Community 4|Community 4]]
- [[_COMMUNITY_Community 5|Community 5]]
- [[_COMMUNITY_Community 6|Community 6]]
- [[_COMMUNITY_Community 7|Community 7]]
- [[_COMMUNITY_Community 8|Community 8]]
- [[_COMMUNITY_Community 9|Community 9]]
- [[_COMMUNITY_Community 10|Community 10]]
- [[_COMMUNITY_Community 11|Community 11]]
- [[_COMMUNITY_Community 12|Community 12]]
- [[_COMMUNITY_Community 13|Community 13]]
- [[_COMMUNITY_Community 14|Community 14]]
- [[_COMMUNITY_Community 15|Community 15]]
- [[_COMMUNITY_Community 16|Community 16]]
- [[_COMMUNITY_Community 17|Community 17]]
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]
- [[_COMMUNITY_Community 21|Community 21]]
- [[_COMMUNITY_Community 22|Community 22]]
- [[_COMMUNITY_Community 23|Community 23]]
- [[_COMMUNITY_Community 24|Community 24]]
- [[_COMMUNITY_Community 25|Community 25]]
- [[_COMMUNITY_Community 26|Community 26]]
- [[_COMMUNITY_Community 27|Community 27]]
- [[_COMMUNITY_Community 28|Community 28]]
- [[_COMMUNITY_Community 29|Community 29]]
- [[_COMMUNITY_Community 30|Community 30]]
- [[_COMMUNITY_Community 31|Community 31]]
- [[_COMMUNITY_Community 32|Community 32]]
- [[_COMMUNITY_Community 33|Community 33]]
- [[_COMMUNITY_Community 34|Community 34]]
- [[_COMMUNITY_Community 35|Community 35]]
- [[_COMMUNITY_Community 36|Community 36]]
- [[_COMMUNITY_Community 37|Community 37]]
- [[_COMMUNITY_Community 38|Community 38]]
- [[_COMMUNITY_Community 39|Community 39]]
- [[_COMMUNITY_Community 40|Community 40]]
- [[_COMMUNITY_Community 41|Community 41]]
- [[_COMMUNITY_Community 42|Community 42]]
- [[_COMMUNITY_Community 43|Community 43]]
- [[_COMMUNITY_Community 44|Community 44]]
- [[_COMMUNITY_Community 45|Community 45]]
- [[_COMMUNITY_Community 46|Community 46]]
- [[_COMMUNITY_Community 47|Community 47]]
- [[_COMMUNITY_Community 48|Community 48]]
- [[_COMMUNITY_Community 51|Community 51]]
- [[_COMMUNITY_Community 52|Community 52]]
- [[_COMMUNITY_Community 53|Community 53]]

## God Nodes (most connected - your core abstractions)
1. `Finance Service` - 45 edges
2. `formatCLP()` - 22 edges
3. `delay()` - 20 edges
4. `cn()` - 18 edges
5. `CuantiCFO — Workflows n8n` - 13 edges
6. `Auditoría de Consistencia — CuantiCFO` - 10 edges
7. `formatDate()` - 9 edges
8. `Endpoints disponibles` - 9 edges
9. `Product` - 9 edges
10. `5. Components` - 9 edges

## Surprising Connections (you probably didn't know these)
- `Finance Service` --references--> `Crear ingreso (API)`  [INFERRED]
  cuanticfo/services/finance.service.ts → API_CONTRACTS.md
- `run()` --calls--> `createCollectionIfNotExists()`  [INFERRED]
  cuanticfo/apply_mongo.js → cuanticfo_schema.mongo.js
- `WF-01: Crear Ingreso` --implements--> `Ingresos (Table)`  [INFERRED]
  N8N_WORKFLOWS.md → Modelo_datos.txt
- `WF-02: Crear Gasto` --implements--> `Gastos (Table)`  [INFERRED]
  N8N_WORKFLOWS.md → Modelo_datos.txt
- `WF-06: Preparar F29` --implements--> `Impuestos Mensuales (Table)`  [INFERRED]
  N8N_WORKFLOWS.md → Modelo_datos.txt

## Communities (54 total, 10 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.07
Nodes (62): allDone, checklistKeys, [cierre, setCierre], handleToggle(), [saved, setSaved], alertasActivas, quickActions, topAlertas (+54 more)

### Community 1 - "Community 1"
Cohesion: 0.06
Nodes (32): [activeId, setActiveId], [busy, setBusy], [messages, setMessages], scrollRef, [threads], ChatComposerProps, handleKeyDown(), handleSubmit() (+24 more)

### Community 2 - "Community 2"
Cohesion: 0.06
Nodes (32): 1. Crear ingreso, 2. Crear gasto, 3. Subir documento, 4. Generar libro de compras, 5. Generar libro de ventas, 6. Preparar F29, 7. Ejecutar cierre mensual, 8. Obtener dashboard (lectura directa Supabase) (+24 more)

### Community 3 - "Community 3"
Cohesion: 0.06
Nodes (30): 1. Resumen Ejecutivo, 2. Riesgos Detectados, 3.1 Entidades en diseño/planificación que NO existen en BD, 3.2 Inconsistencia de nombres y tipos de campos, 3.3 Módulos en el diseño sin ruta Next.js planificada, 3.4 Flujos n8n sin contrato definido, 3.5 Widgets del dashboard sin fuente de datos definida, 3. Inconsistencias Encontradas (+22 more)

### Community 4 - "Community 4"
Cohesion: 0.08
Nodes (26): banded, CashForecastProps, ForecastPoint, ForecastTooltipProps, lowestIdx, allYs, barW, bot (+18 more)

### Community 5 - "Community 5"
Cohesion: 0.08
Nodes (26): CustomTooltip(), DonutChartProps, Alerta, ChartDataPoint, CuentaBancaria, DonutDataPoint, EstadoAlerta, EstadoCobro (+18 more)

### Community 6 - "Community 6"
Cohesion: 0.08
Nodes (21): ChartDataTableProps, HBarItem, HBarListProps, max, sorted, total, b, bucketStyle (+13 more)

### Community 7 - "Community 7"
Cohesion: 0.1
Nodes (22): banded, ProjectionChartProps, ProjectionPoint, ProjectionTooltipProps, baseAssumptions, baseProjection(), mockScenarios, months (+14 more)

### Community 8 - "Community 8"
Cohesion: 0.07
Nodes (27): 1. Overview, 2. Color System, 3. Typography, 4. Elevation + Shadow, 5. Components, 6. Motion, Amount display, Badge (+19 more)

### Community 9 - "Community 9"
Cohesion: 0.08
Nodes (24): Alertas (`estado`), Arquitectura de la integración, Autenticación, code:block1 (Browser/App), code:block2 (Header: X-CFO-Secret: <WEBHOOK_SECRET>), code:env (N8N_BASE_URL=https://n8n.cuanticode.com), code:env (SUPABASE_URL=https://<proyecto>.supabase.co), code:json ({) (+16 more)

### Community 10 - "Community 10"
Cohesion: 0.1
Nodes (14): [active, setActive], [autoCierre, setAutoCierre], [empresa, setEmpresa], initials, [notificaciones, setNotificaciones], SectionId, sections, Empresa (+6 more)

### Community 11 - "Community 11"
Cohesion: 0.11
Nodes (13): [activeGroup, setActiveGroup], [activeTab, setActiveTab], filtered, GroupId, groups, TabId, tabs, sources (+5 more)

### Community 12 - "Community 12"
Cohesion: 0.13
Nodes (14): SparklineProps, counts, Filter, [filter, setFilter], filtered, filterLabels, grouped, kpiInsight (+6 more)

### Community 13 - "Community 13"
Cohesion: 0.11
Nodes (17): Cómo conectar con n8n / Supabase, ¿Cómo correr el proyecto?, code:bash (cd e:/Proyectos/CUANTICFO/cuanticfo), code:block2 (src/), code:env (NEXT_PUBLIC_N8N_BASE_URL=https://n8n.cuanticode.com), code:block4 (Browser → Next.js Route Handler → n8n Webhook → Supabase), code:env (# Supabase (cuando esté listo)), CuantiCFO — Frontend Notes (+9 more)

### Community 14 - "Community 14"
Cohesion: 0.15
Nodes (12): code:json ({ "ok": false, "error": "CODIGO_ERROR", "message": "Descripc), code:json ({ "ok": true, "data": {}, "message": "Operación exitosa", "a), code:block27 (Ingresos ─────────────────────────────────┐), Convenciones generales, CuantiCFO — Workflows n8n, Diagrama de dependencias entre workflows, Input, Pasos del workflow (+4 more)

### Community 15 - "Community 15"
Cohesion: 0.21
Nodes (10): estadoBadge, Movimiento, AlertCard(), estadoBadge, estadoLabel, MovementListMobileProps, estadoBadge, estadoLabel (+2 more)

### Community 16 - "Community 16"
Cohesion: 0.26
Nodes (7): AmountCell(), AmountCellProps, Direction, KpiCompactProps, KpiHeroProps, formatCLP(), formatPct()

### Community 17 - "Community 17"
Cohesion: 0.21
Nodes (7): assertEnvVars(), N8nError, n8nFetch(), N8nRequestOptions, N8nResponse, CreateExpensePayload, CreateExpenseResponse

### Community 18 - "Community 18"
Cohesion: 0.18
Nodes (8): KpiData, colorMap, iconMap, KpiCardProps, sparklineColor, colorMap, QuickActionButton(), QuickActionButtonProps

### Community 19 - "Community 19"
Cohesion: 0.18
Nodes (11): code:block6 (POST https://n8n.cuanticode.com/webhook/cfo/create-expense), code:json ({), code:json ({), Errores posibles, Input esperado, Lógica de negocio, Output esperado, Tablas afectadas (+3 more)

### Community 20 - "Community 20"
Cohesion: 0.18
Nodes (11): code:block22 (POST https://n8n.cuanticode.com/webhook/cfo/close-month), code:json ({), code:json ({), Errores posibles, Input esperado, Output esperado, Pasos del workflow, Tablas afectadas (+3 more)

### Community 21 - "Community 21"
Cohesion: 0.18
Nodes (11): code:block3 (POST https://n8n.cuanticode.com/webhook/cfo/create-income), code:json ({), code:json ({), Errores posibles, Input esperado, Lógica de negocio, Output esperado, Tablas afectadas (+3 more)

### Community 22 - "Community 22"
Cohesion: 0.2
Nodes (10): code:block12 (POST https://n8n.cuanticode.com/webhook/cfo/generate-purchas), code:json ({), code:json ({), Errores posibles, Input esperado, Output esperado, Pasos del workflow, Tablas afectadas (+2 more)

### Community 23 - "Community 23"
Cohesion: 0.2
Nodes (10): code:block17 (POST https://n8n.cuanticode.com/webhook/cfo/prepare-f29), code:json ({), code:json ({), Errores posibles, Input esperado, Output esperado, Pasos del workflow, Tablas afectadas (+2 more)

### Community 24 - "Community 24"
Cohesion: 0.2
Nodes (10): code:json ({), code:json ({), code:block9 (POST https://n8n.cuanticode.com/webhook/cfo/upload-document), Errores posibles, Input esperado, Output esperado, Pasos del workflow, Tablas afectadas (+2 more)

### Community 25 - "Community 25"
Cohesion: 0.2
Nodes (8): Accessibility & Inclusion, Anti-references, Brand Personality, Design Principles, Product, Product Purpose, Register, Users

### Community 26 - "Community 26"
Cohesion: 0.22
Nodes (8): cobrados, estadoBadge, estadoLabel, filtered, pendientes, [search, setSearch], total, vencidos

### Community 27 - "Community 27"
Cohesion: 0.25
Nodes (7): [activeTab, setActiveTab], filtered, [search, setSearch], Tab, tabs, totalGastos, totalIngresos

### Community 28 - "Community 28"
Cohesion: 0.29
Nodes (7): BottomNav(), [collapsed, setCollapsed], NavItem, NavSection, navSections, pathname, cn()

### Community 29 - "Community 29"
Cohesion: 0.25
Nodes (7): conCF, estadoLabel, filtered, pagados, pendientes, [search, setSearch], total

### Community 30 - "Community 30"
Cohesion: 0.25
Nodes (8): code:json ({), code:json ({), Input esperado, Output esperado, Pasos del workflow, Tablas afectadas, Trigger, WF-05: Generar Libro de Ventas

### Community 31 - "Community 31"
Cohesion: 0.25
Nodes (8): code:json ({), code:json ({), Input (para webhook manual), Output esperado, Pasos del workflow, Tablas afectadas, Trigger, WF-07: Reporte Mensual CFO

### Community 32 - "Community 32"
Cohesion: 0.29
Nodes (5): initials, PERIODOS, [showPeriodos, setShowPeriodos], TopBarProps, formatPeriodo()

### Community 33 - "Community 33"
Cohesion: 0.33
Nodes (6): code:json ({), code:json ({ "ok": false, "error": "WORKFLOW_ERROR", "message": "Error ), Pasos del workflow, Tablas afectadas, Trigger, WF-10: Error Handler Global

### Community 34 - "Community 34"
Cohesion: 0.4
Nodes (3): { MongoClient }, run(), createCollectionIfNotExists()

### Community 35 - "Community 35"
Cohesion: 0.4
Nodes (4): code, fs, line1, startIdx

### Community 36 - "Community 36"
Cohesion: 0.4
Nodes (4): ChecklistItem, checklistItems, ClosePeriodChecklistProps, pct

### Community 37 - "Community 37"
Cohesion: 0.4
Nodes (4): code:bash (npm run dev), Deploy on Vercel, Getting Started, Learn More

### Community 39 - "Community 39"
Cohesion: 0.67
Nodes (3): Preparar F29 (API), Impuestos Mensuales (Table), WF-06: Preparar F29

### Community 40 - "Community 40"
Cohesion: 0.67
Nodes (3): Crear gasto (API), Gastos (Table), WF-02: Crear Gasto

### Community 41 - "Community 41"
Cohesion: 0.67
Nodes (3): Ejecutar cierre mensual (API), Cierres Mensuales (Table), WF-09: Ejecutar Cierre Mensual

### Community 42 - "Community 42"
Cohesion: 0.67
Nodes (3): Crear ingreso (API), Ingresos (Table), WF-01: Crear Ingreso

## Knowledge Gaps
- **357 isolated node(s):** `{ MongoClient }`, `fs`, `code`, `startIdx`, `line1` (+352 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **10 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `formatCLP()` connect `Community 16` to `Community 0`, `Community 4`, `Community 5`, `Community 6`, `Community 7`, `Community 15`, `Community 18`, `Community 26`, `Community 29`?**
  _High betweenness centrality (0.031) - this node is a cross-community bridge._
- **Why does `Finance Service` connect `Community 0` to `Community 42`?**
  _High betweenness centrality (0.023) - this node is a cross-community bridge._
- **Why does `CuantiCFO — Workflows n8n` connect `Community 14` to `Community 33`, `Community 19`, `Community 20`, `Community 21`, `Community 22`, `Community 23`, `Community 24`, `Community 30`, `Community 31`?**
  _High betweenness centrality (0.018) - this node is a cross-community bridge._
- **What connects `{ MongoClient }`, `fs`, `code` to the rest of the system?**
  _357 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.07 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._