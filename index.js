// Validering för kontaktformulär
document.addEventListener('DOMContentLoaded', function() {
    // Markera aktiv navigationslänk
    setActiveNavLink();
    
    const form = document.querySelector('.contact-form form');
    
    if (form) {
        form.addEventListener('submit', validateForm);
    }
});

// Sätt active-klassen på rätt navigationslänk
function setActiveNavLink() {
    // Hämta nuvarande sida
    const currentPage = window.location.pathname.split('/').pop() || 'index.html';
    
    // Få alla navigeringslänkar
    const navLinks = document.querySelectorAll('nav a');
    
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
    const errorElement = document.createElement('div');
    errorElement.className = 'error-message';
    errorElement.textContent = message;
    field.parentNode.insertBefore(errorElement, field.nextSibling);
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
}

function showSuccess() {
    const form = document.querySelector('.contact-form form');
    const successMessage = document.createElement('div');
    successMessage.className = 'success-message';
    successMessage.textContent = '✓ Tack för ditt meddelande! Vi kontaktar dig snart.';
    
    form.parentNode.insertBefore(successMessage, form);
    
    // Rensa formuläret
    form.reset();
    
    // Ta bort framgångsmeddelandet efter 5 sekunder
    setTimeout(() => {
        successMessage.remove();
    }, 5000);
}
