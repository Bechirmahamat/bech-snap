import {
    Route,
    RouterProvider,
    Routes,
    createBrowserRouter,
} from 'react-router-dom'
import LoginForm from './_auth/forms/LoginForm'
import RegisterForm from './_auth/forms/RegisterForm'
import Error from './_root/Error'
import { Home, RootLayout } from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
// const router = createBrowserRouter([
//     {
//         path: '/',
//         element: <RootLayout />,
//         errorElement: <Error />,
//         children: [
//             {
//                 index: true,
//             },
//         ],
//     },
//     {
//         path: '/auth',
//         element: <AuthLayout />,
//         children: [
//             {
//                 path: '/login',
//                 element: <LoginForm />,
//             },
//             {
//                 path: '/register',
//                 element: <RegisterForm />,
//             },
//         ],
//     },
// ])
function App() {
    return (
        <main className='flex min-h-screen'>
            <Routes>
                {/* private */}
                <Route element={<RootLayout />}>
                    <Route path='/' element={<Home />} />
                </Route>
                {/* public */}
                <Route element={<AuthLayout />}>
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/register' element={<RegisterForm />} />
                </Route>
            </Routes>
        </main>
    )
}

export default App
