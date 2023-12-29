import { render } from '@testing-library/react';

import HomeUi from './home-ui';

describe('HomeUi', () => {
  it('should render successfully', () => {
    const { baseElement } = render(<HomeUi />);
    expect(baseElement).toBeTruthy();
  });
});
