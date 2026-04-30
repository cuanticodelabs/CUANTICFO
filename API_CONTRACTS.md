# CuantiCFO — Contratos de API
> Versión 1.0 · 2026-04-25  
> Contratos JSON entre Next.js y los webhooks n8n

---

## Arquitectura de la integración

```
Browser/App
    │ fetch()
    ▼
Next.js Server Action / API Route (/api/finance/*)
    │ POST + Header: X-CFO-Secret
    ▼
n8n Webhook (https://n8n.cuanticode.com/webhook/cfo/*)
    │ Postgres node
    ▼
Supabase/PostgreSQL
```

**Regla de oro**: El cliente (browser) NUNCA llama directamente a n8n. Todo pasa por Next.js server-side.

---

## Autenticación

Todos los webhooks n8n requieren:
```
Header: X-CFO-Secret: <WEBHOOK_SECRET>
Content-Type: application/json
```

La variable `WEBHOOK_SECRET` se almacena en:
- **n8n**: Variable de entorno `N8N_WEBHOOK_SECRET`.
- **Next.js**: Variable de entorno server-only `N8N_WEBHOOK_SECRET` (nunca `NEXT_PUBLIC_`).

---

## Formato de respuesta estándar

### Éxito
```json
{
  "ok": true,
  "data": { },
  "message": "Descripción del resultado",
  "alertas": []
}
```

### Error
```json
{
  "ok": false,
  "error": "CODIGO_ERROR_EN_MAYUSCULAS",
  "message": "Descripción legible para el usuario",
  "details": { }
}
```

---

## Endpoints disponibles

### 1. Crear ingreso
```
POST /api/finance/incomes
→ n8n: POST /webhook/cfo/create-income
```

**Request:**
```json
{
  "empresa_id": "550e8400-e29b-41d4-a716-446655440000",
  "fecha_emision": "2026-04-20",
  "fecha_pago": "2026-04-25",
  "cliente": "Empresa ABC SpA",
  "rut_cliente": "76.123.456-7",
  "folio": "F-001234",
  "tipo_documento": "factura_afecta",
  "neto": 1000000,
  "iva": 190000,
  "exento": 0,
  "total": 1190000,
  "categoria_id": null,
  "estado_cobro": "pendiente",
  "proyecto_id": null,
  "archivo_url": null
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "ingreso_id": "7f3d9b2a-...",
    "periodo": "2026-04",
    "total": 1190000
  },
  "message": "Ingreso registrado correctamente.",
  "alertas": [
    {
      "tipo": "categoria_faltante",
      "severidad": "baja",
      "descripcion": "El ingreso no tiene categoría contable asignada."
    }
  ]
}
```

**Errores:**
| HTTP | Código | Cuándo |
|------|--------|--------|
| 400 | `VALIDACION_FALLIDA` | Campo obligatorio faltante o inválido |
| 409 | `DOCUMENTO_DUPLICADO` | Folio+RUT+tipo ya existe |
| 403 | `PERIODO_CERRADO` | El periodo ya fue cerrado |
| 404 | `EMPRESA_NO_ENCONTRADA` | empresa_id inválido |
| 422 | `MONTO_INCONSISTENTE` | neto+iva+exento ≠ total |

---

### 2. Crear gasto
```
POST /api/finance/expenses
→ n8n: POST /webhook/cfo/create-expense
```

**Request:**
```json
{
  "empresa_id": "550e8400-e29b-41d4-a716-446655440000",
  "fecha_documento": "2026-04-20",
  "fecha_pago": "2026-04-25",
  "proveedor": "Google Cloud Chile",
  "rut_proveedor": "00.000.000-0",
  "folio": "INV-001",
  "tipo_documento": "factura_extranjera",
  "categoria_id": "a1b2c3d4-...",
  "neto": 100000,
  "iva": 0,
  "exento": 0,
  "total": 100000,
  "usa_credito_fiscal": false,
  "estado_pago": "pagado",
  "proyecto_id": null,
  "archivo_url": "https://storage.supabase.co/.../factura.pdf"
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "gasto_id": "9c1e7f4b-...",
    "periodo": "2026-04",
    "tiene_respaldo": true
  },
  "message": "Gasto registrado correctamente.",
  "alertas": []
}
```

