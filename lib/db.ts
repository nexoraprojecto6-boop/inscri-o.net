import 'server-only';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';
import { SCHEMA_SQL } from '@/lib/schema-sql';

type Globals = { __seriosPool?: Pool; __seriosSchema?: Promise<void> };
const g = globalThis as unknown as Globals;

function getPool(): Pool {
  if (g.__seriosPool) return g.__seriosPool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Falta a variável de ambiente DATABASE_URL.');

  // A URL externa da Render (…render.com) exige SSL; a interna (rede privada) não.
  // Pode forçar-se com DATABASE_SSL=true|false.
  const sslEnv = process.env.DATABASE_SSL;
  const useSsl = sslEnv ? sslEnv === 'true' : /\.render\.com/.test(url);

  g.__seriosPool = new Pool({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: 5,
    idleTimeoutMillis: 30_000,
  });
  return g.__seriosPool;
}

/** Cria as tabelas na primeira utilização (idempotente). */
async function ensureSchema(pool: Pool) {
  if (!g.__seriosSchema) {
    g.__seriosSchema = pool.query(SCHEMA_SQL).then(() => undefined);
    g.__seriosSchema.catch(() => {
      g.__seriosSchema = undefined; // tenta novamente no próximo pedido
    });
  }
  await g.__seriosSchema;
}

/** Executa uma consulta SQL parametrizada ($1, $2, …). Nunca concatenar dados do utilizador no SQL. */
export async function query<T extends QueryResultRow = QueryResultRow>(
  text: string,
  params: unknown[] = [],
): Promise<QueryResult<T>> {
  const pool = getPool();
  await ensureSchema(pool);
  return pool.query<T>(text, params);
}
