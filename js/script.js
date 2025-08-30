document.addEventListener('DOMContentLoaded', function() {
    // Menu toggle para mobile
    const menuToggle = document.getElementById('menuToggle');
    const mainNav = document.getElementById('mainNav');
    
    menuToggle.addEventListener('click', function() {
        mainNav.classList.toggle('active');
    });
    
    // Form submission handling
    const form = document.getElementById('contribution-form');
    
    if (form) {
        form.addEventListener('submit', function(e) {
            e.preventDefault();
            
            // Simulação de envio do formulário
            const formData = new FormData(form);
            const formValues = Object.fromEntries(formData.entries());
            
            // Aqui você normalmente enviaria os dados para um servidor
            console.log('Dados do formulário:', formValues);
            
            // Feedback para o usuário
            alert('Obrigado por sua contribuição! Entraremos em contato em breve.');
            form.reset();
        });
    }
    
    // Smooth scrolling para âncoras
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function(e) {
            e.preventDefault();
            
            const targetId = this.getAttribute('href');
            if (targetId === '#') return;
            
            const targetElement = document.querySelector(targetId);
            if (targetElement) {
                // Fechar menu mobile se estiver aberto
                if (mainNav) {
                    mainNav.classList.remove('active');
                }
                
                window.scrollTo({
                    top: targetElement.offsetTop - 80,
                    behavior: 'smooth'
                });
            }
        });
    });
    
    // Fechar menu ao clicar fora dele (apenas mobile)
    document.addEventListener('click', function(e) {
        if (window.innerWidth <= 768 && 
            mainNav && 
            !e.target.closest('nav') && 
            !e.target.closest('.menu-toggle') &&
            mainNav.classList.contains('active')) {
            mainNav.classList.remove('active');
        }
    });
});