---

### 3. Subir documento
```
POST /api/finance/documents
→ n8n: POST /webhook/cfo/upload-document
```

> Flujo recomendado: Next.js primero sube el archivo a Supabase Storage y obtiene la URL pre-firmada, luego envía la URL a este endpoint.

**Request:**
```json
{
  "empresa_id": "550e8400-...",
  "tipo_uso": "gasto",
  "archivo_url": "https://storage.supabase.co/.../doc.pdf",
  "nombre_archivo": "factura-proveedor-abril.pdf",
  "mime_type": "application/pdf"
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "archivo_url": "https://storage...",
    "registro_id": "uuid",
    "tipo_registro": "gasto",
    "requiere_revision": true,
    "propuesta": {
      "proveedor": "Proveedor SA",
      "folio": "F-9876",
      "neto": 500000,
      "iva": 95000,
      "total": 595000
    }
  },
  "message": "Documento procesado. Revisa los datos detectados."
}
```

---

### 4. Generar libro de compras
```
POST /api/books/purchases
→ n8n: POST /webhook/cfo/generate-purchase-book
```

**Request:**
```json
{
  "empresa_id": "550e8400-...",
  "periodo": "2026-04"
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "libro_id": "uuid",
    "periodo": "2026-04",
    "tipo": "libro_compras",
    "total_registros": 45,
    "total_neto": 8500000,
    "total_iva": 1615000,
    "total_general": 10115000,
    "archivo_url": "https://storage.../libro-compras-2026-04.xlsx",
    "estado": "generado"
  }
}
```

---

### 5. Generar libro de ventas
```
POST /api/books/sales
→ n8n: POST /webhook/cfo/generate-sales-book
```

**Request:**
```json
{
  "empresa_id": "550e8400-...",
  "periodo": "2026-04"
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "libro_id": "uuid",
    "periodo": "2026-04",
    "tipo": "libro_ventas",
    "total_registros": 12,
    "total_neto": 15000000,
    "total_iva": 2850000,
    "iva_debito_fiscal": 2850000,
    "archivo_url": "https://storage.../libro-ventas-2026-04.xlsx",
    "estado": "generado"
  }
}
```

---

### 6. Preparar F29
```
POST /api/taxes/f29
→ n8n: POST /webhook/cfo/prepare-f29
```

**Request:**
```json
{
  "empresa_id": "550e8400-...",
  "periodo": "2026-04"
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "periodo": "2026-04",
    "iva_debito": 2850000,
    "iva_credito": 1615000,
    "iva_a_pagar": 1235000,
    "remanente_credito": 0,
    "ppm_base": 15000000,
    "ppm": 187500,
    "retenciones": 10750,
    "total_estimado": 1433250,
    "estado": "estimado",
    "inconsistencias": [
      "3 gastos sin categoría contable.",
      "1 ingreso en estado pendiente sin validar."
    ],
    "checklist": {
      "gastos_sin_categoria": 3,
      "ingresos_sin_validar": 1,
      "documentos_sin_respaldo": 2
    }
  },
  "message": "F29 estimado preparado. Revise las inconsistencias antes de declarar."
}
```

> ⚠️ Este endpoint NO envía datos al SII. Es solo una estimación para revisión interna.

---

### 7. Ejecutar cierre mensual
```
POST /api/closing/monthly
→ n8n: POST /webhook/cfo/close-month
```

