import 'server-only';
import { Pool, type QueryResult, type QueryResultRow } from 'pg';
import { SCHEMA_SQL } from '@/lib/schema-sql';

type Globals = { __seriosPool?: Pool; __seriosSchema?: Promise<void> };
const g = globalThis as unknown as Globals;

function getPool(): Pool {
  if (g.__seriosPool) return g.__seriosPool;

  const url = process.env.DATABASE_URL;
  if (!url) throw new Error('Falta a variável de ambiente DATABASE_URL.');

  // Em produção usa-se a Internal Database URL da Render (rede privada, sem SSL).
  // A URL externa (…render.com), usada só em desenvolvimento local, exige SSL.
  // Pode forçar-se com DATABASE_SSL=true|false.
  const sslEnv = process.env.DATABASE_SSL;
  const useSsl = sslEnv ? sslEnv === 'true' : /\.render\.com/.test(url);

  const pool = new Pool({
    connectionString: url,
    ssl: useSsl ? { rejectUnauthorized: false } : undefined,
    max: Number(process.env.DATABASE_POOL_MAX) || 5,
    idleTimeoutMillis: 30_000,
  });

  // Sem este handler, um erro numa ligação inativa (ex.: a base reinicia) derruba o processo.
  pool.on('error', (err) => {
    console.error('[db:pool]', err);
  });

  // Todas as tabelas do Projeto Serio$ vivem no esquema "serios", isoladas de outras
  // tabelas que a mesma base de dados possa ter (ex.: de outros projetos).
  pool.on('connect', (client) => {
    void client.query('set search_path to serios');
  });

  g.__seriosPool = pool;
  return pool;
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
