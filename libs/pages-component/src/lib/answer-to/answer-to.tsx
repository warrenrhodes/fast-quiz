'use client';

import {
  IAnswer,
  IQuiz,
  IQuizGroup,
  IResponse,
  questionType,
} from '@fast-quiz/models';
import { useState, useEffect } from 'react';
import { message } from 'antd';
import { displayMessage } from '../widgets/alert-message';
import { v4 as uuidv4 } from 'uuid';
import { Loader } from '../widgets/loader';
import { postRequest } from '@fast-quiz/utils';
import Link from 'next/link';

/* eslint-disable-next-line */
export interface AnswerToProps {}

export interface AnswerToProps {
  quizGroup: IQuizGroup;
  isPreview: boolean;
}

export function AnswerTo(props: AnswerToProps) {
  const [currentIndex, setCurrentIndex] = useState(0);
  const [isLoading, setIsLoading] = useState(false);
  const [goToResponseStat, setGoToResponseStat] = useState(false);

  const [messageApi, contextHolder] = message.useMessage();
  const [userAnswers, setUserAnswers] = useState<IResponse[]>([]);

  useEffect(() => {
    const handleHashChange = () => {
      const currentHash = window.location.hash;
      if (currentHash.startsWith('#item')) {
        const newIndex = parseInt(currentHash.substring(5)) - 1;
        setCurrentIndex(newIndex);
      }
    };

    window.addEventListener('hashchange', handleHashChange);

    return () => {
      window.removeEventListener('hashchange', handleHashChange);
    };
  }, []);

  const sendDataToServer = async () => {
    setIsLoading(true);
    const result = await postRequest({
      route: '/api/answer-to',
      data: JSON.stringify(userAnswers),
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (result.status !== 200) {
      setIsLoading(false);
      displayMessage('Failed to submit your answers', 'error', messageApi);
      return;
    }
    displayMessage('Answer successfully submitted', 'success', messageApi);
    setIsLoading(false);
    setGoToResponseStat(true);
    return;
  };

  const checkedData = async () => {
    if (userAnswers.length === 0) {
      displayMessage('Please validate the quiz', 'error', messageApi);
      return;
    }

    for (const quiz of props.quizGroup.questions) {
      if (
        !userAnswers.find(
          (q) => q.questionId === quiz.id && q.answers.length !== 0
        )
      ) {
        displayMessage(
          'Please check all the questions before submitting',
          'error',
          messageApi
        );
        return;
      }
    }

    await sendDataToServer();
  };

  return (
    <>
      {contextHolder}
      {isLoading && <Loader />}
      <div className="h-[100vh] w-full place-items-center flex flex-col justify-center">
        <div className="w-[70%]">
          <div className="join grid grid-cols-6 self-start justify-self-start mb-3">
            {currentIndex > 0 && (
              <button className="join-item btn btn-outline font-serif">
                <a href={`#item${currentIndex}`}>Previous</a>
              </button>
            )}
            {currentIndex < props.quizGroup.questions.length - 1 && (
              <button className="join-item btn btn-outline font-serif">
                <a href={`#item${currentIndex + 2}`}>Next</a>
              </button>
            )}
          </div>
          <div className="glass min-h-[500px] rounded-[30px] p-6 mb-3">
            {props.quizGroup.questions.map((q, i) => (
              <div id={`item${i + 1}`} className="carousel-item" key={i}>
                <SingleQuiz
                  key={q.id}
                  quiz={q}
                  setUserAnswers={setUserAnswers}
                  userAnswers={userAnswers}
                  quizGroupId={props.quizGroup.id}
                />
              </div>
            ))}
          </div>
          {!props.isPreview && !goToResponseStat && (
            <div className="flex justify-end">
              <button className="btn btn-outline" onClick={checkedData}>
                Submit
              </button>
            </div>
          )}
          {!props.isPreview && goToResponseStat && (
            <div className="flex justify-end">
              <Link href={`/result/${props.quizGroup.id}`}>
                <button className="btn btn-outline bg-green-600">Result</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </>
  );
}

const SingleQuiz = (props: {
  quiz: IQuiz;
  setUserAnswers: (a: IResponse[]) => void;
  userAnswers: IResponse[];
  quizGroupId: string;
}) => {
  return (
    <div className="carousel-item flex flex-col items-start w-full justify-start">
      <div className="text-5xl font-semibold mb-9 font-serif">
        {props.quiz.title}
      </div>
      <div className="w-full">
        {props.quiz.questionType === questionType.radio ? (
          <RadioAnswer
            answers={props.quiz.answers}
            quizId={props.quiz.id}
            setUserAnswers={props.setUserAnswers}
            userAnswers={props.userAnswers}
            quizGroupId={props.quizGroupId}
          />
        ) : (
          <div></div>
        )}
      </div>
    </div>
  );
};

const RadioAnswer = (props: {
  answers: IAnswer[];
  quizId: string;
  setUserAnswers: (a: IResponse[]) => void;
  userAnswers: IResponse[];
  quizGroupId: string;
}) => {
  const [value, setValue] = useState<IAnswer | null>(null);
  const updateRadioQuizAnswer = (a: IAnswer) => {
    const userAnswer = props.userAnswers.find(
      (u) => u.questionId === props.quizId
    );
    props.setUserAnswers([
      ...props.userAnswers,
      !userAnswer
        ? {
            id: uuidv4(),
            questionId: props.quizId,
            createdAt: new Date().toISOString(),
            answers: a.answer,
            groupId: props.quizGroupId,
          }
        : {
            ...userAnswer,
            answers: a.answer,
            createdAt: new Date().toISOString(),
          },
    ]);
  };
  return (
    <div className="grid grid-cols-2 self-start justify-self-start gap-10">
      {props.answers.map((a) => {
        return (
          a.answer && (
            <SingleRadioAnswer
              key={a.id}
              answer={a}
              isChecked={value?.id === a.id}
              onClick={(a: IAnswer) => {
                setValue(a);
                updateRadioQuizAnswer(a);
              }}
            />
          )
        );
      })}
    </div>
  );
};

const SingleRadioAnswer = (props: {
  answer: IAnswer;
  isChecked: boolean;
  onClick: (a: IAnswer) => void;
}) => {
  return (
    <div
      className="border-2 border-gray-300 rounded-[10px] shadow-lg shadow-black p-2 transition duration-150 ease-in-out hover:shadow-2xl hover:shadow-black"
      onClick={() => props.onClick(props.answer)}
    >
      <div className="form-control flex flex-row gap-3 p-[10px]">
        <input
          type="radio"
          name="radio-10"
          className="radio border-white checked:border-1 checked:border-red-500 checked:bg-red-500 border-4"
          checked={props.isChecked}
          onChange={() => props.onClick(props.answer)}
        />
        <span className="text-lg font-serif">{props.answer.answer}</span>
      </div>
    </div>
  );
};

export default AnswerTo;