**Request:**
```json
{
  "empresa_id": "550e8400-...",
  "periodo": "2026-04",
  "notas_cierre": "Cierre regular. F29 declarado el 08/05."
}
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "periodo": "2026-04",
    "cerrado": true,
    "cerrado_at": "2026-05-08T10:30:00Z",
    "snapshot": {
      "ingresos": 17850000,
      "gastos": 10115000,
      "resultado": 7735000,
      "iva_pagar": 1433250
    }
  },
  "message": "Periodo 2026-04 cerrado exitosamente."
}
```

**Errores:**
| HTTP | Código | Cuándo |
|------|--------|--------|
| 409 | `PERIODO_YA_CERRADO` | El periodo ya tiene `cerrado = true` |
| 422 | `CHECKLIST_INCOMPLETO` | Algún paso del checklist incompleto |
| 422 | `ALERTAS_CRITICAS_PENDIENTES` | Alertas alta severidad sin resolver |

---

### 8. Obtener dashboard (lectura directa Supabase)

> Este endpoint puede hacerse directamente desde Next.js a Supabase, sin pasar por n8n, ya que es solo lectura.

```
GET /api/dashboard?empresa_id=uuid&periodo=2026-04
→ Supabase directamente (Server Action)
```

**Response 200:**
```json
{
  "ok": true,
  "data": {
    "periodo": "2026-04",
    "ingresos_total": 17850000,
    "gastos_total": 10115000,
    "resultado_estimado": 7735000,
    "iva_estimado": 1433250,
    "caja_disponible": 5500000,
    "cuentas_por_cobrar": 3540000,
    "cuentas_por_pagar": 1200000,
    "alertas_pendientes": 3,
    "alertas_criticas": 1,
    "cierre_completado": false
  }
}
```

---

## Tipos de documentos válidos

### Ingresos (`tipo_documento`)
| Valor | Descripción |
|-------|-------------|
| `factura_afecta` | Factura afecta a IVA (código 33 SII) |
| `factura_exenta` | Factura exenta de IVA (código 34 SII) |
| `boleta` | Boleta de ventas y servicios |
| `nota_debito` | Nota de débito |
| `nota_credito` | Nota de crédito (puede reducir base) |
| `boleta_honorarios` | Boleta de honorarios (código 39 SII) |
| `liquidacion` | Liquidación factura |
| `otro` | Otro tipo de ingreso |

### Gastos (`tipo_documento`)
| Valor | Descripción |
|-------|-------------|
| `factura_afecta` | Factura de compra afecta a IVA |
| `factura_exenta` | Factura de compra exenta |
| `boleta` | Boleta de compra |
| `nota_debito` | Nota de débito recibida |
| `nota_credito` | Nota de crédito recibida |
| `boleta_honorarios` | Boleta de honorarios (con retención) |
| `factura_extranjera` | Factura de proveedor extranjero (sin IVA) |
| `gasto_sin_documento` | Gasto sin respaldo tributario |
| `otro` | Otro |

---

## Estados del ciclo de vida

### Ingresos (`estado_cobro`)
`pendiente` → `cobrado` / `vencido` / `anulado`

### Gastos (`estado_pago`)
`pendiente` → `pagado` / `vencido` / `anulado`

### Impuestos F29 (`estado`)
`estimado` → `revisado` → `declarado` → `pagado`

### Libros (`estado`)
`borrador` → `generado` → `revisado` → `enviado`

### Alertas (`estado`)
`pendiente` → `vista` → `resuelta` / `ignorada`

---

## Variables de entorno requeridas

### Next.js (solo server-side)
```env
N8N_BASE_URL=https://n8n.cuanticode.com
N8N_WEBHOOK_SECRET=<token-secreto-compartido>
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_SERVICE_ROLE_KEY=<clave-service-role>
```

### n8n
```env
SUPABASE_URL=https://<proyecto>.supabase.co
SUPABASE_SERVICE_KEY=<clave-service-role>
N8N_WEBHOOK_SECRET=<token-secreto-compartido>
SMTP_HOST=<servidor-smtp>
SMTP_USER=<correo>
SMTP_PASS=<clave>
```
