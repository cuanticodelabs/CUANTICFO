// ============================================================
// CuantiCFO — Actualizar validadores MongoDB
// Ejecutar con: mongosh <connection_string> apply_schema_updates.mongo.js
// ============================================================
use cuanticfo;

const numericTypes = ["int", "long", "double", "decimal"];
const numericOrNull = ["int", "long", "double", "decimal", "null"];
const periodoRegex = "^\\d{4}-\\d{2}$";

// --- INGRESOS ---
db.runCommand({
  collMod: "ingresos",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","empresa_id","fecha_emision","periodo","cliente","tipo_documento","neto","iva","exento","total","estado_cobro","created_at","updated_at"],
      properties: {
        _id:            { bsonType: "string" },
        empresa_id:     { bsonType: "string" },
        fecha_emision:  { bsonType: "date" },
        fecha_pago:     { bsonType: ["date","null"] },
        periodo:        { bsonType: "string", pattern: periodoRegex },
        cliente:        { bsonType: "string" },
        rut_cliente:    { bsonType: ["string","null"] },
        folio:          { bsonType: ["string","null"] },
        tipo_documento: { enum: ["factura_afecta","factura_exenta","boleta","nota_debito","nota_credito","boleta_honorarios","liquidacion","otro"] },
        neto:           { bsonType: numericTypes },
        iva:            { bsonType: numericTypes },
        exento:         { bsonType: numericTypes },
        total:          { bsonType: numericTypes },
        categoria_id:   { bsonType: ["string","null"] },
        estado_cobro:   { enum: ["pendiente","cobrado","vencido","anulado"] },
        proyecto_id:    { bsonType: ["string","null"] },
        archivo_url:    { bsonType: ["string","null"] },
        creado_por:     { bsonType: ["string","null"] },
        created_at:     { bsonType: "date" },
        updated_at:     { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- GASTOS ---
db.runCommand({
  collMod: "gastos",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","empresa_id","fecha_documento","periodo","proveedor","tipo_documento","neto","iva","exento","total","usa_credito_fiscal","estado_pago","tiene_respaldo","created_at","updated_at"],
      properties: {
        _id:             { bsonType: "string" },
        empresa_id:      { bsonType: "string" },
        fecha_documento: { bsonType: "date" },
        fecha_pago:      { bsonType: ["date","null"] },
        periodo:         { bsonType: "string", pattern: periodoRegex },
        proveedor:       { bsonType: "string" },
        rut_proveedor:   { bsonType: ["string","null"] },
        folio:           { bsonType: ["string","null"] },
        tipo_documento:  { enum: ["factura_afecta","factura_exenta","boleta","nota_debito","nota_credito","boleta_honorarios","factura_extranjera","gasto_sin_documento","otro"] },
        categoria_id:    { bsonType: ["string","null"] },
        neto:            { bsonType: numericTypes },
        iva:             { bsonType: numericTypes },
        exento:          { bsonType: numericTypes },
        total:           { bsonType: numericTypes },
        usa_credito_fiscal: { bsonType: "bool" },
        estado_pago:     { enum: ["pendiente","pagado","vencido","anulado"] },
        tiene_respaldo:  { bsonType: "bool" },
        proyecto_id:     { bsonType: ["string","null"] },
        archivo_url:     { bsonType: ["string","null"] },
        creado_por:      { bsonType: ["string","null"] },
        created_at:      { bsonType: "date" },
        updated_at:      { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- LIBROS MENSUALES ---
db.runCommand({
  collMod: "libros_mensuales",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","empresa_id","periodo","tipo","total_neto","total_iva","total_exento","total_general","estado"],
      properties: {
        _id:             { bsonType: "string" },
        empresa_id:      { bsonType: "string" },
        periodo:         { bsonType: "string", pattern: periodoRegex },
        tipo:            { enum: ["libro_compras","libro_ventas","libro_honorarios","libro_gastos_internos"] },
        total_neto:      { bsonType: numericTypes },
        total_iva:       { bsonType: numericTypes },
        total_exento:    { bsonType: numericTypes },
        total_general:   { bsonType: numericTypes },
        total_registros: { bsonType: ["int","long","null"] },
        iva_debito_fiscal: { bsonType: numericOrNull },
        estado:          { enum: ["borrador","generado","revisado","enviado"] },
        archivo_url:     { bsonType: ["string","null"] },
        generado_at:     { bsonType: ["date","null"] },
        generado_por:    { bsonType: ["string","null"] },
        created_at:      { bsonType: ["date","null"] },
        updated_at:      { bsonType: ["date","null"] }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- IMPUESTOS MENSUALES ---
db.runCommand({
  collMod: "impuestos_mensuales",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","empresa_id","periodo","iva_debito","iva_credito","iva_a_pagar","remanente_credito","ppm_base","ppm","retenciones","total_estimado","estado"],
      properties: {
        _id:               { bsonType: "string" },
        empresa_id:        { bsonType: "string" },
        periodo:           { bsonType: "string", pattern: periodoRegex },
        iva_debito:        { bsonType: numericTypes },
        iva_credito:       { bsonType: numericTypes },
        iva_a_pagar:       { bsonType: numericTypes },
        remanente_credito: { bsonType: numericTypes },
        ppm_base:          { bsonType: numericTypes },
        ppm:               { bsonType: numericTypes },
        retenciones:       { bsonType: numericTypes },
        total_estimado:    { bsonType: numericTypes },
        estado:            { enum: ["estimado","revisado","declarado","pagado"] },
        gastos_sin_categoria:  { bsonType: ["int","long","null"] },
        ingresos_pendientes:   { bsonType: ["int","long","null"] },
        gastos_sin_respaldo:   { bsonType: ["int","long","null"] },
        inconsistencias:       { bsonType: ["array","null"] },
        generado_por:          { bsonType: ["string","null"] },
        observaciones:         { bsonType: ["string","null"] },
        comprobante_url:       { bsonType: ["string","null"] },
        calculado_at:          { bsonType: ["date","null"] },
        calculado_por:         { bsonType: ["string","null"] },
        declarado_at:          { bsonType: ["date","null"] },
        created_at:            { bsonType: ["date","null"] },
        updated_at:            { bsonType: ["date","null"] }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- CIERRES MENSUALES ---
db.runCommand({
  collMod: "cierres_mensuales",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","empresa_id","periodo","cerrado","created_at","updated_at"],
      properties: {
        _id:                 { bsonType: "string" },
        empresa_id:          { bsonType: "string" },
        periodo:             { bsonType: "string", pattern: periodoRegex },
        ventas_revisadas:    { bsonType: ["bool","null"] },
        compras_revisadas:   { bsonType: ["bool","null"] },
        honorarios_revisados:{ bsonType: ["bool","null"] },
        banco_conciliado:    { bsonType: ["bool","null"] },
        impuestos_calculados:{ bsonType: ["bool","null"] },
        f29_preparado:       { bsonType: ["bool","null"] },
        reporte_generado:    { bsonType: ["bool","null"] },
        cerrado:             { bsonType: "bool" },
        cerrado_por:         { bsonType: ["string","null"] },
        cerrado_at:          { bsonType: ["date","null"] },
        ingresos_total:      { bsonType: numericOrNull },
        gastos_total:        { bsonType: numericOrNull },
        resultado:           { bsonType: numericOrNull },
        total_facturas:      { bsonType: ["int","long","null"] },
        total_gastos_docs:   { bsonType: ["int","long","null"] },
        impuesto_estimado:   { bsonType: numericOrNull },
        snapshot_ingresos:   { bsonType: numericOrNull },
        snapshot_gastos:     { bsonType: numericOrNull },
        snapshot_resultado:  { bsonType: numericOrNull },
        snapshot_iva_pagar:  { bsonType: numericOrNull },
        notas_cierre:        { bsonType: ["string","null"] },
        created_at:          { bsonType: "date" },
        updated_at:          { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- ALERTAS ---
db.runCommand({
  collMod: "alertas",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","empresa_id","tipo","severidad","descripcion","estado","created_at"],
      properties: {
        _id:              { bsonType: "string" },
        empresa_id:       { bsonType: "string" },
        periodo:          { bsonType: ["string","null"], pattern: periodoRegex },
        tipo:             { enum: ["iva_supera_caja","factura_vencida","gasto_sin_respaldo","documento_duplicado","proveedor_nuevo","mes_sin_cierre","variacion_gasto","margen_bajo","datos_faltantes_f29","categoria_faltante","honorarios_pendiente","otro"] },
        severidad:        { enum: ["alta","media","baja"] },
        descripcion:      { bsonType: "string" },
        accion_sugerida:  { bsonType: ["string","null"] },
        estado:           { enum: ["abierta","pendiente","vista","resuelta","ignorada"] },
        referencia_tabla: { bsonType: ["string","null"] },
        referencia_id:    { bsonType: ["string","null"] },
        resuelta_por:     { bsonType: ["string","null"] },
        resuelta_at:      { bsonType: ["date","null"] },
        created_at:       { bsonType: "date" },
        updated_at:       { bsonType: ["date","null"] }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- WORKFLOW LOGS ---
db.runCommand({
  collMod: "workflow_logs",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","workflow_name","status","created_at"],
      properties: {
        _id:           { bsonType: "string" },
        empresa_id:    { bsonType: ["string","null"] },
        workflow_name: { bsonType: "string" },
        execution_id:  { bsonType: ["string","null"] },
        status:        { enum: ["success","error","warning","running"] },
        trigger_type:  { bsonType: ["string","null"] },
        periodo:       { bsonType: ["string","null"] },
        error_message: { bsonType: ["string","null"] },
        error_node:    { bsonType: ["string","null"] },
        payload:       { bsonType: ["object","array","null"] },
        result:        { bsonType: ["object","array","string","null"] },
        started_at:    { bsonType: ["date","null"] },
        finished_at:   { bsonType: ["date","null"] },
        duration_ms:   { bsonType: ["int","long","null"] },
        created_at:    { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

// --- EMPRESAS (agregar email_contador como opcional) ---
db.runCommand({
  collMod: "empresas",
  validator: {
    $jsonSchema: {
      bsonType: "object",
      required: ["_id","razon_social","rut","tasa_ppm","activa","created_at","updated_at"],
      properties: {
        _id:          { bsonType: "string" },
        razon_social: { bsonType: "string" },
        rut:          { bsonType: "string" },
        giro:         { bsonType: ["string","null"] },
        regimen_tributario: { enum: ["primera_categoria","regimen_pro_pyme","regimen_pro_pyme_transparente","sin_inicio_actividades",null] },
        tasa_ppm:     { bsonType: numericTypes },
        email_contador: { bsonType: ["string","null"] },
        correo_contador: { bsonType: ["string","null"] },
        banco_principal: { bsonType: ["string","null"] },
        fecha_inicio_actividades: { bsonType: ["date","null"] },
        activa:       { bsonType: "bool" },
        created_at:   { bsonType: "date" },
        updated_at:   { bsonType: "date" }
      }
    }
  },
  validationLevel: "moderate",
  validationAction: "error"
});

print("Validadores actualizados correctamente.");
