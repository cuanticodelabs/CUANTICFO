use cuanticfo;

// ============================================================
// Helpers
// ============================================================

const periodoRegex = "^\\d{4}-\\d{2}$";

function createCollectionIfNotExists(name, validator) {
    const exists = db.getCollectionNames().includes(name);

    if (!exists) {
        db.createCollection(name, {
            validator,
            validationLevel: "moderate",
            validationAction: "error"
        });
        print(`Colección creada: ${name}`);
    } else {
        db.runCommand({
            collMod: name,
            validator,
            validationLevel: "moderate",
            validationAction: "error"
        });
        print(`Validador actualizado: ${name}`);
    }
}

// ============================================================
// 1. EMPRESAS
// ============================================================

createCollectionIfNotExists("empresas", {
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

db.empresas.createIndex({ rut: 1 }, { unique: true });
db.empresas.createIndex({ activa: 1 });

// ============================================================
// 2. USUARIOS
// ============================================================

createCollectionIfNotExists("usuarios", {
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

db.usuarios.createIndex({ empresa_id: 1 });
db.usuarios.createIndex({ email: 1 }, { unique: true });
db.usuarios.createIndex(
    { auth_user_id: 1 },
    {
        unique: true,
        partialFilterExpression: { auth_user_id: { $type: "string" } }
    }
);

// ============================================================
// 3. CATEGORÍAS CONTABLES
// ============================================================

createCollectionIfNotExists("categorias_contables", {
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

db.categorias_contables.createIndex({ empresa_id: 1 });
db.categorias_contables.createIndex({ empresa_id: 1, tipo: 1 });
db.categorias_contables.createIndex({ empresa_id: 1, nombre: 1 }, { unique: true });

// ============================================================
// 4. PROYECTOS
// ============================================================

createCollectionIfNotExists("proyectos", {
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

db.proyectos.createIndex({ empresa_id: 1 });
db.proyectos.createIndex({ empresa_id: 1, nombre: 1 }, { unique: true });
db.proyectos.createIndex({ empresa_id: 1, estado: 1 });

// ============================================================
// 5. INGRESOS
// ============================================================

createCollectionIfNotExists("ingresos", {
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
            neto: { bsonType: ["int", "long", "double", "decimal"] },
            iva: { bsonType: ["int", "long", "double", "decimal"] },
            exento: { bsonType: ["int", "long", "double", "decimal"] },
            total: { bsonType: ["int", "long", "double", "decimal"] },
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

db.ingresos.createIndex({ empresa_id: 1, periodo: 1 });
db.ingresos.createIndex({ empresa_id: 1, fecha_emision: -1 });
db.ingresos.createIndex({ empresa_id: 1, estado_cobro: 1 });
db.ingresos.createIndex({ empresa_id: 1, rut_cliente: 1 });
db.ingresos.createIndex({ proyecto_id: 1 });

db.ingresos.createIndex(
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

createCollectionIfNotExists("gastos", {
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
            neto: { bsonType: ["int", "long", "double", "decimal"] },
            iva: { bsonType: ["int", "long", "double", "decimal"] },
            exento: { bsonType: ["int", "long", "double", "decimal"] },
            total: { bsonType: ["int", "long", "double", "decimal"] },
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

db.gastos.createIndex({ empresa_id: 1, periodo: 1 });
db.gastos.createIndex({ empresa_id: 1, fecha_documento: -1 });
db.gastos.createIndex({ categoria_id: 1 });
db.gastos.createIndex({ empresa_id: 1, estado_pago: 1 });
db.gastos.createIndex({ proyecto_id: 1 });

db.gastos.createIndex(
    { empresa_id: 1, tiene_respaldo: 1 },
    { partialFilterExpression: { tiene_respaldo: false } }
);

db.gastos.createIndex(
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

createCollectionIfNotExists("honorarios", {
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
            monto_bruto: { bsonType: ["int", "long", "double", "decimal"] },
            retencion: { bsonType: ["int", "long", "double", "decimal"] },
            monto_neto: { bsonType: ["int", "long", "double", "decimal"] },
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

db.honorarios.createIndex({ empresa_id: 1, periodo: 1 });
db.honorarios.createIndex({ empresa_id: 1, fecha_emision: -1 });
db.honorarios.createIndex({ empresa_id: 1, rut_prestador: 1 });
db.honorarios.createIndex({ proyecto_id: 1 });

// ============================================================
// 8. TRANSFERENCIAS BANCARIAS
// ============================================================

createCollectionIfNotExists("transferencias_bancarias", {
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
            monto: { bsonType: ["int", "long", "double", "decimal"] },
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

db.transferencias_bancarias.createIndex({ empresa_id: 1, periodo: 1 });
db.transferencias_bancarias.createIndex({ empresa_id: 1, fecha: -1 });
db.transferencias_bancarias.createIndex(
    { empresa_id: 1, conciliado: 1 },
    { partialFilterExpression: { conciliado: false } }
);
db.transferencias_bancarias.createIndex({ ingreso_id: 1 });
db.transferencias_bancarias.createIndex({ gasto_id: 1 });

// ============================================================
// 9. LIBROS MENSUALES
// ============================================================

createCollectionIfNotExists("libros_mensuales", {
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
            "estado"
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
            total_neto: { bsonType: ["int", "long", "double", "decimal"] },
            total_iva: { bsonType: ["int", "long", "double", "decimal"] },
            total_exento: { bsonType: ["int", "long", "double", "decimal"] },
            total_general: { bsonType: ["int", "long", "double", "decimal"] },
            total_registros: { bsonType: ["int", "long", "null"] },
            estado: { enum: ["borrador", "generado", "revisado", "enviado"] },
            archivo_url: { bsonType: ["string", "null"] },
            generado_at: { bsonType: ["date", "null"] },
            generado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: ["date", "null"] },
            updated_at: { bsonType: ["date", "null"] }
        }
    }
});

db.libros_mensuales.createIndex({ empresa_id: 1, periodo: 1 });
db.libros_mensuales.createIndex({ empresa_id: 1, periodo: 1, tipo: 1 }, { unique: true });

// ============================================================
// 10. IMPUESTOS MENSUALES
// ============================================================

createCollectionIfNotExists("impuestos_mensuales", {
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
            "estado"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            iva_debito: { bsonType: ["int", "long", "double", "decimal"] },
            iva_credito: { bsonType: ["int", "long", "double", "decimal"] },
            iva_a_pagar: { bsonType: ["int", "long", "double", "decimal"] },
            remanente_credito: { bsonType: ["int", "long", "double", "decimal"] },
            ppm_base: { bsonType: ["int", "long", "double", "decimal"] },
            ppm: { bsonType: ["int", "long", "double", "decimal"] },
            retenciones: { bsonType: ["int", "long", "double", "decimal"] },
            total_estimado: { bsonType: ["int", "long", "double", "decimal"] },
            estado: { enum: ["estimado", "revisado", "declarado", "pagado"] },
            observaciones: { bsonType: ["string", "null"] },
            comprobante_url: { bsonType: ["string", "null"] },
            calculado_at: { bsonType: ["date", "null"] },
            calculado_por: { bsonType: ["string", "null"] },
            declarado_at: { bsonType: ["date", "null"] },
            gastos_sin_categoria: { bsonType: ["int", "long", "null"] },
            ingresos_pendientes: { bsonType: ["int", "long", "null"] },
            gastos_sin_respaldo: { bsonType: ["int", "long", "null"] },
            inconsistencias: { bsonType: ["array", "null"] },
            generado_por: { bsonType: ["string", "null"] },
            created_at: { bsonType: ["date", "null"] },
            updated_at: { bsonType: ["date", "null"] }
        }
    }
});

db.impuestos_mensuales.createIndex({ empresa_id: 1, periodo: 1 }, { unique: true });

// ============================================================
// 11. FLUJO DE CAJA
// ============================================================

createCollectionIfNotExists("flujo_caja", {
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
            saldo_inicial: { bsonType: ["int", "long", "double", "decimal"] },
            ingresos_reales: { bsonType: ["int", "long", "double", "decimal"] },
            egresos_reales: { bsonType: ["int", "long", "double", "decimal"] },
            saldo_final: { bsonType: ["int", "long", "double", "decimal"] },
            cuentas_por_cobrar: { bsonType: ["int", "long", "double", "decimal"] },
            cuentas_por_pagar: { bsonType: ["int", "long", "double", "decimal"] },
            saldo_proyectado_30d: { bsonType: ["int", "long", "double", "decimal"] },
            saldo_proyectado_60d: { bsonType: ["int", "long", "double", "decimal"] },
            saldo_proyectado_90d: { bsonType: ["int", "long", "double", "decimal"] },
            escenario: { enum: ["conservador", "base", "optimista"] },
            notas: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

db.flujo_caja.createIndex({ empresa_id: 1, periodo: 1 });
db.flujo_caja.createIndex({ empresa_id: 1, periodo: 1, escenario: 1 }, { unique: true });

// ============================================================
// 12. ALERTAS
// ============================================================

createCollectionIfNotExists("alertas", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "tipo",
            "severidad",
            "descripcion",
            "estado",
            "created_at"
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
            estado: { enum: ["abierta", "pendiente", "vista", "resuelta", "ignorada"] },
            referencia_tabla: { bsonType: ["string", "null"] },
            referencia_id: { bsonType: ["string", "null"] },
            resuelta_por: { bsonType: ["string", "null"] },
            resuelta_at: { bsonType: ["date", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

db.alertas.createIndex({ empresa_id: 1, periodo: 1 });
db.alertas.createIndex(
    { empresa_id: 1, estado: 1 },
    { partialFilterExpression: { estado: "pendiente" } }
);
db.alertas.createIndex({ empresa_id: 1, severidad: 1 });
db.alertas.createIndex({ referencia_tabla: 1, referencia_id: 1 });

// ============================================================
// 13. CIERRES MENSUALES
// ============================================================

createCollectionIfNotExists("cierres_mensuales", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "empresa_id",
            "periodo",
            "cerrado",
            "created_at",
            "updated_at"
        ],
        properties: {
            _id: { bsonType: "string" },
            empresa_id: { bsonType: "string" },
            periodo: { bsonType: "string", pattern: periodoRegex },
            ventas_revisadas: { bsonType: ["bool", "null"] },
            compras_revisadas: { bsonType: ["bool", "null"] },
            honorarios_revisados: { bsonType: ["bool", "null"] },
            banco_conciliado: { bsonType: ["bool", "null"] },
            impuestos_calculados: { bsonType: ["bool", "null"] },
            f29_preparado: { bsonType: ["bool", "null"] },
            reporte_generado: { bsonType: ["bool", "null"] },
            cerrado: { bsonType: "bool" },
            cerrado_por: { bsonType: ["string", "null"] },
            cerrado_at: { bsonType: ["date", "null"] },
            snapshot_ingresos: { bsonType: ["int", "long", "double", "decimal", "null"] },
            snapshot_gastos: { bsonType: ["int", "long", "double", "decimal", "null"] },
            snapshot_resultado: { bsonType: ["int", "long", "double", "decimal", "null"] },
            snapshot_iva_pagar: { bsonType: ["int", "long", "double", "decimal", "null"] },
            ingresos_total: { bsonType: ["int", "long", "double", "decimal", "null"] },
            gastos_total: { bsonType: ["int", "long", "double", "decimal", "null"] },
            resultado: { bsonType: ["int", "long", "double", "decimal", "null"] },
            total_facturas: { bsonType: ["int", "long", "double", "decimal", "null"] },
            total_gastos_docs: { bsonType: ["int", "long", "double", "decimal", "null"] },
            impuesto_estimado: { bsonType: ["int", "long", "double", "decimal", "null"] },
            notas_cierre: { bsonType: ["string", "null"] },
            created_at: { bsonType: "date" },
            updated_at: { bsonType: "date" }
        }
    }
});

db.cierres_mensuales.createIndex({ empresa_id: 1, periodo: 1 }, { unique: true });

// ============================================================
// 14. WORKFLOW LOGS
// ============================================================

createCollectionIfNotExists("workflow_logs", {
    $jsonSchema: {
        bsonType: "object",
        required: [
            "_id",
            "workflow_name",
            "status",
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
            result: { bsonType: ["object", "array", "string", "null"] },
            started_at: { bsonType: ["date", "null"] },
            finished_at: { bsonType: ["date", "null"] },
            duration_ms: { bsonType: ["int", "long", "null"] },
            created_at: { bsonType: "date" }
        }
    }
});

db.workflow_logs.createIndex({ empresa_id: 1 });
db.workflow_logs.createIndex({ created_at: -1 });
db.workflow_logs.createIndex(
    { status: 1 },
    { partialFilterExpression: { status: "error" } }
);
db.workflow_logs.createIndex({ workflow_name: 1 });
db.workflow_logs.createIndex({ execution_id: 1 });

print("Esquema CuantiCFO MongoDB creado correctamente.");