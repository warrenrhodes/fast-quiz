import { NextRequest } from 'next/server';
import { DB_CRUD } from '../../database/src';

export async function GET(req: NextRequest) {
  const quizID = req.nextUrl.searchParams.get('quiz-group-id');
  console.info(`retrieve the quiz group with id ${quizID}`);

  if (!quizID) {
    return new Response('Fails to get the result of quiz with undefined ID', {
      status: 500,
    });
  }
  const result = await DB_CRUD.getQuizResult(quizID);

  if (!result) {
    return new Response('Fails to get the result of quiz with id ' + quizID, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(result), { status: 200 });
}
