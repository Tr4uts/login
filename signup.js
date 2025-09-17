// --- Função para alternar a visibilidade da senha ---
function setupPasswordToggle(inputId, toggleId) {
    const passwordInput = document.getElementById(inputId);
    const togglePassword = document.getElementById(toggleId);
    const eyeIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 4.5C7 4.5 2.73 7.61 1 12c1.73 4.39 6 7.5 11 7.5s9.27-3.11 11-7.5c-1.73-4.39-6-7.5-11-7.5zM12 17c-2.76 0-5-2.24-5-5s2.24-5 5-5 5 2.24 5 5-2.24 5-5 5zm0-8c-1.66 0-3 1.34-3 3s1.34 3 3 3 3-1.34 3-3-1.34-3-3-3z"/></svg>`;
    const eyeSlashIcon = `<svg xmlns="http://www.w3.org/2000/svg" viewBox="0 0 24 24"><path d="M12 7c2.76 0 5 2.24 5 5 0 .65-.13 1.26-.36 1.83l2.92 2.92c1.51-1.26 2.7-2.89 3.44-4.75-1.73-4.39-6-7.5-11-7.5-1.4 0-2.74.25-3.98.7l2.16 2.16C10.74 7.13 11.35 7 12 7zM2 4.27l2.28 2.28.46.46C3.08 8.3 1.78 10.02 1 12c1.73 4.39 6 7.5 11 7.5 1.55 0 3.03-.3 4.38-.84l.42.42L19.73 22 21 20.73 3.27 3 2 4.27zM7.53 9.8l1.55 1.55c-.05.21-.08.43-.08.65 0 1.66 1.34 3 3 3 .22 0 .44-.03.65-.08l1.55 1.55c-.67.33-1.41.53-2.2.53-2.76 0-5-2.24-5-5 0-.79.2-1.53.53-2.2zm4.31-.78l3.15 3.15.02-.16c0-1.66-1.34-3-3-3l-.17.01z"/></svg>`;

    if (!passwordInput || !togglePassword) return;

    togglePassword.innerHTML = eyeIcon;
    togglePassword.addEventListener('click', function (event) {
        event.preventDefault();
        const type = passwordInput.getAttribute('type') === 'password' ? 'text' : 'password';
        passwordInput.setAttribute('type', type);
        this.innerHTML = type === 'password' ? eyeIcon : eyeSlashIcon;
    });
}

