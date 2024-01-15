import { IAnswer, IQuiz, IResponse } from '@fast-quiz/models';
import { Chart as ChartJS, ArcElement, Tooltip, Legend } from 'chart.js';
import { Pie } from 'react-chartjs-2';

import {
  Suspense,
  useCallback,
  useDeferredValue,
  useEffect,
  useState,
} from 'react';
import 'chart.js/auto';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../utils/routes';

ChartJS.register(ArcElement, Tooltip, Legend);
interface ResultProps {
  result: IResponse[];
}

export function QuizResult(props: ResultProps) {
  const router = useRouter();
  let quizRecord: Record<string, string[]> | null = null;

  if (props.result.length > 0) {
    quizRecord = props.result.reduce<Record<string, string[]>>((prev, curr) => {
      prev[curr.quiz_id] =
        prev[curr.quiz_id] && prev[curr.quiz_id].length > 0
          ? [...prev[curr.quiz_id], ...curr.answers]
          : curr.answers;
      return prev;
    }, {} as Record<string, string[]>);
  }

  return (
    <div>
      <div className="h-[100vh] w-full place-items-center flex flex-col justify-center">
        <div className="w-[70%]">
          <div className="glass min-h-[500px] rounded-[30px] p-6 mb-3">
            <div className="carousel w-full">
              {quizRecord &&
                Object.entries(quizRecord).map(([key, value], index) => (
                  <div
                    id={`slide${index + 1}`}
                    className="carousel-item relative w-full"
                  >
                    <SingleResult key={key} quiz_id={key} answers={value} />
                    <div className="absolute flex justify-between transform -translate-y-1/2 left-5 right-5 top-1/2">
                      {index > 0 && (
                        <a
                          href={`#slide${index - 1}`}
                          className="btn btn-circle"
                        >
                          ❮
                        </a>
                      )}
                      {quizRecord &&
                        index < Object.entries(quizRecord).length - 1 && (
                          <a
                            href={`#slide${index + 2}`}
                            className="btn btn-circle"
                          >
                            ❯
                          </a>
                        )}
                    </div>
                  </div>
                ))}
            </div>
          </div>
          <div className="flex justify-end flex-row gap-3">
            <button
              className="btn btn-outline"
              onClick={() => router.refresh()}
            >
              Refresh
            </button>
            <button
              className="btn btn-outline"
              onClick={() => router.push(ROUTES.home)}
            >
              New Quiz
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}

const SingleResult = (props: { quiz_id: string; answers: string[] }) => {
  const [answer, setAnswer] = useState<IAnswer[]>();
  const [quiz, setQuiz] = useState<IQuiz>();

  const answerQuery = useDeferredValue(answer);
  const quizQuery = useDeferredValue(quiz);

  const fetchAnswerToQuiz = useCallback(async () => {
    const quiz = await fetch(
      `http://localhost:4200/api/answer-to?quiz-id=${props.quiz_id}`
    );
    const data = await quiz.json();
    setAnswer(data);
  }, [props.quiz_id]);

  const fetchQuiz = useCallback(async () => {
    const quiz = await fetch(
      `http://localhost:4200/api/get-quiz?quiz-id=${props.quiz_id}`
    );
    const data = await quiz.json();
    setQuiz(data);
  }, [props.quiz_id]);

  useEffect(() => {
    fetchQuiz();
    fetchAnswerToQuiz();
  }, [fetchQuiz, fetchAnswerToQuiz]);

  console.log('quiz');
  console.log(quizQuery);
  console.log(answerQuery);

  const data = {
    labels: answerQuery ? answerQuery.map((q) => q.answer) : [],
    datasets: [
      {
        label: '# of Votes',
        data: answerQuery
          ? answerQuery.map((q) => countOccurrences(props.answers, q.answer))
          : [],
        borderWidth: 1,
      },
    ],
  };

  const option = {
    responsive: true,
    plugins: {
      legend: {
        position: 'bottom',
        maxWidth: 200,
        labels: {
          color: 'rgb(255, 255, 255)',
          boxWidth: 20,
          font: {
            size: 14,
            weight: 'bold',
          },
        },
      },
    },
  };

  return (
    <Suspense>
      {quizQuery && answerQuery && answerQuery.length > 0 && (
        <div className="w-full place-items-center flex flex-col justify-center">
          <div className="text-5xl font-semibold mb-9 font-serif">
            {quizQuery.title}
          </div>
          <div className="h-[50px]" />
          <div className="h-[300px]">
            <Pie data={data} options={option as never} />
          </div>
        </div>
      )}
    </Suspense>
  );
};

function countOccurrences(list: string[], element: string) {
  return list.reduce((count, current) => {
    if (current === element) {
      return count + 1;
    }
    return count;
  }, 0);
}

export default QuizResult;
