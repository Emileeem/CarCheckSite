import { isExpired, decodeToken } from "react-jwt";

export default function verifyJWT()
{
    const token = localStorage.getItem("token");
    const myDecodedToken = decodeToken(token);
    const isMyTokenExpired = isExpired(token);
    
    return myDecodedToken
}
