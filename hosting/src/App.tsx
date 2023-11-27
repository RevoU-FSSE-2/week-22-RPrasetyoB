import { LoginForm, RegisterForm, HomePage } from './pages'
import './App.css'
import { PublicLayout } from './LayOut'
import { createBrowserRouter, RouterProvider } from 'react-router-dom'
import { AppProvider } from './provider'

const App = () => {
  
  const router = createBrowserRouter([
    {
      element: <PublicLayout />,
      children: [
        {
          path: '/',
          element: <HomePage />
        }
      ]
    },
    {
      element: <LoginForm />,
      path: '/login'
    },
    {
      path: '/register',
      element: <RegisterForm />
    }
  ])


  return (
    <AppProvider>
      <RouterProvider router={router} />
    </AppProvider>
    
  )
}

export default App
