# CuantiCFO — Estado y Plan de Trabajo
> Fecha: 2026-05-08
> Sesión pausada — retomar desde "Acciones inmediatas"

---

## 1. Estado actual

### ✅ Hecho

**Backend n8n (10/10 workflows desplegados y `active: true`):**

| ID | Nombre | Path real | Status |
|----|--------|-----------|--------|
| FuBWjEkWlhnEyhAH | WF-01 Crear Ingreso | `/webhook/cfo/create-income` | 🔴 bug MongoDB |
| 5QMoHUTv6glUIkY0 | WF-02 Crear Gasto | `/webhook/cfo/create-expense` | 🔴 bug MongoDB |
| 09HgImKWIwT3n375 | WF-03 Registrar Respaldo | `/webhook/cfo/register-document` | 🔴 bug MongoDB |
| e92rvl1FAKvVxxpa | WF-04 Generar Libro Compras | `/webhook/cfo/generate-purchase-book` | 🔴 bug MongoDB |
| UqUsOJTUyS7VMpfh | WF-05 Generar Libro Ventas | `/webhook/cfo/generate-sales-book` | 🔴 bug MongoDB |
| LmVKik7JXtS2wtb8 | WF-06 Preparar F29 | `/webhook/cfo/prepare-f29` | 🔴 bug MongoDB |
| 9LMlUa77LwgMxY5v | WF-07 Reporte Mensual CFO | (scheduled + email) | ⚠️ no validado |
| Rt0xdGNGHdCO6nSl | WF-08 Alertas Diarias | (scheduled 9am) | ⚠️ no validado |
| uOTzMhWIGzZhifFb | WF-09 Cierre Mensual | `/webhook/cfo/close-period` | 🔴 bug MongoDB |
| TAeiG6Y9JX4XvP2v | WF-10 Error Handler Global | (error workflow) | ⚠️ no validado |

**Credenciales n8n configuradas:**
- `46gn4G4PPnyDFwSy` — MongoDB CUANTICFO ✅
- `FivGdaHlKXURwCo0` — Header Auth CUANTICFO ✅
- Gmail account ✅
- Google Drive account ✅

**Frontend Next.js (17 páginas con UI completa, todas en mock):**
- Dashboard, Ingresos, Gastos, Movimientos, Cierres, Impuestos+F29, Libros, Documentos, Alertas
- Reportes×5 (flujo-caja, estado-resultados, proyecciones, kpis, presupuesto)
- AI-CFO, Configuración

**Infra cliente Next.js:**
- `cuanticfo/src/lib/api/n8n-client.ts` — `n8nFetch` helper con auth + errores + timeouts ✅
- `cuanticfo/src/services/finance.service.ts` — 13 funciones (12 mock + 1 real: `createGasto`) ✅
- `cuanticfo/src/app/api/finance/gastos/route.ts` — única ruta API conectada ✅

**Documentación:**
- `API_CONTRACTS.md` (8 endpoints)
- `N8N_WORKFLOWS.md`
- `cuanticfo_schema.mongo.js` (14 colecciones)
- `AUDITORIA_CONSISTENCIA.md`

---

## 2. Hallazgos clave de esta sesión

### 🔴 BUG CRÍTICO: queries MongoDB rotos en TODOS los workflows

**Síntoma:** los webhooks responden HTTP 200 pero con body vacío (`Content-Length: 0`).

**Causa raíz (confirmada por execución MCP de WF-01, executionId 15170):**
El nodo MongoDB v1.2 hace `JSON.parse(query)` internamente. Los queries están escritos así:

```
={{ { "empresa_id": $json.empresa_id, "periodo": $json.periodo, "cerrado": true } }}
```

Esto evalúa a un **objeto JS**, no a un string JSON. Al hacer `.toString()` produce `"[object Object]"` → `JSON.parse` falla → workflow se cae al `errorWorkflow` (TAeiG6Y9JX4XvP2v) → el nodo `Respond to Webhook` jamás se ejecuta → cliente recibe 200 con body vacío.

**Stack trace del error:**
```
SyntaxError: "[object Object]" is not valid JSON
  at JSON.parse (<anonymous>)
  at MongoDb.node.ts:185:35
```

