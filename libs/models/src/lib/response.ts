/**
 * The response keys definition.
 */
export enum IResponseKey {
  id = 'id',
  questionId = 'quiz_group_id',
  answers = 'answers',
  createdAt = 'created_at',
  groupId = 'quiz_id',
}
/**
 * The quiz interface definition.
 */
export interface IResponse {
  [IResponseKey.id]: string;
  [IResponseKey.answers]: string[];
  [IResponseKey.questionId]: string;
  [IResponseKey.createdAt]: string;
  [IResponseKey.groupId]: string;
}
