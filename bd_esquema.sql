-- ============================================================
-- CuantiCFO - Esquema PostgreSQL/Supabase
-- Versión: 1.2
-- Última actualización: 2026-04-25
-- Descripción: Modelo de datos para sistema CFO multi-empresa.
--   Soporta ingresos, gastos, libros contables, impuestos,
--   preparación F29, estado de resultados, flujo de caja,
--   alertas, cierres mensuales y trazabilidad de workflows n8n.
-- Convenciones:
--   - Montos: NUMERIC(18,2), nunca FLOAT.
--   - Fechas tributarias: fecha_documento, fecha_pago, periodo, created_at diferenciados.
--   - periodo: formato 'YYYY-MM' (ej: '2026-04').
--   - UUIDs con gen_random_uuid().
--   - RLS habilitado por tabla (configurar en Supabase según roles).
-- ============================================================

create extension if not exists pgcrypto;

-- =========================
-- ENUM-LIKE CHECK SETS
-- (Definidos como constraints; se pueden migrar a pg ENUM si se prefiere)
-- =========================

-- ============================================================
-- 1. EMPRESAS
-- ============================================================
create table if not exists public.empresas (
  id                    uuid          primary key default gen_random_uuid(),
  razon_social          text          not null,
  rut                   text          not null unique,
  giro                  text,
  regimen_tributario    text          check (regimen_tributario in (
                                        'primera_categoria',
                                        'regimen_pro_pyme',
                                        'regimen_pro_pyme_transparente',
                                        'sin_inicio_actividades'
                                      )),
  tasa_ppm              numeric(5,4)  not null default 0,   -- ej: 0.0125 = 1.25%
  email_contador        text,
  banco_principal       text,
  fecha_inicio_actividades date,
  activa                boolean       not null default true,
  created_at            timestamptz   not null default now(),
  updated_at            timestamptz   not null default now()
);

comment on column public.empresas.tasa_ppm is
  'Tasa PPM como decimal (ej: 0.0125 para 1.25%). Depende del régimen y actividad.';
comment on column public.empresas.regimen_tributario is
  'Régimen SII: primera_categoria, regimen_pro_pyme, regimen_pro_pyme_transparente.';

-- ============================================================
-- 2. USUARIOS
-- ============================================================
create table if not exists public.usuarios (
  id          uuid        primary key default gen_random_uuid(),
  empresa_id  uuid        not null references public.empresas(id) on delete cascade,
  -- auth_user_id: referencia al usuario de Supabase Auth (auth.users)
  auth_user_id uuid       unique,
  nombre      text        not null,
  email       text        not null unique,
  rol         text        not null check (rol in ('admin', 'cfo', 'contador', 'socio_lectura')),
  activo      boolean     not null default true,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now()
);

comment on column public.usuarios.auth_user_id is
  'UUID del usuario en Supabase Auth (auth.users.id). Null si aún no completó registro.';
comment on column public.usuarios.rol is
  'admin: acceso total. cfo: operaciones financieras. contador: lectura + libros. socio_lectura: solo reportes.';

-- ============================================================
-- 3. CATEGORÍAS CONTABLES
-- ============================================================
create table if not exists public.categorias_contables (
  id               uuid      primary key default gen_random_uuid(),
  empresa_id       uuid      not null references public.empresas(id) on delete cascade,
  nombre           text      not null,
  tipo             text      not null check (tipo in (
                               'ingreso', 'costo_directo', 'gasto_administrativo',
                               'gasto_comercial', 'gasto_tecnologico', 'gasto_financiero',
                               'otro_ingreso', 'otro_egreso'
                             )),
  cuenta_contable  text,      -- Código plan de cuentas (ej: '4.1.01')
  afecta_resultado boolean   not null default true,
  afecta_iva       boolean   not null default false,
  activa           boolean   not null default true,
  created_at       timestamptz not null default now(),
  constraint uq_categoria_empresa_nombre unique (empresa_id, nombre)
);

