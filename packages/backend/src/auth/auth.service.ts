import { UserDto } from '@sbb-journey-companion/common';

import {
  createUser,
  findUserByUsername,
  findUserByUsernameAndPassword,
} from './auth.repository.js';

export async function findUser(username: string): Promise<UserDto | null> {
  return await findUserByUsername(username);
}

export async function register(username: string, password: string): Promise<UserDto | null> {
  const existingUser = await findUserByUsername(username);
  if (existingUser) {
    return null;
  }

  return await createUser(username, password);
}

export async function login(username: string, password: string): Promise<UserDto | null> {
  return await findUserByUsernameAndPassword(username, password);
}
