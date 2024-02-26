import { zodResolver } from '@hookform/resolvers/zod'
import { Button } from '@/components/ui/button'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import {
    Form,
    FormControl,
    FormDescription,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { RegisterValidation } from '@/lib/validation'
import Loader from '@/components/ui/shared/loader'
import { Link } from 'react-router-dom'

const RegisterForm = () => {
    const isLoading = false
    // 1. Define your form.
    const form = useForm<z.infer<typeof RegisterValidation>>({
        resolver: zodResolver(RegisterValidation),
        defaultValues: {
            name: '',
            username: '',
            email: '',
            password: '',
        },
    })

    // 2. Define a submit handler.
    function onSubmit(values: z.infer<typeof RegisterValidation>) {
        // Do something with the form values.
        // ✅ This will be type-safe and validated.
        console.log(values)
    }
    return (
        <Form {...form}>
            <div className='w-80 sm:w-420 flex flex-center flex-col '>
                <img src='assets/images/logo.svg' alt='logo' />
                <h2 className='h3-bold md:h2-bold pt-5 sm:pt-12'>
                    Create a new Account
                </h2>
                <p className='text-light-3 small-medium md:base-regular mt-2'>
                    To use snapgram enter your details
                </p>

                <form
                    onSubmit={form.handleSubmit(onSubmit)}
                    className='flex flex-col gap-5 w-full mt-4'
                >
                    <FormField
                        control={form.control}
                        name='name'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Name</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-red' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='username'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Username</FormLabel>
                                <FormControl>
                                    <Input
                                        type='text'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-red' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='email'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Email</FormLabel>
                                <FormControl>
                                    <Input
                                        type='email'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-red' />
                            </FormItem>
                        )}
                    />
                    <FormField
                        control={form.control}
                        name='password'
                        render={({ field }) => (
                            <FormItem>
                                <FormLabel>Password</FormLabel>
                                <FormControl>
                                    <Input
                                        type='password'
                                        className='shad-input'
                                        {...field}
                                    />
                                </FormControl>
                                <FormMessage className='text-red w-full truncate' />
                            </FormItem>
                        )}
                    />
                    <Button type='submit' className='shad-button_primary'>
                        {isLoading ? (
                            <div className='flex flex-center gap-2'>
                                <Loader />
                                loading...
                            </div>
                        ) : (
                            <span>Register</span>
                        )}
                    </Button>
                    <p className='text-small-regular text-center mt-2 text-light-2'>
                        Already have an account ?{' '}
                        <Link
                            to={'/login'}
                            className='text-primary-500 text-small-semibold ml-1'
                        >
                            Login
                        </Link>
                    </p>
                </form>
            </div>
        </Form>
    )
}
export default RegisterForm
