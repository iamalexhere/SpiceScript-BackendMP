/**
 * Entry Form - Frontend Integration with Backend API
 * 
 * Connects to POST /api/recipes - Create new recipe
 */

const dropArea = document.getElementById("drop-area");
const inputFile = document.getElementById("input-file");
const imgView = document.getElementById("img-view");

inputFile.addEventListener("change", uploadImage);

function uploadImage() {
    let imgLink = URL.createObjectURL(inputFile.files[0]);
    imgView.style.backgroundImage = `url(${imgLink})`;
    imgView.textContent = "";
    imgView.style.border = 0;
}

dropArea.addEventListener("dragover", function (e) {
    e.preventDefault();
});

dropArea.addEventListener("drop", function (e) {
    e.preventDefault();
    inputFile.files = e.dataTransfer.files;
    uploadImage();
});

// Handle form submission
document.addEventListener('DOMContentLoaded', async () => {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('.submit-button');
    const formHeader = document.querySelector('.form-header h2');

    // Check if in edit mode
    const urlParams = new URLSearchParams(window.location.search);
    const recipeId = urlParams.get('id');
    const isEditMode = !!recipeId;

    let currentRecipe = null;

    // If edit mode, load recipe data and pre-fill form
    if (isEditMode) {
        formHeader.textContent = 'Edit Recipe';
        submitButton.textContent = 'Update Recipe';

        try {
            const response = await fetch(`/api/recipes/${recipeId}`, {
                credentials: 'include'
            });

            if (!response.ok) {
                alert('Failed to load recipe. Redirecting to catalog...');
                window.location.href = '/catalog';
                return;
            }

            const data = await response.json();
            if (data.success && data.data.recipe) {
                currentRecipe = data.data.recipe;

                // Pre-fill form fields
                document.getElementById('recipe-name').value = currentRecipe.recipeName;
                document.getElementById('description').value = currentRecipe.description;
                document.getElementById('ingredients').value = currentRecipe.ingredients;
                document.getElementById('directions').value = currentRecipe.directions;

                // Show current image preview
                const imgView = document.getElementById('img-view');
                imgView.style.backgroundImage = `url(${currentRecipe.imagePath})`;
                imgView.textContent = '';
                imgView.style.border = 0;
            }
        } catch (error) {
            console.error('Error loading recipe:', error);
            alert('Failed to load recipe. Redirecting to catalog...');
            window.location.href = '/catalog';
            return;
        }
    }

    form.addEventListener('submit', async (e) => {
        e.preventDefault();

        // Get form data
        const recipeName = document.getElementById('recipe-name').value.trim();
        const description = document.getElementById('description').value.trim();
        const ingredients = document.getElementById('ingredients').value.trim();
        const directions = document.getElementById('directions').value.trim();
        const imageFile = inputFile.files[0];

        // Validate required fields
        if (!recipeName || !description || !ingredients || !directions) {
            alert('Please fill in all required fields!');
            return;
        }

        // Validate image (required for create, optional for edit)
        if (!isEditMode && !imageFile) {
            alert('Please upload a recipe image!');
            return;
        }

        // Validate file type if image is uploaded
        if (imageFile) {
            const allowedTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp'];
            if (!allowedTypes.includes(imageFile.type)) {
                alert('Only JPEG, PNG, and WebP images are allowed!');
                return;
            }

            // Validate file size (max 5MB)
            const maxSize = 5 * 1024 * 1024; // 5MB
            if (imageFile.size > maxSize) {
                alert('Image size must be less than 5MB!');
                return;
            }
        }

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = isEditMode ? 'Updating...' : 'Submitting...';

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('recipeName', recipeName);
            formData.append('description', description);
            formData.append('ingredients', ingredients);
            formData.append('directions', directions);
            if (imageFile) {
                formData.append('image', imageFile);
            }

            const url = isEditMode ? `/api/recipes/${recipeId}` : '/api/recipes';
            const method = isEditMode ? 'PUT' : 'POST';

            const response = await fetch(url, {
                method: method,
                credentials: 'include',
                body: formData
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert(isEditMode ? 'Recipe updated successfully!' : 'Recipe created successfully!');
                window.location.href = isEditMode ? `/details?id=${recipeId}` : '/catalog';
            } else {
                // Handle errors
                if (response.status === 401) {
                    alert('You must be logged in!');
                    window.location.href = '/sign-in';
                } else if (response.status === 403) {
                    alert('You can only edit your own recipes!');
                    window.location.href = `/details?id=${recipeId}`;
                } else {
                    const errorMessage = data.error?.message || `Failed to ${isEditMode ? 'update' : 'create'} recipe. Please try again.`;
                    alert(errorMessage);
                }

                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = isEditMode ? 'Update Recipe' : 'Submit Recipe';
            }
        } catch (error) {
            console.error(`${isEditMode ? 'Update' : 'Create'} recipe error:`, error);
            alert('Network error. Please check your connection and try again.');

            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = isEditMode ? 'Update Recipe' : 'Submit Recipe';
        }
    });
});