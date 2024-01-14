import { DB_CRUD } from '../../database/src/lib/db_crud';

export async function POST(req: Request) {
  const body = await req.json();

  const result = await DB_CRUD.answerToQuiz(body);

  if (!result) {
    return new Response('Fail to answer to quiz', { status: 500 });
  }

  return new Response('Success', { status: 200 });
}
