import { DB_CRUD } from '../../database/src/lib/db_crud';

export async function POST(req: Request) {
  const body = await req.json();

  const result = await DB_CRUD.createQuiz(body);

  if (!result) {
    return new Response('Fail to create the quiz', { status: 500 });
  }

  return new Response('Success', { status: 200 });
}
