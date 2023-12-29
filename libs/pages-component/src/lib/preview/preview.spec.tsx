import { render } from '@testing-library/react';

import Preview from './preview';

describe('Preview', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<Preview />);
    expect(baseElement).toBeTruthy();
  });
});