comment on column public.categorias_contables.tipo is
  'Clasifica la categoría en el estado de resultados y flujo de caja.';
comment on column public.categorias_contables.cuenta_contable is
  'Código de cuenta según plan de cuentas interno. Ej: 4.1.01, 5.2.03.';

-- ============================================================
-- 4. PROYECTOS / CENTROS DE COSTO
-- ============================================================
create table if not exists public.proyectos (
  id          uuid        primary key default gen_random_uuid(),
  empresa_id  uuid        not null references public.empresas(id) on delete cascade,
  nombre      text        not null,
  codigo      text,
  descripcion text,
  cliente     text,
  estado      text        not null default 'activo' check (estado in ('activo', 'cerrado', 'pausado')),
  fecha_inicio date,
  fecha_fin    date,
  created_at  timestamptz not null default now(),
  updated_at  timestamptz not null default now(),
  constraint uq_proyecto_empresa_nombre unique (empresa_id, nombre)
);

comment on table public.proyectos is
  'Centros de costo o proyectos. Permite segmentar ingresos y gastos por iniciativa.';

-- ============================================================
-- 5. HONORARIOS
-- ============================================================
create table if not exists public.honorarios (
  id                uuid          primary key default gen_random_uuid(),
  empresa_id        uuid          not null references public.empresas(id) on delete cascade,
  fecha_emision     date          not null,
  periodo           text          not null check (periodo ~ '^\d{4}-\d{2}$'),  -- 'YYYY-MM'
  -- Prestador
  prestador         text          not null,
  rut_prestador     text          not null,
  folio             text,
  -- Montos (la retención es 10.75% según SII para honorarios en Chile)
  monto_bruto       numeric(18,2) not null default 0,
  retencion         numeric(18,2) not null default 0,   -- 10.75% del bruto si aplica
  monto_neto        numeric(18,2) not null default 0,   -- monto_bruto - retencion
  -- Estado
  estado_pago       text          not null default 'pendiente' check (estado_pago in (
                                    'pendiente', 'pagado', 'anulado'
                                  )),
  retencion_declarada boolean     not null default false,  -- Si se incluyó en F29
  -- Asociación
  proyecto_id       uuid          references public.proyectos(id) on delete set null,
  -- Documento adjunto
  archivo_url       text,
  -- Trazabilidad
  creado_por        uuid          references public.usuarios(id) on delete set null,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now(),
  -- Coherencia de montos
  constraint chk_honorario_bruto_positivo   check (monto_bruto >= 0),
  constraint chk_honorario_retencion_valida check (retencion >= 0 and retencion <= monto_bruto),
  constraint chk_honorario_neto_positivo    check (monto_neto >= 0)
);

create index if not exists idx_honorarios_empresa_periodo
  on public.honorarios(empresa_id, periodo);
create index if not exists idx_honorarios_empresa_fecha
  on public.honorarios(empresa_id, fecha_emision desc);
create index if not exists idx_honorarios_rut_prestador
  on public.honorarios(empresa_id, rut_prestador);
create index if not exists idx_honorarios_proyecto_id
  on public.honorarios(proyecto_id);

comment on table public.honorarios is
  'Boletas de honorarios recibidas (servicios de terceros). La retención 10.75% alimenta el F29.';
comment on column public.honorarios.retencion is
  'Retención de honorarios (10.75% del bruto según SII). Se declara en F29 como retención.';
comment on column public.honorarios.retencion_declarada is
  'True si esta retención ya fue incluida en un F29 declarado. Evita doble conteo.';

