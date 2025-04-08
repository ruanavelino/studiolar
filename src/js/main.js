// Header color change on scroll
const header = document.querySelector('.header');
const mobileMenuBtn = document.querySelector('.mobile-menu-btn');
const navMenu = document.querySelector('.nav-menu');
const navLinks = document.querySelectorAll('.nav-link');

// Throttle scroll events
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

// Header scroll behavior
function updateHeaderState() {
    const header = document.querySelector('.header');
    const scrollY = window.scrollY || window.pageYOffset;
    
    // Força a remoção da classe scrolled quando no topo
    if (scrollY <= 5) {
        header.classList.remove('scrolled');
    } else {
        header.classList.add('scrolled');
    }
}

// Use throttling for better performance
const throttledScrollHandler = throttle(updateHeaderState, 50);

// Add event listeners
window.addEventListener('scroll', throttledScrollHandler, { passive: true });
window.addEventListener('resize', updateHeaderState);

// Função para garantir que o header tenha o estado correto na inicialização
function initHeaderState() {
    const scrollY = window.scrollY || window.pageYOffset;
    const header = document.querySelector('.header');
    
    console.log('Inicializando estado do header, scrollY =', scrollY);
    
    // Forçar a remoção da classe inicialmente
    header.classList.remove('scrolled');
    
    // Só adicionar a classe se estiver realmente rolado
    if (scrollY > 5) {
        setTimeout(() => {
            header.classList.add('scrolled');
            console.log('Adicionando classe scrolled');
        }, 10);
    }
}

// Executa imediatamente para definir o estado inicial
setTimeout(initHeaderState, 0);

// Execute novamente após o carregamento completo da página
window.addEventListener('load', () => {
    // Forçar um pequeno atraso para garantir que o scroll está estabilizado
    setTimeout(initHeaderState, 100);
    
    // Executar mais uma vez para ter certeza
    setTimeout(initHeaderState, 500);
});

// Add index to nav links for staggered animation
navLinks.forEach((link, index) => {
    link.style.setProperty('--item-index', index);
});

let isMenuOpen = false;

function toggleMenu() {
    isMenuOpen = !isMenuOpen;
    
    // Use requestAnimationFrame for smooth animation
    requestAnimationFrame(() => {
        mobileMenuBtn.classList.toggle('active');
        navMenu.classList.toggle('active');
        
        // Prevent body scroll when menu is open
        document.body.style.overflow = isMenuOpen ? 'hidden' : '';
    });
}

function closeMenu() {
    if (isMenuOpen) {
        isMenuOpen = false;
        
        requestAnimationFrame(() => {
            mobileMenuBtn.classList.remove('active');
            navMenu.classList.remove('active');
            document.body.style.overflow = '';
        });
    }
}

// Event Listeners
mobileMenuBtn.addEventListener('click', (e) => {
    e.preventDefault();
    toggleMenu();
});

// Close menu when clicking outside
document.addEventListener('click', (e) => {
    if (isMenuOpen && !navMenu.contains(e.target) && !mobileMenuBtn.contains(e.target)) {
        closeMenu();
    }
});

// Close menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', closeMenu);
});

// Close menu on resize if open
window.addEventListener('resize', () => {
    if (window.innerWidth > 768 && isMenuOpen) {
        closeMenu();
    }
});

// Back to top button functionality
const backToTopButton = document.getElementById('backToTop');

backToTopButton.addEventListener('click', () => {
    window.scrollTo({
        top: 0,
        behavior: 'smooth'
    });
});

