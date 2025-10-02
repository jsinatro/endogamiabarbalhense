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
    // FUNCIONALIDADE 3: ÍNDICE DINÂMICO (Table of Contents)
    // ========================================================================
    const tocWidget = document.getElementById('toc-widget');
    const tocList = document.getElementById('toc-list');
    const contentArea = document.getElementById('main-content');

    if (tocWidget && tocList && contentArea) {
        // Procura por todos os títulos h4 dentro do conteúdo principal
        const headings = contentArea.querySelectorAll('h4');

        if (headings.length > 0) {
            const ul = document.createElement('ul');
            headings.forEach((heading, index) => {
                const anchorId = `toc-heading-${index}`;
                heading.id = anchorId;

                const li = document.createElement('li');
                const a = document.createElement('a');
                a.textContent = heading.textContent;
                a.href = `#${anchorId}`;
                
                li.appendChild(a);
                ul.appendChild(li);
            });

            tocList.appendChild(ul);
            tocWidget.style.display = 'block'; // Torna o widget visível
        }
    }

});