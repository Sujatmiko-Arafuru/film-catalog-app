// Simple test to check if the app is working
console.log('Testing Katalog Film App...');

// Test 1: Check if basic elements exist
const checkBasicElements = () => {
  const header = document.querySelector('header');
  const mainContent = document.querySelector('#main-content');
  const navLinks = document.querySelectorAll('.nav-list a');
  
  console.log('Header exists:', !!header);
  console.log('Main content exists:', !!mainContent);
  console.log('Navigation links:', navLinks.length);
  
  return header && mainContent && navLinks.length > 0;
};

// Test 2: Check if routes are working
const testRoutes = () => {
  const routes = ['/', '/map', '/add', '/about'];
  routes.forEach(route => {
    console.log(`Testing route: ${route}`);
    window.location.hash = route;
  });
};

// Test 3: Check if Leaflet is available
const checkLeaflet = () => {
  if (typeof L !== 'undefined') {
    console.log('✅ Leaflet is loaded');
    return true;
  } else {
    console.log('Leaflet is not loaded');
    return false;
  }
};

// Test 4: Check if API is accessible
const testAPI = async () => {
  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1');
    const data = await response.json();
    console.log('✅ API is accessible:', data);
    return true;
  } catch (error) {
    console.log('API error:', error);
    return false;
  }
};

// Run all tests
const runTests = async () => {
  console.log('🧪 Running tests...');
  
  const basicElements = checkBasicElements();
  const leaflet = checkLeaflet();
  const api = await testAPI();
  
  console.log('Test Results:');
  console.log('- Basic Elements:', basicElements ? 'OK' : 'FAIL');
  console.log('- Leaflet:', leaflet ? 'OK' : 'FAIL');
  console.log('- API:', api ? 'OK' : 'FAIL');
  
  if (basicElements && leaflet && api) {
    console.log('All tests passed! App should be working correctly.');
  } else {
    console.log('Some tests failed. Check the issues above.');
  }
};

// Export for manual testing
window.testApp = {
  checkBasicElements,
  testRoutes,
  checkLeaflet,
  testAPI,
  runTests
};

console.log('🔧 Test functions available: window.testApp');
console.log('Run: window.testApp.runTests() to test everything');
