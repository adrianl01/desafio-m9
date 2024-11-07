import { use } from "react"
import { User } from "../models/users"

export async function getUserById(id: string) {
    const user = new User(id)
    await user.pull()
    return user.data
}

export async function updateUserAddress(id: string, newAddress: string) {
    console.log("newAddress", newAddress)
    const user = new User(id)
    await user.pull()
    user.data.address = newAddress
    await user.push()
    return user.data
}