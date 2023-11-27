import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import { act } from 'react-dom/test-utils'
import LoginForm from'./';
import { BrowserRouter } from 'react-router-dom';

global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({ token: 'mockedToken'})
});

describe('test login form', () => {
  beforeAll(() => {
    Object.defineProperty(window, 'matchMedia', {
      writable: true,
      value: jest.fn().mockImplementation(query => ({
          matches: false,
          media: query,
          onchange: null,
          addListener: jest.fn(),
          removeListener: jest.fn(),
          addEventListener: jest.fn(),
          removeEventListener: jest.fn(),
          dispatchEvent: jest.fn(),
      })),
    });
  });  
    test('Login Form Title render correctly', async () => {
      render(
          <BrowserRouter>
            <LoginForm />
          </BrowserRouter>
        );
      expect(screen.getByText('Login Form')).toBeDefined();
    })

  test('labels render correctly', async () => {
    render(
        <BrowserRouter>
          <LoginForm />
        </BrowserRouter>
      );
    expect(screen.getByText('Email')).toBeDefined();
    expect(screen.getByText('Password')).toBeDefined();
    expect(screen.getByText('or')).toBeDefined();
  })

  test('buttons render correctly', async () => {
      render(
          <BrowserRouter>
            <LoginForm />
          </BrowserRouter>
        );
      expect(screen.getByText('Login')).toBeDefined();
      expect(screen.getByText('Sign Up')).toBeDefined();
    })

  test('submits the form and set token in localStorage', async () => {   
      render(<BrowserRouter>
              <LoginForm />
            </BrowserRouter>)
      const email = screen.getByPlaceholderText('Enter email');
      const password = screen.getByPlaceholderText('Enter password');
      const button = screen.getByText('Login');

      act(() => {
          fireEvent.change(email, { target: { value : 'rpb@aa.com'}});
          fireEvent.change(password, { target: { value : 'password'}});
          fireEvent.click(button);
      })

      await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/user/login', expect.any(Object));
      })
  })
})