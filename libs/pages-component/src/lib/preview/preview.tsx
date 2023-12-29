'use client';
import { IQuizGroup } from '@fast-quiz/models';
import Answer from '../answer/answer';
import { LocalStorageKeys } from '../utils/constants';
import { useState, useEffect } from 'react';

/* eslint-disable-next-line */
export interface PreviewProps {}

export function Preview() {
  const [data, setData] = useState<IQuizGroup | null>(null);

  useEffect(() => {
    const data = localStorage.getItem(LocalStorageKeys.quizList);
    if (data && (JSON.parse(data) as IQuizGroup).questions.length > 0) {
      setData(JSON.parse(data) as IQuizGroup);
      return;
    }
  }, []);

  if (!data) {
    return <div>Error </div>;
  }

  if (data.questions.length === 0) {
    return <div>No quiz found</div>;
  }

  return (
    <div className="">
      <Answer isPreview={true} quizGroup={data} />
    </div>
  );
}

export default Preview;
