import bcrypt from 'bcryptjs';
import { randomUUID } from 'node:crypto';

import { db } from './db.js';

interface User {
  id: string;
  username: string;
  isAdmin: boolean;
}

interface UserRow {
  id: string;
  username: string;
  password_hash: string;
  is_admin: number;
}

const SALT_ROUNDS = 12;

function toUser(row: UserRow): Pick<User, 'id' | 'username' | 'isAdmin'> {
  return { id: row.id, username: row.username, isAdmin: !!row.is_admin };
}

export async function findUserByUsername(
  username: string,
): Promise<Pick<User, 'id' | 'username' | 'isAdmin'> | null> {
  const row = db
    .prepare('SELECT id, username, is_admin FROM users WHERE username = ?')
    .get(username) as UserRow | undefined;

  return row ? toUser(row) : null;
}

export async function findUserByUsernameAndPassword(
  username: string,
  password: string,
): Promise<Pick<User, 'id' | 'username' | 'isAdmin'> | null> {
  const row = db
    .prepare('SELECT id, username, password_hash, is_admin FROM users WHERE username = ?')
    .get(username) as UserRow | undefined;

  if (!row) return null;

  const passwordMatch = await bcrypt.compare(password, row.password_hash);
  if (!passwordMatch) return null;

  return toUser(row);
}

export async function createUser(
  username: string,
  password: string,
): Promise<Pick<User, 'id' | 'username' | 'isAdmin'>> {
  const passwordHash = await bcrypt.hash(password, SALT_ROUNDS);
  const id = randomUUID();

  try {
    db.prepare('INSERT INTO users (id, username, password_hash, is_admin) VALUES (?, ?, ?, 0)').run(
      id,
      username,
      passwordHash,
    );
  } catch (err) {
    if (err instanceof Error && (err as { code?: string }).code === 'SQLITE_CONSTRAINT_UNIQUE') {
      throw new Error('USERNAME_TAKEN');
    }
    throw err;
  }

  return { id, username, isAdmin: false };
}