// Fade in animations on scroll
const observerOptions = {
    root: null,
    rootMargin: '20px',
    threshold: 0.1
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            requestAnimationFrame(() => {
                entry.target.classList.add('visible');
            });
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

document.querySelectorAll('section').forEach(section => {
    section.classList.add('fade-in');
    observer.observe(section);
});

// Form submission handling
const leadForm = document.getElementById('leadForm');
const whatsappNumber = '5527999999999'; // Formato internacional

// Format currency input
function formatCurrency(input) {
    let value = input.value.replace(/\D/g, '');
    value = (parseInt(value) / 100).toFixed(2);
    value = value.replace('.', ',');
    value = value.replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
    input.value = value ? `R$ ${value}` : '';
}

// Format area input
function formatArea(input) {
    let value = input.value.replace(/[^\d.,]/g, '');
    if (value) {
        value = value.replace(/,/g, '.');
        if (!isNaN(value)) {
            input.value = `${value}m²`;
        }
    }
}

// Initialize form field formatters and validation
document.addEventListener('DOMContentLoaded', () => {
    const budgetInput = document.getElementById('budget');
    const spaceInput = document.getElementById('space');
    const requiredFields = leadForm.querySelectorAll('[required]');

    // Add validation messages
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

    // Custom validation for name field
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
});

leadForm.addEventListener('submit', (e) => {
    e.preventDefault();
    leadForm.classList.add('submitted');
    
    if (!leadForm.checkValidity()) {
        // Find first invalid field and focus it
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

// Project data
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

// Create gallery items
function createGallery() {
    const galleryContainer = document.querySelector('.gallery');
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
    
    if (window.feather) {
        feather.replace();
    }
}

// Create and show popup
function createAndShowPopup(project) {
    const popup = document.createElement('div');
    popup.className = 'project-popup';
    popup.id = 'projectPopup';
    
    document.body.style.overflow = 'hidden'; // Prevent scrolling when popup is open
    
    // Create popup content
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

    // Add to DOM
    document.body.appendChild(popup);

    // Initialize Feather icons
    if (window.feather) {
        feather.replace();
    }

    // Setup slideshow
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

    // Event listeners for dots
    dots.forEach((dot, index) => {
        dot.addEventListener('click', () => {
            clearInterval(slideInterval);
            showSlide(index);
            startSlideshow();
        });
    });

    // Close popup function
    function closePopup() {
        const popup = document.getElementById('projectPopup');
        if (popup) {
            popup.classList.add('closing');
            document.body.style.overflow = ''; // Restore scrolling when popup is closed
            
            setTimeout(() => {
                popup.remove();
                clearInterval(window.slideInterval);
            }, 300);
        }
    }

    // Close the popup when clicking outside the content
    popup.addEventListener('click', (e) => {
        if (e.target === popup) closePopup();
    });
    
    // Close the popup when clicking the close button
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

    // Show popup with animation
    requestAnimationFrame(() => {
        popup.classList.add('active');
        startSlideshow();
    });
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    createGallery();
});

function openProjectPopup(project) {
    const popup = document.createElement('div');
    popup.className = 'project-popup';
    
    // Prevent body scrolling when popup is open
    document.body.style.overflow = 'hidden';
    
    // Create popup content
    popup.innerHTML = `
        <div class="popup-content">
            <div class="slideshow-container">
                ${project.images.map(img => `
                    <div class="slide">
                        <img src="${img}" alt="${project.title}">
                    </div>
                `).join('')}
                <div class="dots-container">
                    ${project.images.map((_, index) => `
                        <span class="dot ${index === 0 ? 'active' : ''}" data-index="${index}"></span>
                    `).join('')}
                </div>
            </div>
            <div class="popup-info">
                <h2>${project.title}</h2>
                <div class="popup-metadata">
                    ${project.location ? `<div class="metadata-item"><strong>Localização:</strong> ${project.location}</div>` : ''}
                    ${project.area ? `<div class="metadata-item"><strong>Área:</strong> ${project.area}m²</div>` : ''}
                    ${project.year ? `<div class="metadata-item"><strong>Ano:</strong> ${project.year}</div>` : ''}
                </div>
                <div class="popup-description">
                    <p>${project.description}</p>
                </div>
                <div class="popup-actions">
                    <button class="cta-button">
                        Quero um projeto assim! Solicitar orçamento
                        <i data-feather="arrow-right"></i>
                    </button>
                </div>
            </div>
            <button class="close-popup">
                <i data-feather="x"></i>
            </button>
        </div>
    `;
    
    document.body.appendChild(popup);
    
    // Initialize Feather icons
    feather.replace();
    
    // Set up slideshow
    let currentSlide = 0;
    const slides = popup.querySelectorAll('.slide');
    const dots = popup.querySelectorAll('.dot');
    
    function showSlide(index) {
        // Hide all slides
        slides.forEach(slide => {
            slide.style.display = 'none';
        });
        
        // Remove active class from all dots
        dots.forEach(dot => {
            dot.classList.remove('active');
        });
        
        // Show the current slide and activate corresponding dot
        slides[index].style.display = 'block';
        dots[index].classList.add('active');
        currentSlide = index;
    }
    
    // Initialize first slide
    showSlide(0);
    
    // Add click event to dots
    dots.forEach(dot => {
        dot.addEventListener('click', function() {
            const slideIndex = parseInt(this.getAttribute('data-index'));
            showSlide(slideIndex);
        });
    });
    
    // Automatic slideshow if more than one image
    let slideInterval;
    if (slides.length > 1) {
        slideInterval = setInterval(function() {
            let nextSlide = currentSlide + 1;
            if (nextSlide >= slides.length) {
                nextSlide = 0;
            }
            showSlide(nextSlide);
        }, 5000);
    }
    
    // Event listener for close button
    const closeButton = popup.querySelector('.close-popup');
    closeButton.addEventListener('click', function() {
        closePopup();
    });
    
    // Close popup when clicking outside content
    popup.addEventListener('click', function(e) {
        if (e.target === popup) {
            closePopup();
        }
    });
    
    // Get CTA button and add click event
    const ctaButton = popup.querySelector('.cta-button');
    ctaButton.addEventListener('click', function() {
        // Scroll to contact section
        closePopup();
        const contactSection = document.getElementById('contact');
        if (contactSection) {
            contactSection.scrollIntoView({ behavior: 'smooth' });
        }
    });
    
    // Function to close popup
    function closePopup() {
        // Clear interval if it exists
        if (slideInterval) {
            clearInterval(slideInterval);
        }
        
        // Restore body scrolling
        document.body.style.overflow = '';
        
        // Remove popup with animation
        popup.classList.add('closing');
        setTimeout(() => {
            if (popup.parentNode) {
                popup.parentNode.removeChild(popup);
            }
        }, 300);
    }
    
    // Add animation class after a small delay
    setTimeout(() => {
        popup.classList.add('active');
    }, 10);
} 