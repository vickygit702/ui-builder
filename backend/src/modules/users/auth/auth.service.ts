import { pool } from '../../../shared/utils/db';
import { UserLoginInput, UserAuthResponse } from '../../../shared/types/user.types';

export async function loginUser(input: UserLoginInput): Promise<UserAuthResponse> {
  const result = await pool.query(
    `SELECT id, email, password, role FROM users.account WHERE email = $1`,
    [input.email.trim().toLowerCase()]
  );

  if (result.rows.length === 0) {
    const error = new Error('Invalid email or password');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  const account = result.rows[0];
  if (account.password !== input.password) {
    const error = new Error('Invalid email or password');
    (error as Error & { statusCode?: number }).statusCode = 401;
    throw error;
  }

  // Token representation for this single user session
  const token = Buffer.from(`${account.id}:${account.email}:${Date.now()}`).toString('base64');

  return {
    token,
    user: {
      id: account.id,
      email: account.email,
      role: account.role,
    },
  };
}
