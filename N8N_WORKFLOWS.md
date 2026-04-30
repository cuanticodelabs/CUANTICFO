# CuantiCFO — Workflows n8n
> Versión 1.0 · 2026-04-25  
> Referencia de diseño para implementación en n8n

---

## Convenciones generales

- **Autenticación**: Todos los webhooks usan Header Auth (`X-CFO-Secret: <token>`).
- **Respuesta estándar de error**:
  ```json
  { "ok": false, "error": "CODIGO_ERROR", "message": "Descripción legible", "details": {} }
  ```
- **Respuesta estándar de éxito**:
  ```json
  { "ok": true, "data": {}, "message": "Operación exitosa", "alertas": [] }
  ```
- **Todos los montos**: Recibidos como número, tratados internamente como `NUMERIC(18,2)`.
- **Periodo**: Siempre derivado de `fecha_documento` con formato `YYYY-MM`.
- **Logs**: Cada workflow debe registrar inicio y fin en `workflow_logs`.

---

## WF-01: Crear Ingreso

**Nombre en n8n**: `cfo/create-income`

### Trigger
Webhook POST desde Next.js Server Action.
```
POST https://n8n.cuanticode.com/webhook/cfo/create-income
Header: X-CFO-Secret: <token>
```

### Input esperado
```json
{
  "empresa_id": "uuid",
  "fecha_emision": "2026-04-20",
  "fecha_pago": "2026-04-25",
  "cliente": "Empresa Cliente SPA",
  "rut_cliente": "76.123.456-7",
  "folio": "F-001234",
  "tipo_documento": "factura_afecta",
  "neto": 1000000,
  "iva": 190000,
  "exento": 0,
  "total": 1190000,
  "categoria_id": "uuid-opcional",
  "estado_cobro": "pendiente",
  "proyecto_id": "uuid-opcional",
  "archivo_url": "https://storage.../doc.pdf",
  "creado_por": "uuid-usuario"
}
```

### Validaciones
1. `empresa_id`, `fecha_emision`, `cliente`, `tipo_documento`, `total` → obligatorios.
2. Verificar que `empresa_id` existe en tabla `empresas`.
3. Verificar que empresa no está cerrada (`activa = true`).
4. Calcular `periodo` = `YYYY-MM` desde `fecha_emision`.
5. Verificar que el `periodo` NO está cerrado en `cierres_mensuales`.
6. Si `folio` y `rut_cliente` informados: verificar duplicado en `ingresos` (mismo empresa_id + folio + rut_cliente + tipo_documento).
7. Verificar coherencia: `neto + iva + exento` debe aproximarse a `total` (tolerancia ±1 peso).

### Tablas afectadas
- `ingresos` — INSERT.
- `alertas` — INSERT si cliente con facturas vencidas previas.
- `workflow_logs` — INSERT al inicio y al final.

### Lógica de negocio
- Si `estado_cobro = 'pendiente'` y `fecha_emision` > 30 días: crear alerta `factura_vencida`.
- Si `categoria_id` es null: crear alerta `categoria_faltante`.
- Si `tipo_documento = 'nota_credito'`: el neto puede ser negativo (ajustar validación de monto).

### Output esperado
```json
{
  "ok": true,
  "data": {
    "ingreso_id": "uuid-generado",
    "periodo": "2026-04",
    "total": 1190000
  },
  "message": "Ingreso registrado correctamente.",
  "alertas": [
    { "tipo": "categoria_faltante", "severidad": "baja", "descripcion": "Ingreso sin categoría contable." }
  ]
}
```

### Errores posibles
| Código | Descripción |
|--------|-------------|
| `EMPRESA_NO_ENCONTRADA` | `empresa_id` no existe |
| `PERIODO_CERRADO` | El periodo ya fue cerrado con `cerrado = true` |
| `DOCUMENTO_DUPLICADO` | Folio+RUT+tipo ya existe para esta empresa |
| `MONTO_INCONSISTENTE` | `neto + iva + exento` no coincide con `total` |
| `VALIDACION_FALLIDA` | Campo obligatorio faltante o formato inválido |

---

## WF-02: Crear Gasto

**Nombre en n8n**: `cfo/create-expense`

### Trigger
Webhook POST desde Next.js Server Action.
```
POST https://n8n.cuanticode.com/webhook/cfo/create-expense
```

