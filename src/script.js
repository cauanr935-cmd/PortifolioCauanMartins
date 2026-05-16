const safeStorage = {
    getItem(key) {
        try {
            return window.localStorage ? window.localStorage.getItem(key) : null;
        } catch (error) {
            return null;
        }
    },
    setItem(key, value) {
        try {
            if (window.localStorage) {
                window.localStorage.setItem(key, value);
            }
        } catch (error) {
            return null;
        }
    }
};

const prefersDarkMode = () => {
    try {
        return window.matchMedia ? window.matchMedia('(prefers-color-scheme: dark)').matches : false;
    } catch (error) {
        return false;
    }
};

const applyTheme = (theme, themeToggle) => {
    document.body.classList.toggle('dark-theme', theme === 'dark');
    if (themeToggle) {
        themeToggle.textContent = theme === 'dark' ? '☀️' : '🌙';
        themeToggle.title = theme === 'dark' ? 'Ativar modo claro' : 'Ativar modo escuro';
    }
};

const init3DTilt = () => {
    const cards = document.querySelectorAll('.card-3d');
    
    cards.forEach(card => {
        card.addEventListener('mousemove', (e) => {
            const rect = card.getBoundingClientRect();
            const centerX = rect.left + rect.width / 2;
            const centerY = rect.top + rect.height / 2;
            
            const mouseX = e.clientX;
            const mouseY = e.clientY;
            
            const distX = mouseX - centerX;
            const distY = mouseY - centerY;
            
            const rotateY = (distX / (rect.width / 2)) * 8;
            const rotateX = -(distY / (rect.height / 2)) * 8;
            
            card.style.transform = `rotateX(${rotateX}deg) rotateY(${rotateY}deg) scale(1.02)`;
            card.style.transition = 'none';
        });
        
        card.addEventListener('mouseleave', () => {
            card.style.transform = 'rotateX(0deg) rotateY(0deg) scale(1)';
            card.style.transition = 'transform 0.6s cubic-bezier(0.23, 1, 0.320, 1)';
        });
    });
};

const getInitialTheme = () => {
    const savedTheme = safeStorage.getItem('site-theme');
    if (savedTheme === 'dark' || savedTheme === 'light') {
        return savedTheme;
    }
    return prefersDarkMode() ? 'dark' : 'light';
};

const typewriter = (element, speed = 60) => {
    const text = element.textContent.trim();
    element.textContent = '';

    const cursor = document.createElement('span');
    cursor.className = 'typewriter-cursor';
    cursor.textContent = '|';
    element.appendChild(cursor);

    let index = 0;
    const typeNext = () => {
        if (index < text.length) {
            cursor.insertAdjacentText('beforebegin', text.charAt(index));
            index += 1;
            setTimeout(typeNext, speed);
        } else {
            setTimeout(() => cursor.remove(), 800);
        }
    };

    typeNext();
};

const initTypewriter = () => {
    const headline = document.querySelector('.hero-headline.typewriter');
    if (headline) {
        typewriter(headline);
    }
};

const initScrollReveal = () => {
    const reveals = document.querySelectorAll('.reveal');
    if (!reveals.length) return;

    const revealObserver = new IntersectionObserver((entries, observer) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('visible');
                observer.unobserve(entry.target);
            }
        });
    }, {
        threshold: 0.15,
        rootMargin: '0px 0px -50px 0px'
    });

    reveals.forEach(element => revealObserver.observe(element));
};

const initThemeSwitcher = (themeToggle) => {
    if (!themeToggle) return;

    themeToggle.addEventListener('click', () => {
        const currentTheme = document.body.classList.contains('dark-theme') ? 'dark' : 'light';
        const nextTheme = currentTheme === 'dark' ? 'light' : 'dark';
        applyTheme(nextTheme, themeToggle);
        safeStorage.setItem('site-theme', nextTheme);
    });
};

document.addEventListener('DOMContentLoaded', () => {
    const menuToggle = document.getElementById('menuToggle');
    const themeToggle = document.getElementById('themeToggle');
    const nav = document.getElementById('nav');
    const navLinks = document.querySelectorAll('.nav-link');

    if (menuToggle && nav) {
        menuToggle.addEventListener('click', () => {
            menuToggle.classList.toggle('active');
            nav.classList.toggle('active');
        });
    }

    navLinks.forEach(link => {
        link.addEventListener('click', () => {
            if (menuToggle && nav) {
                menuToggle.classList.remove('active');
                nav.classList.remove('active');
            }
        });

        link.addEventListener('click', (e) => {
            e.preventDefault();
            const targetId = link.getAttribute('href');
            const targetElement = document.querySelector(targetId);

            if (targetElement) {
                const offsetTop = targetElement.offsetTop - 80;
                window.scrollTo({
                    top: offsetTop,
                    behavior: 'smooth'
                });
            }
        });
    });

    const highlightCurrentSection = () => {
        const sections = document.querySelectorAll('section');
        const scrollPosition = window.scrollY + 100;
        let current = '';

        sections.forEach(section => {
            const sectionTop = section.offsetTop;
            const sectionHeight = section.clientHeight;
            if (scrollPosition >= sectionTop - 100 && scrollPosition < sectionTop + sectionHeight) {
                current = section.getAttribute('id');
            }
        });

        navLinks.forEach(link => link.classList.remove('active'));

        if (current) {
            const activeLink = document.querySelector(`.nav-link[href="#${current}"]`);
            if (activeLink) {
                activeLink.classList.add('active');
            }
        }
    };

    window.addEventListener('scroll', highlightCurrentSection);
    highlightCurrentSection();

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

    const cards = document.querySelectorAll('.project-card, .qualification-item, .merit-item');
    cards.forEach((card, index) => {
        card.style.opacity = '0';
        card.style.transform = 'translateY(20px)';
        card.style.transition = `opacity 0.5s ease-out ${index * 0.1}s, transform 0.5s ease-out ${index * 0.1}s`;
        observer.observe(card);
    });

    navLinks.forEach(link => {
        link.style.transition = 'color 0.3s ease';
    });

    initThemeSwitcher(themeToggle);
    applyTheme(getInitialTheme(), themeToggle);
    initTypewriter();
    initScrollReveal();
    init3DTilt();

    const projectCards = document.querySelectorAll('.project-card');
    projectCards.forEach(card => {
        card.addEventListener('mouseenter', function() {
            this.style.transition = 'all 0.3s ease';
        });
    });

    const contactLinks = document.querySelectorAll('.about-contact a');
    contactLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            if (link.getAttribute('href') === '#') {
                e.preventDefault();
                console.log('Link não configurado ainda');
            }
        });
    });

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

    console.log('Portfólio de Cauan Martins carregado com sucesso!');
});
