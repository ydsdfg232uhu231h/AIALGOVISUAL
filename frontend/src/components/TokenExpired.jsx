import {jwtDecode} from "jwt-decode";

function TokenExpired({token}) {
  if (!token) {
    return true;
  }
  try {
    const decodedToken= jwtDecode(token);
    const currentTime = Date.now() /1000;
    return decodedToken.exp < currentTime;
  } catch (error) {
    console.log("Error in decoding token", error);
    return true;
  }
}

export default TokenExpired;