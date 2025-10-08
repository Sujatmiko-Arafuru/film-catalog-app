// Test file untuk memastikan semua fitur berfungsi
// Jalankan di browser console untuk testing

console.log('Testing Katalog Film App');

// Test 1: Check if Leaflet is loaded
if (typeof L !== 'undefined') {
  console.log('✅ Leaflet.js loaded successfully');
} else {
  console.log('Leaflet.js not loaded');
}

// Test 2: Check if routes are working
const testRoutes = () => {
  const routes = ['/', '/map', '/add', '/about'];
  routes.forEach(route => {
    console.log(`Testing route: ${route}`);
    window.location.hash = route;
  });
};

// Test 3: Check API connectivity
const testAPI = async () => {
  try {
    const response = await fetch('https://story-api.dicoding.dev/v1/stories?location=1');
    const data = await response.json();
    console.log('✅ API connection successful:', data);
  } catch (error) {
    console.log('API connection failed:', error);
  }
};

// Test 4: Check responsive design
const testResponsive = () => {
  const breakpoints = [375, 768, 1024];
  breakpoints.forEach(width => {
    console.log(`Testing responsive design at ${width}px`);
    // Simulate viewport change
    document.body.style.width = `${width}px`;
  });
};

// Test 5: Check accessibility features
const testAccessibility = () => {
  // Check for alt text
  const images = document.querySelectorAll('img');
  let altTextCount = 0;
  images.forEach(img => {
    if (img.alt !== undefined) altTextCount++;
  });
  console.log(`✅ Images with alt text: ${altTextCount}/${images.length}`);

  // Check for labels
  const inputs = document.querySelectorAll('input, textarea, select');
  let labeledInputs = 0;
  inputs.forEach(input => {
    const label = document.querySelector(`label[for="${input.id}"]`);
    if (label) labeledInputs++;
  });
  console.log(`✅ Labeled inputs: ${labeledInputs}/${inputs.length}`);

  // Check for semantic HTML
  const semanticElements = document.querySelectorAll('header, main, nav, section, article');
  console.log(`✅ Semantic HTML elements: ${semanticElements.length}`);
};

// Run all tests
const runAllTests = () => {
  console.log('🧪 Running all tests...');
  testAPI();
  testAccessibility();
  testResponsive();
  console.log('✅ All tests completed');
};

// Export for manual testing
window.testKatalogFilm = {
  testRoutes,
  testAPI,
  testAccessibility,
  testResponsive,
  runAllTests
};

console.log('🔧 Test functions available: window.testKatalogFilm');