-- ============================================================
-- 6. TRANSFERENCIAS BANCARIAS
-- ============================================================
create table if not exists public.transferencias_bancarias (
  id                uuid          primary key default gen_random_uuid(),
  empresa_id        uuid          not null references public.empresas(id) on delete cascade,
  fecha             date          not null,
  periodo           text          not null check (periodo ~ '^\d{4}-\d{2}$'),
  tipo              text          not null check (tipo in ('entrada', 'salida', 'traspaso_interno')),
  descripcion       text          not null,
  monto             numeric(18,2) not null,
  -- Cuenta origen / destino (texto libre para MVP; en Fase 2 referenciar tabla cuentas_bancarias)
  cuenta_origen     text,
  cuenta_destino    text,
  -- Referencia a ingreso/gasto si aplica
  ingreso_id        uuid          references public.ingresos(id) on delete set null,
  gasto_id          uuid          references public.gastos(id) on delete set null,
  -- Estado
  conciliado        boolean       not null default false,
  archivo_url       text,         -- Comprobante de transferencia
  -- Trazabilidad
  creado_por        uuid          references public.usuarios(id) on delete set null,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now(),
  constraint chk_transferencia_monto_positivo check (monto > 0)
);

create index if not exists idx_transferencias_empresa_periodo
  on public.transferencias_bancarias(empresa_id, periodo);
create index if not exists idx_transferencias_empresa_fecha
  on public.transferencias_bancarias(empresa_id, fecha desc);
create index if not exists idx_transferencias_no_conciliadas
  on public.transferencias_bancarias(empresa_id, conciliado) where conciliado = false;

comment on table public.transferencias_bancarias is
  'Movimientos bancarios para conciliación. Se puede asociar a un ingreso o gasto existente.';

-- ============================================================
-- 7. INGRESOS
-- ============================================================
create table if not exists public.ingresos (
  id               uuid          primary key default gen_random_uuid(),
  empresa_id       uuid          not null references public.empresas(id) on delete cascade,
  -- Fechas tributarias distinguidas
  fecha_emision    date          not null,        -- Fecha del documento tributario
  fecha_pago       date,                          -- Fecha efectiva de cobro/pago
  periodo          text          not null,        -- 'YYYY-MM' para agrupación tributaria
  -- Contraparte
  cliente          text          not null,
  rut_cliente      text,
  -- Documento
  folio            text,
  tipo_documento   text          not null check (tipo_documento in (
                                   'factura_afecta', 'factura_exenta', 'boleta',
                                   'nota_debito', 'nota_credito', 'boleta_honorarios',
                                   'liquidacion', 'otro'
                                 )),
  constraint chk_ingreso_periodo check (periodo ~ '^\d{4}-\d{2}$'),
  -- Montos (siempre NUMERIC, nunca FLOAT)
  neto             numeric(18,2) not null default 0,
  iva              numeric(18,2) not null default 0,
  exento           numeric(18,2) not null default 0,
  total            numeric(18,2) not null default 0,
  -- Categoría contable
  categoria_id     uuid          references public.categorias_contables(id) on delete set null,
  -- Estado y clasificación
  estado_cobro     text          not null default 'pendiente' check (estado_cobro in (
                                   'pendiente', 'cobrado', 'vencido', 'anulado'
                                 )),
  -- Asociación
  proyecto_id      uuid          references public.proyectos(id) on delete set null,
  -- Documento adjunto
  archivo_url      text,
  -- Trazabilidad
  creado_por       uuid          references public.usuarios(id) on delete set null,
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now(),
  -- Validez tributaria: previene duplicados folio+rut+tipo en misma empresa
  constraint uq_ingreso_folio_rut_tipo unique (empresa_id, folio, rut_cliente, tipo_documento),
  -- Coherencia de montos
  constraint chk_ingreso_neto_positivo check (neto >= 0),
  constraint chk_ingreso_iva_positivo  check (iva >= 0),
  constraint chk_ingreso_exento_positivo check (exento >= 0),
  constraint chk_ingreso_total_positivo check (total >= 0)
);

comment on column public.ingresos.periodo is
  'Periodo tributario YYYY-MM. Puede diferir del mes de fecha_emision si hay notas de crédito/débito.';
comment on column public.ingresos.tipo_documento is
  'Tipo de DTE o documento interno según clasificación SII.';
comment on constraint uq_ingreso_folio_rut_tipo on public.ingresos is
  'Previene registro duplicado del mismo DTE. Folio puede ser null en boletas sin folio.';

