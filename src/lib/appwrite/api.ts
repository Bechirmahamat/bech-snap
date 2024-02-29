import { INewUser } from '@/types'
import { account, appwriteConfig, avatars, databases } from './config'
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
export async function getAccount() {
    try {
        console.log('get ')
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
