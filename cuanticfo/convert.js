const fs = require('fs');
let code = fs.readFileSync('../cuanticfo_schema.mongo.js', 'utf8');

// Replace the function definition
const startIdx = code.indexOf('function createCollectionIfNotExists');
const endIdx = code.indexOf('}', startIdx) + 1;
// Now we need the closing brace of the ELSE block.
// Let's just remove everything up to `// 1. EMPRESAS` and re-add periodoRegex manually.
const line1 = code.indexOf('// 1. EMPRESAS');
code = code.substring(line1);

code = code.replace(/createCollectionIfNotExists\(/g, 'await createCollectionIfNotExists(');
code = code.replace(/db\.([a-zA-Z0-9_]+)\.createIndex\(/g, 'await db.collection(\'$1\').createIndex(');
code = code.replace(/db\.runCommand/g, 'db.command');

const wrapper = `const { MongoClient } = require('mongodb');
async function run() {
  const client = new MongoClient('mongodb://admin:WA9qG7%3F%29%23%40um3-%23@localhost:27018/cuanticfo?authSource=admin');
  try {
    await client.connect();
    console.log('Connected');
    const db = client.db('cuanticfo');
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
    const periodoRegex = "^\\\\d{4}-\\\\d{2}$";
    
    ${code}
    
    console.log("Migration completed successfully.");
    
  } catch(e) {
    console.error(e);
  } finally {
    await client.close();
  }
}
run();`;

fs.writeFileSync('apply_mongo.js', wrapper);
