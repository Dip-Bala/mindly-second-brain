import jwt from 'jsonwebtoken'
import fs from 'fs';
import path from 'path'
const PRIVATE_KEY = fs.readFileSync(path.join(__dirname, '../../keys/private.key'), 'utf8');
const PUBLIC_KEY = fs.readFileSync(path.join(__dirname, '../../keys/public.key'), 'utf8');

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