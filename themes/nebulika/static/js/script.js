document.addEventListener("DOMContentLoaded", function() {
    const searchInput = document.getElementById('search-input');
    const searchResults = document.getElementById('search-results');
    const searchResultsBox = document.getElementById('search-results-box'); // New: Get reference to the results box
    const searchOverlay = document.getElementById('search-overlay'); // New: Get reference to the overlay
    let searchIndex = [];
    let isLoading = true;

    // Load search index
    fetch('/index.json')
        .then(response => {
            if (!response.ok) {
                throw new Error('Failed to load search index');
            }
            return response.json();
        })
        .then(data => {
            searchIndex = data;
            isLoading = false;
            searchInput.placeholder = 'Search posts...';
        })
        .catch(error => {
            console.error('Search index loading failed:', error);
            searchInput.placeholder = 'Search unavailable';
            searchInput.disabled = true;
        });

    // Debounce function to limit search frequency
    function debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }

    // Enhanced search function
    function performSearch(query) {
        searchResults.innerHTML = '';

        if (query.length < 2) {
            searchResultsBox.classList.remove('active'); // Hide results box
            return;
        }

        searchResultsBox.classList.add('active'); // Show results box

        if (isLoading) {
            const li = document.createElement('li');
            li.textContent = 'Loading...';
            searchResults.appendChild(li);
            return;
        }

        const queryLower = query.toLowerCase();
        const results = searchIndex.filter(item => {
            const titleMatch = item.title.toLowerCase().includes(queryLower);
            const contentMatch = item.content.toLowerCase().includes(queryLower);
            const tagMatch = item.tags && item.tags.some(tag => 
                tag.toLowerCase().includes(queryLower)
            );
            return titleMatch || contentMatch || tagMatch;
        }).slice(0, 8); // Limit to 8 results

        if (results.length === 0) {
            const li = document.createElement('li');
            li.textContent = 'No results found';
            li.style.fontStyle = 'italic';
            li.style.color = '#888';
            searchResults.appendChild(li);
            return;
        }

        results.forEach(result => {
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.href = result.url;
            a.innerHTML = highlightMatch(result.title, query);
            
            // Add date if available
            if (result.date) {
                const dateSpan = document.createElement('span');
                dateSpan.textContent = ` • ${formatDate(result.date)}`;
                dateSpan.style.color = '#888';
                dateSpan.style.fontSize = '0.8em';
                a.appendChild(dateSpan);
            }
            
            li.appendChild(a);
            searchResults.appendChild(li);
        });
    }

    // Highlight matching text
    function highlightMatch(text, query) {
        const regex = new RegExp(`(${query})`, 'gi');
        return text.replace(regex, '<mark style="background-color: var(--accent-color); color: white; padding: 2px 4px; border-radius: 3px;">$1</mark>');
    }

    // Format date
    function formatDate(dateString) {
        const date = new Date(dateString);
        return date.toLocaleDateString('en-US', { 
            year: 'numeric', 
            month: 'short', 
            day: 'numeric' 
        });
    }

    // Clear search when clicking outside
    document.addEventListener('click', function(event) {
        if (!searchOverlay.contains(event.target)) { // Check if click is outside the overlay
            searchResultsBox.classList.remove('active'); // Hide results box
            searchInput.value = ''; // Clear input
            searchResults.innerHTML = ''; // Clear results
        }
    });

    // Handle keyboard navigation
    searchInput.addEventListener('keydown', function(event) {
        const items = searchResults.querySelectorAll('li a');
        let currentIndex = Array.from(items).findIndex(item => item.classList.contains('selected'));
        
        if (event.key === 'ArrowDown') {
            event.preventDefault();
            if (currentIndex < items.length - 1) {
                if (currentIndex >= 0) items[currentIndex].classList.remove('selected');
                items[currentIndex + 1].classList.add('selected');
            }
        } else if (event.key === 'ArrowUp') {
            event.preventDefault();
            if (currentIndex > 0) {
                items[currentIndex].classList.remove('selected');
                items[currentIndex - 1].classList.add('selected');
            }
        } else if (event.key === 'Enter' && currentIndex >= 0) {
            event.preventDefault();
            items[currentIndex].click();
        } else if (event.key === 'Escape') {
            searchResultsBox.classList.remove('active'); // Hide results box
            searchInput.value = ''; // Clear input
            searchResults.innerHTML = ''; // Clear results
            searchInput.blur();
        }
    });

    // Debounced search
    const debouncedSearch = debounce(performSearch, 300);
    searchInput.addEventListener('input', function() {
        debouncedSearch(this.value);
    });
});