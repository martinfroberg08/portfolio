// Validering för kontaktformulär
document.addEventListener('DOMContentLoaded', function() {
    // Markera aktiv navigationslänk
    setActiveNavLink();
    initThemeToggle();
    initHamburgerMenu();

    const form = document.querySelector('.contact-form form');

    if (form) {
        form.addEventListener('submit', validateForm);
    }
});

function initHamburgerMenu() {
    const hamburgerBtn = document.getElementById('hamburgerBtn');
    const navLinksWrapper = document.getElementById('navLinksWrapper');

    if (!hamburgerBtn || !navLinksWrapper) return;

    // Toggle menu när hamburgerknappen klickas
    hamburgerBtn.addEventListener('click', function() {
        navLinksWrapper.classList.toggle('active');
        const isActive = navLinksWrapper.classList.contains('active');
        hamburgerBtn.setAttribute('aria-expanded', isActive);
    });

    // Stäng menyn när en länk klickas
    navLinksWrapper.querySelectorAll('a').forEach(link => {
        link.addEventListener('click', function() {
            navLinksWrapper.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        });
    });

    // Stäng menyn när man klickar utanför
    document.addEventListener('click', function(e) {
        if (!e.target.closest('.navbar')) {
            navLinksWrapper.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });

    // Stäng menyn när fönstret ändrar storlek till desktop
    window.addEventListener('resize', function() {
        if (window.innerWidth > 768) {
            navLinksWrapper.classList.remove('active');
            hamburgerBtn.setAttribute('aria-expanded', 'false');
        }
    });
}

function initThemeToggle() {
    const savedTheme = localStorage.getItem('portfolio-theme');
    const initialTheme = savedTheme || 'dark';

    setTheme(initialTheme);

    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
        button.addEventListener('click', function() {
            const currentTheme = document.documentElement.getAttribute('data-theme') || 'dark';
            const nextTheme = currentTheme === 'light' ? 'dark' : 'light';
            setTheme(nextTheme);
        });
    });
}

function setTheme(theme) {
    document.documentElement.setAttribute('data-theme', theme);
    localStorage.setItem('portfolio-theme', theme);

    document.querySelectorAll('[data-theme-toggle]').forEach(button => {
        button.setAttribute('aria-label', theme === 'light' ? 'Växla till mörkt läge' : 'Växla till ljusläge');
        button.setAttribute('title', theme === 'light' ? 'Växla till mörkt läge' : 'Växla till ljusläge');
    });
}

// Sätt active-klassen på rätt navigationslänk
function setActiveNavLink() {
    // Hämta nuvarande sida
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';

    // Få alla navigeringslänkar 
    const navLinks = document.querySelectorAll('.nav-links-wrapper a');

    navLinks.forEach(link => {
        const href = link.getAttribute('href');

        // Ta bort active-klassen från alla
        link.classList.remove('active');

        // Lägg till active om länken matchar nuvarande sida
        if (href === currentPage || (currentPage === '' && href === 'index.html')) {
            link.classList.add('active');
        }
    });
}

function validateForm(e) {
    e.preventDefault();

    // Hämta formulärfält
    const name = document.getElementById('name').value.trim();
    const email = document.getElementById('email').value.trim();
    const subject = document.getElementById('subject').value.trim();
    const message = document.getElementById('message').value.trim();

    // Rensa gamla felmeddelanden
    clearErrors();

    let isValid = true;

    // Validera namn
    if (name === '') {
        showError('name', 'Namn är obligatoriskt');
        isValid = false;
    } else if (name.length < 2) {
        showError('name', 'Namn måste innehålla minst 2 tecken');
        isValid = false;
    }

    // Validera email
    if (email === '') {
        showError('email', 'E-post är obligatoriskt');
        isValid = false;
    } else if (!isValidEmail(email)) {
        showError('email', 'Ange en giltig e-postadress');
        isValid = false;
    }

    // Validera ämne
    if (subject === '') {
        showError('subject', 'Ämne är obligatoriskt');
        isValid = false;
    } else if (subject.length < 3) {
        showError('subject', 'Ämne måste innehålla minst 3 tecken');
        isValid = false;
    }

    // Validera meddelande
    if (message === '') {
        showError('message', 'Meddelande är obligatoriskt');
        isValid = false;
    } else if (message.length < 10) {
        showError('message', 'Meddelandet måste innehålla minst 10 tecken');
        isValid = false;
    }

    // Om formuläret är giltigt, visa framgångsmeddelande
    if (isValid) {
        showSuccess();
        // Här kan du skicka formuläret till en server eller göra något annat
        // this.submit(); // Skicka formuläret
    }
}

function isValidEmail(email) {
    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
    return emailRegex.test(email);
}

function showError(fieldId, message) {
    const field = document.getElementById(fieldId);
    if (!field) return;

    const formGroup = field.closest('.form-group') || field.parentNode;
    
    // Kontrollera om det redan finns ett felmeddelande
    const existingError = formGroup.querySelector('.error-message');
    if (existingError) {
        existingError.textContent = message;
    } else {
        const errorElement = document.createElement('div');
        errorElement.className = 'error-message';
        errorElement.setAttribute('role', 'alert');
        errorElement.textContent = message;
        formGroup.appendChild(errorElement);
    }
    
    field.classList.add('input-error');
}

function clearErrors() {
    // Ta bort gamla felmeddelanden
    document.querySelectorAll('.error-message').forEach(element => {
        element.remove();
    });

    // Ta bort error-klass från input-fält
    document.querySelectorAll('.input-error').forEach(element => {
        element.classList.remove('input-error');
    });

    // Ta bort tidigare lyckomeddelanden
    document.querySelectorAll('.success-message').forEach(element => {
        element.remove();
    });
}

function showSuccess() {
    const form = document.querySelector('.contact-form form');
    if (!form) return;

    const existingMessage = document.querySelector('.success-message');
    if (existingMessage) {
        existingMessage.remove();
    }

    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.setAttribute('role', 'status');
    successMessage.textContent = '✓ Tack för ditt meddelande! Vi kontaktar dig snart.';

    form.parentNode.insertBefore(successMessage, form);

    // Rensa formuläret
    form.reset();

    // Ta bort framgångsmeddelandet efter 5 sekunder
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}