document.addEventListener("DOMContentLoaded", function () {
    const signupForm = document.getElementById('signup-form');
    if (!signupForm) return;

    const emailInput = document.getElementById('email'); // --- ADIÇÃO ---
    const passwordInput = document.getElementById('password');
    const confirmPasswordInput = document.getElementById('confirm-password');

    // --- Seleção dos elementos de feedback da senha ---
    const feedbackContainer = document.querySelector("#senha-feedback-container");
    const progressBarFill = document.querySelector("#senha-barra-progresso-fill");
    const forcaSenhaTexto = document.querySelector("#senha-forca-texto");
    const criteriaItems = {
        comprimento: document.querySelector("#senha-comprimento"),
        maiuscula: document.querySelector("#senha-maiuscula"),
        minuscula: document.querySelector("#senha-minuscula"),
        simbolo: document.querySelector("#senha-simbolo"),
        numero: document.querySelector("#senha-numero")
    };

    // --- FUNÇÕES AUXILIARES ---

    function displayError(inputElement, message) {
        const errorElementId = inputElement.id + '-error';
        let errorElement = document.getElementById(errorElementId);
        if (!errorElement) {
            errorElement = document.createElement('p');
            errorElement.id = errorElementId;
            errorElement.className = 'error-message';
            errorElement.setAttribute('aria-live', 'polite');
            inputElement.parentNode.insertBefore(errorElement, inputElement.nextSibling);
            inputElement.setAttribute('aria-describedby', errorElementId);
        }
        errorElement.innerText = message;
        inputElement.classList.toggle('input-error', !!message);
    }

    function verificarCriteriosSenha(senha) {
        return {
            comprimento: senha.length >= 8,
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            simbolo: /[^A-Za-z0-9]/.test(senha),
            numero: /\d/.test(senha)
        };
    }

    function todosCriteriosAtendidos(criterios) {
        return Object.values(criterios).every(val => val === true);
    }

    // --- LÓGICA DE VALIDAÇÃO ---
    
    // --- ADIÇÃO: Função de validação de e-mail ---
    function validateEmail() {
        // Expressão regular para validar um formato de e-mail comum.
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        const isValid = emailRegex.test(emailInput.value);
        if (!isValid) {
            displayError(emailInput, "Por favor, insira um e-mail válido.");
        } else {
            displayError(emailInput, ""); // Limpa o erro se for válido
        }
        return isValid;
    }

    function validatePasswordStrength() {
        const criterios = verificarCriteriosSenha(passwordInput.value);
        const isStrong = todosCriteriosAtendidos(criterios);
        if (!isStrong) {
            displayError(passwordInput, "A senha não atende a todos os critérios de segurança.");
        } else {
            displayError(passwordInput, "");
        }
        return isStrong;
    }

    function validatePasswordMatch() {
        if (confirmPasswordInput.value.length === 0) {
            displayError(confirmPasswordInput, "");
            return false;
        }
        const isMatch = passwordInput.value === confirmPasswordInput.value;
        if (!isMatch) {
            displayError(confirmPasswordInput, "As senhas não coincidem.");
        } else {
            displayError(confirmPasswordInput, "");
        }
        return isMatch;
    }

    // --- EVENT LISTENERS ---
    
    emailInput.addEventListener('blur', validateEmail); //Valida o e-mail ao perder o foco
    emailInput.addEventListener('focus', () => displayError(emailInput, '')); //Limpa o erro ao focar no campo

    passwordInput.addEventListener('focus', () => feedbackContainer.classList.add('visible'));
    passwordInput.addEventListener('blur', () => feedbackContainer.classList.remove('visible'));
    passwordInput.addEventListener('input', function () {
        const senha = this.value;
        const criterios = verificarCriteriosSenha(senha);
        let criteriaMet = 0;
        let forcaTexto = 'Nenhuma';
        let corForca = '#888';

        const validateCriterion = (element, isValid) => {
            if (isValid) {
                element.classList.add('valid');
                criteriaMet++;
            } else {
                element.classList.remove('valid');
            }
        };

        validateCriterion(criteriaItems.comprimento, criterios.comprimento);
        validateCriterion(criteriaItems.maiuscula, criterios.maiuscula);
        validateCriterion(criteriaItems.minuscula, criterios.minuscula);
        validateCriterion(criteriaItems.simbolo, criterios.simbolo);
        validateCriterion(criteriaItems.numero, criterios.numero);
        
        validatePasswordMatch();

        const widthPercentage = (criteriaMet / 5) * 100;

        switch (criteriaMet) {
            case 1: forcaTexto = 'Muito Fraca'; corForca = '#e74c3c'; break;
            case 2: forcaTexto = 'Fraca'; corForca = '#ffac3b'; break;
            case 3: forcaTexto = 'Média'; corForca = '#f1c40f'; break;
            case 4: forcaTexto = 'Forte'; corForca = '#57a64a'; break;
            case 5: forcaTexto = 'Excelente'; corForca = '#2ecc71'; break;
        }

        progressBarFill.style.width = widthPercentage + '%';
        progressBarFill.style.backgroundColor = corForca;
        forcaSenhaTexto.innerText = forcaTexto;
        forcaSenhaTexto.style.color = corForca;
    });

    confirmPasswordInput.addEventListener('input', validatePasswordMatch);

    // --- VALIDAÇÃO FINAL NO ENVIO ---
    signupForm.addEventListener('submit', function (event) {
        event.preventDefault();
        
        // --- ALTERAÇÃO: Roda todas as validações, incluindo a de e-mail ---
        const isEmailValid = validateEmail();
        const isStrong = validatePasswordStrength();
        const isMatch = validatePasswordMatch();

        if (isEmailValid && isStrong && isMatch) { // --- ALTERAÇÃO: Adiciona a validação de e-mail à condição ---
            alert("Inscrição bem-sucedida!");
            window.location.href = "index.html";
        } else {
            console.log("Validação falhou. O formulário não foi enviado.");
            const firstErrorInput = signupForm.querySelector('.input-error');
            if (firstErrorInput) {
                firstErrorInput.focus();
            }
        }
    });

    // --- CONFIGURAÇÃO INICIAL ---
    setupPasswordToggle('password', 'togglePassword');
    setupPasswordToggle('confirm-password', 'toggleConfirmPassword');
});