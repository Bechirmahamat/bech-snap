import { RouterProvider, createBrowserRouter } from 'react-router-dom'

import LoginForm from './_auth/forms/LoginForm'
import RegisterForm from './_auth/forms/RegisterForm'
import { Home, RootLayout } from './_root/pages'

const router = createBrowserRouter([
    {
        path: '/',
        element: <RootLayout />,
        errorElement: <Error />,
        children: [
            {
                index: true,
            },
        ],
    },
    {
        path: '/login',
        element: <LoginForm />,
    },
    {
        path: '/register',
        element: <RegisterForm />,
    },
])
function App() {
    return <RouterProvider router={router}></RouterProvider>
}

export default App
