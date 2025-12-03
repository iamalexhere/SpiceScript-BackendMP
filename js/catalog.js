/**
 * Catalog - Frontend Integration with Backend API
 * 
 * Connects to:
 * - GET /api/recipes - Fetch all recipes
 * - GET /api/auth/me - Check authentication status
 * - POST /api/auth/signout - Logout
 */

let currentUser = null;

// Fetch recipes dari backend
async function fetchRecipes() {
    try {
        const response = await fetch('/api/recipes', {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Failed to fetch recipes');
        }

        const data = await response.json();

        if (data.success) {
            return data.data.recipes || [];
        }

        return [];
    } catch (error) {
        console.error('Error fetching recipes:', error);
        alert('Failed to load recipes. Please refresh the page.');
        return [];
    }
}

// Check authentication status
async function checkAuth() {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success) {
                currentUser = data.data.user;
                return true;
            }
        }

        currentUser = null;
        return false;
    } catch (error) {
        console.error('Error checking auth:', error);
        currentUser = null;
        return false;
    }
}

// Render recipe cards
function renderCatalog(recipes) {
    const catalogContainer = document.getElementById('catalog');

    if (!recipes || recipes.length === 0) {
        catalogContainer.innerHTML = '<p style="text-align: center; padding: 40px;">No recipes found. Be the first to add one!</p>';
        return;
    }

    const htmlCard = recipes.map(recipe => `
        <div class="card" data-recipe-id="${recipe.id}" style="cursor: pointer;">
            <img src="${recipe.imagePath || '../images/default-recipe.jpg'}" class="image-container" alt="${recipe.recipeName}">
            <div class="card-inner-container">
                <h4><b>${recipe.recipeName}</b></h4>
                <p>${recipe.description}</p>
                <small style="color: #888;">by ${recipe.authorName || 'Anonymous'}</small>
            </div>
        </div>
    `).join('');

    catalogContainer.innerHTML = htmlCard;

    // Add click listeners to all cards
    const cards = document.querySelectorAll('.card');
    cards.forEach(card => {
        card.addEventListener('click', () => {
            const recipeId = card.getAttribute('data-recipe-id');
            window.location.href = `/details?id=${recipeId}`;
        });
    });
}

// Update nav buttons based on auth state
function updateNavButtons() {
    const signInBtn = document.getElementById('signInBtn');
    const signOutBtn = document.getElementById('signOutBtn');
    const createRecipeBtn = document.getElementById('createRecipeBtn');

    if (currentUser) {
        // User is logged in
        signInBtn.style.display = 'none';
        signOutBtn.style.display = 'block';
        createRecipeBtn.style.display = 'block';
    } else {
        // User is guest
        signInBtn.style.display = 'block';
        signOutBtn.style.display = 'none';
        createRecipeBtn.style.display = 'none';
    }
}

// Handle sign out
async function handleSignOut() {
    try {
        const response = await fetch('/api/auth/signout', {
            method: 'POST',
            credentials: 'include'
        });

        if (response.ok) {
            currentUser = null;
            updateNavButtons();
            alert('Signed out successfully!');
            // Optionally reload recipes
            await loadPage();
        } else {
            alert('Sign out failed. Please try again.');
        }
    } catch (error) {
        console.error('Sign out error:', error);
        alert('Network error during sign out.');
    }
}

// Initialize page
async function loadPage() {
    // Check authentication status
    await checkAuth();

    // Update nav buttons
    updateNavButtons();

    // Fetch and render recipes
    const recipes = await fetchRecipes();
    renderCatalog(recipes);
}

// Set up event listeners
document.addEventListener('DOMContentLoaded', () => {
    const signOutBtn = document.getElementById('signOutBtn');
    if (signOutBtn) {
        signOutBtn.addEventListener('click', handleSignOut);
    }

    // Load page data
    loadPage();
});