document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // Function to set the theme and store it
    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.remove('light-theme');
            body.classList.add('dark-theme');
            themeSwitcher.textContent = '☀️';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.remove('dark-theme');
            body.classList.add('light-theme');
            themeSwitcher.textContent = '🌙';
            localStorage.setItem('theme', 'light');
        }
    };

    // Check for saved theme or system preference on page load
    const savedTheme = localStorage.getItem('theme');
    const prefersLight = window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches;

    if (savedTheme) {
        setTheme(savedTheme);
    } else if (prefersLight) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    // Event listener to toggle theme on click
    themeSwitcher.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });
});