### Input esperado
```json
{
  "empresa_id": "uuid",
  "fecha_documento": "2026-04-20",
  "fecha_pago": "2026-04-25",
  "proveedor": "Google Cloud Chile",
  "rut_proveedor": "00.000.000-0",
  "folio": "INV-001",
  "tipo_documento": "factura_extranjera",
  "categoria_id": "uuid-opcional",
  "neto": 100000,
  "iva": 0,
  "exento": 0,
  "total": 100000,
  "usa_credito_fiscal": false,
  "estado_pago": "pagado",
  "proyecto_id": "uuid-opcional",
  "archivo_url": "https://storage.../factura.pdf",
  "creado_por": "uuid-usuario"
}
```

### Validaciones
1. Campos obligatorios: `empresa_id`, `fecha_documento`, `proveedor`, `tipo_documento`, `total`.
2. Verificar `empresa_id` existe y está activa.
3. Calcular `periodo` desde `fecha_documento`.
4. Verificar que `periodo` no está cerrado.
5. Verificar duplicado: folio+rut_proveedor+tipo_documento en misma empresa.
6. Coherencia de montos: `neto + iva + exento ≈ total`.
7. Si `tipo_documento = 'gasto_sin_documento'`: forzar `usa_credito_fiscal = false`.

### Tablas afectadas
- `gastos` — INSERT.
- `alertas` — INSERT si sin respaldo, categoría faltante, o proveedor nuevo.
- `workflow_logs` — INSERT.

### Lógica de negocio
- `tiene_respaldo` = `true` si `archivo_url` informado, `false` si null.
- Si `tiene_respaldo = false`: crear alerta `gasto_sin_respaldo` (severidad: baja).
- Si `categoria_id` null: crear alerta `categoria_faltante` (severidad: media).
- Detectar si `rut_proveedor` nunca ha aparecido antes en esta empresa → alerta `proveedor_nuevo`.
- Si gasto similar (mismo proveedor, mismo mes, diferencia < 5%) ya existe → alerta `documento_duplicado` (no bloquear, solo alertar).

### Output esperado
```json
{
  "ok": true,
  "data": {
    "gasto_id": "uuid-generado",
    "periodo": "2026-04",
    "tiene_respaldo": true
  },
  "message": "Gasto registrado correctamente.",
  "alertas": []
}
```

### Errores posibles
| Código | Descripción |
|--------|-------------|
| `EMPRESA_NO_ENCONTRADA` | `empresa_id` no existe |
| `PERIODO_CERRADO` | El periodo ya fue cerrado |
| `DOCUMENTO_DUPLICADO` | Folio+RUT+tipo ya existe |
| `MONTO_INCONSISTENTE` | Suma de componentes no coincide con total |

---

## WF-03: Subida de Documento

**Nombre en n8n**: `cfo/upload-document`

### Trigger
Webhook POST con `multipart/form-data` o payload JSON con URL pre-firmada de Supabase Storage.

```
POST https://n8n.cuanticode.com/webhook/cfo/upload-document
```

### Input esperado
```json
{
  "empresa_id": "uuid",
  "tipo_uso": "gasto | ingreso | comprobante_sii | honorario",
  "archivo_url": "https://storage.supabase.co/...",
  "nombre_archivo": "factura-proveedor.pdf",
  "mime_type": "application/pdf",
  "subido_por": "uuid-usuario"
}
```

### Pasos del workflow
1. Validar `empresa_id`, `tipo_uso`, `archivo_url`.
2. Registrar metadatos del archivo (tabla `workflow_logs` como registro auxiliar).
3. **Si `tipo_uso = 'gasto' | 'ingreso'`**: Intentar extracción OCR/IA (opcional en MVP).
   - Proponer `proveedor` o `cliente`.
   - Proponer `folio`, `neto`, `iva`, `total`.
   - Proponer `categoria_id` basado en historial.
4. Crear registro en `ingresos` o `gastos` con `estado_cobro/estado_pago = 'pendiente'` y datos propuestos.
5. Notificar al usuario (email/push) para que valide los datos propuestos.

### Tablas afectadas
- `ingresos` o `gastos` — INSERT provisional (estado: pendiente revisión).
- `workflow_logs` — INSERT.
- `alertas` — INSERT si documento necesita revisión manual.

### Output esperado
```json
{
  "ok": true,
  "data": {
    "archivo_url": "https://storage...",
    "registro_id": "uuid",
    "tipo_registro": "gasto",
    "requiere_revision": true,
    "propuesta": {
      "proveedor": "Proveedor Detectado",
      "folio": "F-001",
      "neto": 500000,
      "iva": 95000,
      "total": 595000
    }
  },
  "message": "Documento subido. Revisa los datos detectados."
}
```

