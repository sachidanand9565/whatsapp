const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');

function loadEnv() {
  const envPath = path.resolve(process.cwd(), '.env.local');
  if (!fs.existsSync(envPath)) {
    console.error('.env.local file not found');
    return;
  }
  const content = fs.readFileSync(envPath, 'utf8');
  content.split('\n').forEach(line => {
    line = line.trim();
    if (!line || line.startsWith('#')) return;
    const idx = line.indexOf('=');
    if (idx === -1) return;
    const key = line.substring(0, idx).trim();
    let val = line.substring(idx + 1).trim();
    if (val.startsWith('"') && val.endsWith('"')) {
      val = val.substring(1, val.length - 1);
    } else if (val.startsWith("'") && val.endsWith("'")) {
      val = val.substring(1, val.length - 1);
    }
    process.env[key] = val;
  });
}

async function main() {
  loadEnv();
  const conn = await mysql.createConnection({
    host: process.env.DB_HOST,
    port: Number(process.env.DB_PORT) || 3306,
    user: process.env.DB_USER,
    password: process.env.DB_PASSWORD,
    database: process.env.DB_NAME,
  });

  try {
    console.log('--- ACTIVE FLOWS ---');
    const [flows] = await conn.execute('SELECT id, name, trigger_keywords, trigger_type, is_active FROM flows');
    console.log(flows);

    console.log('\n--- ACTIVE FLOW SESSIONS ---');
    const [sessions] = await conn.execute('SELECT * FROM flow_sessions');
    console.log(sessions);

    console.log('\n--- LAST 10 MESSAGES ---');
    const [messages] = await conn.execute('SELECT id, contact_id, direction, type, content, created_at FROM messages ORDER BY id DESC LIMIT 10');
    console.log(messages);

    console.log('\n--- LAST 10 NODE LOGS ---');
    const [logs] = await conn.execute('SELECT * FROM flow_node_logs ORDER BY id DESC LIMIT 10');
    console.log(logs);

  } catch (err) {
    console.error(err);
  } finally {
    await conn.end();
  }
}

main();
