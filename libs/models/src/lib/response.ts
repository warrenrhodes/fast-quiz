/**
 * The response keys definition.
 */
export enum IResponseKey {
  id = 'id',
  questionId = 'questionId',
  answers = 'answers',
  createdAt = 'createdAt',
  groupId = 'groupId',
}
/**
 * The quiz interface definition.
 */
export interface IResponse {
  [IResponseKey.id]: string;
  [IResponseKey.answers]: string[] | string;
  [IResponseKey.questionId]: string;
  [IResponseKey.createdAt]: string;
  [IResponseKey.groupId]: string;
}
