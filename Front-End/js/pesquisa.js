// pesquisa.js - Funcionalidade de busca e filtros
document.addEventListener('DOMContentLoaded', function() {
    // Elementos da DOM
    const searchInput = document.getElementById('mainSearchInput');
    const searchButton = document.getElementById('searchButton');
    const categoryFilters = document.querySelectorAll('.category-filter');
    const recentSearches = document.getElementById('recentSearches');
    const recentList = document.getElementById('recentList');
    const clearRecent = document.getElementById('clearRecent');
    const searchResults = document.getElementById('searchResults');
    const resultsContainer = document.getElementById('resultsContainer');
    const emptyResults = document.getElementById('emptyResults');
    const resultsTitle = document.getElementById('resultsTitle');
    const resultsCount = document.getElementById('resultsCount');
    const sortSelect = document.getElementById('sortSelect');
    const filterToggle = document.getElementById('filterToggle');
    const filterModal = document.getElementById('filterModal');
    const closeFilter = document.getElementById('closeFilter');
    const applyFilters = document.getElementById('applyFilters');
    const resetFilters = document.getElementById('resetFilters');
    const exploreCategories = document.getElementById('exploreCategories');

    // Dados dos produtos (simulando uma base de dados)
    const productsData = [
        {
            id: 1,
            name: "Alface Crespa",
            category: "hortalicas",
            image: "imagens/alface.png",
            stock: 100,
            producer: "Fazenda São José - PR",
            packaging: [
                { type: "Caixa 20kg", price: "R$ 80,00", min: 10 },
                { type: "Saca 50kg", price: "R$ 150,00", min: 5 }
            ],
            isOffer: false
        },
        {
            id: 2,
            name: "Arroz Integral",
            category: "graos",
            image: "imagens/arroz.png",
            stock: 1000,
            producer: "Cooperativa Rio Branco - MT",
            packaging: [
                { type: "Saca 50kg", price: "R$ 180,00", min: 10 }
            ],
            isOffer: false
        },
        {
            id: 3,
            name: "Batata Inglesa",
            category: "hortalicas",
            image: "imagens/batatas.png",
            stock: 450,
            producer: "Fazenda São José - PR",
            packaging: [
                { type: "Caixa 20kg", price: "R$ 80,00", min: 10 },
                { type: "Saca 50kg", price: "R$ 150,00", min: 5 }
            ],
            isOffer: false
        },
        {
            id: 4,
            name: "Banana Nanica",
            category: "frutas",
            image: "imagens/banana.png",
            stock: 300,
            producer: "Fazenda São João - BA",
            packaging: [
                { type: "Caixa 20kg", price: "R$ 120,00", min: 5 }
            ],
            isOffer: true
        },
        {
            id: 5,
            name: "Brócolis Ninja",
            category: "hortalicas",
            image: "imagens/brocolis.png",
            stock: 450,
            producer: "Fazenda São José - PR",
            packaging: [
                { type: "Caixa 20kg", price: "R$ 80,00", min: 10 },
                { type: "Saca 50kg", price: "R$ 150,00", min: 5 }
            ],
            isOffer: false
        },
        {
            id: 6,
            name: "Cenoura",
            category: "hortalicas",
            image: "imagens/cenouras.png",
            stock: 320,
            producer: "Fazenda Hortifruti - SP",
            packaging: [
                { type: "Caixa 20kg", price: "R$ 75,00", min: 8 }
            ],
            isOffer: true
        },
        {
            id: 7,
            name: "Cebola Roxa",
            category: "hortalicas",
            image: "imagens/cebolas.png",
            stock: 280,
            producer: "Fazenda Vale Verde - MG",
            packaging: [
                { type: "Saca 30kg", price: "R$ 120,00", min: 6 }
            ],
            isOffer: false
        },
        {
            id: 8,
            name: "Feijão Carioca",
            category: "graos",
            image: "imagens/feijao.png",
            stock: 700,
            producer: "Fazenda Boa Esperança - GO",
            packaging: [
                { type: "Saca 60kg", price: "R$ 250,00", min: 8 }
            ],
            isOffer: false
        },
        {
            id: 9,
            name: "Laranja Pera",
            category: "frutas",
            image: "imagens/laranja.png",
            stock: 500,
            producer: "Fazenda Citrus - SP",
            packaging: [
                { type: "Caixa 20kg", price: "R$ 90,00", min: 8 }
            ],
            isOffer: true
        },
        {
            id: 10,
            name: "Lentilha",
            category: "graos",
            image: "imagens/lentilha.png",
            stock: 300,
            producer: "AgroVale - RS",
            packaging: [
                { type: "Saca 25kg", price: "R$ 200,00", min: 6 }
            ],
            isOffer: false
        },
        {
            id: 11,
            name: "Maçã Gala",
            category: "frutas",
            image: "imagens/maca.png",
            stock: 200,
            producer: "Cooperativa Vale do Sul - RS",
            packaging: [
                { type: "Caixa 18kg", price: "R$ 140,00", min: 5 }
            ],
            isOffer: true
        },
        {
            id: 12,
            name: "Manga",
            category: "frutas",
            image: "imagens/manga.png",
            stock: 250,
            producer: "Fazenda Frutos Tropicais - PE",
            packaging: [
                { type: "Caixa 22kg", price: "R$ 110,00", min: 6 }
            ],
            isOffer: false
        },
        {
            id: 13,
            name: "Milho Verde",
            category: "graos",
            image: "imagens/milho.png",
            stock: 2000,
            producer: "Fazenda Campo Verde - PR",
            packaging: [
                { type: "Saca 60kg", price: "R$ 90,00", min: 20 }
            ],
            isOffer: false
        },
        {
            id: 14,
            name: "Morango",
            category: "frutas",
            image: "imagens/morango.png",
            stock: 150,
            producer: "Sítio Colinas - MG",
            packaging: [
                { type: "Caixa 5kg", price: "R$ 80,00", min: 10 }
            ],
            isOffer: false
        },
        {
            id: 15,
            name: "Soja",
            category: "graos",
            image: "imagens/soja.png",
            stock: 2500,
            producer: "Cooperativa AgroSul - MS",
            packaging: [
                { type: "Saca 60kg", price: "R$ 160,00", min: 15 }
            ],
            isOffer: false
        },
        {
            id: 16,
            name: "Tomate Italiano",
            category: "hortalicas",
            image: "imagens/tomates.png",
            stock: 180,
            producer: "Fazenda Sol Nascente - RJ",
            packaging: [
                { type: "Caixa 15kg", price: "R$ 95,00", min: 12 }
            ],
            isOffer: false
        },
        {
            id: 17,
            name: "Trigo",
            category: "graos",
            image: "imagens/trigo.png",
            stock: 1200,
            producer: "Cooperativa Vale do Trigo - RS",
            packaging: [
                { type: "Saca 50kg", price: "R$ 140,00", min: 12 }
            ],
            isOffer: false
        },
        {
            id: 18,
            name: "Uva",
            category: "frutas",
            image: "imagens/uva.png",
            stock: 400,
            producer: "Vinícola Vale Verde - RS",
            packaging: [
                { type: "Caixa 10kg", price: "R$ 70,00", min: 15 }
            ],
            isOffer: true
        }
    ];

    // Estado da aplicação
    let currentResults = [];
    let currentFilters = {
        categories: ['frutas', 'hortalicas', 'graos'],
        minPrice: null,
        maxPrice: null,
        state: ''
    };

    // Inicialização
    init();

    function init() {
        loadRecentSearches();
        setupEventListeners();
    }

    function setupEventListeners() {
        // Busca
        searchButton.addEventListener('click', performSearch);
        searchInput.addEventListener('keypress', function(e) {
            if (e.key === 'Enter') {
                performSearch();
            }
        });

        // Filtros de categoria rápida
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function() {
                const category = this.getAttribute('data-category');
                if (category === 'ofertas') {
                    searchInput.value = '';
                    filterByOffers();
                } else {
                    searchInput.value = '';
                    filterByCategory(category);
                }
            });
        });

        // Ordenação
        sortSelect.addEventListener('change', function() {
            if (currentResults.length > 0) {
                sortResults(this.value);
                displayResults(currentResults);
            }
        });

        // Modal de filtros
        filterToggle.addEventListener('click', () => {
            filterModal.style.display = 'block';
        });

        closeFilter.addEventListener('click', () => {
            filterModal.style.display = 'none';
        });

        applyFilters.addEventListener('click', applyAdvancedFilters);
        resetFilters.addEventListener('click', resetAdvancedFilters);

        // Buscas recentes
        clearRecent.addEventListener('click', clearRecentSearches);
        exploreCategories.addEventListener('click', () => {
            searchResults.style.display = 'none';
            document.querySelector('.quick-filters').scrollIntoView({ behavior: 'smooth' });
        });

        // Fechar modal ao clicar fora
        filterModal.addEventListener('click', function(e) {
            if (e.target === filterModal) {
                filterModal.style.display = 'none';
            }
        });
    }

    function performSearch() {
        const query = searchInput.value.trim();
        if (query) {
            saveRecentSearch(query);
            searchProducts(query);
        }
    }

    function searchProducts(query) {
        const searchTerm = query.toLowerCase();
        
        currentResults = productsData.filter(product => {
            const matchesName = product.name.toLowerCase().includes(searchTerm);
            const matchesProducer = product.producer.toLowerCase().includes(searchTerm);
            const matchesCategory = currentFilters.categories.includes(product.category);
            
            // Filtro por preço
            let matchesPrice = true;
            if (currentFilters.minPrice || currentFilters.maxPrice) {
                const productPrice = extractPrice(product.packaging[0].price);
                if (currentFilters.minPrice && productPrice < currentFilters.minPrice) {
                    matchesPrice = false;
                }
                if (currentFilters.maxPrice && productPrice > currentFilters.maxPrice) {
                    matchesPrice = false;
                }
            }
            
            // Filtro por estado
            let matchesState = true;
            if (currentFilters.state) {
                matchesState = product.producer.includes(currentFilters.state);
            }
            
            return (matchesName || matchesProducer) && matchesCategory && matchesPrice && matchesState;
        });

        displaySearchResults(query, currentResults);
    }

    function filterByCategory(category) {
        const categoryNames = {
            'frutas': 'Frutas',
            'hortalicas': 'Hortaliças',
            'graos': 'Grãos'
        };
        
        currentResults = productsData.filter(product => 
            product.category === category && 
            applyPriceFilter(product) && 
            applyStateFilter(product)
        );
        
        displaySearchResults(categoryNames[category], currentResults);
    }

    function filterByOffers() {
        currentResults = productsData.filter(product => 
            product.isOffer && 
            currentFilters.categories.includes(product.category) &&
            applyPriceFilter(product) &&
            applyStateFilter(product)
        );
        
        displaySearchResults("Ofertas", currentResults);
    }

    function applyPriceFilter(product) {
        if (!currentFilters.minPrice && !currentFilters.maxPrice) return true;
        
        const productPrice = extractPrice(product.packaging[0].price);
        
        if (currentFilters.minPrice && productPrice < currentFilters.minPrice) return false;
        if (currentFilters.maxPrice && productPrice > currentFilters.maxPrice) return false;
        
        return true;
    }

    function applyStateFilter(product) {
        if (!currentFilters.state) return true;
        return product.producer.includes(currentFilters.state);
    }

    function displaySearchResults(query, results) {
        resultsTitle.textContent = `Resultados para "${query}"`;
        resultsCount.textContent = `${results.length} produto${results.length !== 1 ? 's' : ''} encontrado${results.length !== 1 ? 's' : ''}`;
        
        if (results.length > 0) {
            sortResults(sortSelect.value);
            displayResults(results);
            emptyResults.style.display = 'none';
            resultsContainer.style.display = 'block';
        } else {
            resultsContainer.style.display = 'none';
            emptyResults.style.display = 'block';
        }
        
        // Mostrar seção de resultados e esconder outras
        searchResults.style.display = 'block';
        recentSearches.style.display = 'none';
        document.querySelector('.featured-products').style.display = 'none';
        
        // Rolar para os resultados
        searchResults.scrollIntoView({ behavior: 'smooth' });
    }

    function displayResults(products) {
        resultsContainer.innerHTML = products.map(product => `
            <div class="product-card" data-category="${product.category}">
                ${product.isOffer ? '<div class="product-badge">Oferta</div>' : ''}
                <div class="product-image">
                    <img src="${product.image}" alt="${product.name}" loading="lazy">
                </div>
                <div class="product-header">
                    <h3>${product.name}</h3>
                    <div class="stock">Estoque: ${product.stock}</div>
                </div>
                <div class="product-details">
                    ${product.packaging.map(pkg => `
                        <div class="packaging-option">
                            <div class="packaging-info">
                                <div class="packaging-type">${pkg.type}</div>
                                <div class="packaging-price">${pkg.price}</div>
                            </div>
                            <div class="min-order">Min: ${pkg.min}</div>
                        </div>
                    `).join('')}
                    <div class="producer">${product.producer}</div>
                    <button class="btn-interesse" onclick="handleInterest(${product.id})">Tenho Interesse</button>
                </div>
            </div>
        `).join('');
    }

    function sortResults(sortBy) {
        switch(sortBy) {
            case 'price-asc':
                currentResults.sort((a, b) => extractPrice(a.packaging[0].price) - extractPrice(b.packaging[0].price));
                break;
            case 'price-desc':
                currentResults.sort((a, b) => extractPrice(b.packaging[0].price) - extractPrice(a.packaging[0].price));
                break;
            case 'name':
                currentResults.sort((a, b) => a.name.localeCompare(b.name));
                break;
            case 'relevance':
            default:
                // Mantém a ordem original (relevância da busca)
                break;
        }
    }

    function extractPrice(priceString) {
        // Converte "R$ 80,00" para 80.00
        return parseFloat(priceString.replace('R$', '').replace('.', '').replace(',', '.').trim());
    }

    function applyAdvancedFilters() {
        // Atualizar filtros de categoria
        const categoryCheckboxes = document.querySelectorAll('input[name="category"]:checked');
        currentFilters.categories = Array.from(categoryCheckboxes).map(cb => cb.value);
        
        // Atualizar filtros de preço
        const minPrice = document.getElementById('minPrice').value;
        const maxPrice = document.getElementById('maxPrice').value;
        currentFilters.minPrice = minPrice ? parseFloat(minPrice) : null;
        currentFilters.maxPrice = maxPrice ? parseFloat(maxPrice) : null;
        
        // Atualizar filtro de estado
        currentFilters.state = document.getElementById('stateFilter').value;
        
        // Fechar modal
        filterModal.style.display = 'none';
        
        // Re-aplicar busca se houver termo de busca
        const currentQuery = searchInput.value.trim();
        if (currentQuery) {
            searchProducts(currentQuery);
        } else if (currentResults.length > 0) {
            // Se não há busca mas há resultados, refiltrar os resultados atuais
            const currentDisplay = resultsTitle.textContent.replace('Resultados para "', '').replace('"', '');
            if (currentDisplay === 'Frutas' || currentDisplay === 'Hortaliças' || currentDisplay === 'Grãos') {
                filterByCategory(currentDisplay.toLowerCase());
            } else if (currentDisplay === 'Ofertas') {
                filterByOffers();
            }
        }
    }

    function resetAdvancedFilters() {
        // Resetar checkboxes de categoria
        document.querySelectorAll('input[name="category"]').forEach(checkbox => {
            checkbox.checked = true;
        });
        
        // Resetar preços
        document.getElementById('minPrice').value = '';
        document.getElementById('maxPrice').value = '';
        
        // Resetar estado
        document.getElementById('stateFilter').value = '';
        
        // Resetar filtros na memória
        currentFilters = {
            categories: ['frutas', 'hortalicas', 'graos'],
            minPrice: null,
            maxPrice: null,
            state: ''
        };
    }

    // Buscas recentes
    function saveRecentSearch(query) {
        let recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        recent = recent.filter(item => item !== query);
        recent.unshift(query);
        recent = recent.slice(0, 5); // Manter apenas as 5 mais recentes
        localStorage.setItem('recentSearches', JSON.stringify(recent));
        loadRecentSearches();
    }

    function loadRecentSearches() {
        const recent = JSON.parse(localStorage.getItem('recentSearches') || '[]');
        if (recent.length > 0) {
            recentList.innerHTML = recent.map(item => `
                <div class="recent-item" onclick="setSearchQuery('${item}')">
                    ${item}
                </div>
            `).join('');
            recentSearches.style.display = 'block';
        } else {
            recentSearches.style.display = 'none';
        }
    }

    function clearRecentSearches() {
        localStorage.removeItem('recentSearches');
        loadRecentSearches();
    }

    // Funções globais para uso no HTML
    window.setSearchQuery = function(query) {
        searchInput.value = query;
        performSearch();
    };

    window.handleInterest = function(productId) {
        const product = productsData.find(p => p.id === productId);
        if (product) {
            // Aqui você pode implementar a lógica de interesse
            // Por exemplo: adicionar aos favoritos, abrir modal, etc.
            alert(`Interesse registrado para: ${product.name}`);
            
            // Simulação: adicionar aos favoritos no localStorage
            let favorites = JSON.parse(localStorage.getItem('favorites') || '[]');
            if (!favorites.includes(productId)) {
                favorites.push(productId);
                localStorage.setItem('favorites', JSON.stringify(favorites));
            }
        }
    };
});