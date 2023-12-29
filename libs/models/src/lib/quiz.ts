/**
 * The quiz keys definition.
 */
export enum IQuizKey {
  id = 'id',
  title = 'title',
  answers = 'answers',
  createdAt = 'createdAt',
  questionType = 'questionType',
}

/**
 * The quiz keys definition.
 */
export enum IQuizGroupKey {
  id = 'id',
  questions = 'questions',
}

/**
 * The quiz interface definition.
 */
export interface IQuiz {
  [IQuizKey.id]: string;
  [IQuizKey.title]: string;
  [IQuizKey.answers]: IAnswer[];
  [IQuizKey.questionType]: questionType;
  [IQuizKey.createdAt]: string;
}
/**
 * The quiz group interface definition.
 */
export interface IQuizGroup {
  [IQuizGroupKey.id]: string;
  [IQuizGroupKey.questions]: IQuiz[];
}

/**
 * The answer keys definition.
 */
export enum IAnswerKey {
  id = 'id',
  answer = 'answer',
}

export interface IAnswer {
  [IAnswerKey.id]: string;
  [IAnswerKey.answer]: string;
}

export enum questionType {
  checkBox = 'checkBox',
  radio = 'radio',
  text = 'text',
}
