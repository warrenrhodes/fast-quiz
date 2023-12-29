import { Typography } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import debounce from 'lodash.debounce';
import { Dispatch, useCallback, useState } from 'react';
import { IQuiz, IAnswer, questionType } from '@fast-quiz/models';
import { Action } from './quiz-box';

export enum QuizAction {
  initialState = 'initialState',
  addNewQuiz = 'addNewQuiz',
  updateQuiz = 'updateQuiz',
  removeQuiz = 'removeQuiz',
  removeAnswerFromQuiz = 'removeAnswerFromQuiz',
  saveData = 'saveData',
  previewData = 'previewData',
  replaceQuizGroup = 'replaceQuizGroup',
}

const ListOfQuiz = (props: {
  questions: IQuiz[];
  dispatch: Dispatch<Action>;
}) => {
  const removeAnswerFromQuiz = ({
    quizId,
    answerId,
  }: {
    quizId: string;
    answerId: string;
  }) => {
    props.dispatch({
      type: QuizAction.removeAnswerFromQuiz,
      payload: { quizId, answerId },
    });
  };

  const removeQuiz = (id: string) => {
    props.dispatch({ type: QuizAction.removeQuiz, payload: id });
  };

  const updateQuiz = (quiz: IQuiz) => {
    props.dispatch({ type: QuizAction.updateQuiz, payload: quiz });
  };

  return (
    <>
      {props.questions.map((q) => (
        <IQuiz
          key={q.id}
          quiz={q}
          updateQuiz={updateQuiz}
          removeAnswer={removeAnswerFromQuiz}
          removeQuiz={removeQuiz}
        />
      ))}
    </>
  );
};

const IQuiz = (props: {
  quiz: IQuiz;
  updateQuiz: (quiz: IQuiz) => void;
  removeAnswer: ({
    quizId,
    answerId,
  }: {
    quizId: string;
    answerId: string;
  }) => void;
  removeQuiz: (id: string) => void;
}) => {
  const [title, setTitle] = useState<string>(props.quiz.title);
  const updateQuizTitle = (value: string) => {
    props.updateQuiz({
      ...props.quiz,
      title: value,
    });
  };

  const debouncedLog = useCallback(
    debounce((inputValue) => {
      updateQuizTitle(inputValue);
    }, 1000),
    []
  );

  const handleQuizTitleChange = (value: string) => {
    setTitle(value);
    debouncedLog(value);
  };

  return (
    <div className="border-2 rounded-lg glass p-4 m-4">
      <button
        className="btn btn-sm btn-circle absolute -right-4 -top-4 border-2"
        onClick={() => props.removeQuiz(props.quiz.id)}
      >
        ✕
      </button>
      <div>
        <Typography.Title level={5}>Quiz Title</Typography.Title>
        <input
          autoComplete="on"
          type="text"
          placeholder="title"
          value={title}
          className="input input-bordered w-full"
          onChange={(value) => handleQuizTitleChange(value.target.value)}
        />
      </div>
      {props.quiz.questionType === questionType.radio ? (
        <RadioQuiz
          quiz={props.quiz}
          updateQuiz={props.updateQuiz}
          removeAnswer={props.removeAnswer}
          removeQuiz={props.removeQuiz}
        />
      ) : (
        <span></span>
      )}
    </div>
  );
};

const RadioQuiz = (props: {
  quiz: IQuiz;
  updateQuiz: (quiz: IQuiz) => void;
  removeAnswer: ({
    quizId,
    answerId,
  }: {
    quizId: string;
    answerId: string;
  }) => void;
  removeQuiz: (id: string) => void;
}) => {
  return (
    <div className="flex flex-col gap-3 mt-3 ml-20">
      {props.quiz.answers?.map((a, index) => (
        <AnswerRow
          quiz={props.quiz}
          key={a.id}
          answer={a}
          closeButtonEnabled={props.quiz.answers.length > 2 ? true : false}
          removeAnswer={props.removeAnswer}
          updateQuiz={props.updateQuiz}
          removeQuiz={props.removeQuiz}
          index={index}
        />
      ))}

      <button
        className="btn border-2 rounded-md border-gray-400 border-dotted hover:border-dotted hover:border-2 hover:rounded-md hover:border-gray-400"
        onClick={() =>
          props.updateQuiz({
            ...props.quiz,
            answers: [
              ...props.quiz.answers,
              {
                id: uuidv4(),
                answer: '',
              },
            ],
          })
        }
      >
        <span>&#43; </span> Add Answer
      </button>
    </div>
  );
};

const AnswerRow = (props: {
  quiz: IQuiz;
  answer: IAnswer;
  closeButtonEnabled: boolean;
  removeAnswer: ({
    quizId,
    answerId,
  }: {
    quizId: string;
    answerId: string;
  }) => void;
  updateQuiz: (quiz: IQuiz) => void;
  removeQuiz: (id: string) => void;
  index: number;
}) => {
  const [title, setTitle] = useState<string>(props.answer.answer);
  const updateAnswer = (value: string) => {
    props.updateQuiz({
      ...props.quiz,
      answers: props.quiz.answers?.map((a) => {
        if (a.id === props.answer.id) {
          return {
            ...a,
            answer: value,
          };
        }
        return a;
      }),
    });
  };

  const debouncedLog = useCallback(
    debounce((inputValue) => {
      updateAnswer(inputValue);
    }, 1000),
    []
  );

  const handleChange = (value: string) => {
    setTitle(value);
    debouncedLog(value);
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      {props.closeButtonEnabled && (
        <button
          className="btn btn-sm btn-circle btn-outline"
          onClick={() =>
            props.removeAnswer({
              quizId: props.quiz.id,
              answerId: props.answer.id,
            })
          }
        >
          ✕
        </button>
      )}
      <input
        type="text"
        autoComplete="on"
        placeholder={`Answer ${
          props.index === 0 ? '' : `( ${props.index + 1} )`
        }`}
        className="input input-bordered flex-1"
        value={title}
        key={props.answer.id}
        onChange={(value) => handleChange(value.target.value)}
      />
    </div>
  );
};

export default ListOfQuiz;
