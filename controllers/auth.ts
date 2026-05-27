import { User } from "../models/users";
import { Auth } from "../models/auth";
import { addMinutes } from "date-fns";

export async function findOrCreateAuth(email: string): Promise<Auth> {
  const cleanEmail = email.trim().toLowerCase();

  const auth = await Auth.findByEmail(cleanEmail);

  if (auth) {
    console.log("auth encontrado");
    return auth;
  }

  console.log("se crea uno nuevo");

  const newUser = await User.createNewUser({
    email: cleanEmail,
  });

  const newAuth = await Auth.createNewAuth({
    email: cleanEmail,
    userId: newUser.id,
    code: null,
    expires: null,
    validCode: false,
  });

  return newAuth;
}

export async function createCode(email: string) {
  const cleanEmail = email.trim().toLowerCase();

  const auth = await findOrCreateAuth(cleanEmail);

  let newCode: number;

  do {
    newCode = Math.floor(10000 + Math.random() * 90000);
  } while (newCode === auth.data.code);

  const expires = addMinutes(new Date(), 20);

  auth.data.code = newCode;
  auth.data.expires = expires;
  auth.data.validCode = true;

  await auth.push();

  console.log("nuevo código:", newCode);
  console.log("expira:", expires);

  return auth;
}