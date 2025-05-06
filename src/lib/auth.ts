import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';


const JWT_SECRET = process.env.JWT_SECRET || 'default';

export function signJwt(id: number, payload: object) {
  return jwt.sign(payload, JWT_SECRET, { expiresIn: '1d' });
}

export function verifyJwt(token: string) {
  return jwt.verify(token, JWT_SECRET);
}

export async function hashPassword(password: string) {
  return await bcrypt.hash(password, 10);
}

export async function comparePassword(password: string, hash: string) {
  return await bcrypt.compare(password, hash);
}