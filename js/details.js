/**
 * Recipe Details - Frontend Integration with Backend API
 * 
 * Connects to GET /api/recipes/:id
 */

document.addEventListener('DOMContentLoaded', async () => {
    // Get recipe ID from URL
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');

    if (!recipeId) {
        alert('No recipe specified!');
        window.location.href = '/catalog';
        return;
    }

    try {
        // Fetch recipe data
        const response = await fetch(`/api/recipes/${recipeId}`, {
            credentials: 'include'
        });

        if (!response.ok) {
            throw new Error('Recipe not found');
        }

        const data = await response.json();

        if (data.success && data.data.recipe) {
            renderRecipe(data.data.recipe);
        } else {
            throw new Error('Recipe not found');
        }
    } catch (error) {
        console.error('Error fetching recipe:', error);
        alert('Failed to load recipe. Redirecting to catalog...');
        window.location.href = '/catalog';
    }
});

function renderRecipe(recipe) {
    // Update page title
    document.title = `${recipe.recipeName} | SpiceScript`;

    // Update recipe header
    const recipeHeader = document.querySelector('.recipe-header');
    recipeHeader.innerHTML = `
        <h1>${recipe.recipeName}</h1>
        <div class="featured-image">
            <img src="${recipe.imagePath || '/images/default-recipe.jpg'}" alt="${recipe.recipeName}">
        </div>
    `;

    // Update recipe content
    const recipeContent = document.querySelector('.recipe-content');

    // Parse ingredients and directions (split by newlines)
    const ingredientsList = recipe.ingredients.split('\n')
        .filter(item => item.trim())
        .map(item => `<li>${item.trim()}</li>`)
        .join('');

    const directionsList = recipe.directions.split('\n')
        .filter(item => item.trim())
        .map((item, index) => `
            <div class="step">
                <div class="step-text">
                    <h3>Step ${index + 1}</h3>
                    <p>${item.trim()}</p>
                </div>
            </div>
        `)
        .join('');

    recipeContent.innerHTML = `
        <div class="intro">
            <p>${recipe.description}</p>
            <p class="recipe-meta">
                <strong>By:</strong> ${recipe.authorName || 'Anonymous'}<br>
                <strong>Created:</strong> ${new Date(recipe.createdAt).toLocaleDateString()}
            </p>
        </div>

        <div class="ingredients">
            <h2>Ingredients</h2>
            <ul>
                ${ingredientsList}
            </ul>
        </div>

        <div class="instructions">
            <h2>Directions</h2>
            ${directionsList}
        </div>
    `;

    checkAuthAndShowEditButton(recipe);
}

async function checkAuthAndShowEditButton(recipe) {
    try {
        const response = await fetch('/api/auth/me', {
            credentials: 'include'
        });

        if (response.ok) {
            const data = await response.json();
            if (data.success && data.data.user) {
                const user = data.data.user;

                // Show edit button only if current user is the author
                if (user.id === recipe.authorId) {
                    const editButtonContainer = document.querySelector('.EditButton-container');
                    editButtonContainer.innerHTML = `
                        <button onclick="editRecipe(${recipe.id})">Edit</button>
                        <button onclick="deleteRecipe(${recipe.id})" class="delete-btn">Delete</button>
                    `;
                    editButtonContainer.classList.remove('hidden');
                }
            }
        }
    } catch (error) {
        console.error('Error checking auth:', error);
    }
}

function editRecipe(recipeId) {
    window.location.href = `/entry_form?id=${recipeId}`;
}

// Delete recipe function
async function deleteRecipe(recipeId) {
    if (!confirm('Are you sure you want to delete this recipe?')) {
        return;
    }

    try {
        const response = await fetch(`/api/recipes/${recipeId}`, {
            method: 'DELETE',
            credentials: 'include'
        });

        const data = await response.json();

        if (response.ok && data.success) {
            alert('Recipe deleted successfully!');
            window.location.href = '/catalog';
        } else {
            const errorMessage = data.error?.message || 'Failed to delete recipe.';
            alert(errorMessage);
        }
    } catch (error) {
        console.error('Delete recipe error:', error);
        alert('Network error. Please try again.');
    }
}
