import React from 'react';
import App from './App';
import {BrowserRouter} from 'react-router-dom';
import '@testing-library/jest-dom';
import {render, screen} from "./helpers/test-utils";

test('renders welcome to Postgram text', () => {
  render(<App/>);
  const linkElement = screen.getByText(/Welcome to Postgram!/i);
  expect(linkElement).toBeInTheDocument();
});
