import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
import {
    Form,
    FormControl,
    FormField,
    FormItem,
    FormLabel,
    FormMessage,
} from '@/components/ui/form'
import { Input } from '@/components/ui/input'
import { Textarea } from '../ui/textarea'
import FileUploader from '../ui/shared/FileUploader'
import { PostValidation } from '@/lib/validation'
import { Models } from 'appwrite'
import { useUserContext } from '@/context/AuthContext'
import { useToast } from '../ui/use-toast'
import {
    useCreatePost,
    useUpdatePost,
} from '@/lib/react-query/queriesAndMutation'
import { useNavigate } from 'react-router-dom'
import Loader from '../ui/shared/loader'

type PostFormProps = {
    post?: Models.Document
    action: 'Create' | 'Update'
}

const PostForm = ({ post, action }: PostFormProps) => {
    const { toast } = useToast()
    const { mutateAsync: createPost, isPending: isLoadingCreate } =
        useCreatePost()
    const { mutateAsync: updatePost, isPending: isLoadingUpdate } =
        useUpdatePost()
    const { user } = useUserContext()
    const navigate = useNavigate()
    // 1. Define your form.
    const form = useForm<z.infer<typeof PostValidation>>({
        resolver: zodResolver(PostValidation),
        defaultValues: {
            caption: post ? post?.caption : '',
            file: [],
            location: post ? post?.location : '',
            tags: post ? post?.tags.join(',') : '',
        },
    })
    // handle onSubmit
    async function onSubmit(values: z.infer<typeof PostValidation>) {
        if (post && action === 'Update') {
            const update = await updatePost({
                ...values,
                postId: post.$id,
                imageId: post?.imageId,
                imageUrl: post?.imageUrl,
            })

            if (!update) {
                toast({ title: 'Please Try Again ' })
            }
            return navigate(`/posts/${post.$id}`)
        }
        const newPost = await createPost({ ...values, userId: user.id })
        if (!newPost) {
            toast({ title: 'something went wrong' })
        }
        navigate('/')
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex gap-4 flex-col max-w-3xl w-full'
            >
                <FormField
                    control={form.control}
                    name='caption'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>
                                Caption
                            </FormLabel>
                            <FormControl>
                                <Textarea
                                    className='shad-textarea custom-scrollbar'
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='file'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>
                                Add picture
                            </FormLabel>
                            <FormControl>
                                <FileUploader
                                    fieldChange={field.onChange}
                                    mediaUrl={post?.imageUrl}
                                />
                            </FormControl>

                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='location'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>
                                Add location
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='shad-input'
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <FormField
                    control={form.control}
                    name='tags'
                    render={({ field }) => (
                        <FormItem>
                            <FormLabel className='shad-form_label'>
                                Add Tags (sepearated by comma " , ")
                            </FormLabel>
                            <FormControl>
                                <Input
                                    type='text'
                                    className='shad-input'
                                    placeholder='Art, Expression, Learn'
                                    {...field}
                                />
                            </FormControl>

                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <div className='flex gap-4 mt-4 items-center justify-end'>
                    <Button
                        type='button'
                        className='whitespace-nowrap  bg-orange-700 hover:bg-orange-800'
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        className=' whitespace-nowrap bg-primary-500 hover:bg-primary-600'
                        disabled={isLoadingCreate || isLoadingUpdate}
                    >
                        {isLoadingCreate || isLoadingUpdate ? (
                            <>
                                <Loader />
                                <span>loading...</span>
                            </>
                        ) : action === 'Update' ? (
                            'Update'
                        ) : (
                            'Create'
                        )}
                    </Button>
                </div>
            </form>
        </Form>
    )
}
export default PostForm
