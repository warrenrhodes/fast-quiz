import { IQuizGroup } from '@fast-quiz/models';
import AnswerTo from '../answer-to/answer-to';

/* eslint-disable-next-line */
export interface AnswerProps {
  quizGroup: IQuizGroup;
}

export function Answer(props: AnswerProps) {
  return <AnswerTo isPreview={false} quizGroup={props.quizGroup} />;
}

export default Answer;
