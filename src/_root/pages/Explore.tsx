import { Input } from '@/components/ui/input'
import { GridPostList, SearchResults } from '@/components/ui/shared'
import Loader from '@/components/ui/shared/loader'
import useDebounce from '@/hooks/useDebounce'
import {
    useGetPosts,
    useSearchPost,
} from '@/lib/react-query/queriesAndMutation'
import { useState } from 'react'

const Explore = () => {
    const { data: posts, fetchNextPage, hasNextPage } = useGetPosts()

    const [searchValue, setSearchValue] = useState('')
    const shouldShowSearchResults = searchValue !== ''
    const debouncedValue = useDebounce(searchValue, 500)
    const { data: searchedPosts, isFetching: isSearchFetching } =
        useSearchPost(debouncedValue)
    if (!posts) {
        return (
            <div className='flex-center w-full h-full'>
                <Loader />
            </div>
        )
    }
    console.log(posts)

    const shouldShowPosts =
        !shouldShowSearchResults &&
        posts.pages.every((item) => item.documents.length === 0)
    return (
        <section className='explore-container'>
            <div className='explore-inner_container'>
                <h2 className='h3-bold md:h2-bold w-full'>Search Posts</h2>
                <div className='flex gap-1 px-4 w-full bg-dark-4 rounded-lg'>
                    <img
                        src='/assets/icons/search.svg'
                        alt='seacrh'
                        width={24}
                        height={24}
                        className=''
                    />
                    <Input
                        type='text'
                        placeholder='search'
                        className='explore-search'
                        value={searchValue}
                        onChange={(e) => setSearchValue(e.target.value)}
                    />
                </div>
            </div>
            <div className='flex-between w-full max-w-5xl mt-16 mb-7'>
                <h2 className='body-bold md:h3-bold'>Popular Today</h2>

                <div className='flex-center gap-3 bg-dark-3 rounded-xl px-4 py-2 cursor-pointer'>
                    <p className='small-medium md:base-medium text-light-2'>
                        All
                    </p>
                    <img
                        src='/assets/icons/filter.svg'
                        width={20}
                        height={20}
                        alt='filter'
                    />
                </div>
            </div>
            <div className='flex flex-wrap gap-9 w-full max-w-5xl'>
                {shouldShowSearchResults ? (
                    <SearchResults
                        isSearchFetching={isSearchFetching}
                        searchedPosts={searchedPosts}
                    />
                ) : shouldShowPosts ? (
                    <p className='text-light-4 mt-20 text-center w-full '>
                        End of Posts
                    </p>
                ) : (
                    posts.pages.map((item, index) => (
                        <GridPostList key={index} posts={item.documents} />
                    ))
                )}
            </div>
            {hasNextPage && !searchValue && (
                <div ref={ref} className='mt-10'>
                    <Loader />
                </div>
            )}
        </section>
    )
}
export default Explore