-- ============================================================
-- 6. GASTOS
-- ============================================================
create table if not exists public.gastos (
  id                 uuid          primary key default gen_random_uuid(),
  empresa_id         uuid          not null references public.empresas(id) on delete cascade,
  -- Fechas tributarias distinguidas
  fecha_documento    date          not null,      -- Fecha del documento del proveedor
  fecha_pago         date,                        -- Fecha efectiva de pago
  periodo            text          not null,      -- 'YYYY-MM' para agrupación tributaria
  -- Contraparte
  proveedor          text          not null,
  rut_proveedor      text,
  -- Documento
  folio              text,
  tipo_documento     text          not null check (tipo_documento in (
                                     'factura_afecta', 'factura_exenta', 'boleta',
                                     'nota_debito', 'nota_credito', 'boleta_honorarios',
                                     'factura_extranjera', 'gasto_sin_documento', 'otro'
                                   )),
  constraint chk_gasto_periodo check (periodo ~ '^\d{4}-\d{2}$'),
  -- Clasificación
  categoria_id       uuid          references public.categorias_contables(id) on delete set null,
  -- Montos (siempre NUMERIC, nunca FLOAT)
  neto               numeric(18,2) not null default 0,
  iva                numeric(18,2) not null default 0,
  exento             numeric(18,2) not null default 0,
  total              numeric(18,2) not null default 0,
  -- IVA
  usa_credito_fiscal boolean       not null default false,
  -- Estado
  estado_pago        text          not null default 'pendiente' check (estado_pago in (
                                     'pendiente', 'pagado', 'vencido', 'anulado'
                                   )),
  tiene_respaldo     boolean       not null default false,   -- Indica si hay documento adjunto
  -- Asociación
  proyecto_id        uuid          references public.proyectos(id) on delete set null,
  -- Documento adjunto
  archivo_url        text,
  -- Trazabilidad
  creado_por         uuid          references public.usuarios(id) on delete set null,
  created_at         timestamptz   not null default now(),
  updated_at         timestamptz   not null default now(),
  -- Previene duplicados
  constraint uq_gasto_folio_rut_tipo unique (empresa_id, folio, rut_proveedor, tipo_documento),
  -- Coherencia
  constraint chk_gasto_neto_positivo   check (neto >= 0),
  constraint chk_gasto_iva_positivo    check (iva >= 0),
  constraint chk_gasto_exento_positivo check (exento >= 0),
  constraint chk_gasto_total_positivo  check (total >= 0)
);

comment on column public.gastos.tiene_respaldo is
  'True si existe archivo_url cargado. Usado por alertas para detectar gastos sin respaldo.';
comment on column public.gastos.usa_credito_fiscal is
  'True si el IVA de este gasto puede usarse como crédito fiscal en el F29.';

-- ============================================================
-- 7. LIBROS CONTABLES (snapshots mensuales)
-- ============================================================
create table if not exists public.libros_mensuales (
  id               uuid          primary key default gen_random_uuid(),
  empresa_id       uuid          not null references public.empresas(id) on delete cascade,
  periodo          text          not null,   -- 'YYYY-MM'
  tipo             text          not null check (tipo in (
                                   'libro_compras', 'libro_ventas',
                                   'libro_honorarios', 'libro_gastos_internos'
                                 )),
  -- Resúmenes calculados
  total_neto       numeric(18,2) not null default 0,
  total_iva        numeric(18,2) not null default 0,
  total_exento     numeric(18,2) not null default 0,
  total_general    numeric(18,2) not null default 0,
  -- Estado del libro
  estado           text          not null default 'borrador' check (estado in (
                                   'borrador', 'generado', 'revisado', 'enviado'
                                 )),
  archivo_url      text,         -- URL del Excel/PDF generado
  generado_at      timestamptz,
  generado_por     uuid          references public.usuarios(id) on delete set null,
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now(),
  constraint uq_libro_empresa_periodo_tipo unique (empresa_id, periodo, tipo)
);

comment on table public.libros_mensuales is
  'Snapshots de libros contables generados por n8n. No reemplaza el RCV del SII, es control interno.';

