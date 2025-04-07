import jwt_decode from "jwt-decode";

export const isTokenValid = (token) => {
    if (!token) return false;
    const decoded = jwt_decode(token);
    const currentTime = Date.now() / 1000; // Convert to seconds
    return decoded.exp > currentTime; // Check if token is expired
}; 