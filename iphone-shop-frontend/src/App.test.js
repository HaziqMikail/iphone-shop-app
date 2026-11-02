import { render, screen } from '@testing-library/react';
import App from './App';

test('renders iPhone Shop App loading state', () => {
  render(<App />);
  const loadingElement = screen.getByText(/loading products/i);
  expect(loadingElement).toBeInTheDocument();
});
