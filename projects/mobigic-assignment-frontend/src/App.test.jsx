import { render, screen } from '@testing-library/react';
import { MemoryRouter } from 'react-router-dom';
import App from './App';

test('renders the private file sharing home page', () => {
  render(<MemoryRouter><App /></MemoryRouter>);
  expect(screen.getByRole('heading', { name: /your files\. your links\. your choice\./i })).toBeInTheDocument();
});
