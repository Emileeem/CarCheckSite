import { isExpired, decodeToken } from "react-jwt";

export default function verifyJWT()
{
    const token = localStorage.getItem("token");
    console.log(token)
    const myDecodedToken = decodeToken(token);
    const isMyTokenExpired = isExpired(token);

    console.log(myDecodedToken)
    console.log(isMyTokenExpired)

    return myDecodedToken
}
