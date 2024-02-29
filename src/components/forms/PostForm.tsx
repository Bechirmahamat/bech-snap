import { zodResolver } from '@hookform/resolvers/zod'
import { useForm } from 'react-hook-form'
import { z } from 'zod'
import { Button } from '@/components/ui/button'
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
import { Textarea } from '../ui/textarea'
import FileUploader from '../ui/shared/FileUploader'
const formSchema = z.object({
    username: z.string().min(2, {
        message: 'Username must be at least 2 characters.',
    }),
})

const PostForm = ({ post }) => {
    // 1. Define your form.
    const form = useForm<z.infer<typeof formSchema>>({
        resolver: zodResolver(formSchema),
        defaultValues: {
            username: '',
        },
    })
    // handle onSubmit
    function onSubmit(values: z.infer<typeof formSchema>) {
        console.log(values)
    }

    return (
        <Form {...form}>
            <form
                onSubmit={form.handleSubmit(onSubmit)}
                className='flex flex-col max-w-5xl w-full'
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
                    name='caption'
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
                                <Input type='text' className='shad-input' />
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
                                />
                            </FormControl>

                            <FormMessage className='shad-form_message' />
                        </FormItem>
                    )}
                />
                <div className='flex gap-4 items-center justify-end'>
                    <Button type='button' className='shad-button_dark_4'>
                        Cancel
                    </Button>
                    <Button
                        type='submit'
                        className='shad-button_primary whitespace-nowrap'
                    >
                        Submit
                    </Button>
                </div>
            </form>
        </Form>
    )
}
export default PostForm
