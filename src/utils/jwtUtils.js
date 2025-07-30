// Utility function to decode JWT token
export const decodeToken = (token) => {
  try {
    // JWT tokens have 3 parts separated by dots
    const parts = token.split('.');
    if (parts.length !== 3) {
      throw new Error('Invalid token format');
    }
    
    // Decode the payload (second part)
    const payload = parts[1];
    // Add padding if needed for base64 decoding
    const paddedPayload = payload + '='.repeat((4 - payload.length % 4) % 4);
    const decodedPayload = atob(paddedPayload.replace(/-/g, '+').replace(/_/g, '/'));
    
    return JSON.parse(decodedPayload);
  } catch (error) {
    console.error('Error decoding token:', error);
    return null;
  }
};

// Check if user is admin
export const isAdmin = (token) => {
  if (!token) return false;
  
  const decoded = decodeToken(token);
  if (!decoded) return false;
  
  return decoded.admin === true;
};

// Get user info from token
export const getUserInfo = (token) => {
  if (!token) return null;
  
  const decoded = decodeToken(token);
  if (!decoded) return null;
  
  return {
    id: decoded.id,
    first_name: decoded.first_name,
    region: decoded.region,
    admin: decoded.admin || false
  };
}; 