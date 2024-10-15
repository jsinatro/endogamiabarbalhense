// Função para rolar até a seção correspondente
function scrollToSection(sectionId) {
    // Rola suavemente até a seção especificada
    document.getElementById(sectionId).scrollIntoView({ behavior: 'smooth' });
}

// Função para alternar a exibição do submenu
function toggleSubmenu(submenuId) {
    const submenu = document.getElementById(submenuId);
    // Alterna a visibilidade do submenu
    submenu.style.display = submenu.style.display === 'none' ? 'block' : 'none';
}

// Menu responsivo
document.querySelector('.menu-toggle').addEventListener('click', function() {
    // Alterna a classe 'active' no menu para exibir ou esconder
    document.querySelector('#menu').classList.toggle('active');
});

// Desabilita o botão direito do mouse para copiar ou colar
document.addEventListener('contextmenu', function(event) {
    event.preventDefault(); // Impede o menu de contexto (botão direito do mouse)
    alert("Ei, o botão direito está de férias! Tente o esquerdo, ele adora trabalhar.");
});

// Opcional: Desabilitar também os atalhos de teclado para copiar (Ctrl+C), colar (Ctrl+V) e cortar (Ctrl+X)
document.addEventListener('keydown', function(event) {
    if ((event.ctrlKey && (event.key === 'c' || event.key === 'x' || event.key === 'v'))) {
        event.preventDefault(); // Impede as ações de copiar, cortar e colar
        alert("Ops! Esses atalhos estão de folga hoje. Que tal usar o bom e velho método manual?");
    }
});

// Scritp galeria

let currentPhotoIndex = 0;
let photos = document.querySelectorAll('.gallery img');
let modal = document.getElementById('myModal');
let modalImg = document.getElementById('modalImg');
let captionText = document.getElementById('caption');

function openModal(index) {
    modal.style.display = "block";
    currentPhotoIndex = index;
    updateModal();
}

function closeModal() {
    modal.style.display = "none";
}

function changePhoto(direction) {
    currentPhotoIndex += direction;

    // Se a imagem atual é a primeira ou última, volta ao início ou ao fim
    if (currentPhotoIndex < 0) {
        currentPhotoIndex = photos.length - 1;
    } else if (currentPhotoIndex >= photos.length) {
        currentPhotoIndex = 0;
    }
    
    updateModal();
}

function updateModal() {
    let currentPhoto = photos[currentPhotoIndex];
    modalImg.src = currentPhoto.src;
    captionText.innerHTML = currentPhoto.getAttribute('data-caption');
}