import {
    Route,
    RouterProvider,
    Routes,
    createBrowserRouter,
} from 'react-router-dom'
import LoginForm from './_auth/forms/LoginForm'
import RegisterForm from './_auth/forms/RegisterForm'
import Error from './_root/Error'
import {
    AllUser,
    CreatePost,
    EditPost,
    Explore,
    Home,
    PostDetails,
    Profile,
    RootLayout,
    Saved,
    UpdatePost,
    UpdateProfile,
} from './_root/pages'
import AuthLayout from './_auth/AuthLayout'
import { useToast } from '@/components/ui/use-toast'
import { Toaster } from './components/ui/toaster'

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
                    <Route path='/explore' element={<Explore />} />
                    <Route path='/saved' element={<Saved />} />
                    <Route path='/all-users' element={<AllUser />} />
                    <Route path='/create-post' element={<CreatePost />} />
                    <Route path='/update-post/:id' element={<EditPost />} />
                    <Route path='/posts/:id' element={<PostDetails />} />
                    <Route path='/profile/:id/*' element={<Profile />} />
                    <Route
                        path='/update-profile/:id'
                        element={<UpdateProfile />}
                    />
                </Route>
                {/* public */}
                <Route element={<AuthLayout />}>
                    <Route path='/login' element={<LoginForm />} />
                    <Route path='/register' element={<RegisterForm />} />
                </Route>
            </Routes>

            <Toaster />
        </main>
    )
}

export default App
