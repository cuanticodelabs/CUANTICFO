// =====================================================
// API ROUTE — /api/finance/gastos
// Proxy seguro: Next.js → n8n webhook (create-expense)
// =====================================================

import { NextRequest, NextResponse } from 'next/server';
import { n8nFetch, N8nError } from '@/lib/api/n8n-client';

// Empresa hardcodeada mientras no hay auth.
// TODO: extraer de la sesión del usuario autenticado.
const EMPRESA_ID = '11111111-1111-1111-1111-111111111111';

/**
 * Payload que espera el webhook /create-expense de n8n
 * (según Contratos_integracion.txt - Flujo 2)
 */
interface CreateExpensePayload {
  empresa_id: string;
  fecha_documento: string;
  periodo: string;
  proveedor: string;
  rut_proveedor: string;
  folio: string;
  tipo_documento: string;
  categoria_id?: string;
  neto: number;
  iva: number;
  exento?: number;
  total: number;
  usa_credito_fiscal: boolean;
  estado_pago: string;
  tiene_respaldo?: boolean;
  proyecto_id?: string | null;
  archivo_url?: string;
}

/**
 * Respuesta del webhook create-expense de n8n
 */
interface CreateExpenseResponse {
  ok: boolean;
  gasto_id: string;
  message: string;
  alertas: Array<{ tipo: string; descripcion: string }>;
}

/**
 * POST /api/finance/gastos
 * Crea un nuevo gasto a través de n8n
 */
export async function POST(request: NextRequest) {
  try {
    const body = await request.json();

    // Validaciones básicas en el proxy antes de llamar a n8n
    const requiredFields = ['fecha_documento', 'proveedor', 'tipo_documento', 'total'] as const;
    for (const field of requiredFields) {
      if (!body[field] && body[field] !== 0) {
        return NextResponse.json(
          {
            ok: false,
            error: 'CAMPO_FALTANTE',
            message: `El campo "${field}" es obligatorio`,
            campo: field,
          },
          { status: 400 }
        );
      }
    }

    // Derivar periodo del fecha_documento si no viene
    const periodo = body.periodo || body.fecha_documento?.substring(0, 7);

    // Construir payload para n8n (inyectar empresa_id server-side)
    const payload: CreateExpensePayload = {
      empresa_id: EMPRESA_ID,
      fecha_documento: body.fecha_documento,
      periodo,
      proveedor: body.proveedor,
      rut_proveedor: body.rut_proveedor || '',
      folio: body.folio || '',
      tipo_documento: body.tipo_documento,
      categoria_id: body.categoria_id || undefined,
      neto: Number(body.neto) || 0,
      iva: Number(body.iva) || 0,
      exento: Number(body.exento) || 0,
      total: Number(body.total),
      usa_credito_fiscal: Boolean(body.usa_credito_fiscal),
      estado_pago: body.estado_pago || 'pendiente',
      tiene_respaldo: body.tiene_respaldo ?? true,
      proyecto_id: body.proyecto_id || null,
      archivo_url: body.archivo_url || undefined,
    };

    // Llamar a n8n
    const data = await n8nFetch<CreateExpenseResponse>({
      path: '/create-expense',
      body: payload,
    });

    return NextResponse.json(data, { status: 200 });
  } catch (err) {
    console.error('[API /finance/gastos] Error:', err);

    if (err instanceof N8nError) {
      return NextResponse.json(
        {
          ok: false,
          error: err.code || 'N8N_ERROR',
          message: err.message,
          campo: err.campo,
        },
        { status: err.status >= 400 && err.status < 600 ? err.status : 500 }
      );
    }

    return NextResponse.json(
      {
        ok: false,
        error: 'INTERNAL_ERROR',
        message: 'Error interno del servidor. Intenta nuevamente.',
      },
      { status: 500 }
    );
  }
}

/**
 * GET /api/finance/gastos
 * Listar gastos del período — TODO: conectar con webhook de lectura
 * Por ahora retorna 501 indicando que aún no está implementado
 */
export async function GET() {
  return NextResponse.json(
    {
      ok: false,
      error: 'NOT_IMPLEMENTED',
      message: 'GET /api/finance/gastos aún no está conectado a n8n.',
    },
    { status: 501 }
  );
}
