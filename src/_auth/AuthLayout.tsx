import { Navigate, Outlet } from 'react-router-dom'

const AuthLayout = () => {
    const isAuthenticated = false
    return (
        <>
            {isAuthenticated ? (
                <Navigate to='/' />
            ) : (
                <>
                    <section className='flex flex-1 items-center flex-col justify-center py-10'>
                        <Outlet />
                    </section>
                    <img
                        src='/assets/images/side-img.svg'
                        alt=''
                        className='hidden lg:block object-cover mt-5 h-screen w-1/2 bg-no-repeat '
                    />
                </>
            )}
        </>
    )
}
export default AuthLayout
