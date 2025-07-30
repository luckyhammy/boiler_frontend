import { decodeToken, isAdmin, getUserInfo } from './jwtUtils';

// Test function to verify JWT decoding
export const testJWTDecoding = () => {
  // This is a sample token for testing - replace with actual token from your system
  const sampleToken = localStorage.getItem('token');
  
  if (!sampleToken) {
    console.log('No token found in localStorage');
    return;
  }

  console.log('=== JWT TOKEN ANALYSIS ===');
  console.log('Raw token:', sampleToken);
  
  const decoded = decodeToken(sampleToken);
  console.log('Decoded token payload:', decoded);
  
  if (decoded) {
    console.log('=== TOKEN FIELDS ===');
    console.log('id:', decoded.id);
    console.log('first_name:', decoded.first_name);
    console.log('region:', decoded.region);
    console.log('admin:', decoded.admin);
    console.log('iat:', decoded.iat);
    console.log('exp:', decoded.exp);
    
    // Check if region exists in the token
    if (decoded.region) {
      console.log('✅ Region found in token:', decoded.region);
    } else {
      console.log('❌ Region is missing from token');
      console.log('Available fields:', Object.keys(decoded));
    }
  }
  
  const adminStatus = isAdmin(sampleToken);
  console.log('Is admin:', adminStatus);
  
  const userInfo = getUserInfo(sampleToken);
  console.log('User info from getUserInfo:', userInfo);
  
  return { decoded, adminStatus, userInfo };
};

// Call this function in browser console to test
window.testJWT = testJWTDecoding; 