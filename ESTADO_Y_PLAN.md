# CuantiCFO — Estado y Plan de Trabajo
> Actualizado: 2026-05-08 — sesión pausada para instalar MongoDB MCP server

---

## 1. Estado actual

### ✅ Hecho (acumulado)

**Backend n8n (10/10 workflows desplegados y `active: true`):**

| ID | Nombre | Path real | Status |
|----|--------|-----------|--------|
| FuBWjEkWlhnEyhAH | WF-01 Crear Ingreso | `/webhook/cfo/create-income` | 🟡 fix aplicado, pendiente smoke test |
| 5QMoHUTv6glUIkY0 | WF-02 Crear Gasto | `/webhook/cfo/create-expense` | 🟡 fix aplicado, pendiente smoke test |
| 09HgImKWIwT3n375 | WF-03 Registrar Respaldo | `/webhook/cfo/register-document` | 🟡 fix aplicado, pendiente smoke test |
| e92rvl1FAKvVxxpa | WF-04 Generar Libro Compras | `/webhook/cfo/generate-purchase-book` | 🟡 fix aplicado, pendiente smoke test |
| UqUsOJTUyS7VMpfh | WF-05 Generar Libro Ventas | `/webhook/cfo/generate-sales-book` | 🟡 fix aplicado, pendiente smoke test |
| LmVKik7JXtS2wtb8 | WF-06 Preparar F29 | `/webhook/cfo/prepare-f29` | 🟡 fix aplicado, pendiente smoke test |
| 9LMlUa77LwgMxY5v | WF-07 Reporte Mensual CFO | (scheduled + email) | ⚠️ no validado |
| Rt0xdGNGHdCO6nSl | WF-08 Alertas Diarias | (scheduled 9am) | ⚠️ no validado |
| uOTzMhWIGzZhifFb | WF-09 Cierre Mensual | `/webhook/cfo/close-period` | 🟡 fix aplicado, pendiente smoke test |
| TAeiG6Y9JX4XvP2v | WF-10 Error Handler Global | (error workflow) | ⚠️ no validado |

**Fixes aplicados vía REST API en esta sesión:**

1. **Bug #1 — `JSON.stringify` en todas las queries MongoDB** (13 nodos, 8 workflows)
   - Patrón antiguo: `={{ { "campo": $json.campo } }}`
   - Patrón nuevo: `={{ JSON.stringify({ "campo": $json.campo }) }}`
   - Nodos corregidos: `Verificar Periodo Cerrado Ingreso` (WF-01), `Verificar Periodo Cerrado Gasto` (WF-02), `Consultar Gastos del Periodo` (WF-04, limit 0), `Consultar Ingresos del Periodo` (WF-05, limit 0), `Consultar Empresa` + `Consultar Ingresos F29` + `Consultar Gastos F29` (WF-06, limit 0), `Verificar Estado Periodo` + `Consultar Ingresos Snapshot` + `Consultar Gastos Snapshot` + `Consultar Impuesto Snapshot` (WF-09), + 5 nodos WF-07 detectados en el scan automático.

2. **Bug #2 — `crypto is not defined`** (Code nodes en task runner sandbox)
   - Helper UUID puro añadido a todos los nodos Code afectados:
     ```javascript
     const randomUUID=()=>'xxxxxxxx-xxxx-4xxx-yxxx-xxxxxxxxxxxx'.replace(/[xy]/g,c=>{const r=Math.random()*16|0,v=c==='x'?r:(r&0x3|0x8);return v.toString(16)});
     ```

3. **Bug #3 — MongoDB schema validation error 121** (identificado, fix preparado, PENDIENTE aplicar)
   - Causa: schema define `bsonType: "decimal"` para campos monetarios pero n8n envía BSON double (número JS).
   - Fix preparado en `apply_schema_updates.mongo.js`: cambia todos los campos monetarios a `["int", "long", "double", "decimal"]`.
   - **⚠️ ESTE SCRIPT AÚN NO SE HA APLICADO A LA BASE DE DATOS.**

4. **WF-02 `Preparar Alerta Respaldo`** — añadido campo `updated_at: now` (requería schema).
5. **WF-09 `Preparar Cierre Doc`** — añadido campo `created_at: now` (requería schema).

**Archivos de schema actualizados:**
- `cuanticfo_schema.mongo.js` — versión actualizada con tipos numéricos flexibles en todas las colecciones.
- `apply_schema_updates.mongo.js` — script `collMod` listo para correr con `mongosh`. Cubre: ingresos, gastos, libros_mensuales, impuestos_mensuales, cierres_mensuales, alertas, workflow_logs, empresas.

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

---

## 2. Hallazgos clave (histórico)

### 🔴 BUG #1 — MongoDB `JSON.parse("[object Object]")` — CORREGIDO

El nodo MongoDB v1.2 hace `JSON.parse(query)` internamente. Expresiones `={{ { ... } }}` producen un objeto JS → `.toString()` = `"[object Object]"` → `JSON.parse` falla → workflow cae al errorWorkflow → cliente recibe 200 vacío. Fix: `JSON.stringify()` en todos los queries.

