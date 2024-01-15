import { NextRequest } from 'next/server';
import { DB_CRUD } from '../../database/src/lib/db_crud';

export async function POST(req: Request) {
  const body = await req.json();

  const result = await DB_CRUD.answerToQuiz(body);

  if (!result) {
    return new Response('Fail to answer to quiz', { status: 500 });
  }

  return new Response('Success', { status: 200 });
}
export async function GET(req: NextRequest) {
  const quizID = req.nextUrl.searchParams.get('quiz-id');

  if (!quizID) {
    return new Response('Fail to get the answer of quiz  with undefined ID', {
      status: 500,
    });
  }
  const result = await DB_CRUD.getAnswersByQuizId(quizID);

  if (!result) {
    return new Response(`Fail to get the answer of quiz id ${quizID}`, {
      status: 500,
    });
  }

  return new Response(JSON.stringify(result), { status: 200 });
}
