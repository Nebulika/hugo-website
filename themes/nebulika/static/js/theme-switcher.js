document.addEventListener('DOMContentLoaded', () => {
    const themeSwitcher = document.getElementById('theme-switcher');
    const body = document.body;

    // Function to set the theme
    const setTheme = (theme) => {
        if (theme === 'dark') {
            body.classList.remove('light-theme');
            themeSwitcher.textContent = '☾';
            localStorage.setItem('theme', 'dark');
        } else {
            body.classList.add('light-theme');
            themeSwitcher.textContent = '☉';
            localStorage.setItem('theme', 'light');
        }
    };

    // Check for saved theme preference or system preference
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        setTheme(savedTheme);
    } else if (window.matchMedia && window.matchMedia('(prefers-color-scheme: light)').matches) {
        setTheme('light');
    } else {
        setTheme('dark');
    }

    // Event listener for button click
    themeSwitcher.addEventListener('click', () => {
        if (body.classList.contains('light-theme')) {
            setTheme('dark');
        } else {
            setTheme('light');
        }
    });
});