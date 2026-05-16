// ===== Elementos do DOM =====
const menuToggle = document.getElementById('menuToggle');
const themeToggle = document.getElementById('themeToggle');
const nav = document.getElementById('nav');
const navLinks = document.querySelectorAll('.nav-link');

// ===== Menu Mobile Toggle =====
menuToggle.addEventListener('click', () => {
    menuToggle.classList.toggle('active');
    nav.classList.toggle('active');
});

// Fechar menu ao clicar em um link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        menuToggle.classList.remove('active');
        nav.classList.remove('active');
    });
});

// ===== Smooth Scroll =====
navLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        e.preventDefault();
        const targetId = link.getAttribute('href');
        const targetElement = document.querySelector(targetId);
        
        if (targetElement) {
            const offsetTop = targetElement.offsetTop - 80; // Offset para o header fixo
            window.scrollTo({
                top: offsetTop,
                behavior: 'smooth'
            });
        }
    });
});

// ===== Detecção de Scroll para Ativar Links =====
window.addEventListener('scroll', () => {
    let current = '';
    
    // Obter todas as seções
    const sections = document.querySelectorAll('section');
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        
        if (scrollY >= sectionTop - 100) {
            current = section.getAttribute('id');
        }
    });
    
    // Remover classe ativa de todos os links
    navLinks.forEach(link => {
        link.classList.remove('active');
    });
    
    // Adicionar classe ativa ao link correspondente
    if (current) {
        const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
        if (activeLink) {
            activeLink.classList.add('active');
        }
    }
});

// ===== Animações ao Rolar =====
const observerOptions = {
    threshold: 0.1,
    rootMargin: '0px 0px -50px 0px'
};

const observer = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.style.opacity = '1';
            entry.target.style.transform = 'translateY(0)';
            observer.unobserve(entry.target);
        }
    });
}, observerOptions);

// Observar cards e elementos
const cards = document.querySelectorAll('.project-card, .qualification-item, .merit-item');
cards.forEach((card, index) => {
    card.style.opacity = '0';
    card.style.transform = 'translateY(20px)';
    card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
    observer.observe(card);
});

// ===== Adição de Classe Ativa ao Menu =====
const addActiveStyleToNav = () => {
    navLinks.forEach(link => {
        link.style.transition = 'color 0.3s ease';
    });
};

const applyTheme = (theme) => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
};

const getInitialTheme = () => {
    const savedTheme = localStorage.getItem('site-theme');
    if (savedTheme) return savedTheme;
    return window.matchMedia('(prefers-color-scheme: dark)').matches ? 'dark' : 'light';
};

const toggleTheme = () => {
    const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
    const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
    applyTheme(nextTheme);
    localStorage.setItem('site-theme', nextTheme);
};

if (themeToggle) {
    themeToggle.addEventListener('click', toggleTheme);
}

document.addEventListener('DOMContentLoaded', () => {
    addActiveStyleToNav();
    applyTheme(getInitialTheme());
});

// ===== Efeito de Hover em Cards =====
const projectCards = document.querySelectorAll('.project-card');
projectCards.forEach(card => {
    card.addEventListener('mouseenter', function() {
        this.style.transition = 'all 0.3s ease';
    });
});

// ===== Validação de Links de Contato =====
const contactLinks = document.querySelectorAll('.about-contact a');
contactLinks.forEach(link => {
    link.addEventListener('click', (e) => {
        if (link.getAttribute('href') === '#') {
            e.preventDefault();
            console.log('Link não configurado ainda');
        }
    });
});

// ===== Função para Destacar Seção Atual =====
function highlightCurrentSection() {
    const sections = document.querySelectorAll('section');
    const scrollPosition = window.scrollY + 100;
    
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionBottom = sectionTop + section.clientHeight;
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionBottom) {
            const sectionId = section.getAttribute('id');
            navLinks.forEach(link => {
                link.classList.remove('active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('active');
                }
            });
        }
    });
}

window.addEventListener('scroll', highlightCurrentSection);

// ===== Estilos Dinâmicos para Link Ativo =====
const style = document.createElement('style');
style.innerHTML = `
    .nav-link.active {
        color: var(--primary-color);
        font-weight: 700;
    }
    
    .nav-link.active::after {
        width: 100%;
    }
`;
document.head.appendChild(style);

// ===== Função de Log para Debug =====
console.log('Portfólio de Cauan Martins carregado com sucesso!');
