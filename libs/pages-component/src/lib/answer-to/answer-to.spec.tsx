import { render } from '@testing-library/react';

import AnswerTo from './answer-to';

describe('AnswerTo', () => {
  it('should render successfully', () => {
    const { baseElement } = render(
      <AnswerTo isPreview={false} quizGroup={{ questions: [], id: 'ed' }} />
    );
    expect(baseElement).toBeTruthy();
  });
});
