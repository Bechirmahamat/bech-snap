import { INewUser } from '@/types'
import { account, appwriteConfig, avatars, databases } from './config'
import { ID } from 'appwrite'

export const createUserAccount = async (user: INewUser) => {
    try {
        const newAccount = await account.create(
            ID.unique(),
            user.email,
            user.password,
            user.name
        )
        if (!newAccount) throw Error('Could not create user account')
        const avatarUrl = avatars.getInitials(user.name)
        const newUser = await saveUserToDB({
            accountID: newAccount.$id,
            name: newAccount.name,
            email: newAccount.email,
            username: user.username,
            imageUrl: avatarUrl,
        })
        return newUser
    } catch (error) {
        console.log(error)
    }
}

export async function saveUserToDB(user: {
    accountID: string
    name: string
    email: string
    username?: string
    imageUrl: URL
}) {
    try {
        const newUser = databases.createDocument(
            appwriteConfig.databaseId,
            appwriteConfig.userCollectionId,
            ID.unique(),
            user
        )
        console.log(newUser)

        return newUser
    } catch (error) {
        console.log(error)
    }
}

export async function signInAccount(user: { email: string; password: string }) {
    try {
        const session = await account.createEmailSession(
            user.email,
            user.password
        )
        return session
    } catch (error) {
        console.log(error)
    }
}
