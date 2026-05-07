# Graph Report - .  (2026-05-07)

## Corpus Check
- cluster-only mode — file stats not available

## Summary
- 189 nodes · 315 edges · 21 communities (15 shown, 6 thin omitted)
- Extraction: 98% EXTRACTED · 2% INFERRED · 0% AMBIGUOUS · INFERRED: 6 edges (avg confidence: 0.87)
- Token cost: 0 input · 0 output

## Graph Freshness
- Built from commit: `82fdec06`
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
- [[_COMMUNITY_Community 18|Community 18]]
- [[_COMMUNITY_Community 19|Community 19]]
- [[_COMMUNITY_Community 20|Community 20]]

## God Nodes (most connected - your core abstractions)
1. `Finance Service` - 45 edges
2. `delay()` - 19 edges
3. `cn()` - 11 edges
4. `formatCLP()` - 8 edges
5. `Movimiento` - 5 edges
6. `formatDate()` - 5 edges
7. `BottomNav()` - 4 edges
8. `QuickActionButton()` - 4 edges
9. `mockEmpresa` - 4 edges
10. `CierreMensual` - 4 edges

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

## Communities (21 total, 6 thin omitted)

### Community 0 - "Community 0"
Cohesion: 0.06
Nodes (32): [activeTab, setActiveTab], filtered, tabs, allDone, [cierre, setCierre], [empresa, setEmpresa], [saved, setSaved], alertasActivas (+24 more)

### Community 1 - "Community 1"
Cohesion: 0.11
Nodes (28): Crear ingreso (API), Finance Service, mockAlertas, mockCierre, mockImpuesto, Ingresos (Table), WF-01: Crear Ingreso, CreateGastoInput (+20 more)

### Community 2 - "Community 2"
Cohesion: 0.11
Nodes (20): AppShellProps, BottomNav(), [collapsed, setCollapsed], NavItem, NavSection, pathname, PERIODOS, [showPeriodos, setShowPeriodos] (+12 more)

### Community 3 - "Community 3"
Cohesion: 0.09
Nodes (23): mockGastos, mockIngresos, mockMovimientos, Alerta, CierreMensual, Empresa, EstadoAlerta, EstadoCobro (+15 more)

### Community 4 - "Community 4"
Cohesion: 0.21
Nodes (7): assertEnvVars(), N8nError, n8nFetch(), N8nRequestOptions, N8nResponse, CreateExpensePayload, CreateExpenseResponse

### Community 5 - "Community 5"
Cohesion: 0.18
Nodes (9): CustomTooltip(), DonutChartProps, ChartDataPoint, DonutDataPoint, ImpuestoMensual, FinancialChartCardProps, rows, TaxSummaryCardProps (+1 more)

### Community 6 - "Community 6"
Cohesion: 0.36
Nodes (6): estadoBadge, Movimiento, MovementListMobileProps, estadoLabel, MovementTableProps, formatDate()

### Community 7 - "Community 7"
Cohesion: 0.4
Nodes (3): { MongoClient }, run(), createCollectionIfNotExists()

### Community 8 - "Community 8"
Cohesion: 0.4
Nodes (4): code, fs, line1, startIdx

### Community 10 - "Community 10"
Cohesion: 0.67
Nodes (3): Crear gasto (API), Gastos (Table), WF-02: Crear Gasto

### Community 11 - "Community 11"
Cohesion: 0.67
Nodes (3): Preparar F29 (API), Impuestos Mensuales (Table), WF-06: Preparar F29

### Community 12 - "Community 12"
Cohesion: 0.67
Nodes (3): Ejecutar cierre mensual (API), Cierres Mensuales (Table), WF-09: Ejecutar Cierre Mensual

## Knowledge Gaps
- **74 isolated node(s):** `{ MongoClient }`, `fs`, `code`, `startIdx`, `line1` (+69 more)
  These have ≤1 connection - possible missing edges or undocumented components.
- **6 thin communities (<3 nodes) omitted from report** — run `graphify query` to explore isolated nodes.

## Suggested Questions
_Questions this graph is uniquely positioned to answer:_

- **Why does `Finance Service` connect `Community 1` to `Community 0`, `Community 2`, `Community 3`?**
  _High betweenness centrality (0.190) - this node is a cross-community bridge._
- **Why does `cn()` connect `Community 2` to `Community 0`, `Community 3`, `Community 6`?**
  _High betweenness centrality (0.014) - this node is a cross-community bridge._
- **What connects `{ MongoClient }`, `fs`, `code` to the rest of the system?**
  _74 weakly-connected nodes found - possible documentation gaps or missing edges._
- **Should `Community 0` be split into smaller, more focused modules?**
  _Cohesion score 0.06 - nodes in this community are weakly interconnected._
- **Should `Community 1` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 2` be split into smaller, more focused modules?**
  _Cohesion score 0.11 - nodes in this community are weakly interconnected._
- **Should `Community 3` be split into smaller, more focused modules?**
  _Cohesion score 0.09 - nodes in this community are weakly interconnected._