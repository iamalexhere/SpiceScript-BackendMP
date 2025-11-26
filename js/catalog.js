
// Mock Data
const recipes = [
    {
        id: 1,
        title: 'Batagor Goreng',
        img: 'https://placehold.co/600x400',
        description: 'Batagor goreng khas jabar barat',
        ingredients: 'Baso, tahu, goreng',
        steps: 'Goreng', 
    },
    {
        id:2,
        title:'Cireng Goreng',
        img:'https://placehold.co/600x400',
        description:'Cireng goreng khas bojongsoang',
        ingredients:'Aci',
        steps:'Goreng',
    },
    {
        id:3,
        title:'Naspad Padang',
        img:'https://placehold.co/600x400',
        description:'Nasi Padang khas padang pariaman',
        ingredients:'Nasi',
        steps:'Padang',
    },
    {
        id:4,
        title:'Naskun Kuning Warning',
        img:'https://placehold.co/600x400',
        description:'Nasi Kuning khas warning',
        ingredients:'Nasi',
        steps:'Kuning',
    },
    {
        id:5,
        title:'Nasgor Goreng',
        img:'https://placehold.co/600x400',
        description:'Nasi goreng khas mojokerto',
        ingredients:'Nasi',
        steps:'Goreng',
    },
    {
        id:5,
        title:'Nasgor Goreng',
        img:'https://placehold.co/600x400',
        description:'Nasi goreng khas mojokerto',
        ingredients:'Nasi',
        steps:'Goreng',
    },
    {
        id:3,
        title:'Naspad Padang',
        img:'https://placehold.co/600x400',
        description:'Nasi Padang khas padang pariaman',
        ingredients:'Nasi',
        steps:'Padang',
    },
    {
        id: 1,
        title: 'Batagor Goreng',
        img: 'https://placehold.co/600x400',
        description: 'Batagor goreng khas jabar barat',
        ingredients: 'Baso, tahu, goreng',
        steps: 'Goreng', 
    },

]

function renderCatalog() {
    const catalogContainer = document.getElementById('catalog');

    const htmlCard = recipes.map(recipe => `
        <div class="card">
            <img src="${recipe.img}" class="image-container">
            <div class="card-inner-container">
                <h4><b>${recipe.title}</b></h4>
                <p>${recipe.description}</p>
            </div>
        </div>
    `).join('');

    catalogContainer.innerHTML = htmlCard;
}

renderCatalog();