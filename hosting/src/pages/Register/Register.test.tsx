import { fireEvent, render, screen, waitFor } from '@testing-library/react'
import RegisterForm from'./';
import { BrowserRouter } from 'react-router-dom';
import { act } from 'react-dom/test-utils'

global.fetch = jest.fn().mockResolvedValue({
  json: async () => ({ token: 'mockedToken'})
});
describe('test register form', () => {
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
    test('Register form Title render correctly', async () => {
      render(
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        );
      expect(screen.getByText('Registration Form')).toBeDefined();
    })

    test('Label name render correctly', async () => {
      render(
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        );
      expect(screen.getByText('Name')).toBeDefined();
      expect(screen.getByText('Email')).toBeDefined();
      expect(screen.getByText('Password')).toBeDefined(); 
      expect(screen.getByText('or')).toBeDefined();        
    })

    test('Buttons render correctly', async () => {
      render(
          <BrowserRouter>
            <RegisterForm />
          </BrowserRouter>
        );
      expect(screen.getByText('Sign Up')).toBeDefined();
      expect(screen.getByText('Login')).toBeDefined();
    })
    
    test('submit registration test', async () => { 
      render(<BrowserRouter>
              <RegisterForm />
            </BrowserRouter>)
      const name = screen.getByPlaceholderText('Enter name');
      const email = screen.getByPlaceholderText('Enter email');
      const password = screen.getByPlaceholderText('Enter password');
      const button = screen.getByText('Sign Up');

      act(() => {
        fireEvent.change(name, { target: { value : 'rpb'}});
        fireEvent.change(email, { target: { value : 'rpb@cc.com'}});
        fireEvent.change(password, { target: { value : '12345'}});
        fireEvent.click(button);
      })

      await waitFor(() => {
          expect(global.fetch).toHaveBeenCalledWith('https://mock-api.arikmpt.com/api/user/register', expect.any(Object));
      })
    })
})