-- Migración de esquema CuantiCFO v1.1 a v1.2
-- Ejecutar este archivo en el SQL Editor de Supabase si ya tenías la versión anterior cargada.

-- ============================================================
-- 1. Crear tabla honorarios
-- ============================================================
create table if not exists public.honorarios (
  id                uuid          primary key default gen_random_uuid(),
  empresa_id        uuid          not null references public.empresas(id) on delete cascade,
  fecha_emision     date          not null,
  periodo           text          not null check (periodo ~ '^\d{4}-\d{2}$'),  -- 'YYYY-MM'
  prestador         text          not null,
  rut_prestador     text          not null,
  folio             text,
  monto_bruto       numeric(18,2) not null default 0,
  retencion         numeric(18,2) not null default 0,
  monto_neto        numeric(18,2) not null default 0,
  estado_pago       text          not null default 'pendiente' check (estado_pago in ('pendiente', 'pagado', 'anulado')),
  retencion_declarada boolean     not null default false,
  proyecto_id       uuid          references public.proyectos(id) on delete set null,
  archivo_url       text,
  creado_por        uuid          references public.usuarios(id) on delete set null,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now(),
  constraint chk_honorario_bruto_positivo   check (monto_bruto >= 0),
  constraint chk_honorario_retencion_valida check (retencion >= 0 and retencion <= monto_bruto),
  constraint chk_honorario_neto_positivo    check (monto_neto >= 0)
);

create index if not exists idx_honorarios_empresa_periodo on public.honorarios(empresa_id, periodo);
create index if not exists idx_honorarios_empresa_fecha on public.honorarios(empresa_id, fecha_emision desc);
create index if not exists idx_honorarios_rut_prestador on public.honorarios(empresa_id, rut_prestador);
create index if not exists idx_honorarios_proyecto_id on public.honorarios(proyecto_id);

create or replace trigger trg_honorarios_updated_at
  before update on public.honorarios
  for each row execute function public.set_updated_at();

-- ============================================================
-- 2. Crear tabla transferencias_bancarias
-- ============================================================
create table if not exists public.transferencias_bancarias (
  id                uuid          primary key default gen_random_uuid(),
  empresa_id        uuid          not null references public.empresas(id) on delete cascade,
  fecha             date          not null,
  periodo           text          not null check (periodo ~ '^\d{4}-\d{2}$'),
  tipo              text          not null check (tipo in ('entrada', 'salida', 'traspaso_interno')),
  descripcion       text          not null,
  monto             numeric(18,2) not null,
  cuenta_origen     text,
  cuenta_destino    text,
  ingreso_id        uuid          references public.ingresos(id) on delete set null,
  gasto_id          uuid          references public.gastos(id) on delete set null,
  conciliado        boolean       not null default false,
  archivo_url       text,
  creado_por        uuid          references public.usuarios(id) on delete set null,
  created_at        timestamptz   not null default now(),
  updated_at        timestamptz   not null default now(),
  constraint chk_transferencia_monto_positivo check (monto > 0)
);

create index if not exists idx_transferencias_empresa_periodo on public.transferencias_bancarias(empresa_id, periodo);
create index if not exists idx_transferencias_empresa_fecha on public.transferencias_bancarias(empresa_id, fecha desc);
create index if not exists idx_transferencias_no_conciliadas on public.transferencias_bancarias(empresa_id, conciliado) where conciliado = false;

create or replace trigger trg_transferencias_updated_at
  before update on public.transferencias_bancarias
  for each row execute function public.set_updated_at();

-- ============================================================
-- 3. Constraints YYYY-MM en ingresos y gastos
-- ============================================================
do $$ 
begin
  if not exists (select constraint_name from information_schema.constraint_column_usage where table_name = 'ingresos' and constraint_name = 'chk_ingreso_periodo') then
    alter table public.ingresos add constraint chk_ingreso_periodo check (periodo ~ '^\d{4}-\d{2}$');
  end if;
  
  if not exists (select constraint_name from information_schema.constraint_column_usage where table_name = 'gastos' and constraint_name = 'chk_gasto_periodo') then
    alter table public.gastos add constraint chk_gasto_periodo check (periodo ~ '^\d{4}-\d{2}$');
  end if;
end $$;

-- ============================================================
-- 4. Row Level Security (RLS)
-- ============================================================
create or replace function public.mi_empresa_id()
returns uuid language sql stable security definer as $$
  select empresa_id from public.usuarios
  where auth_user_id = auth.uid()
  limit 1;
$$;

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

-- (Re)crear políticas
drop policy if exists rls_ingresos_empresa on public.ingresos;
create policy rls_ingresos_empresa on public.ingresos for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_gastos_empresa on public.gastos;
create policy rls_gastos_empresa on public.gastos for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_honorarios_empresa on public.honorarios;
create policy rls_honorarios_empresa on public.honorarios for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_transferencias_empresa on public.transferencias_bancarias;
create policy rls_transferencias_empresa on public.transferencias_bancarias for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_proyectos_empresa on public.proyectos;
create policy rls_proyectos_empresa on public.proyectos for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_categorias_empresa on public.categorias_contables;
create policy rls_categorias_empresa on public.categorias_contables for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_libros_empresa on public.libros_mensuales;
create policy rls_libros_empresa on public.libros_mensuales for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_impuestos_empresa on public.impuestos_mensuales;
create policy rls_impuestos_empresa on public.impuestos_mensuales for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_flujo_caja_empresa on public.flujo_caja;
create policy rls_flujo_caja_empresa on public.flujo_caja for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_alertas_empresa on public.alertas;
create policy rls_alertas_empresa on public.alertas for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_cierres_empresa on public.cierres_mensuales;
create policy rls_cierres_empresa on public.cierres_mensuales for all using (empresa_id = public.mi_empresa_id());

drop policy if exists rls_workflow_logs_empresa on public.workflow_logs;
create policy rls_workflow_logs_empresa on public.workflow_logs for all using (empresa_id = public.mi_empresa_id());