### Errores posibles
| Código | Descripción |
|--------|-------------|
| `ARCHIVO_INACCESIBLE` | URL no responde o formato inválido |
| `TIPO_USO_INVALIDO` | `tipo_uso` no reconocido |

---

## WF-04: Generar Libro de Compras

**Nombre en n8n**: `cfo/generate-purchase-book`

### Trigger
Webhook POST desde Next.js (acción manual del CFO/contador) o Schedule mensual.

```
POST https://n8n.cuanticode.com/webhook/cfo/generate-purchase-book
```

### Input esperado
```json
{
  "empresa_id": "uuid",
  "periodo": "2026-04",
  "generado_por": "uuid-usuario"
}
```

### Pasos del workflow
1. Validar `empresa_id` y `periodo` (formato YYYY-MM).
2. Consultar todos los `gastos` con `empresa_id` y `periodo` dados.
3. Filtrar por `tipo_documento` válido para libro de compras (excluir `gasto_sin_documento`).
4. Agrupar: calcular `SUM(neto)`, `SUM(iva)`, `SUM(exento)`, `SUM(total)`.
5. Detectar gastos sin `categoria_id` → incluir en observaciones.
6. Generar archivo Excel/CSV con estructura del libro.
7. Subir a Supabase Storage.
8. Actualizar o insertar en `libros_mensuales` con `tipo = 'libro_compras'`.
9. Retornar URL del archivo.

### Tablas afectadas
- `gastos` — SELECT.
- `libros_mensuales` — INSERT/UPDATE.
- `workflow_logs` — INSERT.

### Output esperado
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

### Errores posibles
| Código | Descripción |
|--------|-------------|
| `SIN_REGISTROS` | No hay gastos para el periodo dado |
| `ERROR_GENERACION_ARCHIVO` | Falla al crear el Excel/PDF |

---

## WF-05: Generar Libro de Ventas

**Nombre en n8n**: `cfo/generate-sales-book`

### Trigger
Webhook POST o Schedule mensual.

### Input esperado
```json
{
  "empresa_id": "uuid",
  "periodo": "2026-04",
  "generado_por": "uuid-usuario"
}
```

### Pasos del workflow
1. Validar inputs.
2. Consultar `ingresos` con `empresa_id` y `periodo`.
3. Agrupar por `tipo_documento`: facturas afectas, exentas, boletas, notas de crédito/débito.
4. Calcular `SUM(neto)`, `SUM(iva)`, `SUM(exento)`, `SUM(total)` por tipo.
5. Calcular IVA débito total (solo facturas afectas y boletas).
6. Generar Excel/CSV.
7. Subir a Supabase Storage.
8. Insertar/actualizar en `libros_mensuales` con `tipo = 'libro_ventas'`.

### Tablas afectadas
- `ingresos` — SELECT.
- `libros_mensuales` — INSERT/UPDATE.
- `workflow_logs` — INSERT.

