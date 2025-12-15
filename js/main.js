// js/main.js

// Espera todo o conteúdo da página carregar antes de executar o script
document.addEventListener('DOMContentLoaded', function() {

    // ========================================================================
    // FUNCIONALIDADE 1: ROLAGEM SUAVE PARA ÂNCORAS (ex: link "Contato")
    // ========================================================================
    const internalLinks = document.querySelectorAll('a[href^="#"]');
    internalLinks.forEach(link => {
        link.addEventListener('click', function(e) {
            e.preventDefault();
            const targetId = this.getAttribute('href');
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                targetElement.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // ========================================================================
    // FUNCIONALIDADE 2: PESQUISA DE CONTEÚDO NA PÁGINA
    // ========================================================================
    const searchForm = document.getElementById('content-search-form');
    if (searchForm) {
        const searchInput = document.getElementById('content-search-input');
        const mainContent = document.getElementById('main-content');
        let originalContent = mainContent.innerHTML; // Salva o conteúdo original

        function removeHighlights() {
            mainContent.innerHTML = originalContent; // Restaura o conteúdo original
        }

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            removeHighlights(); // Limpa a busca anterior

            const query = searchInput.value.trim().toLowerCase();
            if (query.length === 0) {
                return;
            }

            const regex = new RegExp(`(${query})`, 'gi');
            
            if (originalContent.toLowerCase().includes(query)) {
                const newContent = originalContent.replace(regex, '<span class="search-highlight">$1</span>');
                mainContent.innerHTML = newContent;
            } else {
                alert('Termo não encontrado na página.');
            }
        });
        
        // Adiciona um estilo para o highlight dinamicamente
        const style = document.createElement('style');
        style.innerHTML = `.search-highlight { background-color: var(--color-accent); color: #fff; font-weight: bold; }`;
        document.head.appendChild(style);
    }
    
// ========================================================================
// FUNCIONALIDADE 3: ÍNDICE DINÂMICO (Table of Contents) com hierarquia
// ========================================================================

// Referências aos elementos do DOM
const tocWidget = document.getElementById('toc-widget');     // Container do widget
const tocList = document.getElementById('toc-list');         // Área onde a lista será inserida
const contentArea = document.getElementById('main-content'); // Área principal do conteúdo

// Verifica se todos os elementos existem
if (tocWidget && tocList && contentArea) {
    // Seleciona todos os títulos h1 a h6 dentro do conteúdo principal
    const headings = contentArea.querySelectorAll('h1, h2, h3, h4, h5, h6');

    // Se houver títulos, começa a construir o índice
    if (headings.length > 0) {
        const tocRoot = document.createElement('ul'); // Raiz da lista
        let currentLevels = [tocRoot]; // Pilha para controlar os níveis de profundidade

        // Itera sobre cada título encontrado
        headings.forEach((heading, index) => {
            const level = parseInt(heading.tagName.substring(1)); // Extrai o nível (1 a 6)
            const anchorId = `toc-heading-${index}`;              // ID único para âncora
            heading.id = anchorId;                                // Define o ID no título original

            // Cria o item da lista e o link
            const li = document.createElement('li');
            const a = document.createElement('a');
            a.textContent = heading.textContent;
            a.href = `#${anchorId}`;
            li.appendChild(a);

            // Adiciona evento de clique no link para expandir/recolher subníveis
            a.addEventListener('click', (e) => {
                const sublist = li.querySelector('ul'); // Verifica se há subnível
                if (sublist) {
                    e.preventDefault(); // Impede rolagem automática
                    sublist.classList.toggle('collapsed'); // Alterna visibilidade
                }
            });

            // Garante que a pilha tenha profundidade suficiente
            while (currentLevels.length < level) {
                const newUl = document.createElement('ul');
                newUl.classList.add('collapsed'); // Começa recolhido
                currentLevels[currentLevels.length - 1].lastElementChild?.appendChild(newUl);
                currentLevels.push(newUl);
            }

            // Remove níveis mais profundos se necessário
            currentLevels = currentLevels.slice(0, level);

            // Adiciona o item ao nível atual
            currentLevels[level - 1].appendChild(li);
        });

        // Insere a lista no widget e exibe
        tocList.appendChild(tocRoot);
        tocWidget.style.display = 'block';
    }
}


    // ========================================================================
// FUNCIONALIDADE 5: GALERIA DE FOTOS (LIGHTBOX)
// ========================================================================
function setupGallery() {
    const modal = document.getElementById("gallery-modal");
    if (!modal) return; // Só executa se estiver na página da galeria

    const modalImg = document.getElementById("modal-img");
    const captionText = document.getElementById("caption");
    const galleryItems = document.querySelectorAll(".gallery-item img");
    const closeButton = document.querySelector(".close-button");

    // Para cada miniatura, adiciona um evento de clique
    galleryItems.forEach(item => {
        item.addEventListener('click', function() {
            modal.style.display = "block";
            modalImg.src = this.src;
            captionText.innerHTML = this.dataset.caption; // Pega a legenda do atributo 'data-caption'
        });
    });

    // Função para fechar o modal
    function closeModal() {
        modal.style.display = "none";
    }

    // Fecha ao clicar no botão 'X'
    closeButton.addEventListener('click', closeModal);

    // Fecha ao clicar fora da imagem (no fundo escuro)
    modal.addEventListener('click', function(e) {
        if (e.target === modal) {
            closeModal();
        }
    });

    // Fecha ao pressionar a tecla 'Esc'
    document.addEventListener('keydown', function(e) {
        if (e.key === "Escape" && modal.style.display === "block") {
            closeModal();
        }
    });
}

// Roda a função da galeria quando a página carrega
document.addEventListener('DOMContentLoaded', setupGallery);
});


// ...código existente...
document.addEventListener('DOMContentLoaded', function() {
    const menuToggle = document.getElementById('menu-toggle');
    const mainMenu = document.getElementById('main-menu');

    menuToggle.addEventListener('click', function() {
        mainMenu.classList.toggle('menu-open');
    });
});
// ...código existente...