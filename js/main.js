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
        const mainContent = document.querySelector('main') || document.getElementById('main-content');

        function clearHighlights(root) {
            const highlightSpans = root.querySelectorAll('span.search-highlight');
            highlightSpans.forEach((span) => {
                const parent = span.parentNode;
                if (!parent) return;

                parent.replaceChild(document.createTextNode(span.textContent || ''), span);
                parent.normalize();
            });
        }

        function highlightTerm(root, term) {
            if (!root || !term) return 0;

            const escapedTerm = term.replace(/[.*+?^${}()|[\]\\]/g, '\\$&');
            const regex = new RegExp(escapedTerm, 'gi');
            const forbiddenTags = new Set(['SCRIPT', 'STYLE', 'NOSCRIPT', 'INPUT', 'TEXTAREA']);
            const walker = document.createTreeWalker(
                root,
                NodeFilter.SHOW_TEXT,
                {
                    acceptNode(node) {
                        const parentElement = node.parentElement;
                        if (!parentElement) return NodeFilter.FILTER_REJECT;
                        if (!node.nodeValue || !node.nodeValue.trim()) return NodeFilter.FILTER_REJECT;
                        if (forbiddenTags.has(parentElement.tagName)) return NodeFilter.FILTER_REJECT;
                        if (parentElement.closest('script, style, noscript, input, textarea, .search-highlight')) {
                            return NodeFilter.FILTER_REJECT;
                        }
                        return NodeFilter.FILTER_ACCEPT;
                    }
                }
            );

            const textNodes = [];
            while (walker.nextNode()) {
                textNodes.push(walker.currentNode);
            }

            let totalMatches = 0;
            textNodes.forEach((textNode) => {
                const text = textNode.nodeValue;
                if (!text) return;

                regex.lastIndex = 0;
                let match;
                let lastIndex = 0;
                const fragment = document.createDocumentFragment();

                while ((match = regex.exec(text)) !== null) {
                    totalMatches += 1;

                    if (match.index > lastIndex) {
                        fragment.appendChild(document.createTextNode(text.slice(lastIndex, match.index)));
                    }

                    const span = document.createElement('span');
                    span.className = 'search-highlight';
                    span.textContent = match[0];
                    fragment.appendChild(span);

                    lastIndex = match.index + match[0].length;
                }

                if (lastIndex > 0) {
                    if (lastIndex < text.length) {
                        fragment.appendChild(document.createTextNode(text.slice(lastIndex)));
                    }
                    textNode.parentNode.replaceChild(fragment, textNode);
                }
            });

            return totalMatches;
        }

        searchForm.addEventListener('submit', function(e) {
            e.preventDefault();
            clearHighlights(document);

            const query = searchInput.value.trim();
            if (query.length === 0 || !mainContent) {
                return;
            }

            const matches = highlightTerm(mainContent, query);
            const firstHighlight = mainContent.querySelector('.search-highlight');

            if (matches > 0 && firstHighlight) {
                firstHighlight.scrollIntoView({ behavior: 'smooth', block: 'center' });
            } else {
                alert('Termo não encontrado na página.');
            }
        });
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
