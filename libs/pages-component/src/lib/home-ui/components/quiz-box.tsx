'use client';
import { useState, useReducer, useEffect } from 'react';

import ListOfQuiz, { QuizAction } from './list-of-quiz';
import { Modal, message } from 'antd';
import { v4 as uuidv4 } from 'uuid';
import { IQuiz, IQuizGroup, questionType } from '@fast-quiz/models';
import { useRouter } from 'next/navigation';
import { ROUTES } from '../../utils/routes';
import { LocalStorageKeys } from '../../utils/constants';
import { displayMessage } from '../../widgets/alert-message';
import { postRequest } from '@fast-quiz/utils';
import { Loader } from '../../widgets/loader';
import Link from 'next/link';
import { MessageInstance } from 'antd/es/message/interface';

export type State = {
  questionGroup: IQuizGroup;
};

export type Action =
  | {
      type: QuizAction.addNewQuiz | QuizAction.updateQuiz;
      payload: IQuiz;
    }
  | {
      type: QuizAction.removeQuiz;
      payload: string;
    }
  | {
      type: QuizAction.removeAnswerFromQuiz;
      payload: { quizId: string; answerId: string };
    }
  | {
      type: QuizAction.replaceQuizGroup;
      payload: IQuizGroup;
    };

const QuizBox = () => {
  const initialState = { id: uuidv4(), questions: [] };

  const [displayQuizTypeBox, setDisplayQuizTypeBox] = useState(false);
  const [quizLinks, setQuizLinks] = useState<string[]>([]);
  const [state, dispatch] = useReducer(reducer, {
    questionGroup: initialState,
  });
  const [messageApi, contextHolder] = message.useMessage();
  const [isLoading, setIsLoading] = useState(false);

  const router = useRouter();

  useEffect(() => {
    const data = localStorage.getItem(LocalStorageKeys.quizList);
    if (data && (JSON.parse(data) as IQuizGroup).questions.length > 0) {
      dispatch({
        type: QuizAction.replaceQuizGroup,
        payload: JSON.parse(data) as IQuizGroup,
      });
    }
  }, [quizLinks]);

  function reducer(state: State, action: Action): State {
    switch (action.type) {
      case QuizAction.replaceQuizGroup:
        return {
          ...state,
          questionGroup: action.payload,
        };
      case QuizAction.addNewQuiz:
        return {
          ...state,
          questionGroup: {
            id: state.questionGroup.id,
            questions: [...state.questionGroup.questions, action.payload],
          },
        };
      case QuizAction.removeQuiz:
        return {
          ...state,
          questionGroup: {
            ...state.questionGroup,
            questions: state.questionGroup.questions.filter(
              (q) => q.id !== action.payload
            ),
          },
        };
      case QuizAction.updateQuiz:
        return {
          ...state,
          questionGroup: {
            ...state.questionGroup,
            questions: state.questionGroup.questions.map((q) =>
              q.id === action.payload.id ? action.payload : q
            ),
          },
        };
      case QuizAction.removeAnswerFromQuiz:
        return {
          ...state,
          questionGroup: {
            ...state.questionGroup,
            questions: state.questionGroup.questions.filter((q) => {
              if (q.id === action.payload.quizId) {
                q.answers = q.answers?.filter(
                  (a) => a.id !== action.payload.answerId
                );
              }
              return q;
            }),
          },
        };
      default:
        throw new Error('Unhandled action type');
    }
  }

  const addNewQuiz = (typeOfQuestion: questionType) => {
    const quiz: IQuiz = {
      id: uuidv4(),
      questionType: typeOfQuestion,
      answers: [],
      title: '',
      createdAt: new Date().toISOString(),
    };

    dispatch({ type: QuizAction.addNewQuiz, payload: quiz });
  };

  const clearQuiz = () => {
    dispatch({ type: QuizAction.replaceQuizGroup, payload: initialState });
  };

  const verifyData = (): boolean => {
    if (state.questionGroup.questions.length === 0) {
      displayMessage('Please add at least one question!', 'error', messageApi);
      return false;
    }

    for (const quiz of state.questionGroup.questions) {
      if (quiz.title.trim().length === 0) {
        displayMessage(`Please add a title to the quiz `, 'error', messageApi);
        return false;
      }
      if (quiz.answers.length < 2) {
        displayMessage(
          `Please add at least 2 answers to the  **${quiz.title}** quiz`,
          'error',
          messageApi
        );
        return false;
      }
    }

    return true;
  };

  const previewData = () => {
    const isValidData = verifyData();
    if (isValidData) {
      localStorage.setItem(
        LocalStorageKeys.quizList,
        JSON.stringify(state.questionGroup)
      );
      router.push(ROUTES.preview);
      return;
    }

    return;
  };
  const saveData = async () => {
    const isValidData = verifyData();
    if (!isValidData) {
      return;
    }
    setIsLoading(true);
    console.log(state.questionGroup);
    const body = {
      id: state.questionGroup.id,
      questions: state.questionGroup.questions,
    };

    const result = await postRequest({
      route: '/api/create-quiz',
      data: body,
      headers: {
        'Content-Type': 'application/json',
      },
    });

    if (result.status !== 200) {
      setIsLoading(false);
      return;
    }
    localStorage.clear();
    clearQuiz();
    setIsLoading(false);
    const quizUrl = `answer/${state.questionGroup.id}`;
    setQuizLinks([...quizLinks, quizUrl]);
    return;
  };

  return (
    <>
      {contextHolder}
      {isLoading && <Loader />}
      <div className="w-2/3">
        {quizLinks.length > 0 && (
          <div className="w-full glass mb-6 rounded-lg p-4">
            <div>Link(s)</div>
            <div>
              {quizLinks.map((q, i) => (
                <LinkBox key={i} link={q} messageApi={messageApi} />
              ))}
            </div>
          </div>
        )}
        <div className="w-full glass rounded-lg">
          <div className="card  shadow-xl">
            <div className="card-body">
              <h2 className="card-title">QUIZ!</h2>
              <div>
                <ListOfQuiz
                  questions={state.questionGroup.questions}
                  dispatch={dispatch}
                />
              </div>
              <div className="card-actions w-full">
                <button
                  className="btn btn-primary w-full"
                  onClick={() => setDisplayQuizTypeBox(!displayQuizTypeBox)}
                >
                  <span>&#43;</span> Add Question
                </button>
                <div className="flex flex-row gap-3 items-end justify-end w-full">
                  <button className="btn btn-ghost " onClick={previewData}>
                    Preview
                  </button>
                  <button className="btn btn-success glass" onClick={saveData}>
                    Save
                  </button>
                </div>
              </div>
            </div>
          </div>
          {displayQuizTypeBox && (
            <Modal
              title="Select quiz type"
              open={displayQuizTypeBox}
              onCancel={() => setDisplayQuizTypeBox(false)}
              footer={[
                <button
                  key={uuidv4()}
                  className="btn btn-primary text-white"
                  onClick={() => setDisplayQuizTypeBox(!displayQuizTypeBox)}
                >
                  Cancel
                </button>,
              ]}
            >
              <div>
                {Object.values(questionType).map((type) => {
                  return (
                    <div
                      key={uuidv4()}
                      className="container h-2, hover:bg-purple-200 p-3"
                      onClick={() => {
                        setDisplayQuizTypeBox(!displayQuizTypeBox);
                        addNewQuiz(type);
                      }}
                    >
                      <h1>{type}</h1>
                    </div>
                  );
                })}
              </div>
            </Modal>
          )}
        </div>
      </div>
    </>
  );
};

const LinkBox = (props: { link: string; messageApi: MessageInstance }) => {
  const link = `${process.env.NEXT_PUBLIC_APP_URL}/${props.link}`;
  const handleCopyClick = async () => {
    try {
      await navigator.clipboard.writeText(link);
      displayMessage(`Link copied to clipboard`, 'success', props.messageApi);
    } catch (error) {
      displayMessage(`Failed to copy link`, 'error', props.messageApi);
    }
  };

  return (
    <div className="flex flex-row gap-3 items-center">
      <Link
        href={props.link}
        target="_blank"
        className="text-blue-900 underline"
      >
        {link}
      </Link>
      <button className="btn btn-ghost" onClick={handleCopyClick}>
        COPY
      </button>
    </div>
  );
};

export default QuizBox;
