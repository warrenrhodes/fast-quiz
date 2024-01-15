import { Pool, PoolClient } from 'pg';

let client: PoolClient | null = null;

export const dbPool = new Pool({
  host: process.env.POSTGRES_HOST,
  database: process.env.POSTGRES_DB,
  user: process.env.POSTGRES_USER,
  port: parseInt(process.env.POSTGRES_PORT ?? '5432'),
  password: process.env.POSTGRES_PASSWORD,
  max: 20,
  idleTimeoutMillis: 30000,
  connectionTimeoutMillis: 2000,
});

export async function dbConnect() {
  try {
    if (client) {
      return;
    }
    client = await dbPool.connect();

    const isQuizGroupsExist = await client.query(
      "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quiz_groups');"
    );

    if (!isQuizGroupsExist.rows[0].exists) {
      await client.query('CREATE TABLE quiz_groups ( id UUID PRIMARY KEY );');
    }

    const isQuizzesExist = (
      await client.query(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'quizzes');"
      )
    ).rows[0].exists;

    if (!isQuizzesExist) {
      await client.query(
        'CREATE TABLE quizzes ( id UUID PRIMARY KEY, title VARCHAR(255), question_type VARCHAR(255), created_at TIMESTAMP, quiz_group_id UUID REFERENCES quiz_groups(id) ON DELETE CASCADE );'
      );
    }

    const isAnswersExist = (
      await client.query(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'answers');"
      )
    ).rows[0].exists;

    if (!isAnswersExist) {
      await client.query(
        'CREATE TABLE answers ( id UUID PRIMARY KEY, answer text, quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE, created_at TIMESTAMP);'
      );
    }

    const isResultExist = (
      await client.query(
        "SELECT EXISTS (SELECT 1 FROM information_schema.tables WHERE table_name = 'results');"
      )
    ).rows[0].exists;

    if (!isResultExist) {
      await client.query(
        'CREATE TABLE results ( id UUID PRIMARY KEY, answers text[], quiz_id UUID REFERENCES quizzes(id) ON DELETE CASCADE, quiz_group_id UUID REFERENCES quiz_groups(id) ON DELETE CASCADE, created_at TIMESTAMP );'
      );
    }
  } catch (e) {
    console.error(e);
  }
}
