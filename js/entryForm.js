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
document.addEventListener('DOMContentLoaded', () => {
    const form = document.querySelector('form');
    const submitButton = form.querySelector('.submit-button');

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

        // Validate image is required
        if (!imageFile) {
            alert('Please upload a recipe image!');
            return;
        }

        // Validate file type
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

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            // Create FormData for file upload
            const formData = new FormData();
            formData.append('recipeName', recipeName);
            formData.append('description', description);
            formData.append('ingredients', ingredients);
            formData.append('directions', directions);
            formData.append('image', imageFile);

            const response = await fetch('/api/recipes', {
                method: 'POST',
                credentials: 'include', // Important: Include session cookie
                body: formData // Don't set Content-Type header, browser will set it automatically with boundary
            });

            const data = await response.json();

            if (response.ok && data.success) {
                alert('Recipe created successfully!');
                window.location.href = '/catalog';
            } else {
                // Handle errors
                if (response.status === 401) {
                    alert('You must be logged in to create a recipe!');
                    window.location.href = '/sign-in';
                } else {
                    const errorMessage = data.error?.message || 'Failed to create recipe. Please try again.';
                    alert(errorMessage);
                }

                // Re-enable button
                submitButton.disabled = false;
                submitButton.textContent = 'Submit Recipe';
            }
        } catch (error) {
            console.error('Create recipe error:', error);
            alert('Network error. Please check your connection and try again.');

            // Re-enable button
            submitButton.disabled = false;
            submitButton.textContent = 'Submit Recipe';
        }
    });
});