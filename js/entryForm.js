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

        // Note: Image upload akan ditambahkan nanti
        // Untuk sekarang, kita bisa pakai placeholder atau skip
        const imagePath = '../images/default-recipe.jpg';

        // Validate
        if (!recipeName || !description || !ingredients || !directions) {
            alert('Please fill in all required fields!');
            return;
        }

        // Disable submit button
        submitButton.disabled = true;
        submitButton.textContent = 'Submitting...';

        try {
            const response = await fetch('/api/recipes', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json'
                },
                credentials: 'include', // Important: Include session cookie
                body: JSON.stringify({
                    recipeName,
                    description,
                    imagePath,
                    ingredients,
                    directions
                })
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