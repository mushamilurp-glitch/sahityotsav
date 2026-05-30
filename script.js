// HAMBURGER MENU FUNCTIONALITY
const hamburger = document.getElementById('hamburger');
const navLinks = document.getElementById('navLinks');

if (hamburger && navLinks) {
  hamburger.addEventListener('click', () => {
    hamburger.classList.toggle('active');
    navLinks.classList.toggle('open');
    const expanded = hamburger.classList.contains('active');
    hamburger.setAttribute('aria-expanded', expanded);
  });

  // Close menu when a link is clicked
  document.querySelectorAll('.nav-links a').forEach(link => {
    link.addEventListener('click', () => {
      hamburger.classList.remove('active');
      navLinks.classList.remove('open');
      hamburger.setAttribute('aria-expanded', 'false');
    });
  });
}

// THEME TOGGLE FUNCTIONALITY
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

const updateThemeToggle = (isDarkMode) => {
  if (!themeToggle) return;
  themeToggle.innerHTML = '<span class="dot"></span>';
  themeToggle.setAttribute('aria-label', isDarkMode ? 'Switch to light mode' : 'Switch to dark mode');
};

const setTheme = (theme) => {
  htmlElement.setAttribute('data-theme', theme);
  localStorage.setItem('theme', theme);
  updateThemeToggle(theme === 'dark');
};

const initializeTheme = () => {
  const savedTheme = localStorage.getItem('theme');
  const defaultTheme = window.matchMedia && window.matchMedia('(prefers-color-scheme:dark)').matches ? 'dark' : 'light';
  setTheme(savedTheme || defaultTheme);
};

if (themeToggle) {
  themeToggle.addEventListener('click', () => {
    const current = htmlElement.getAttribute('data-theme') === 'dark' ? 'light' : 'dark';
    setTheme(current);
  });
}

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