### 🔴 BUG #2 — `crypto is not defined` — CORREGIDO

n8n task runner sandbox no expone `crypto` global. Fix: UUID v4 en puro JS (sin dependencias).

### 🔴 BUG #3 — MongoDB schema validation code 121 — FIX PREPARADO, PENDIENTE APLICAR

Schema exige `bsonType: "decimal"` para campos monetarios pero n8n enviá BSON double. Primer error observado: executionId 15742, nodo `Insertar Ingreso en BD`. El script `apply_schema_updates.mongo.js` relaja todos los tipos a `["int", "long", "double", "decimal"]`.

### 🟠 Discrepancias API_CONTRACTS.md vs workflows reales

| Endpoint | API_CONTRACTS dice | Workflow real |
|----------|---------------------|---------------|
| WF-03 | `/upload-document` con `tipo_uso`, `nombre_archivo`, `mime_type` | `/register-document` con `tabla`, `referencia_id`, `archivo_url` |
| WF-09 | `/close-month` con `notas_cierre` | `/close-period` con `cerrado_por` |

→ Usar paths/contratos reales del workflow al cablear rutas API, luego actualizar `API_CONTRACTS.md`.

### 🟡 Seed MongoDB NO realizado

- Empresa demo `_id: "11111111-1111-1111-1111-111111111111"` asumida pero NO confirmada en BD.
- Colecciones creadas con schema pero sin datos reales.

### 🟡 `.env.local` desactualizado

- Tiene líneas muertas de Supabase.
- Falta `MONGODB_URI` para rutas API que lean MongoDB directamente.

---

## 3. Plan detallado

### FASE 0 — Prerrequisitos (próxima sesión — MongoDB MCP disponible)

1. **Aplicar schema validators** — ejecutar `apply_schema_updates.mongo.js`:
   ```bash
   mongosh "MONGODB_URI/cuanticfo" apply_schema_updates.mongo.js
   ```
   O vía MongoDB MCP si está disponible.

2. **Seedear MongoDB:**
   - Insertar empresa demo:
     ```js
     {
       _id: "11111111-1111-1111-1111-111111111111",
       razon_social: "CuantiCode Labs SpA",
       rut: "77.222.333-4",
       tasa_ppm: 0.0125,
       activa: true,
       email_contador: "jzapata@cuanticode.com",
       created_at: new Date(),
       updated_at: new Date()
     }
     ```
   - Insertar categorías base en `categorias_contables` (infraestructura, marketing, sueldos, servicios_profesionales, software, otros).

3. **Smoke test end-to-end** de los 6 webhooks con payloads reales:
   - WF-01 (`/create-income`), WF-02 (`/create-expense`), WF-04, WF-05, WF-06 (`/prepare-f29`), WF-09 (`/close-period`)
   - Esperar `success` en la ejecución y JSON real en la respuesta (no body vacío).

### FASE 1 — Rutas API Next.js (estimado 2-3h)

Patrón: replicar `cuanticfo/src/app/api/finance/gastos/route.ts`.

| # | Ruta | Workflow | Path n8n | Notas |
|---|------|----------|----------|-------|
| 1 | `POST /api/finance/incomes` | WF-01 | `/create-income` | |
| 2 | `POST /api/finance/documents` | WF-03 | `/register-document` | Body: `{tabla, referencia_id, archivo_url}` |
| 3 | `POST /api/books/purchases` | WF-04 | `/generate-purchase-book` | Body: `{periodo}` |
| 4 | `POST /api/books/sales` | WF-05 | `/generate-sales-book` | Body: `{periodo}` |
| 5 | `POST /api/taxes/f29` | WF-06 | `/prepare-f29` | Body: `{periodo}` |
| 6 | `POST /api/closing/monthly` | WF-09 | `/close-period` | Body: `{periodo, cerrado_por}` |
| 7 | `GET /api/dashboard` | (lectura directa MongoDB) | — | Instalar `mongodb`, agregaciones |

### FASE 2 — Migrar `finance.service.ts` (estimado 1h)

Reemplazar las 12 funciones mock por fetch a rutas `/api/*`:
- `getDashboardKpis`, `getChartData`, etc. → `GET /api/dashboard`
- `getIngresos`, `getGastos`, `getMovimientos` → nuevos GET endpoints (lectura directa Mongo)
- `getAlertas` → `GET /api/alertas`
- `getImpuestoMensual` → `GET /api/taxes/f29?periodo=...`
- `getCierreMensual` → `GET /api/closing/monthly?periodo=...`

Mantener tipos. Conservar mock como fallback con `process.env.NEXT_PUBLIC_USE_MOCK`.

### FASE 3 — Limpieza y env (15 min)

- `.env.local`: eliminar refs a Supabase, agregar `MONGODB_URI`.
- Actualizar `API_CONTRACTS.md` con paths/contratos reales.

### FASE 4 — Diferido (no bloquea MVP)

- Auth + multi-empresa: NextAuth.js, eliminar `EMPRESA_ID` hardcoded.
- Object Storage: bucket R2/Cloudinary, conectar con WF-03.
- WF-07, WF-08, WF-10: validar con datos reales.