-- ============================================================
-- 8. IMPUESTOS MENSUALES (base para F29)
-- ============================================================
create table if not exists public.impuestos_mensuales (
  id                  uuid          primary key default gen_random_uuid(),
  empresa_id          uuid          not null references public.empresas(id) on delete cascade,
  periodo             text          not null,   -- 'YYYY-MM'
  -- IVA
  iva_debito          numeric(18,2) not null default 0,   -- IVA en ventas afectas
  iva_credito         numeric(18,2) not null default 0,   -- IVA en compras con crédito fiscal
  iva_a_pagar         numeric(18,2) not null default 0,   -- iva_debito - iva_credito (si > 0)
  remanente_credito   numeric(18,2) not null default 0,   -- Si iva_credito > iva_debito
  -- PPM
  ppm_base            numeric(18,2) not null default 0,   -- Base de cálculo PPM (ingresos netos)
  ppm                 numeric(18,2) not null default 0,   -- PPM calculado
  -- Retenciones
  retenciones         numeric(18,2) not null default 0,   -- Retenciones honorarios
  -- Totales
  total_estimado      numeric(18,2) not null default 0,   -- iva_a_pagar + ppm + retenciones
  -- Estado y trazabilidad
  estado              text          not null default 'estimado' check (estado in (
                                     'estimado', 'revisado', 'declarado', 'pagado'
                                   )),
  observaciones       text,
  comprobante_url     text,         -- Comprobante SII cargado manualmente
  calculado_at        timestamptz,
  calculado_por       uuid          references public.usuarios(id) on delete set null,
  declarado_at        timestamptz,
  created_at          timestamptz   not null default now(),
  updated_at          timestamptz   not null default now(),
  constraint uq_impuesto_empresa_periodo unique (empresa_id, periodo),
  constraint chk_iva_pagar_no_negativo check (iva_a_pagar >= 0),
  constraint chk_remanente_no_negativo check (remanente_credito >= 0)
);

comment on table public.impuestos_mensuales is
  'Consolidado de impuestos por periodo. Alimenta el preparador F29. No envía al SII automáticamente.';
comment on column public.impuestos_mensuales.estado is
  'estimado: calculado por n8n. revisado: aprobado por CFO. declarado: marcado como declarado en SII. pagado: comprobante cargado.';

-- ============================================================
-- 9. FLUJO DE CAJA
-- ============================================================
create table if not exists public.flujo_caja (
  id               uuid          primary key default gen_random_uuid(),
  empresa_id       uuid          not null references public.empresas(id) on delete cascade,
  periodo          text          not null,    -- 'YYYY-MM'
  -- Saldos reales
  saldo_inicial    numeric(18,2) not null default 0,
  ingresos_reales  numeric(18,2) not null default 0,
  egresos_reales   numeric(18,2) not null default 0,
  saldo_final      numeric(18,2) not null default 0,
  -- Proyecciones
  cuentas_por_cobrar  numeric(18,2) not null default 0,
  cuentas_por_pagar   numeric(18,2) not null default 0,
  saldo_proyectado_30d numeric(18,2) not null default 0,
  saldo_proyectado_60d numeric(18,2) not null default 0,
  saldo_proyectado_90d numeric(18,2) not null default 0,
  -- Metadata
  escenario        text          not null default 'base' check (escenario in ('conservador', 'base', 'optimista')),
  notas            text,
  created_at       timestamptz   not null default now(),
  updated_at       timestamptz   not null default now(),
  constraint uq_flujo_empresa_periodo_escenario unique (empresa_id, periodo, escenario)
);

comment on table public.flujo_caja is
  'Snapshot de flujo de caja por periodo. Calculado por n8n. Puede tener múltiples escenarios.';

