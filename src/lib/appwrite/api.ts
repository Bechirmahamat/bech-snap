import { INewPost, INewUser } from '@/types'
import { account, appwriteConfig, avatars, databases, storage } from './config'
import { ID, Query } from 'appwrite'

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
    }
}
export async function getAccount() {
    try {
        const currentAccount = await account.get()

        return currentAccount
    } catch (error) {
        console.log(error)
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
