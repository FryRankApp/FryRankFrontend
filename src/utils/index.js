import { SignJWT } from 'jose';
import { SECRET_KEY } from "../constants";
export async function generateToken(accountId) {
    const token = await new SignJWT({ userId: accountId })
        .setProtectedHeader({ alg: 'HS256' })
        .setIssuedAt()
        .setExpirationTime('30m') // Token expiry time
        .sign(new TextEncoder().encode(SECRET_KEY));
    return token;
}