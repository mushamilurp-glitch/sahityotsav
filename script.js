// THEME TOGGLE FUNCTIONALITY
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Check for saved theme preference or default to light mode
const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme') || 'light';
  
  if (savedTheme === 'dark') {
    htmlElement.classList.add('dark-mode');
    updateThemeIcon(true);
  } else {
    htmlElement.classList.remove('dark-mode');
    updateThemeIcon(false);
  }
};

// Update the theme toggle icon
const updateThemeIcon = (isDarkMode) => {
  if (isDarkMode) {
    themeToggle.innerHTML = '<i class="fas fa-sun"></i>';
    themeToggle.setAttribute('aria-label', 'Switch to light mode');
  } else {
    themeToggle.innerHTML = '<i class="fas fa-moon"></i>';
    themeToggle.setAttribute('aria-label', 'Switch to dark mode');
  }
};

// Toggle theme on button click
themeToggle.addEventListener('click', () => {
  const isDarkMode = htmlElement.classList.toggle('dark-mode');
  localStorage.setItem('theme', isDarkMode ? 'dark' : 'light');
  updateThemeIcon(isDarkMode);
});

// Initialize theme on page load
initializeTheme();

// Smooth scroll behavior for navigation links
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({
        behavior: 'smooth',
        block: 'start'
      });
    }
  });
});
