import React from 'react';
import { render, screen } from '@testing-library/react';
import App from './App';

test('renders User Management Dashboard title', () => {
  render(<App />);
  const headingElement = screen.getByText(/User Management Dashboard/i);
  expect(headingElement).toBeInTheDocument();
});