**Fix:** wrap todos los queries con `JSON.stringify()`. Patrón correcto:
```
={{ JSON.stringify({ "empresa_id": $json.empresa_id, "periodo": $json.periodo }) }}
```

**Workflows afectados** (todos los que tienen nodo MongoDB con `query`):
- WF-01: nodo `Verificar Periodo Cerrado Ingreso`
- WF-02: nodo `Verificar Periodo Cerrado Gasto`
- WF-04: nodo `Consultar Gastos del Periodo`
- WF-05: nodo `Consultar Ingresos del Periodo`
- WF-06: nodos `Consultar Empresa`, `Consultar Ingresos F29`, `Consultar Gastos F29`
- WF-09: nodos `Verificar Estado Periodo`, `Consultar Ingresos Snapshot`, `Consultar Gastos Snapshot`, `Consultar Impuesto Snapshot`
- WF-08: probablemente también (no validado)
- WF-03 no usa `query` find (solo update por `_id`), debería estar OK pero hay que verificar.

### 🟠 Discrepancias en API_CONTRACTS.md vs workflows reales

| Endpoint | API_CONTRACTS dice | Workflow real |
|----------|---------------------|---------------|
| WF-03 | `/upload-document` con `tipo_uso`, `nombre_archivo`, `mime_type` | `/register-document` con `tabla` (`ingresos`/`gastos`), `referencia_id`, `archivo_url` |
| WF-09 | `/close-month` con `notas_cierre` | `/close-period` con `cerrado_por` |
| WF-09 | Valida `CHECKLIST_INCOMPLETO` y `ALERTAS_CRITICAS_PENDIENTES` | Solo verifica si periodo ya está cerrado (`PERIODO_YA_CERRADO`) |

→ Cuando se cableen las rutas API, **usar los paths/contratos reales del workflow**, no los de la documentación.
→ Después actualizar `API_CONTRACTS.md` para reflejar realidad.

### 🟡 Seed MongoDB no verificado

- Empresa demo `_id: "11111111-1111-1111-1111-111111111111"` se asume en `gastos/route.ts` pero NO se confirmó que existe en MongoDB.
- WF-06 (Preparar F29) consulta esta empresa — si no existe, falla incluso después de arreglar los queries.
- Tampoco se verificó si las colecciones del schema están aplicadas (`cuanticfo_schema.mongo.js`).

### 🟡 `.env.local` desactualizado

```env
# Supabase (cuando esté listo)         ← muerto, eliminar
# NEXT_PUBLIC_SUPABASE_URL=
# NEXT_PUBLIC_SUPABASE_ANON_KEY=
# SUPABASE_SERVICE_ROLE_KEY=
```

Falta `MONGODB_URI` para la ruta `/api/dashboard` que lee MongoDB directo.

---

## 3. Plan detallado (orden propuesto)

### FASE 0 — Prerrequisitos (estimado 1-1.5h)

1. **Arreglar queries MongoDB en los 10 workflows.**
   Usar `mcp__n8n-mcp__update_workflow` (o el editor n8n) para wrappear cada query en `JSON.stringify()`.
   Validar uno por uno con `mcp__n8n-mcp__execute_workflow` + `get_execution`.

2. **Verificar/seedear MongoDB.**
   - Confirmar que las 14 colecciones de `cuanticfo_schema.mongo.js` están aplicadas.
   - Insertar empresa demo:
     ```js
     {
       _id: "11111111-1111-1111-1111-111111111111",
       razon_social: "CuantiCode Labs SpA",
       rut: "77.222.333-4",
       tasa_ppm: NumberDecimal("0.0125"),
       activa: true,
       email_contador: "jzapata@cuanticode.com",
       created_at: new Date(),
       updated_at: new Date()
     }
     ```
   - Insertar 5-6 categorías base en `categorias_contables` (infraestructura, marketing, sueldos, servicios profesionales, software, otros).

3. **Smoke test end-to-end** con curl/PowerShell o ejecución directa vía MCP:
   - WF-06 → debe responder JSON con `iva_debito`, `iva_credito`, etc.
   - WF-04, WF-05 → libros vacíos pero respuesta 200 con totales en cero.
   - WF-01, WF-02 → crear ingreso/gasto de prueba y verificar inserción.

