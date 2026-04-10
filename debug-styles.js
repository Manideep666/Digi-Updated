// Force all content to be immediately visible
console.log('Forcing content visibility');

// Immediately apply
document.body.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; background: #0a0a0f !important; color: white !important; overflow: auto !important; width: 100% !important; height: auto !important; margin: 0; padding: 0;';

// Hide loader
const loader = document.querySelector('.sonar-loader-wrapper');
if (loader) {
  loader.style.cssText = 'display: none !important; visibility: hidden !important; opacity: 0 !important; pointer-events: none !important; z-index: -9999 !important; width: 0; height: 0; position: fixed;';
}

// Force all sections visible
const sections = document.querySelectorAll('section, nav, main, .sonar-nav, .sonar-hero');
sections.forEach(el => {
  el.style.cssText = 'display: block !important; visibility: visible !important; opacity: 1 !important; z-index: auto !important;';
});

// Force hero content visible
const heroContent = document.querySelectorAll('[class*="hero"], .container, .content');
heroContent.forEach(el => {
  el.style.cssText = (el.style.cssText || '') + 'display: block !important; visibility: visible !important; opacity: 1 !important;';
});

// Do it again after 200ms to ensure
setTimeout(() => {
  document.body.style.background = '#0a0a0f';
  document.body.style.color = 'white';
  console.log('Content visibility confirmed');
}, 200);