-- ============================================================
-- 10. ALERTAS
-- ============================================================
create table if not exists public.alertas (
  id               uuid        primary key default gen_random_uuid(),
  empresa_id       uuid        not null references public.empresas(id) on delete cascade,
  periodo          text,       -- 'YYYY-MM' si aplica
  tipo             text        not null check (tipo in (
                                 'iva_supera_caja', 'factura_vencida', 'gasto_sin_respaldo',
                                 'documento_duplicado', 'proveedor_nuevo', 'mes_sin_cierre',
                                 'variacion_gasto', 'margen_bajo', 'datos_faltantes_f29',
                                 'categoria_faltante', 'honorarios_pendiente', 'otro'
                               )),
  severidad        text        not null default 'media' check (severidad in ('alta', 'media', 'baja')),
  descripcion      text        not null,
  accion_sugerida  text,
  estado           text        not null default 'pendiente' check (estado in (
                                 'pendiente', 'vista', 'resuelta', 'ignorada'
                               )),
  -- Referencia al registro que generó la alerta
  referencia_tabla text,       -- Nombre de tabla (ej: 'gastos', 'ingresos')
  referencia_id    uuid,       -- ID del registro relacionado
  -- Trazabilidad
  resuelta_por     uuid        references public.usuarios(id) on delete set null,
  resuelta_at      timestamptz,
  created_at       timestamptz not null default now(),
  updated_at       timestamptz not null default now()
);

comment on column public.alertas.referencia_tabla is
  'Tabla origen de la alerta para drill-down. Ej: gastos, ingresos, impuestos_mensuales.';
comment on column public.alertas.referencia_id is
  'ID del registro específico que originó la alerta. Permite navegar al contexto exacto.';

-- ============================================================
-- 11. CIERRES MENSUALES
-- ============================================================
create table if not exists public.cierres_mensuales (
  id                    uuid        primary key default gen_random_uuid(),
  empresa_id            uuid        not null references public.empresas(id) on delete cascade,
  periodo               text        not null,   -- 'YYYY-MM'
  -- Checklist de cierre
  ventas_revisadas      boolean     not null default false,
  compras_revisadas     boolean     not null default false,
  honorarios_revisados  boolean     not null default false,  -- NUEVO (faltaba en esquema original)
  banco_conciliado      boolean     not null default false,
  impuestos_calculados  boolean     not null default false,
  f29_preparado         boolean     not null default false,  -- NUEVO (faltaba en esquema original)
  reporte_generado      boolean     not null default false,
  -- Estado
  cerrado               boolean     not null default false,
  cerrado_por           uuid        references public.usuarios(id) on delete set null,
  cerrado_at            timestamptz,
  -- Snapshot financiero al cierre
  snapshot_ingresos     numeric(18,2),
  snapshot_gastos       numeric(18,2),
  snapshot_resultado    numeric(18,2),
  snapshot_iva_pagar    numeric(18,2),
  notas_cierre          text,
  created_at            timestamptz not null default now(),
  updated_at            timestamptz not null default now(),
  constraint uq_cierre_empresa_periodo unique (empresa_id, periodo)
);

comment on column public.cierres_mensuales.cerrado is
  'True bloquea edición de ingresos/gastos del periodo. Cambios posteriores requieren ajuste con trazabilidad.';
comment on column public.cierres_mensuales.snapshot_ingresos is
  'Totales al momento del cierre para referencia histórica inmutable.';

-- ============================================================
-- 12. WORKFLOW LOGS (trazabilidad n8n)
-- ============================================================
create table if not exists public.workflow_logs (
  id               uuid        primary key default gen_random_uuid(),
  empresa_id       uuid        references public.empresas(id) on delete set null,
  workflow_name    text        not null,
  execution_id     text,       -- ID de ejecución en n8n
  status           text        not null check (status in ('success', 'error', 'warning', 'running')),
  -- Contexto de la ejecución
  trigger_type     text,       -- 'webhook', 'schedule', 'manual'
  periodo          text,       -- Si el workflow opera sobre un periodo
  -- Detalles del error
  error_message    text,
  error_node       text,       -- Nodo n8n donde ocurrió el error
  -- Payload completo para debugging
  payload          jsonb,
  result           jsonb,      -- Resultado de la ejecución
  -- Tiempos
  started_at       timestamptz not null default now(),
  finished_at      timestamptz,
  duration_ms      integer,    -- Duración calculada
  created_at       timestamptz not null default now()
);

