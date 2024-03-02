import { Models } from 'appwrite'
import Loader from './loader'
import { GridPostList } from '.'

type searchProps = {
    isSearchFetching: boolean
    searchedPosts: Models.Document[]
}

const SearchResults = ({ isSearchFetching, searchedPosts }: searchProps) => {
    if (isSearchFetching) return <Loader />
    if (searchedPosts && searchedPosts.documents.length > 0) {
        return <GridPostList posts={searchedPosts.documents} />
    }
    return (
        <div>
            <p className='text-light-4 mt-10 text-center w-full'>
                No result found
            </p>
        </div>
    )
}
export default SearchResults
