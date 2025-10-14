import { render, screen } from '@testing-library/react';
import Web from './Web/Web';

test('renderiza', () => {
  render(<Web />);
  const linkElement = screen.getByText(/learn react/i);
  expect(linkElement).toBeInTheDocument();
});