---

## 4. Acciones inmediatas al retomar

> Ejecutar en este orden exacto (MongoDB MCP ya debe estar configurado):

### Paso 1 — Aplicar schema validators

```bash
# Opción A: desde terminal
mongosh "mongodb+srv://..." apply_schema_updates.mongo.js

# Opción B: vía MongoDB MCP si está disponible
```

Verificar que el `print("Validadores actualizados correctamente.")` al final no lance errores.

### Paso 2 — Seed empresa demo + categorías

Insertar empresa `11111111-1111-1111-1111-111111111111` y 6 categorías en `categorias_contables`.

### Paso 3 — Smoke test WF-01 (crear ingreso)

```powershell
$headers = @{ "X-CFO-Secret" = "AKJfGwQRSJYOzZd68bPu-lkUbdumjkBFynxzskkjDx_wwlmX"; "Content-Type" = "application/json" }
$body = @{
  empresa_id = "11111111-1111-1111-1111-111111111111"
  periodo    = "2026-04"
  fecha_emision = "2026-04-15"
  cliente    = "Cliente Demo"
  tipo_documento = "factura_afecta"
  neto   = 100000
  iva    = 19000
  exento = 0
  total  = 119000
  estado_cobro = "pendiente"
} | ConvertTo-Json
Invoke-WebRequest -Uri "https://cuanticode.com/webhook/cfo/create-income" -Method POST -Headers $headers -Body $body
```

Esperar status 200 con `{ "ok": true, "ingreso_id": "..." }`.

### Paso 4 — Smoke test WF-06 (F29)

```powershell
$body = @{ empresa_id = "11111111-1111-1111-1111-111111111111"; periodo = "2026-04" } | ConvertTo-Json
Invoke-WebRequest -Uri "https://cuanticode.com/webhook/cfo/prepare-f29" -Method POST -Headers $headers -Body $body
```

Esperar JSON con `iva_debito`, `iva_credito`, `iva_a_pagar`.

### Paso 5 — Empezar Fase 1 (rutas API)

Comenzar por `POST /api/finance/incomes` (simétrico al ya existente `gastos/route.ts`).

---

## 5. Tasks

```
#1 [done]     Descubrir y diagnosticar bug JSON.parse en MongoDB nodes
#2 [done]     Aplicar JSON.stringify fix en los 10 workflows vía REST API
#3 [done]     Aplicar fix crypto.randomUUID en todos los Code nodes
#4 [done]     Preparar script apply_schema_updates.mongo.js
#5 [pending]  Aplicar schema validators a MongoDB (requiere MongoDB MCP o mongosh)
#6 [pending]  Seed empresa demo + categorías en MongoDB
#7 [pending]  Smoke test end-to-end WF-01, 02, 04, 05, 06, 09
#8 [pending]  Crear ruta POST /api/finance/incomes (WF-01)
#9 [pending]  Crear ruta POST /api/finance/documents (WF-03)
#10 [pending] Crear rutas POST /api/books/{purchases,sales} (WF-04, WF-05)
#11 [pending] Crear ruta POST /api/taxes/f29 (WF-06)
#12 [pending] Crear ruta POST /api/closing/monthly (WF-09)
#13 [pending] Crear ruta GET /api/dashboard (lectura directa MongoDB)
#14 [pending] Migrar finance.service.ts de mock a HTTP real
#15 [pending] Limpiar .env.local (eliminar Supabase, agregar MONGODB_URI)
```

---

## 6. Datos de referencia

**Auth n8n:**
- Header: `X-CFO-Secret`
- Valor: `AKJfGwQRSJYOzZd68bPu-lkUbdumjkBFynxzskkjDx_wwlmX`

**Empresa demo:**
- `_id`: `11111111-1111-1111-1111-111111111111`
- `razon_social`: CuantiCode Labs SpA
- `rut`: 77.222.333-4

**API Public Key n8n:**
```
eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJzdWIiOiIyYTEyN2MwMy00Yzg0LTRjZTMtOGEyNy0yY2U3MGFkODkxMmEiLCJpc3MiOiJuOG4iLCJhdWQiOiJwdWJsaWMtYXBpIiwianRpIjoiM2RkYTAxZTYtZGE2MS00ZmQ3LTk0MWQtZTU3N2FjYWI3MmM4IiwiaWF0IjoxNzc4MTA1MzcwfQ.9LWnBV-bxYHR85IOaqtPTtvKafSebvnGud65di_OaRg
```

**MongoDB:**
- Credencial n8n: `46gn4G4PPnyDFwSy` (MongoDB CUANTICFO)
- DB: `cuanticfo`
- URI: en n8n env `MONGODB_URI` (no replicado en `.env.local` aún)

**Próximo commit sugerido (después de smoke test exitoso):**
```
fix(n8n): corregir queries MongoDB y UUID en los 10 workflows

- JSON.stringify en 13 nodos MongoDB query (bug JSON.parse)  
- UUID v4 puro en todos los Code nodes (bug crypto sandbox)
- Relajar bsonType monetario a ["int","long","double","decimal"]
```
