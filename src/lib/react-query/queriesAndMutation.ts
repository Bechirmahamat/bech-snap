import {
    QueryClient,
    useInfiniteQuery,
    useMutation,
    useQueries,
    useQueryClient,
} from '@tanstack/react-query'
import { createPost, createUserAccount, signInAccount } from '../appwrite/api'
import { INewPost, INewUser } from '@/types'
import { QUERY_KEYS } from './Query'

export const useCreateUserAccountMutation = () => {
    return useMutation({
        mutationFn: (user: INewUser) => createUserAccount(user),
    })
}
export const useSignInAccountMutation = () => {
    return useMutation({
        mutationFn: (user: { email: string; password: string }) =>
            signInAccount(user),
    })
}

export const useSignOutAccountMutation = () => {
    return useMutation({
        mutationFn: signInAccount,
    })
}
export const useCreatePost = () => {
    const queryClient = useQueryClient()
    return useMutation({
        mutationFn: (post: INewPost) => createPost(post),
        onSuccess: (data) => {
            queryClient.invalidateQueries({
                queryKey: [QUERY_KEYS.GET_RECENT_POSTS],
            })
        },
    })
}
