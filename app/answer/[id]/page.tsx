import { Answer } from '@fast-quiz/pages-component';

export default async function Index({ params }: { params: { id: string } }) {
  const currentQuiz = await fetch(
    `http://localhost:4200/api/get-quiz-group?quiz-group-id=${params.id}`
  );

  const data = await currentQuiz.json();

  if (currentQuiz.status !== 200) {
    return <div>Fail to get the quiz</div>;
  }

  /*
   * Replace the elements below with your own.
   *
   * Note: The corresponding styles are in the ./index.css file.
   */
  return (
    <div className="">
      <Answer quizGroup={data} />
    </div>
  );
}