### Output esperado
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
    "archivo_url": "https://storage.../libro-ventas-2026-04.xlsx"
  }
}
```

---

## WF-06: Preparar F29

**Nombre en n8n**: `cfo/prepare-f29`

### Trigger
Webhook POST desde Next.js (acción manual del CFO).
```
POST https://n8n.cuanticode.com/webhook/cfo/prepare-f29
```

### Input esperado
```json
{
  "empresa_id": "uuid",
  "periodo": "2026-04",
  "generado_por": "uuid-usuario"
}
```

### Pasos del workflow
1. Validar `empresa_id` y `periodo`.
2. Obtener `tasa_ppm` de `empresas`.
3. **IVA Débito**: `SUM(iva)` de `ingresos` donde `tipo_documento IN ('factura_afecta', 'boleta', 'nota_debito')` y `periodo = X`.
4. **IVA Crédito**: `SUM(iva)` de `gastos` donde `usa_credito_fiscal = true` y `periodo = X`.
5. **IVA a Pagar**: `MAX(iva_debito - iva_credito, 0)`.
6. **Remanente crédito**: `MAX(iva_credito - iva_debito, 0)`.
7. **PPM base**: `SUM(neto)` de `ingresos` afectos a PPM del periodo.
8. **PPM**: `ppm_base * tasa_ppm`.
9. **Retenciones**: `SUM(iva)` de gastos con `tipo_documento = 'boleta_honorarios'` (10.75% por retención).
10. **Total estimado**: `iva_a_pagar + ppm + retenciones`.
11. Detectar inconsistencias:
    - Gastos sin categoría.
    - Ingresos sin clasificación.
    - Documentos en estado `pendiente` sin validar.
12. Insertar o actualizar `impuestos_mensuales`.
13. Responder resumen completo.

> **IMPORTANTE**: Este workflow NO envía nada al SII. Es solo un cálculo estimado para revisión del CFO.

### Tablas afectadas
- `ingresos` — SELECT.
- `gastos` — SELECT.
- `empresas` — SELECT (tasa_ppm).
- `impuestos_mensuales` — INSERT/UPDATE (upsert por empresa_id+periodo).
- `workflow_logs` — INSERT.

### Output esperado
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

### Errores posibles
| Código | Descripción |
|--------|-------------|
| `PERIODO_INVALIDO` | Formato YYYY-MM incorrecto |
| `SIN_DATOS_PERIODO` | No hay ingresos ni gastos para el periodo |
| `EMPRESA_NO_ENCONTRADA` | empresa_id inválido |

---

## WF-07: Reporte Mensual CFO

**Nombre en n8n**: `cfo/monthly-report`

### Trigger
Schedule mensual (ej: día 5 de cada mes, 08:00 AM) O Webhook manual.

### Input (para webhook manual)
```json
{
  "empresa_id": "uuid",
  "periodo": "2026-04",
  "destinatarios": ["cfo@empresa.cl", "socio@empresa.cl"]
}
```

### Pasos del workflow
1. Consultar resumen financiero del periodo:
   - Total ingresos, gastos, resultado.
   - IVA estimado desde `impuestos_mensuales`.
   - Flujo de caja desde `flujo_caja`.
   - Alertas abiertas desde `alertas`.
2. Comparar vs periodo anterior (variaciones %).
3. Generar HTML del reporte.
4. Convertir a PDF (usar nodo HTTP hacia servicio PDF o librería).
5. Subir PDF a Supabase Storage.
6. Enviar correo con PDF adjunto a `destinatarios`.
7. Registrar en `workflow_logs`.

### Tablas afectadas
- `ingresos`, `gastos`, `impuestos_mensuales`, `flujo_caja`, `alertas` — SELECT.
- `workflow_logs` — INSERT.

### Output esperado
```json
{
  "ok": true,
  "data": {
    "periodo": "2026-04",
    "reporte_url": "https://storage.../reporte-cfo-2026-04.pdf",
    "enviado_a": ["cfo@empresa.cl"],
    "resumen": {
      "ingresos_total": 17850000,
      "gastos_total": 10115000,
      "resultado": 7735000,
      "iva_estimado": 1433250
    }
  }
}
```

---

## WF-08: Alertas Automáticas

**Nombre en n8n**: `cfo/check-alerts`

### Trigger
Schedule diario (ej: 07:00 AM).

### Input
No requiere input externo. Opera sobre todas las empresas activas.

### Reglas de negocio evaluadas

| Regla | Condición | Severidad |
|-------|-----------|-----------|
| `iva_supera_caja` | `impuestos.total_estimado > flujo_caja.saldo_final` | Alta |
| `factura_vencida` | `ingresos.estado_cobro = 'pendiente'` y `fecha_emision < NOW() - 30 días` | Alta |
| `gasto_sin_respaldo` | `gastos.tiene_respaldo = false` y `created_at < NOW() - 7 días` | Baja |
| `mes_sin_cierre` | `cierres_mensuales.cerrado = false` y periodo < mes actual | Media |
| `variacion_gasto` | Gasto categoría X > 30% vs mismo mes año anterior | Media |
| `datos_faltantes_f29` | `impuestos_mensuales.estado = 'estimado'` y estamos a 5 días del vencimiento | Alta |
| `categoria_faltante` | `ingresos` o `gastos` sin `categoria_id` con más de 2 días | Media |
| `honorarios_pendiente` | `ingresos.tipo_documento = 'boleta_honorarios'` sin retención calculada | Media |

### Pasos del workflow
1. Iterar sobre empresas activas.
2. Por cada empresa, evaluar todas las reglas para el periodo corriente.
3. Para cada regla que se cumpla:
   - Verificar si ya existe alerta del mismo tipo+empresa+periodo en estado 'pendiente' (no duplicar).
   - INSERT en `alertas` si no existe.
4. Enviar notificación (email/Slack) si severidad = 'alta'.
5. Registrar en `workflow_logs`.

### Tablas afectadas
- `empresas`, `ingresos`, `gastos`, `impuestos_mensuales`, `flujo_caja`, `cierres_mensuales` — SELECT.
- `alertas` — INSERT (solo si no existe alerta activa del mismo tipo+periodo).
- `workflow_logs` — INSERT.

---

## WF-09: Ejecutar Cierre Mensual

**Nombre en n8n**: `cfo/close-month`

### Trigger
Webhook POST desde Next.js (acción explícita del CFO/admin).
```
POST https://n8n.cuanticode.com/webhook/cfo/close-month
```

### Input esperado
```json
{
  "empresa_id": "uuid",
  "periodo": "2026-04",
  "cerrado_por": "uuid-usuario",
  "notas_cierre": "Cierre regular. F29 declarado el 12/05."
}
```

### Validaciones previas (checklist)
1. `ventas_revisadas = true`.
2. `compras_revisadas = true`.
3. `honorarios_revisados = true`.
4. `banco_conciliado = true`.
5. `impuestos_calculados = true` (existe registro en `impuestos_mensuales`).
6. `f29_preparado = true`.
7. `reporte_generado = true`.
8. No existen alertas de severidad 'alta' pendientes para el periodo.

### Pasos del workflow
1. Verificar checklist completo.
2. Calcular snapshot financiero:
   - `snapshot_ingresos = SUM(total)` de `ingresos` del periodo.
   - `snapshot_gastos = SUM(total)` de `gastos` del periodo.
   - `snapshot_resultado = snapshot_ingresos - snapshot_gastos`.
   - `snapshot_iva_pagar` desde `impuestos_mensuales`.
3. UPDATE `cierres_mensuales` con:
   - `cerrado = true`.
   - `cerrado_por`, `cerrado_at = NOW()`.
   - Snapshots calculados.
   - `notas_cierre`.
4. Enviar correo de confirmación al CFO y contador.
5. Registrar en `workflow_logs`.

> **IMPORTANTE**: Una vez `cerrado = true`, el periodo queda bloqueado. Cualquier ajuste posterior debe hacerse como documento nuevo con referencia al periodo cerrado.

### Tablas afectadas
- `cierres_mensuales` — UPDATE.
- `ingresos`, `gastos`, `impuestos_mensuales` — SELECT (para snapshot).
- `alertas` — SELECT (validación).
- `workflow_logs` — INSERT.

### Output esperado
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

### Errores posibles
| Código | Descripción |
|--------|-------------|
| `CHECKLIST_INCOMPLETO` | Algún paso del checklist no está completado |
| `ALERTAS_CRITICAS_PENDIENTES` | Existen alertas de severidad alta sin resolver |
| `PERIODO_YA_CERRADO` | El periodo ya fue cerrado previamente |
| `EMPRESA_NO_ENCONTRADA` | `empresa_id` inválido |

---

## WF-10: Error Handler Global

**Nombre en n8n**: `cfo/error-handler`

### Trigger
`Error Trigger` nativo de n8n (se activa cuando cualquier otro workflow falla).

### Pasos del workflow
1. Recibir datos del error: workflow_name, execution_id, error_message, error_node, payload.
2. INSERT en `workflow_logs`:
   ```json
   {
     "workflow_name": "nombre-del-workflow-fallido",
     "execution_id": "id-n8n",
     "status": "error",
     "error_message": "Mensaje de error",
     "error_node": "Nodo donde falló",
     "payload": { "...input original..." }
   }
   ```
3. Si `error_message` contiene palabras clave críticas (timeout, constraint, permission):
   - Crear alerta en `alertas` con `severidad = 'alta'` y `tipo = 'otro'`.
   - Enviar email al equipo técnico.
4. Responder al webhook original (si aplica) con error estándar:
   ```json
   { "ok": false, "error": "WORKFLOW_ERROR", "message": "Error interno. El equipo fue notificado." }
   ```

### Tablas afectadas
- `workflow_logs` — INSERT.
- `alertas` — INSERT condicional.

---

## Diagrama de dependencias entre workflows

```
Ingresos ─────────────────────────────────┐
  WF-01 (Crear Ingreso)                    │
                                           ├──► WF-06 (Preparar F29)
Gastos ────────────────────────────────────┤         │
  WF-02 (Crear Gasto)                      │         ▼
  WF-03 (Subir Documento)                  │    impuestos_mensuales
                                           │         │
Libros ─────────────────────────────────── ┤         ▼
  WF-04 (Libro Compras)                    │    WF-09 (Cierre Mensual)
  WF-05 (Libro Ventas)                     │         │
                                           │         ▼
Automatizaciones ──────────────────────── ─┘    WF-07 (Reporte CFO)
  WF-08 (Alertas Diarias)                  │
  WF-10 (Error Handler) ◄────────── todos  │
```