### FASE 1 — Rutas API Next.js (estimado 2-3h)

Replicar el patrón de `cuanticfo/src/app/api/finance/gastos/route.ts` en cada nuevo endpoint. Inyectar `EMPRESA_ID` server-side (TODO: cambiar por sesión cuando haya auth).

| # | Ruta | Workflow | Path n8n | Notas |
|---|------|----------|----------|-------|
| 1 | `POST /api/finance/incomes` | WF-01 | `/create-income` | Validar neto+iva+exento==total |
| 2 | `POST /api/finance/documents` | WF-03 | `/register-document` | Body: `{tabla, referencia_id, archivo_url}` |
| 3 | `POST /api/books/purchases` | WF-04 | `/generate-purchase-book` | Body: `{periodo}` |
| 4 | `POST /api/books/sales` | WF-05 | `/generate-sales-book` | Body: `{periodo}` |
| 5 | `POST /api/taxes/f29` | WF-06 | `/prepare-f29` | Body: `{periodo}` |
| 6 | `POST /api/closing/monthly` | WF-09 | `/close-period` | Body: `{periodo, cerrado_por}` |
| 7 | `GET /api/dashboard` | (lectura directa MongoDB) | — | Instalar `mongodb`, agregaciones |

### FASE 2 — Migrar `finance.service.ts` (estimado 1h)

Reemplazar las 12 funciones mock por fetch a las rutas `/api/*`:
- `getEmpresa`, `getUsuario` → `GET /api/empresa` (nuevo endpoint, lectura directa Mongo)
- `getDashboardKpis`, `getChartData`, `getDistribucionGastos`, `getCuentasBancarias`, `getCuentasPorCobrar`, `getCuentasPorPagar`, `getUltimosMovimientos` → derivados de `GET /api/dashboard`
- `getMovimientos`, `getIngresos`, `getGastos` → nuevos endpoints `GET /api/finance/incomes`, `GET /api/finance/expenses` (lectura directa Mongo)
- `getAlertas` → `GET /api/alertas` (lectura directa)
- `getImpuestoMensual`, `getCierreMensual` → `GET /api/taxes/f29?periodo=...` y `GET /api/closing/monthly?periodo=...`
- `getEstadoResultados`, `getEstadoResultadosHistorico`, `getFlujoCaja` → derivados o nuevos endpoints

Mantener tipos. Conservar las funciones mock como fallback opcional con `process.env.NEXT_PUBLIC_USE_MOCK`.

### FASE 3 — Limpieza y env (estimado 15 min)

- `.env.local`: eliminar refs a Supabase, agregar `MONGODB_URI`.
- Actualizar `API_CONTRACTS.md` con paths/contratos reales.
- Actualizar `Contratos_integracion.txt` también.

### FASE 4 — Frentes diferidos (no bloquean MVP funcional)

- **Auth + multi-empresa**: NextAuth.js, eliminar `EMPRESA_ID` hardcoded, selector real de empresa.
- **Object Storage**: bucket R2/Cloudinary, endpoint de upload, conectar con WF-03.
- **WF-07, WF-08, WF-10**: validar que ejecuten correctamente cuando hay datos reales.

---

## 4. Acciones inmediatas al retomar

> Ejecutar en este orden exacto:

### Paso 1 — Arreglar workflows (~30 min)

1. Abrir cada workflow en n8n.cuanticode.com (o usar `mcp__n8n-mcp__update_workflow`).
2. Para cada nodo MongoDB con campo `query`, reemplazar:
   ```
   ={{ { "campo": $json.campo } }}
   ```
   por:
   ```
   ={{ JSON.stringify({ "campo": $json.campo }) }}
   ```
3. Lista exacta de nodos a editar (workflow → nodo):
   - WF-01 (FuBWjEkWlhnEyhAH) → `Verificar Periodo Cerrado Ingreso`
   - WF-02 (5QMoHUTv6glUIkY0) → `Verificar Periodo Cerrado Gasto`
   - WF-04 (e92rvl1FAKvVxxpa) → `Consultar Gastos del Periodo`
   - WF-05 (UqUsOJTUyS7VMpfh) → `Consultar Ingresos del Periodo`
   - WF-06 (LmVKik7JXtS2wtb8) → `Consultar Empresa`, `Consultar Ingresos F29`, `Consultar Gastos F29`
   - WF-09 (uOTzMhWIGzZhifFb) → `Verificar Estado Periodo`, `Consultar Ingresos Snapshot`, `Consultar Gastos Snapshot`, `Consultar Impuesto Snapshot`
   - WF-08 (Rt0xdGNGHdCO6nSl) → revisar y arreglar.
   - WF-03 (09HgImKWIwT3n375) → no tiene `query find` (solo updates por _id), validar que funcione.

