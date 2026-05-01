// =====================================================
// N8N CLIENT — CuantiCFO
// Proxy helper para llamadas server-side a n8n webhooks.
// Solo se usa dentro de Route Handlers (/api/...).
// Inyecta el header de autenticación X-CFO-Secret.
// =====================================================

const N8N_BASE_URL = process.env.N8N_BASE_URL;
const N8N_AUTH_SECRET = process.env.N8N_AUTH_SECRET;

/**
 * Respuesta estándar de n8n (todos los workflows usan este formato)
 */
export interface N8nResponse<T = Record<string, unknown>> {
  ok: boolean;
  message?: string;
  error?: string;
  campo?: string;
  [key: string]: unknown;
  // El payload específico se tipea con genéricos en cada llamada
}

/**
 * Error lanzado cuando n8n responde con ok: false o HTTP >= 400
 */
export class N8nError extends Error {
  public status: number;
  public code?: string;
  public campo?: string;

  constructor(message: string, status: number, code?: string, campo?: string) {
    super(message);
    this.name = 'N8nError';
    this.status = status;
    this.code = code;
    this.campo = campo;
  }
}

/**
 * Valida que las variables de entorno estén configuradas.
 * Se ejecuta en cada llamada para dar errores claros durante el desarrollo.
 */
function assertEnvVars(): void {
  if (!N8N_BASE_URL) {
    throw new Error(
      '[n8n-client] N8N_BASE_URL no está configurado en .env.local'
    );
  }
  if (!N8N_AUTH_SECRET) {
    throw new Error(
      '[n8n-client] N8N_AUTH_SECRET no está configurado en .env.local'
    );
  }
}

interface N8nRequestOptions {
  /** Ruta relativa al base URL de n8n (ej: "/create-expense") */
  path: string;
  /** HTTP method — por defecto POST */
  method?: 'POST' | 'GET' | 'PUT' | 'DELETE' | 'PATCH';
  /** Body de la petición (se serializa a JSON automáticamente) */
  body?: unknown;
  /** Timeout en milisegundos — por defecto 30s */
  timeoutMs?: number;
}

/**
 * Realiza una petición autenticada a n8n.
 *
 * @example
 * ```ts
 * const data = await n8nFetch<{ gasto_id: string }>({
 *   path: '/create-expense',
 *   body: { empresa_id, proveedor, total, ... }
 * });
 * ```
 */
export async function n8nFetch<T = Record<string, unknown>>(
  options: N8nRequestOptions
): Promise<T & { ok: boolean; message?: string }> {
  assertEnvVars();

  const { path, method = 'POST', body, timeoutMs = 30_000 } = options;
  const url = `${N8N_BASE_URL}${path}`;

  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);

  try {
    const response = await fetch(url, {
      method,
      headers: {
        'Content-Type': 'application/json',
        'X-CFO-Secret': N8N_AUTH_SECRET!,
      },
      body: body ? JSON.stringify(body) : undefined,
      signal: controller.signal,
    });

    clearTimeout(timeout);

    // Intentar parsear JSON siempre
    let data: T & { ok: boolean; message?: string; error?: string; campo?: string };
    try {
      data = await response.json();
    } catch {
      throw new N8nError(
        `n8n respondió con status ${response.status} pero sin JSON válido`,
        response.status
      );
    }

    // Si n8n devuelve ok: false o HTTP error, lanzar N8nError
    if (!response.ok || data.ok === false) {
      throw new N8nError(
        data.message || data.error || `Error de n8n (HTTP ${response.status})`,
        response.status,
        data.error,
        data.campo
      );
    }

    return data;
  } catch (err) {
    clearTimeout(timeout);

    // Re-lanzar N8nError tal cual
    if (err instanceof N8nError) throw err;

    // Timeout
    if (err instanceof DOMException && err.name === 'AbortError') {
      throw new N8nError(
        `Timeout: n8n no respondió en ${timeoutMs / 1000}s`,
        504
      );
    }

    // Error de red / DNS / etc
    throw new N8nError(
      `No se pudo conectar con n8n: ${(err as Error).message}`,
      502
    );
  }
}