comment on table public.workflow_logs is
  'Registro de ejecuciones n8n. Crítico para auditoría y debugging. Nunca borrar registros.';
comment on column public.workflow_logs.error_node is
  'Nombre del nodo n8n donde falló la ejecución. Facilita debugging rápido.';

-- ============================================================
-- ÍNDICES DE RENDIMIENTO
-- ============================================================

-- Empresas
create index if not exists idx_empresas_rut on public.empresas(rut);

-- Usuarios
create index if not exists idx_usuarios_empresa_id    on public.usuarios(empresa_id);
create index if not exists idx_usuarios_auth_user_id  on public.usuarios(auth_user_id);
create index if not exists idx_usuarios_email         on public.usuarios(email);

-- Categorías
create index if not exists idx_categorias_empresa_id on public.categorias_contables(empresa_id);
create index if not exists idx_categorias_tipo       on public.categorias_contables(empresa_id, tipo);

-- Proyectos
create index if not exists idx_proyectos_empresa_id on public.proyectos(empresa_id);

-- Ingresos
create index if not exists idx_ingresos_empresa_periodo
  on public.ingresos(empresa_id, periodo);
create index if not exists idx_ingresos_empresa_fecha
  on public.ingresos(empresa_id, fecha_emision desc);
create index if not exists idx_ingresos_estado_cobro
  on public.ingresos(empresa_id, estado_cobro);
create index if not exists idx_ingresos_rut_cliente
  on public.ingresos(empresa_id, rut_cliente);
create index if not exists idx_ingresos_proyecto_id
  on public.ingresos(proyecto_id);

-- Gastos
create index if not exists idx_gastos_empresa_periodo
  on public.gastos(empresa_id, periodo);
create index if not exists idx_gastos_empresa_fecha
  on public.gastos(empresa_id, fecha_documento desc);
create index if not exists idx_gastos_categoria_id
  on public.gastos(categoria_id);
create index if not exists idx_gastos_estado_pago
  on public.gastos(empresa_id, estado_pago);
create index if not exists idx_gastos_sin_respaldo
  on public.gastos(empresa_id, tiene_respaldo) where tiene_respaldo = false;
create index if not exists idx_gastos_proyecto_id
  on public.gastos(proyecto_id);

-- Libros mensuales
create index if not exists idx_libros_empresa_periodo
  on public.libros_mensuales(empresa_id, periodo);

-- Impuestos mensuales
create index if not exists idx_impuestos_empresa_periodo
  on public.impuestos_mensuales(empresa_id, periodo);

-- Flujo de caja
create index if not exists idx_flujo_caja_empresa_periodo
  on public.flujo_caja(empresa_id, periodo);

-- Alertas
create index if not exists idx_alertas_empresa_periodo
  on public.alertas(empresa_id, periodo);
create index if not exists idx_alertas_estado
  on public.alertas(empresa_id, estado) where estado = 'pendiente';
create index if not exists idx_alertas_severidad
  on public.alertas(empresa_id, severidad);

-- Cierres mensuales
create index if not exists idx_cierres_empresa_periodo
  on public.cierres_mensuales(empresa_id, periodo);

-- Workflow logs
create index if not exists idx_workflow_logs_empresa
  on public.workflow_logs(empresa_id);
create index if not exists idx_workflow_logs_created_at
  on public.workflow_logs(created_at desc);
create index if not exists idx_workflow_logs_status
  on public.workflow_logs(status) where status = 'error';
create index if not exists idx_workflow_logs_workflow_name
  on public.workflow_logs(workflow_name);

-- ============================================================
-- TRIGGER: updated_at automático
-- ============================================================
create or replace function public.set_updated_at()
returns trigger language plpgsql as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

create or replace trigger trg_empresas_updated_at
  before update on public.empresas
  for each row execute function public.set_updated_at();

