import { INewPost, INewUser, IUpdatePost } from '@/types'
import { account, appwriteConfig, avatars, databases, storage } from './config'
import { ID, Query } from 'appwrite'
import { error } from 'console'

export const createUserAccount = async (user: INewUser) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )

        if (!newAccount) throw Error
        const avatarUrl = avatars.getInitials(user.name)

        const newUser = await saveUserToDB({
            accountId: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })

        return newUser
    } catch (error) {
        console.log(error)
        return error
    }
}

export const saveUserToDB = async (user: {
    accountId: string
    email: string
    name: string
    imageUrl: URL
    username?: string
}) => {
    try {
        //
        console.log('here')
        const databaseId = appwriteConfig.databaseId
        const collectionId = appwriteConfig.userCollectionId
        const documentId = ID.unique()
        const newUsers = await databases.createDocument(
            databaseId,
            collectionId,
            documentId,
            user
        )

        return newUsers
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const email = user.email
        const password = user.password
        const session = await account.createEmailSession(email, password)
        return session
    } catch (error) {
        console.log(error)
    }
}
export const signOutAccount = async () => {
    try {
        const session = await account.deleteSession('current')
        return session
    } catch (error) {
        console.log(error)
        return null
    }
}
export async function getAccount() {
    try {
        const currentAccount = await account.get()

        return currentAccount
    } catch (error) {
        // console.log(error)
        return null
    }
}

export const getCurrentUser = async () => {
    try {
        const databaseId = appwriteConfig.databaseId
        const collectionId = appwriteConfig.userCollectionId

        const account = await getAccount()

        if (!account) throw Error
        const currentUser = await databases.listDocuments(
            databaseId,
            collectionId,
            [Query.equal('accountId', account.$id)]
        )
        if (!currentUser) throw Error

        return currentUser.documents[0]
    } catch (error) {
        console.log(error)
    }
}

export const createPost = async (post: INewPost) => {
    try {
        // upload image to storage
        const uploadedFile = await uploadFile(post.file[0])
        if (!uploadedFile) throw Error

        // getThefileUrl;
        const fileUrl = await getFilePreview(uploadedFile.$id)
        if (!fileUrl) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }
        // console.log(fileUrl)

        // convert tags into an array
        const tags = post.tags?.replace(/ /g, '').split(',') || []
        const newPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            ID.unique(),
            {
                creator: post.userId,
                caption: post.caption,
                imageUrl: fileUrl,
                imageId: uploadedFile.$id,
                location: post.location,
                tags: tags,
            }
        )
        if (!newPost) {
            await deleteFile(uploadedFile.$id)
            throw Error
        }
        return newPost
    } catch (error) {
        console.log(error)
    }
}
export const deleteFile = async (fileId: string) => {
    try {
        await storage.deleteFile(appwriteConfig.storageId, fileId)
        return { status: 'ok' }
    } catch (error) {
        console.log(error)
    }
}
export const getFilePreview = async (fileId: string) => {
    try {
        const fileUrl = storage.getFilePreview(
            appwriteConfig.storageId,
            fileId,
            2000,
            2000,
            'top',
            100
        )
        return fileUrl
    } catch (error) {
        console.log(error)
    }
}

export const uploadFile = async (file: File) => {
    try {
        const uploadFile = await storage.createFile(
            appwriteConfig.storageId,
            ID.unique(),
            file
        )
        return uploadFile
    } catch (error) {
        console.log(error)
    }
}

// get Recent post

export const getRecentPosts = async () => {
    const posts = await databases.listDocuments(
        appwriteConfig.databaseId,
        appwriteConfig.postCollectionId,
        [Query.orderDesc('$createdAt'), Query.limit(20)]
    )
    if (!posts) throw Error
    return posts
}

// get the like post

export const likedPost = async (postId: string, likesArray: string[]) => {
    try {
        // console.log(postId)

        const updatedPost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId,
            {
                likes: likesArray,
            }
        )
        if (!updatedPost) throw Error
        return updatedPost
    } catch (error) {
        console.log(error)
    }
}

// save a post i mean user when he want to save a post

export const savePost = async (postId: string, userId: string) => {
    try {
        const savingPost = await databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            ID.unique(),
            {
                user: userId,
                post: postId,
            }
        )
        if (!savingPost) throw Error
        return savingPost
    } catch (error) {
        console.log(error)
    }
}

//delete saved post
export const deleteSavePost = async (saveRecordId: string) => {
    try {
        const statusCode = await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.saveCollectionId,
            saveRecordId
        )
        if (!statusCode) throw Error
        return { status: 'ok' }
    } catch (error) {
        console.log(error)
    }
}

export const getPostById = async (postId: string) => {
    try {
        const getPost = await databases.getDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
        return getPost
    } catch (error) {
        console.log(error)
    }
}

// updating post

export const updatePost = async (post: IUpdatePost) => {
    const hadFileToUpdate = post.file.length > 0
    try {
        let image = {
            imageUrl: post.imageUrl,
            imageId: post.imageId,
        }
        if (hadFileToUpdate) {
            // upload image to storage
            const uploadedFile = await uploadFile(post.file[0])
            if (!uploadedFile) throw Error
            // getThefileUrl;
            const fileUrl = await getFilePreview(uploadedFile.$id)
            if (!fileUrl) {
                await deleteFile(uploadedFile.$id)
                throw Error
            }
            image = { ...image, imageId: uploadedFile.$id, imageUrl: fileUrl }
        }

        // convert tags into an array
        const tags = post.tags?.replace(/ /g, '').split(',') || []
        const updatePost = await databases.updateDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            post.postId,
            {
                caption: post.caption,
                imageUrl: image.imageUrl,
                imageId: image.imageId,
                location: post.location,
                tags: tags,
            }
        )
        if (!updatePost) {
            await deleteFile(post.imageId)
            throw Error
        }
        return updatePost
    } catch (error) {
        console.log(error)
    }
}

export const deletePost = async (postId: string, imageId: string) => {
    if (!postId || !imageId) throw Error
    try {
        await databases.deleteDocument(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            postId
        )
    } catch (error) {
        console.log(error)
    }
}

export const getInfinitePosts = async ({
    pageParam,
}: {
    pageParam: number
}) => {
    const queries: any[] = [Query.orderDesc('$updatedAt'), Query.limit(10)]
    if (pageParam) {
        queries.push(Query.cursorAfter(pageParam.toString()))
    }
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            queries
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error)
    }
}
export const searchPosts = async ({ searchTerm }: { searchTerm: string }) => {
    try {
        const posts = await databases.listDocuments(
            appwriteConfig.databaseId,
            appwriteConfig.postCollectionId,
            [Query.search('caption', searchTerm)]
        )
        if (!posts) throw Error
        return posts
    } catch (error) {
        console.log(error)
    }
}
