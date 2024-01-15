import { NextRequest } from 'next/server';
import { DB_CRUD } from '../../database/src/lib/db_crud';

export async function GET(req: NextRequest) {
  const quizID = req.nextUrl.searchParams.get('quiz-group-id');

  if (!quizID) {
    return new Response('Fail to get the quiz with undefined ID', {
      status: 500,
    });
  }
  const result = await DB_CRUD.getQuizByGroup(quizID);

  if (!result) {
    return new Response('Fail to get the quiz', { status: 500 });
  }

  return new Response(JSON.stringify(result), { status: 200 });
}
