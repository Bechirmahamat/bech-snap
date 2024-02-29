import PostCard from '@/components/ui/shared/PostCard'
import Loader from '@/components/ui/shared/loader'
import { useGetRecentPost } from '@/lib/react-query/queriesAndMutation'
import { Models } from 'appwrite'

const Home = () => {
    const {
        data: posts,
        isLoading: isPostLoading,
        isError: isErrorPosts,
    } = useGetRecentPost()
    // console.log(posts)

    return (
        <section className='flex flex-1'>
            <div className='home-container'>
                <div className='home-posts'>
                    <h2 className='h3-bold md:h2-bold text-left w-full'>
                        Home feed
                    </h2>
                    {isPostLoading && !posts ? (
                        <Loader />
                    ) : (
                        <ul className='flex flex-col flex-1 gap-9 w-full'>
                            {posts?.documents.map((post: Models.Document) => {
                                return <PostCard key={post.$id} post={post} />
                            })}
                        </ul>
                    )}
                </div>
            </div>
        </section>
    )
}
export default Home
