import { render } from '@testing-library/react';

import { QuizResult } from './quiz-result';

describe('Result', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<QuizResult result={[]} />);
    expect(baseElement).toBeTruthy();
  });
});
