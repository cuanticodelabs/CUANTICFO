const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb://admin:WA9qG7%3F%29%23%40um3-%23@localhost:27018/cuanticfo_db?authSource=admin');
  try {
    await client.connect();
    console.log('Connected');
    const db = client.db('cuanticfo_db');
    const existingCols = await db.listCollections().toArray();
    const existingColNames = existingCols.map(c => c.name);
    
    async function createCollectionIfNotExists(name, validator) {
      if (!existingColNames.includes(name)) {
        await db.createCollection(name, { validator, validationLevel: 'moderate', validationAction: 'error' });
        console.log('Coleccion creada: ' + name);
        existingColNames.push(name);
      } else {
        await db.command({ collMod: name, validator, validationLevel: 'moderate', validationAction: 'error' });
        console.log('Validador actualizado: ' + name);
      }
    }
    
    const print = console.log;
    const periodoRegex = "^\\d{4}-\\d{2}$";
    
    // 1. EMPRESAS
// ============================================================

await createCollectionIfNotExists("empresas", {
    $jsonSchema: {
        bsonType: "object",
        required: ["_id", "razon_social", "rut", "tasa_ppm", "activa", "created_at", "updated_at"],
        properties: {
            _id: { bsonType: "string" },
            razon_social: { bsonType: "string" },
            rut: { bsonType: "string" },
            giro: { bsonType: ["string", "null"] },
            regimen_tributario: {
                enum: [
                    "primera_categoria",
                    "regimen_pro_pyme",
                    "regimen_pro_pyme_transparente",
                    "sin_inicio_actividades",
                    null
                ]
            },
            tasa_ppm: { bsonType: "decimal" },
            email_contador: { bsonType: ["string", "null"] },
            banco_principal: { bsonType: ["string", "null"] },
            fecha_inicio_actividades: { bsonType: ["date", "null"] },
            activa: { bsonType: "bool" },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('empresas').createIndex({ rut: 1 }, { unique: true });
await db.collection('empresas').createIndex({ activa: 1 });

// ============================================================
// 2. USUARIOS
// ============================================================

await createCollectionIfNotExists("usuarios", {
    $jsonSchema: {
        bsonType: "object",
        required: ["_id", "empresa_id", "nombre", "email", "rol", "activo", "created_at", "updated_at"],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            auth_user_id: { bsonType: ["string", "null"] },
            nombre: { bsonType: "string" },
            email: { bsonType: "string" },
            rol: {
                enum: ["admin", "cfo", "contador", "socio_lectura"]
            },
            activo: { bsonType: "bool" },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('usuarios').createIndex({ empresa_id: 1 });
await db.collection('usuarios').createIndex({ email: 1 }, { unique: true });
await db.collection('usuarios').createIndex(
    { auth_user_id: 1 },
    {
        unique: true,
        partialFilterExpression: { auth_user_id: { $type: "string" } }
    }
);

// ============================================================
// 3. CATEGORÍAS CONTABLES
// ============================================================

await createCollectionIfNotExists("categorias_contables", {
    $jsonSchema: {
        bsonType: "object",
        required: ["_id", "empresa_id", "nombre", "tipo", "afecta_resultado", "afecta_iva", "activa", "created_at"],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            nombre: { bsonType: "string" },
            tipo: {
                enum: [
                    "ingreso",
                    "costo_directo",
                    "gasto_administrativo",
                    "gasto_comercial",
                    "gasto_tecnologico",
                    "gasto_financiero",
                    "otro_ingreso",
                    "otro_egreso"
                ]
            },
            cuenta_contable: { bsonType: ["string", "null"] },
            afecta_resultado: { bsonType: "bool" },
            afecta_iva: { bsonType: "bool" },
            activa: { bsonType: "bool" },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: ["date", "null"] }
        }
    }
});

await db.collection('categorias_contables').createIndex({ empresa_id: 1 });
await db.collection('categorias_contables').createIndex({ empresa_id: 1, tipo: 1 });
await db.collection('categorias_contables').createIndex({ empresa_id: 1, nombre: 1 }, { unique: true });

// ============================================================
// 4. PROYECTOS
// ============================================================

await createCollectionIfNotExists("proyectos", {
    $jsonSchema: {
        bsonType: "object",
        required: ["_id", "empresa_id", "nombre", "estado", "created_at", "updated_at"],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            nombre: { bsonType: "string" },
            codigo: { bsonType: ["string", "null"] },
            descripcion: { bsonType: ["string", "null"] },
            cliente: { bsonType: ["string", "null"] },
            estado: { enum: ["activo", "cerrado", "pausado"] },
            fecha_inicio: { bsonType: ["date", "null"] },
            fecha_fin: { bsonType: ["date", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('proyectos').createIndex({ empresa_id: 1 });
await db.collection('proyectos').createIndex({ empresa_id: 1, nombre: 1 }, { unique: true });
await db.collection('proyectos').createIndex({ empresa_id: 1, estado: 1 });

// ============================================================
// 5. INGRESOS
// ============================================================

await createCollectionIfNotExists("ingresos", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "fecha_emision",
            "periodo",
            "cliente",
            "tipo_documento",
            "neto",
            "iva",
            "exento",
            "total",
            "estado_cobro",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            fecha_emision: { bsonType: "date" },
            fecha_pago: { bsonType: ["date", "null"] },
            periodo: { bsonType: "string", pattern: periodoRegex },
            cliente: { bsonType: "string" },
            rut_cliente: { bsonType: ["string", "null"] },
            folio: { bsonType: ["string", "null"] },
            tipo_documento: {
                enum: [
                    "factura_afecta",
                    "factura_exenta",
                    "boleta",
                    "nota_debito",
                    "nota_credito",
                    "boleta_honorarios",
                    "liquidacion",
                    "otro"
                ]
            },
            neto: { bsonType: "decimal" },
            iva: { bsonType: "decimal" },
            exento: { bsonType: "decimal" },
            total: { bsonType: "decimal" },
            categoria_id: { bsonType: ["string", "null"] },
            estado_cobro: { enum: ["pendiente", "cobrado", "vencido", "anulado"] },
            proyecto_id: { bsonType: ["string", "null"] },
            archivo_url: { bsonType: ["string", "null"] },
            creado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('ingresos').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('ingresos').createIndex({ empresa_id: 1, fecha_emision: -1 });
await db.collection('ingresos').createIndex({ empresa_id: 1, estado_cobro: 1 });
await db.collection('ingresos').createIndex({ empresa_id: 1, rut_cliente: 1 });
await db.collection('ingresos').createIndex({ proyecto_id: 1 });

await db.collection('ingresos').createIndex(
    { empresa_id: 1, folio: 1, rut_cliente: 1, tipo_documento: 1 },
    {
        unique: true,
        partialFilterExpression: {
            folio: { $type: "string" },
            rut_cliente: { $type: "string" }
        }
    }
);

// ============================================================
// 6. GASTOS
// ============================================================

await createCollectionIfNotExists("gastos", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "fecha_documento",
            "periodo",
            "proveedor",
            "tipo_documento",
            "neto",
            "iva",
            "exento",
            "total",
            "usa_credito_fiscal",
            "estado_pago",
            "tiene_respaldo",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            fecha_documento: { bsonType: "date" },
            fecha_pago: { bsonType: ["date", "null"] },
            periodo: { bsonType: "string", pattern: periodoRegex },
            proveedor: { bsonType: "string" },
            rut_proveedor: { bsonType: ["string", "null"] },
            folio: { bsonType: ["string", "null"] },
            tipo_documento: {
                enum: [
                    "factura_afecta",
                    "factura_exenta",
                    "boleta",
                    "nota_debito",
                    "nota_credito",
                    "boleta_honorarios",
                    "factura_extranjera",
                    "gasto_sin_documento",
                    "otro"
                ]
            },
            categoria_id: { bsonType: ["string", "null"] },
            neto: { bsonType: "decimal" },
            iva: { bsonType: "decimal" },
            exento: { bsonType: "decimal" },
            total: { bsonType: "decimal" },
            usa_credito_fiscal: { bsonType: "bool" },
            estado_pago: { enum: ["pendiente", "pagado", "vencido", "anulado"] },
            tiene_respaldo: { bsonType: "bool" },
            proyecto_id: { bsonType: ["string", "null"] },
            archivo_url: { bsonType: ["string", "null"] },
            creado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('gastos').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('gastos').createIndex({ empresa_id: 1, fecha_documento: -1 });
await db.collection('gastos').createIndex({ categoria_id: 1 });
await db.collection('gastos').createIndex({ empresa_id: 1, estado_pago: 1 });
await db.collection('gastos').createIndex({ proyecto_id: 1 });

await db.collection('gastos').createIndex(
    { empresa_id: 1, tiene_respaldo: 1 },
    { partialFilterExpression: { tiene_respaldo: false } }
);

await db.collection('gastos').createIndex(
    { empresa_id: 1, folio: 1, rut_proveedor: 1, tipo_documento: 1 },
    {
        unique: true,
        partialFilterExpression: {
            folio: { $type: "string" },
            rut_proveedor: { $type: "string" }
        }
    }
);

// ============================================================
// 7. HONORARIOS
// ============================================================

await createCollectionIfNotExists("honorarios", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "fecha_emision",
            "periodo",
            "prestador",
            "rut_prestador",
            "monto_bruto",
            "retencion",
            "monto_neto",
            "estado_pago",
            "retencion_declarada",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            fecha_emision: { bsonType: "date" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            prestador: { bsonType: "string" },
            rut_prestador: { bsonType: "string" },
            folio: { bsonType: ["string", "null"] },
            monto_bruto: { bsonType: "decimal" },
            retencion: { bsonType: "decimal" },
            monto_neto: { bsonType: "decimal" },
            estado_pago: { enum: ["pendiente", "pagado", "anulado"] },
            retencion_declarada: { bsonType: "bool" },
            proyecto_id: { bsonType: ["string", "null"] },
            archivo_url: { bsonType: ["string", "null"] },
            creado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('honorarios').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('honorarios').createIndex({ empresa_id: 1, fecha_emision: -1 });
await db.collection('honorarios').createIndex({ empresa_id: 1, rut_prestador: 1 });
await db.collection('honorarios').createIndex({ proyecto_id: 1 });

// ============================================================
// 8. TRANSFERENCIAS BANCARIAS
// ============================================================

await createCollectionIfNotExists("transferencias_bancarias", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "fecha",
            "periodo",
            "tipo",
            "descripcion",
            "monto",
            "conciliado",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            fecha: { bsonType: "date" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            tipo: { enum: ["entrada", "salida", "traspaso_interno"] },
            descripcion: { bsonType: "string" },
            monto: { bsonType: "decimal" },
            cuenta_origen: { bsonType: ["string", "null"] },
            cuenta_destino: { bsonType: ["string", "null"] },
            ingreso_id: { bsonType: ["string", "null"] },
            gasto_id: { bsonType: ["string", "null"] },
            conciliado: { bsonType: "bool" },
            archivo_url: { bsonType: ["string", "null"] },
            creado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('transferencias_bancarias').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('transferencias_bancarias').createIndex({ empresa_id: 1, fecha: -1 });
await db.collection('transferencias_bancarias').createIndex(
    { empresa_id: 1, conciliado: 1 },
    { partialFilterExpression: { conciliado: false } }
);
await db.collection('transferencias_bancarias').createIndex({ ingreso_id: 1 });
await db.collection('transferencias_bancarias').createIndex({ gasto_id: 1 });

// ============================================================
// 9. LIBROS MENSUALES
// ============================================================

await createCollectionIfNotExists("libros_mensuales", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "periodo",
            "tipo",
            "total_neto",
            "total_iva",
            "total_exento",
            "total_general",
            "estado",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            tipo: {
                enum: [
                    "libro_compras",
                    "libro_ventas",
                    "libro_honorarios",
                    "libro_gastos_internos"
                ]
            },
            total_neto: { bsonType: "decimal" },
            total_iva: { bsonType: "decimal" },
            total_exento: { bsonType: "decimal" },
            total_general: { bsonType: "decimal" },
            estado: { enum: ["borrador", "generado", "revisado", "enviado"] },
            archivo_url: { bsonType: ["string", "null"] },
            generado_at: { bsonType: ["date", "null"] },
            generado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('libros_mensuales').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('libros_mensuales').createIndex({ empresa_id: 1, periodo: 1, tipo: 1 }, { unique: true });

// ============================================================
// 10. IMPUESTOS MENSUALES
// ============================================================

await createCollectionIfNotExists("impuestos_mensuales", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "periodo",
            "iva_debito",
            "iva_credito",
            "iva_a_pagar",
            "remanente_credito",
            "ppm_base",
            "ppm",
            "retenciones",
            "total_estimado",
            "estado",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            iva_debito: { bsonType: "decimal" },
            iva_credito: { bsonType: "decimal" },
            iva_a_pagar: { bsonType: "decimal" },
            remanente_credito: { bsonType: "decimal" },
            ppm_base: { bsonType: "decimal" },
            ppm: { bsonType: "decimal" },
            retenciones: { bsonType: "decimal" },
            total_estimado: { bsonType: "decimal" },
            estado: { enum: ["estimado", "revisado", "declarado", "pagado"] },
            observaciones: { bsonType: ["string", "null"] },
            comprobante_url: { bsonType: ["string", "null"] },
            calculado_at: { bsonType: ["date", "null"] },
            calculado_por: { bsonType: ["string", "null"] },
            declarado_at: { bsonType: ["date", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('impuestos_mensuales').createIndex({ empresa_id: 1, periodo: 1 }, { unique: true });

// ============================================================
// 11. FLUJO DE CAJA
// ============================================================

await createCollectionIfNotExists("flujo_caja", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "periodo",
            "saldo_inicial",
            "ingresos_reales",
            "egresos_reales",
            "saldo_final",
            "cuentas_por_cobrar",
            "cuentas_por_pagar",
            "saldo_proyectado_30d",
            "saldo_proyectado_60d",
            "saldo_proyectado_90d",
            "escenario",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            saldo_inicial: { bsonType: "decimal" },
            ingresos_reales: { bsonType: "decimal" },
            egresos_reales: { bsonType: "decimal" },
            saldo_final: { bsonType: "decimal" },
            cuentas_por_cobrar: { bsonType: "decimal" },
            cuentas_por_pagar: { bsonType: "decimal" },
            saldo_proyectado_30d: { bsonType: "decimal" },
            saldo_proyectado_60d: { bsonType: "decimal" },
            saldo_proyectado_90d: { bsonType: "decimal" },
            escenario: { enum: ["conservador", "base", "optimista"] },
            notas: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('flujo_caja').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('flujo_caja').createIndex({ empresa_id: 1, periodo: 1, escenario: 1 }, { unique: true });

// ============================================================
// 12. ALERTAS
// ============================================================

await createCollectionIfNotExists("alertas", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "tipo",
            "severidad",
            "descripcion",
            "estado",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: ["string", "null"], pattern: periodoRegex },
            tipo: {
                enum: [
                    "iva_supera_caja",
                    "factura_vencida",
                    "gasto_sin_respaldo",
                    "documento_duplicado",
                    "proveedor_nuevo",
                    "mes_sin_cierre",
                    "variacion_gasto",
                    "margen_bajo",
                    "datos_faltantes_f29",
                    "categoria_faltante",
                    "honorarios_pendiente",
                    "otro"
                ]
            },
            severidad: { enum: ["alta", "media", "baja"] },
            descripcion: { bsonType: "string" },
            accion_sugerida: { bsonType: ["string", "null"] },
            estado: { enum: ["pendiente", "vista", "resuelta", "ignorada"] },
            referencia_tabla: { bsonType: ["string", "null"] },
            referencia_id: { bsonType: ["string", "null"] },
            resuelta_por: { bsonType: ["string", "null"] },
            resuelta_at: { bsonType: ["date", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('alertas').createIndex({ empresa_id: 1, periodo: 1 });
await db.collection('alertas').createIndex(
    { empresa_id: 1, estado: 1 },
    { partialFilterExpression: { estado: "pendiente" } }
);
await db.collection('alertas').createIndex({ empresa_id: 1, severidad: 1 });
await db.collection('alertas').createIndex({ referencia_tabla: 1, referencia_id: 1 });

// ============================================================
// 13. CIERRES MENSUALES
// ============================================================

await createCollectionIfNotExists("cierres_mensuales", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "periodo",
            "ventas_revisadas",
            "compras_revisadas",
            "honorarios_revisados",
            "banco_conciliado",
            "impuestos_calculados",
            "f29_preparado",
            "reporte_generado",
            "cerrado",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            ventas_revisadas: { bsonType: "bool" },
            compras_revisadas: { bsonType: "bool" },
            honorarios_revisados: { bsonType: "bool" },
            banco_conciliado: { bsonType: "bool" },
            impuestos_calculados: { bsonType: "bool" },
            f29_preparado: { bsonType: "bool" },
            reporte_generado: { bsonType: "bool" },
            cerrado: { bsonType: "bool" },
            cerrado_por: { bsonType: ["string", "null"] },
            cerrado_at: { bsonType: ["date", "null"] },
            snapshot_ingresos: { bsonType: ["decimal", "null"] },
            snapshot_gastos: { bsonType: ["decimal", "null"] },
            snapshot_resultado: { bsonType: ["decimal", "null"] },
            snapshot_iva_pagar: { bsonType: ["decimal", "null"] },
            notas_cierre: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

await db.collection('cierres_mensuales').createIndex({ empresa_id: 1, periodo: 1 }, { unique: true });

// ============================================================
// 14. WORKFLOW LOGS
// ============================================================

await createCollectionIfNotExists("workflow_logs", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "workflow_name",
            "status",
            "started_at",
            "created_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: ["string", "null"] },
            workflow_name: { bsonType: "string" },
            execution_id: { bsonType: ["string", "null"] },
            status: { enum: ["success", "error", "warning", "running"] },
            trigger_type: { bsonType: ["string", "null"] },
            periodo: { bsonType: ["string", "null"] },
            error_message: { bsonType: ["string", "null"] },
            error_node: { bsonType: ["string", "null"] },
            payload: { bsonType: ["object", "array", "null"] },
            result: { bsonType: ["object", "array", "null"] },
            started_at: { bsonType: "date" },
            finished_at: { bsonType: ["date", "null"] },
            duration_ms: { bsonType: ["int", "long", "null"] },
            created_at: { bsonType: "date" }
        }
    }
});

await db.collection('workflow_logs').createIndex({ empresa_id: 1 });
await db.collection('workflow_logs').createIndex({ created_at: -1 });
await db.collection('workflow_logs').createIndex(
    { status: 1 },
    { partialFilterExpression: { status: "error" } }
);
await db.collection('workflow_logs').createIndex({ workflow_name: 1 });
await db.collection('workflow_logs').createIndex({ execution_id: 1 });

print("Esquema CuantiCFO MongoDB creado correctamente.");
    
    console.log("Migration completed successfully.");
    
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();