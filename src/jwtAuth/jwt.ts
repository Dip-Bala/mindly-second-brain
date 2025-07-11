import jwt from 'jsonwebtoken'
import dotenv from 'dotenv'
dotenv.config();

const PRIVATE_KEY = Buffer.from(process.env.PRIVATE_KEY!, 'base64').toString('utf8');
const PUBLIC_KEY = Buffer.from(process.env.PUBLIC_KEY!, 'base64').toString('utf8');

export function generateToken(payload: { _id: string, username: string}): string{
     const jwt_token = jwt.sign(payload, PRIVATE_KEY, {
        algorithm: 'RS256',
        expiresIn: '7d',
    })
    return jwt_token;
}

export async function verifyToken(token: string){
    const decodedData = await jwt.verify(token, PUBLIC_KEY);
    console.log(decodedData);
    return decodedData;
}