create or replace trigger trg_usuarios_updated_at
  before update on public.usuarios
  for each row execute function public.set_updated_at();

create or replace trigger trg_categorias_updated_at
  before update on public.categorias_contables
  for each row execute function public.set_updated_at();

create or replace trigger trg_proyectos_updated_at
  before update on public.proyectos
  for each row execute function public.set_updated_at();

create or replace trigger trg_ingresos_updated_at
  before update on public.ingresos
  for each row execute function public.set_updated_at();

create or replace trigger trg_gastos_updated_at
  before update on public.gastos
  for each row execute function public.set_updated_at();

create or replace trigger trg_libros_updated_at
  before update on public.libros_mensuales
  for each row execute function public.set_updated_at();

create or replace trigger trg_impuestos_updated_at
  before update on public.impuestos_mensuales
  for each row execute function public.set_updated_at();

create or replace trigger trg_flujo_caja_updated_at
  before update on public.flujo_caja
  for each row execute function public.set_updated_at();

create or replace trigger trg_alertas_updated_at
  before update on public.alertas
  for each row execute function public.set_updated_at();

create or replace trigger trg_cierres_updated_at
  before update on public.cierres_mensuales
  for each row execute function public.set_updated_at();

create or replace trigger trg_honorarios_updated_at
  before update on public.honorarios
  for each row execute function public.set_updated_at();

create or replace trigger trg_transferencias_updated_at
  before update on public.transferencias_bancarias
  for each row execute function public.set_updated_at();

-- ============================================================
-- ROW LEVEL SECURITY (RLS)
-- Habilita aislamiento de datos entre empresas.
-- Activar en Supabase Dashboard > Authentication > Policies.
-- IMPORTANTE: Los webhooks de n8n usan service_role key,
--   que bypasa RLS. Solo el frontend usa anon/user key.
-- ============================================================

-- Función auxiliar: obtiene empresa_id del usuario autenticado
create or replace function public.mi_empresa_id()
returns uuid language sql stable security definer as $$
  select empresa_id from public.usuarios
  where auth_user_id = auth.uid()
  limit 1;
$$;

comment on function public.mi_empresa_id is
  'Retorna el empresa_id del usuario autenticado. Usada en políticas RLS.';

-- Habilitar RLS en todas las tablas operacionales
alter table public.ingresos              enable row level security;
alter table public.gastos                enable row level security;
alter table public.honorarios            enable row level security;
alter table public.transferencias_bancarias enable row level security;
alter table public.proyectos             enable row level security;
alter table public.categorias_contables  enable row level security;
alter table public.libros_mensuales      enable row level security;
alter table public.impuestos_mensuales   enable row level security;
alter table public.flujo_caja            enable row level security;
alter table public.alertas               enable row level security;
alter table public.cierres_mensuales     enable row level security;
alter table public.workflow_logs         enable row level security;

-- Políticas: cada usuario ve solo los datos de su empresa
-- (crear una por tabla; patrón idéntico para todas)

create policy rls_ingresos_empresa on public.ingresos
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_gastos_empresa on public.gastos
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_honorarios_empresa on public.honorarios
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_transferencias_empresa on public.transferencias_bancarias
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_proyectos_empresa on public.proyectos
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_categorias_empresa on public.categorias_contables
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_libros_empresa on public.libros_mensuales
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_impuestos_empresa on public.impuestos_mensuales
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_flujo_caja_empresa on public.flujo_caja
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_alertas_empresa on public.alertas
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_cierres_empresa on public.cierres_mensuales
  for all using (empresa_id = public.mi_empresa_id());

create policy rls_workflow_logs_empresa on public.workflow_logs
  for all using (empresa_id = public.mi_empresa_id());

-- Las tablas empresas y usuarios NO tienen RLS aquí;
-- el acceso se controla a nivel de aplicación y Supabase Auth.
-- (Un usuario solo ve su empresa vía la función mi_empresa_id).

-- ============================================================
-- FIN DEL ESQUEMA — v1.2
-- ============================================================