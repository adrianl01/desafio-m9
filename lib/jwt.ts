import jwt from "jsonwebtoken";

const SECRET = process.env.JWT_SECRET as string;

export function generate(obj: object) {
  return jwt.sign(obj, SECRET, {
    expiresIn: "30d",
  });
}

export async function decode(token: string) {
  try {
    return jwt.verify(token, SECRET);
  } catch (e) {
    console.error("token incorrecto");
    return null;
  }
}