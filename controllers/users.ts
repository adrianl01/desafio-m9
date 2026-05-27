import { User } from "../models/users";

export async function getUserById(id: string) {
  const user = new User(id);

  await user.pull();

  if (!user.data) {
    throw new Error("User not found");
  }

  return user.data;
}

export async function updateUserAddress(
  id: string,
  newAddress: string
) {
  const user = new User(id);

  await user.pull();

  if (!user.data) {
    throw new Error("User not found");
  }

  user.data.address = newAddress;

  await user.push();

  return user.data;
}

export async function updateAddtionalUserData(
  id: string,
  newUserData: any
) {
  const user = new User(id);

  await user.pull();

  if (!user.data) {
    throw new Error("User not found");
  }

  user.data.additionalUserData = newUserData;

  await user.push();

  return user.data;
}

export async function getUserOrders(id: string) {
  const user = new User(id);

  const orders = await user.getUserOrders();

  return orders;
}