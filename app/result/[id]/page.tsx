import { QuizResult } from '@fast-quiz/pages-component';

export default async function Index({ params }: { params: { id: string } }) {
  const currentQuiz = await fetch(
    `http://localhost:4200/api/result?quiz-group-id=${params.id}`,
    { cache: 'no-store' }
  );

  if (currentQuiz.status !== 200) {
    return <div>Fail to get the quiz</div>;
  }
  const data = await currentQuiz.json();

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className="">
      <QuizResult result={data} />
    </div>
  );
}
