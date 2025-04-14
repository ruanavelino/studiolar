/**
 * Studio Lar - Main JavaScript
 * Controla o comportamento do header, menu mobile, e outras funcionalidades interativas do site
 */

document.addEventListener('DOMContentLoaded', function() {
    // Inicializar Feather Icons
    if (window.feather) {
        feather.replace();
    }
    
    // ===== HEADER E NAVEGAÇÃO =====
    const header = document.querySelector('.header');
    const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
    const navMenu = document.querySelector('.nav-menu');
    const navLinks = document.querySelectorAll('.nav-link');
    let isMenuOpen = false;
    
    // Função para melhor performance em eventos de scroll
    function throttle(func, limit) {
        let inThrottle;
        return function(...args) {
            if (!inThrottle) {
                func.apply(this, args);
                inThrottle = true;
                setTimeout(() => inThrottle = false, limit);
            }
        }
    }
    
    // Atualizar estado do header com base na posição do scroll
    function updateHeaderState() {
        if (window.scrollY > 50) {
            header.classList.add('scrolled');
        } else {
            header.classList.remove('scrolled');
        }
    }
    
    // Alternar menu mobile
    function toggleMenu(e) {
        if (e) e.preventDefault();
        isMenuOpen = !isMenuOpen;
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    }
    
    // Fechar menu mobile
    function closeMenu() {
        if (isMenuOpen) {
            isMenuOpen = false;
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        }
    }
    
    // Event listeners para o header e navegação
    if (header) {
        // Scroll event com throttle para melhor performance
        const throttledScrollHandler = throttle(updateHeaderState, 50);
        window.addEventListener('scroll', throttledScrollHandler, { passive: true });
        
        // Definir estado inicial do header
        updateHeaderState();
    }
    
    if (mobileMenuBtn) {
        mobileMenuBtn.addEventListener('click', toggleMenu);
    }
    
    if (navMenu) {
        // Fechar menu ao clicar fora
        document.addEventListener('click', (e) => {
            if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
                closeMenu();
            }
        });
        
        // Fechar menu ao clicar em links
        if (navLinks.length > 0) {
            navLinks.forEach(link => {
                link.addEventListener('click', closeMenu);
            });
        }
        
        // Fechar menu ao redimensionar para desktop
        window.addEventListener('resize', () => {
            if (window.innerWidth > 768 && isMenuOpen) {
                closeMenu();
            }
        });
    }
    
    // ===== BOTÃO VOLTAR AO TOPO =====
    const backToTopButton = document.getElementById('backToTop');
    
    if (backToTopButton) {
        // Rolar para o topo ao clicar
        backToTopButton.addEventListener('click', () => {
            window.scrollTo({
                top: 0,
                behavior: 'smooth'
            });
        });
        
        // Mostrar/ocultar botão voltar ao topo
        function toggleBackToTopButton() {
            if (window.scrollY > 300) {
                backToTopButton.classList.add('visible');
            } else {
                backToTopButton.classList.remove('visible');
            }
        }
        
        // Usar throttle para melhor performance
        const throttledToggleBackToTop = throttle(toggleBackToTopButton, 100);
        window.addEventListener('scroll', throttledToggleBackToTop, { passive: true });
        
        // Estado inicial
        toggleBackToTopButton();
    }
    
    // ===== GALERIA DE PROJETOS =====
    const galleryContainer = document.querySelector('.gallery');
    
    // Dados dos projetos
    const projectsData = [
        {
            images: [
                'src/img/hanzo.png',
                'src/img/hanzo.png',
                'src/img/hanzo.png'
            ],
            title: 'Hanzo Sushi',
            description: 'Restaurante japonês com design moderno e acolhedor. Espaço com ambiente de sushi bar e área de mesas para uma experiência gastronômica única.',
            location: 'Vila Velha, ES',
            area: '115m²',
            year: '2024'
        },
        {
            images: [
                'src/img/ibnj.png',
                'src/img/ibnj.png',
                'src/img/ibnj.png'
            ],
            title: 'Igreja - IBNJ',
            description: 'Igreja com design moderno e acolhedor. Espaço com ambiente de igreja e área de mesas para uma experiência religiosa única.',
            location: 'Vitória, ES',
            area: '32m²',
            year: '2025'
        },
        {
            images: [
                'src/img/quarto-helena.png',
                'src/img/quarto-helena.png',
                'src/img/quarto-helena.png'
            ],
            title: 'Quarto Helena',
            description: 'Quarto com design moderno com design minimalista e aconchegante.',
            location: 'Serra, ES',
            area: '28m²',
            year: '2023'
        },
        {
            images: [
                'src/img/predio.png',
                'src/img/predio.png',
                'src/img/predio.png'
            ],
            title: 'Predio Comercial',
            description: 'Predio comercial com design moderno e acolhedor. Espaço com ambiente de predio e área de mesas para uma experiência comercial única.',
            location: 'Vila Velha, ES',
            area: '72m²',
            year: '2024'
        },
        {
            images: [
                'src/img/casa01.png',
                'src/img/casa01.png',
                'src/img/casa01.png'
            ],
            title: 'Casa alto padrão',
            description: 'Casa com design moderno e de alto padrão. Espaço com ambiente de casa e área de mesas para uma experiência residencial única.',
            location: 'Vitória, ES',
            area: '427m²',
            year: '2025'
        },
        {
            images: [
                'src/img/clinica-alves.png',
                'src/img/clinica-alves.png',
                'src/img/clinica-alves.png'
            ],
            title: 'Clínica Alves',
            description: 'Clínica com design moderno e acolhedor. Espaço com ambiente de clínica e área de mesas para uma experiência clínica única.',
            location: 'Guarapari, ES',
            area: '76m²',
            year: '2025'
        }
    ];
    
    // Criar galeria de projetos
    function createGallery() {
        if (!galleryContainer) return;
        
        const fragment = document.createDocumentFragment();
        
        projectsData.forEach((project) => {
            const galleryItem = document.createElement('div');
            galleryItem.className = 'gallery-item';
            
            const imageContainer = document.createElement('div');
            imageContainer.className = 'gallery-image-container';
            
            const img = document.createElement('img');
            img.src = project.images[0];
            img.alt = project.title;
            img.loading = 'lazy';
            
            const overlay = document.createElement('div');
            overlay.className = 'gallery-overlay';
            overlay.innerHTML = `
                <h3>${project.title}</h3>
                <p class="project-preview">${project.description.substring(0, 100)}...</p>
                <div class="project-meta">
                    <span><i data-feather="map-pin"></i> ${project.location}</span>
                    <span><i data-feather="maximize-2"></i> ${project.area}</span>
                </div>
                <button class="view-project-btn">Ver Projeto</button>
            `;
            
            imageContainer.appendChild(img);
            imageContainer.appendChild(overlay);
            galleryItem.appendChild(imageContainer);
            
            galleryItem.addEventListener('click', () => {
                createAndShowPopup(project);
            });
            
            fragment.appendChild(galleryItem);
        });
        
        galleryContainer.appendChild(fragment);
        
        // Reinicializar ícones Feather depois de criar a galeria
        if (window.feather) {
            feather.replace();
        }
    }
    
    // Criar e mostrar popup de projeto
    function createAndShowPopup(project) {
        const popup = document.createElement('div');
        popup.className = 'project-popup';
        popup.id = 'projectPopup';
        
        document.body.style.overflow = 'hidden'; // Evitar scroll quando popup está aberto
        
        // Criar conteúdo do popup
        popup.innerHTML = `
            <div class="popup-content">
                <button class="close-popup" aria-label="Fechar">
                    <i data-feather="x"></i>
                </button>
                <div class="popup-image-container">
                    <div class="slideshow-container">
                        ${project.images.map((img, index) => `<div class="slide${index === 0 ? ' active' : ''}"><img src="${img}" alt="${project.title} - Imagem ${index + 1}"></div>`).join('')}
                    </div>
                    <div class="slideshow-dots">
                        ${project.images.map((_, index) => `<span class="dot${index === 0 ? ' active' : ''}"></span>`).join('')}
                    </div>
                </div>
                <div class="popup-details">
                    <h2>${project.title}</h2>
                    <p>${project.description}</p>
                    <div class="popup-info">
                        <div class="info-item">
                            <h4>Localização</h4>
                            <p>${project.location}</p>
                        </div>
                        <div class="info-item">
                            <h4>Área</h4>
                            <p>${project.area}</p>
                        </div>
                        <div class="info-item">
                            <h4>Ano</h4>
                            <p>${project.year}</p>
                        </div>
                    </div>
                    <div class="popup-actions">
                        <button class="cta-button">
                            <i data-feather="message-circle"></i>
                            Quero um projeto assim! Solicitar orçamento
                        </button>
                    </div>
                </div>
            </div>
        `;
    
        // Adicionar ao DOM
        document.body.appendChild(popup);
    
        // Inicializar ícones Feather
        if (window.feather) {
            feather.replace();
        }
    
        // Configurar slideshow
        let currentSlide = 0;
        const slides = popup.querySelectorAll('.slide');
        const dots = popup.querySelectorAll('.dot');
        let slideInterval;
    
        function showSlide(index) {
            slides.forEach(slide => slide.classList.remove('active'));
            dots.forEach(dot => dot.classList.remove('active'));
            slides[index].classList.add('active');
            dots[index].classList.add('active');
            currentSlide = index;
        }
    
        function startSlideshow() {
            slideInterval = setInterval(() => {
                const nextSlide = (currentSlide + 1) % slides.length;
                showSlide(nextSlide);
            }, 5000);
        }
    
        // Event listeners para dots
        dots.forEach((dot, index) => {
            dot.addEventListener('click', () => {
                clearInterval(slideInterval);
                showSlide(index);
                startSlideshow();
            });
        });
    
        // Função para fechar popup
        function closePopup() {
            const popup = document.getElementById('projectPopup');
            if (popup) {
                popup.classList.add('closing');
                document.body.style.overflow = ''; // Restaurar scroll quando popup é fechado
                
                setTimeout(() => {
                    popup.remove();
                    clearInterval(window.slideInterval);
                }, 300);
            }
        }
    
        // Fechar popup ao clicar fora do conteúdo
        popup.addEventListener('click', (e) => {
            if (e.target === popup) closePopup();
        });
        
        // Fechar popup ao clicar no botão de fechar
        const closeButton = popup.querySelector('.close-popup');
        closeButton.addEventListener('click', closePopup);
    
        const ctaButton = popup.querySelector('.cta-button');
        ctaButton.addEventListener('click', () => {
            closePopup();
            const contactForm = document.getElementById('leadForm');
            contactForm.scrollIntoView({ behavior: 'smooth' });
            const projectTypeSelect = document.getElementById('projectType');
            if (projectTypeSelect) projectTypeSelect.focus();
        });
    
        document.addEventListener('keydown', (e) => {
            if (e.key === 'Escape') closePopup();
        });
    
        // Mostrar popup com animação
        setTimeout(() => {
            popup.classList.add('active');
            startSlideshow();
        }, 10);
    }
    
    // Inicializar galeria se existir
    if (galleryContainer) {
        createGallery();
    }
    
    // ===== FORMULÁRIO DE CONTATO =====
    const leadForm = document.getElementById('leadForm');
    if (leadForm) {
        const whatsappNumber = '5527999999999'; // Formato internacional
        
        // Formatar entrada de moeda
        function formatCurrency(input) {
            let value = input.value.replace(/\D/g, '');
            value = (parseInt(value) / 100).toFixed(2);
            value = value.replace('.', ',');
            value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
            input.value = value ? `R$ ${value}` : '';
        }
        
        // Formatar entrada de área
        function formatArea(input) {
            let value = input.value.replace(/[^\d.,]/g, '');
            if (value) {
                value = value.replace(/,/g, '.');
                if (!isNaN(value)) {
                    input.value = `${value}m²`;
                }
            }
        }
        
        // Inicializar formatadores e validação de campos
        const budgetInput = document.getElementById('budget');
        const spaceInput = document.getElementById('space');
        const requiredFields = leadForm.querySelectorAll('[required]');
        
        // Adicionar mensagens de validação
        requiredFields.forEach(field => {
            const validationMessage = document.createElement('span');
            validationMessage.className = 'validation-message';
            validationMessage.textContent = 'Este campo é obrigatório';
            field.parentNode.appendChild(validationMessage);
        });
        
        if (budgetInput) {
            budgetInput.addEventListener('input', (e) => {
                let value = e.target.value.replace(/\D/g, '');
                if (value) {
                    formatCurrency(e.target);
                }
            });
        }
        
        if (spaceInput) {
            spaceInput.addEventListener('input', (e) => {
                formatArea(e.target);
            });
        }
        
        // Validação personalizada para campo nome
        const nameInput = document.getElementById('name');
        if (nameInput) {
            nameInput.addEventListener('input', () => {
                const isValid = /^[A-Za-zÀ-ÖØ-öø-ÿ\s]+$/.test(nameInput.value);
                if (!isValid && nameInput.value) {
                    nameInput.setCustomValidity('Por favor, use apenas letras e espaços');
                } else {
                    nameInput.setCustomValidity('');
                }
            });
        }
        
        // Submissão do formulário
        leadForm.addEventListener('submit', (e) => {
            e.preventDefault();
            leadForm.classList.add('submitted');
            
            if (!leadForm.checkValidity()) {
                // Encontrar primeiro campo inválido e focar nele
                const firstInvalid = leadForm.querySelector(':invalid');
                if (firstInvalid) {
                    firstInvalid.focus();
                }
                return;
            }
            
            const formData = {
                name: document.getElementById('name').value,
                city: document.getElementById('city').value,
                state: document.getElementById('state').value,
                projectType: document.getElementById('projectType').value,
                space: document.getElementById('space').value || 'Não informado',
                budget: document.getElementById('budget').value || 'Não informado',
                message: document.getElementById('message').value
            };
        
            const whatsappMessage = `Olá, meu nome é ${formData.name}, estou interessado em iniciar um projeto de arquitetura. Seguem informações:
        
Localização: ${formData.city} - ${formData.state}
Tipo de projeto: ${formData.projectType}
Área aproximada: ${formData.space}
Orçamento estimado: ${formData.budget}
        
Descrição do projeto:
${formData.message}`;
        
            const encodedMessage = encodeURIComponent(whatsappMessage);
            const whatsappUrl = `https://wa.me/${whatsappNumber}?text=${encodedMessage}`;
            
            window.open(whatsappUrl, '_blank');
            leadForm.reset();
            leadForm.classList.remove('submitted');
        });
    }
    
    // ===== ANIMAÇÕES DE FADE IN =====
    const observerOptions = {
        root: null,
        rootMargin: '20px',
        threshold: 0.1
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, observerOptions);
    
    document.querySelectorAll('section').forEach(section => {
        section.classList.add('fade-in');
        observer.observe(section);
    });
}); 