### Paso 2 — Validar fix con execución MCP

```
mcp__n8n-mcp__execute_workflow workflowId=LmVKik7JXtS2wtb8 inputs=...
mcp__n8n-mcp__get_execution executionId=<nuevo>
```

Esperar status `success` y body con datos reales.

### Paso 3 — Seed MongoDB

Conectarse a MongoDB Atlas / self-hosted con `mongosh` o crear script Node:
```bash
node cuanticfo/scripts/seed-empresa-demo.js
```
(El script todavía no existe — crear en sesión nueva.)

### Paso 4 — Smoke test end-to-end completo

Probar los 6 webhooks con payloads reales (PowerShell `Invoke-WebRequest`).

### Paso 5 — Empezar Fase 1 (rutas API)

Comenzar por `POST /api/finance/incomes` que es el más simétrico al ya existente de gastos.

---

## 5. Mapeo de tasks (sesión actual)

```
#1 [in_progress] Smoke test de los 10 workflows n8n
   → DESCUBRIMIENTO: bug sistémico MongoDB JSON.parse
   → Pendiente: validar fix después de arreglar workflows

#2 [pending] Verificar seed MongoDB (empresa demo + categorías)
#3 [pending] Crear ruta /api/finance/incomes (WF-01)
#4 [pending] Crear ruta /api/finance/documents (WF-03)
#5 [pending] Crear rutas /api/books/purchases y /api/books/sales (WF-04, WF-05)
#6 [pending] Crear ruta /api/taxes/f29 (WF-06)
#7 [pending] Crear ruta /api/closing/monthly (WF-09)
#8 [pending] Crear ruta GET /api/dashboard (lectura directa MongoDB)
#9 [pending] Migrar finance.service.ts de mock a HTTP real
#10 [pending] Limpiar .env.local (eliminar Supabase, agregar MONGODB_URI)
```

**Task nueva a crear al retomar:**
```
#11 Arreglar bug JSON.parse en queries MongoDB de los 10 workflows
   (debe completarse antes de #2 y de cualquier ruta API)
```

---

## 6. Datos de referencia para retomar

**Auth n8n:**
- Header: `X-CFO-Secret`
- Valor: `AKJfGwQRSJYOzZd68bPu-lkUbdumjkBFynxzskkjDx_wwlmX`

**Empresa demo (asumida, NO confirmada):**
- `_id`: `11111111-1111-1111-1111-111111111111`

**API Public Key n8n** (para listar workflows/credenciales):
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYTEyN2MwMy00Yzg0LTRjZTMtOGEyNy0yY2U3MGFkODkxMmEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiM2RkYTAxZTYtZGE2MS00ZmQ3LTk0MWQtZTU3N2FjYWI3MmM4IiwiaWF0IjoxNzc4MTA1MzcwfQ.9LWnBV-bxYHR85IOaqtPTtvKafSebvnGud65di_OaRg
```

**MongoDB:**
- Credencial n8n: `46gn4G4PPnyDFwSy` (MongoDB CUANTICFO)
- Connection string: en n8n env `MONGODB_URI` (no replicado en `.env.local` aún)
- DB: `cuanticfo`

**Próximo commit sugerido (cuando termine FASE 1):**
```
feat(api): conectar 7 rutas API Next.js a workflows n8n

- POST /api/finance/incomes → WF-01
- POST /api/finance/documents → WF-03 (path: register-document)
- POST /api/books/{purchases,sales} → WF-04, WF-05
- POST /api/taxes/f29 → WF-06
- POST /api/closing/monthly → WF-09 (path: close-period)
- GET  /api/dashboard → lectura directa MongoDB

Closes ESTADO_Y_PLAN.md FASE 1.
```
