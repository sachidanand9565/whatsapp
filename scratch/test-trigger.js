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
    const workspaceId = 13;
    const messageText = 'hi';
    const lowerText = messageText.toLowerCase().trim();

    console.log('Querying flows for workspaceId:', workspaceId);
    const [flows] = await conn.execute(
      'SELECT id, name, trigger_keywords, trigger_type, nodes, edges, is_active FROM flows WHERE workspace_id = ? AND is_active = 1',
      [workspaceId]
    );
    console.log('Found active flows:', flows.length);

    for (const flow of flows) {
      console.log('Evaluating flow:', flow.name, 'ID:', flow.id);
      let keywords = [];
      try {
        keywords = typeof flow.trigger_keywords === 'string'
          ? JSON.parse(flow.trigger_keywords)
          : flow.trigger_keywords || [];
      } catch (e) {
        console.error('Failed to parse trigger_keywords:', e.message);
      }
      console.log('Parsed keywords:', keywords, 'Type of keywords:', typeof keywords, Array.isArray(keywords));
      console.log('trigger_type:', flow.trigger_type);
      console.log('lowerText:', lowerText);

      let isMatched = false;
      if (flow.trigger_type === 'any') {
        isMatched = true;
      } else if (flow.trigger_type === 'keyword') {
        // Handle case where keywords might be a string but not parsed as an array
        isMatched = keywords.includes(lowerText);
      }
      console.log('isMatched result:', isMatched);
    }
  } catch (err) {
    console.error(err);
  } finally {
    await conn.end();
  }
}

main();
