import jwt from "jsonwebtoken"

export function generate(obj) {
    return jwt.sign(obj, process.env.JWT_SECRET);
}

export async function decode(token) {
    try {
        return jwt.verify(token, process.env.JWT_SECRET);
    } catch (e) {
        console.error("token incorrecto")
        return null
    }
}

