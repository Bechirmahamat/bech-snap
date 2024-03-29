import { useUserContext } from '@/context/AuthContext'
import {
    useDeleteSavePost,
    useGetCurrentUser,
    useLikePost,
    useSavePost,
} from '@/lib/react-query/queriesAndMutation'
import { checkIsLiked } from '@/lib/utils'
import { Models } from 'appwrite'
import { Loader } from 'lucide-react'
import { useEffect, useState } from 'react'

type PostStatsProps = {
    post?: Models.Document
    userId: string
}
const PostStats = ({ post, userId }: PostStatsProps) => {
    const { mutate: likedPost } = useLikePost()
    const { mutate: savePost, isPending: isSavingLoading } = useSavePost()
    const { mutate: deleteSavedPost, isPending: isDeletingLoading } =
        useDeleteSavePost()
    const { data: currentUser } = useGetCurrentUser()
    const savePostRecord = currentUser?.save.find(
        (record: Models.Document) => record.post.$id === post?.$id
    )

    useEffect(() => {
        setIsSaved(!!savePostRecord)
    }, [currentUser])
    const likesList = post?.likes.map((user: Models.Document) => user.$id)

    const [likes, setLikes] = useState(likesList)
    const [isSaved, setIsSaved] = useState(false)

    const handleLikePost = (e: React.MouseEvent) => {
        e.stopPropagation()
        let newLikes = [...likes]
        const hasLiked = newLikes.includes(userId)

        if (hasLiked) {
            newLikes = newLikes.filter((id) => id !== userId)
        } else {
            newLikes.push(userId)
        }
        setLikes(newLikes)
        likedPost({ postId: post?.$id || '', likesArray: newLikes })
    }
    const handleSavePost = (e: React.MouseEvent) => {
        e.stopPropagation()

        if (savePostRecord) {
            setIsSaved(false)
            deleteSavedPost(savePostRecord.$id)
        } else {
            setIsSaved(true)
            savePost({ postId: post?.$id || '', userId })
        }
    }

    return (
        <div className='flex justify-between items-center z-20'>
            <div className='flex gap-2 mr-5'>
                <img
                    src={
                        checkIsLiked(likes, userId)
                            ? '/assets/icons/liked.svg'
                            : '/assets/icons/like.svg'
                    }
                    alt='like'
                    width={20}
                    height={20}
                    className='cursor-pointer'
                    onClick={(e) => handleLikePost(e)}
                />
                <p className='small-medium lg:base-medium'>{likes.length}</p>
            </div>

            <div className='flex gap-2 '>
                {isSavingLoading || isDeletingLoading ? (
                    <Loader />
                ) : (
                    <img
                        src={
                            isSaved
                                ? '/assets/icons/saved.svg'
                                : '/assets/icons/save.svg'
                        }
                        alt='like'
                        width={20}
                        height={20}
                        onClick={(e) => handleSavePost(e)}
                        className='cursor-pointer'
                    />
                )}
            </div>
        </div>
    )
}
export default PostStats
