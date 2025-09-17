addEventListener("DOMContentLoaded", function (event) {
    // --- Seleção de todos os elementos do formulário ---
    const form = document.querySelector("form[name='meu_form']");
    const nomeInput = document.querySelector("#nome");
    const emailInput = document.querySelector("#email");
    const senhaInput = document.querySelector("#senha");
    const mostrarSenhaCheckbox = document.querySelector("#mostrar-senha");
    const botaoEnviar = document.querySelector("#botao-enviar");
    const campos = document.querySelectorAll("input, select, textarea");

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

    // --- Configuração de ARIA para acessibilidade ---
    const labelErroNome = document.querySelector("#label-erro-nome");
    if (labelErroNome) labelErroNome.setAttribute('aria-live', 'polite');

    const labelErroSenha = document.querySelector("#label-erro-senha");
    if (labelErroSenha) labelErroSenha.setAttribute('aria-live', 'polite');

    let labelErroEmail = document.querySelector("#label-erro-email");
    if (!labelErroEmail) {
        labelErroEmail = document.createElement("p");
        labelErroEmail.id = "label-erro-email";
        emailInput.parentNode.appendChild(labelErroEmail);
    }
    labelErroEmail.setAttribute('aria-live', 'polite');

    // --- FUNÇÕES AUXILIARES DE VALIDAÇÃO ---

    /**
     * Verifica os critérios de uma senha e retorna um objeto com os resultados.
     * @param {string} senha A senha a ser validada.
     * @returns {object} Um objeto contendo o status booleano de cada critério.
     */
    function verificarCriteriosSenha(senha) {
        const criterios = {
            comprimento: senha.length >= 8,
            maiuscula: /[A-Z]/.test(senha),
            minuscula: /[a-z]/.test(senha),
            simbolo: /[^A-Za-z0-9]/.test(senha),
            numero: /\d/.test(senha)
        };
        return criterios;
    }

    /**
     * Verifica se todos os critérios foram atendidos.
     * @param {object} criterios O objeto retornado por verificarCriteriosSenha.
     * @returns {boolean} Verdadeiro se todos os critérios forem atendidos, falso caso contrário.
     */
    function todosCriteriosAtendidos(criterios) {
        return Object.values(criterios).every(val => val === true);
    }


    // --- FUNCIONALIDADES (executadas uma única vez, quando a página carrega) ---

    // Funcionalidade: Mostrar/ocultar senha
    mostrarSenhaCheckbox.addEventListener("change", function () {
        senhaInput.type = this.checked ? "text" : "password";
    });

    // Funcionalidade: Destaque de campo ativo
    campos.forEach(function (campo) {
        campo.addEventListener("focus", function () {
            campo.classList.add("campo-ativo");
        });
        campo.addEventListener("blur", function () {
            campo.classList.remove("campo-ativo");
        });
    });

    // Funcionalidade: Verificador de Senha com Barra de Progresso e Texto
    senhaInput.addEventListener('focus', function () {
        feedbackContainer.style.display = 'block';
    });

    senhaInput.addEventListener('blur', function () {
        feedbackContainer.style.display = 'none';
    });

    senhaInput.addEventListener('input', function () {
        const senha = senhaInput.value;
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

        const widthPercentage = (criteriaMet / 5) * 100;

        switch (criteriaMet) {
            case 1: forcaTexto = 'Muito Fraca'; corForca = '#e74c3c'; break; // Vermelho
            case 2: forcaTexto = 'Fraca'; corForca = '#ffac3b'; break; // Laranja
            case 3: forcaTexto = 'Média'; corForca = '#f1c40f'; break; // Amarelo
            case 4: forcaTexto = 'Forte'; corForca = '#57a64a'; break; // Verde claro
            case 5: forcaTexto = 'Excelente'; corForca = '#2ecc71'; break; // Verde escuro
        }
        
        if (senha.length === 0) {
             forcaTexto = 'Nenhuma';
             corForca = '#888';
        }

        progressBarFill.style.width = widthPercentage + '%';
        progressBarFill.style.backgroundColor = corForca;
        forcaSenhaTexto.innerText = forcaTexto;
        forcaSenhaTexto.style.color = corForca;
    });

    // --- VALIDAÇÃO EM TEMPO REAL (EVENTO 'BLUR') ---

    nomeInput.addEventListener("blur", function() {
        if (this.value.length > 0 && this.value.length < 10) {
            labelErroNome.innerText = "O nome deve conter ao menos 10 caracteres";
        } else {
            labelErroNome.innerText = "";
        }
    });

    emailInput.addEventListener("blur", function() {
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (this.value.length > 0 && !emailRegex.test(this.value)) {
            labelErroEmail.innerText = "Digite um e-mail válido";
        } else {
            labelErroEmail.innerText = "";
        }
    });

    // --- LÓGICA DE VALIDAÇÃO FINAL (Executada apenas ao clicar em Enviar) ---
    botaoEnviar.addEventListener("click", function (eventClick) {
        let erro = false;

        // Limpa todas as mensagens de erro antes de validar novamente
        labelErroNome.innerText = "";
        labelErroEmail.innerText = "";
        labelErroSenha.innerText = "";

        // Validação do nome
        if (nomeInput.value.length < 10) {
            erro = true;
            labelErroNome.innerText = "O nome deve conter ao menos 10 caracteres";
            setTimeout(() => { labelErroNome.innerText = ""; }, 3000);
        }

        // Validação do email
        const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
        if (!emailRegex.test(emailInput.value)) {
            erro = true;
            labelErroEmail.innerText = "Digite um e-mail válido";
            setTimeout(() => { labelErroEmail.innerText = ""; }, 3000);
        }

        // Validação da senha (usando a função refatorada)
        const criteriosSenha = verificarCriteriosSenha(senhaInput.value);
        if (!todosCriteriosAtendidos(criteriosSenha)) {
            erro = true;
            labelErroSenha.innerText = "A senha não atende a todos os critérios de segurança.";
            setTimeout(() => { labelErroSenha.innerText = ""; }, 4000);
        }

        // Se a flag 'erro' foi ativada em qualquer ponto, impede o envio e rola a tela
        if (erro) {
            eventClick.preventDefault();
            form.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }
    });
});